import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { SiteValidationError } from '../../src/lib/validate-config';
import { CORE_TRUST_PAGE_KINDS, TRUST_PAGE_SLUGS } from '../../src/lib/trust';
import { buildPlan, checkPlan } from './generator';
import { findOrphanPages, formatOrphanWarning } from './link-graph';
import { manifestPath, readManifest } from './managed-files';
import { isAffiliateDisclosureEnabled, loadSiteSpec, MANIFEST_FILENAME, readTemplateVersion, SpecValidationError } from './site-spec';

function walkFiles(dir: string, extensions: Set<string>, out: string[] = []): string[] {
	if (!existsSync(dir)) return out;
	for (const entry of readdirSync(dir)) {
		const full = path.join(dir, entry);
		const stat = statSync(full);
		if (stat.isDirectory()) {
			walkFiles(full, extensions, out);
			continue;
		}
		if (extensions.has(path.extname(entry).toLowerCase())) out.push(full);
	}
	return out;
}

function toError(error: SpecValidationError): SiteValidationError {
	return new SiteValidationError(error.message.split('\n')[0]!, error.field, error.value, error.location, error.hint);
}

function rawTitle(filePath: string): string {
	const raw = readFileSync(filePath, 'utf8');
	const match = raw.match(/^title:\s*(.+)$/m);
	return match?.[1]?.replace(/^['"]|['"]$/g, '') ?? '';
}

export function reportOrphanPageWarnings(spec: import('./site-spec').SiteSpec): void {
	for (const page of findOrphanPages(spec)) {
		console.warn(`validate:site warning: ${formatOrphanWarning(page)}`);
	}
}

export function validateGeneratedSiteExtras(rootDir: string): void {
	const specPath = path.join(rootDir, 'site-spec.yaml');
	if (!existsSync(specPath)) {
		throw new SiteValidationError(
			'generated-site mode requires site-spec.yaml at the repository root.',
			'site-spec.yaml',
			undefined,
			'site-spec.yaml',
			'Create site-spec.yaml and run npm run site:generate.',
		);
	}

	let loaded;
	try {
		loaded = loadSiteSpec(specPath, rootDir);
	} catch (error) {
		if (error instanceof SpecValidationError) throw toError(error);
		throw error;
	}

	const templateVersion = readTemplateVersion(rootDir);
	if (loaded.spec.templateVersion !== templateVersion) {
		throw new SiteValidationError(
			'templateVersion is incompatible with TEMPLATE_VERSION.',
			'templateVersion',
			loaded.spec.templateVersion,
			'site-spec.yaml',
			`Set templateVersion to ${templateVersion}.`,
		);
	}

	if (!existsSync(manifestPath(rootDir))) {
		throw new SiteValidationError(
			'Managed-files manifest is missing.',
			MANIFEST_FILENAME,
			undefined,
			MANIFEST_FILENAME,
			'Run npm run site:generate to create .site-generator-manifest.json.',
		);
	}

	const manifest = readManifest(rootDir);
	if (!manifest) {
		throw new SiteValidationError(
			'Managed-files manifest could not be read.',
			MANIFEST_FILENAME,
			undefined,
			MANIFEST_FILENAME,
			'Repair or regenerate .site-generator-manifest.json.',
		);
	}
	if (manifest.specHash !== loaded.specHash) {
		throw new SiteValidationError(
			'Manifest specHash does not match site-spec.yaml.',
			'specHash',
			manifest.specHash,
			MANIFEST_FILENAME,
			'Re-run npm run site:generate after changing site-spec.yaml.',
		);
	}

	let plan;
	try {
		plan = buildPlan(loaded);
	} catch (error) {
		if (error instanceof SpecValidationError) throw toError(error);
		throw error;
	}
	const check = checkPlan(loaded, plan);
	if (!check.ok) {
		throw new SiteValidationError(
			'Managed generated files drifted from site-spec.yaml.',
			'managed-files',
			check.drift.join(', '),
			check.drift[0] ?? MANIFEST_FILENAME,
			'Do not hand-edit generated files. Re-run npm run site:generate or restore the drifted files.',
		);
	}

	const docsDir = path.join(rootDir, 'src/content/docs');
	const docs = walkFiles(docsDir, new Set(['.md', '.mdx']));
	for (const file of docs) {
		const raw = readFileSync(file, 'utf8');
		if (/\{\{page:[^}]+\}\}/.test(raw) || /\{\{hub\}\}/.test(raw)) {
			throw new SiteValidationError(
				'Unresolved generator placeholders found in content.',
				'placeholder',
				raw.match(/\{\{(?:page:[^}]+|hub)\}\}/)?.[0],
				path.relative(rootDir, file),
				'Re-run the generator; placeholders must be resolved before shipping.',
			);
		}
	}

	const expectedPageFiles = new Set(
		loaded.spec.pages.map((page) =>
			path.join('src/content/docs', page.category, `${page.slug}.md`).replace(/\\/g, '/'),
		),
	);
	expectedPageFiles.add('src/content/docs/index.mdx');

	for (const file of docs) {
		const rel = path.relative(rootDir, file).replace(/\\/g, '/');
		if (expectedPageFiles.has(rel)) continue;
		const title = rawTitle(file);
		if (/example-/i.test(path.basename(rel)) || /example game/i.test(title)) {
			throw new SiteValidationError(
				'Demo Example Game page remains in a generated site.',
				'content',
				rel,
				rel,
				'Remove leftover demo pages or regenerate from site-spec.yaml.',
			);
		}
		if (!manifest.managedFiles.some((entry) => entry.path === rel)) {
			throw new SiteValidationError(
				'Found a guide page that is not part of the current site-spec.',
				'content',
				rel,
				rel,
				'Delete the unexpected page or declare it in site-spec.yaml and regenerate.',
			);
		}
	}

	const trustDir = path.join(rootDir, 'src/content/trust');
	const trustFiles = walkFiles(trustDir, new Set(['.md', '.mdx']));
	const expectedTrustFiles = new Set<string>();
	if (loaded.spec.trust?.enabled) {
		for (const kind of CORE_TRUST_PAGE_KINDS) {
			const page = loaded.spec.trust[kind];
			if (!page?.enabled) continue;
			expectedTrustFiles.add(`src/content/trust/${TRUST_PAGE_SLUGS[kind]}.md`);
		}
	}
	if (isAffiliateDisclosureEnabled(loaded.spec)) {
		expectedTrustFiles.add(`src/content/trust/${TRUST_PAGE_SLUGS.affiliateDisclosure}.md`);
	}
	for (const file of trustFiles) {
		const rel = path.relative(rootDir, file).replace(/\\/g, '/');
		if (rel.endsWith('/.gitkeep')) continue;
		if (expectedTrustFiles.has(rel)) continue;
		if (!manifest.managedFiles.some((entry) => entry.path === rel)) {
			throw new SiteValidationError(
				'Found a trust page that is not part of the current site-spec.',
				'content',
				rel,
				rel,
				'Delete the unexpected trust page or disable it in site-spec.yaml and regenerate.',
			);
		}
	}

	reportOrphanPageWarnings(loaded.spec);
}
