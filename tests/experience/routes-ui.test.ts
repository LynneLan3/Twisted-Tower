import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { ui } from '../../src/lib/ui';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function copyTemplateWorkspace(): string {
	mkdirSync(path.join(ROOT, 'tmp'), { recursive: true });
	const dir = mkdtempSync(path.join(ROOT, 'tmp', 'gws-routes-ui-'));
	const entries = [
		'package.json',
		'package-lock.json',
		'astro.config.mjs',
		'tsconfig.json',
		'TEMPLATE_VERSION',
		'.gitignore',
		'public',
		'src',
		'scripts',
	];
	for (const entry of entries) {
		cpSync(path.join(ROOT, entry), path.join(dir, entry), { recursive: true });
	}
	const nodeModulesTarget = path.relative(dir, path.join(ROOT, 'node_modules'));
	try {
		cpSync(nodeModulesTarget, path.join(dir, 'node_modules'), { recursive: true });
	} catch {
		// node_modules may not exist in this checkout; template build tests rely on the real one.
	}
	return dir;
}

function buildTemplate(workspace: string) {
	return spawnSync('npx', ['astro', 'build'], {
		cwd: workspace,
		encoding: 'utf8',
		env: { ...process.env, VALIDATE_MODE: 'template' },
	});
}

test('routes UI i18n dictionary covers Route chrome strings', () => {
	const en = ui('en');
	const zh = ui('zh-CN');
	for (const key of [
		'routesNav',
		'homeNav',
		'aboutNav',
		'playerRoutes',
		'chooseWhatYoureTryingLede',
		'allGuides',
		'fieldGuide',
		'chooseRouteLede',
		'fastAnswers',
		'commonQuestionsLede',
		'followTheRoute',
		'followTheRouteLede',
		'otherRoutes',
		'chooseAnotherRoute',
		'read',
		'youAreOn',
		'backToRoute',
		'chooseAnotherRouteAction',
	] as const) {
		assert.ok(en[key], `en.${key} missing`);
		assert.ok(zh[key], `zh-CN.${key} missing`);
	}
	assert.equal(en.openRoute('Getting Started'), 'Open Getting Started route →');
	assert.equal(zh.openRoute('Getting Started'), '打开 Getting Started 路径 →');
});

test('formal routes UI: guides index + dynamic route hubs render from runtime routes', { timeout: 240_000 }, () => {
	const workspace = copyTemplateWorkspace();
	try {
		const build = buildTemplate(workspace);
		assert.equal(build.status, 0, build.stdout + build.stderr);

		// Guides Index uses runtime routes
		const guidesHtml = readFileSync(path.join(workspace, 'dist/example-game/guides/index.html'), 'utf8');
		for (const label of ['Getting Started', 'Core Gameplay', 'World &amp; Exploration', 'Story &amp; Characters']) {
			assert.ok(guidesHtml.includes(label), `guides index missing route ${label}`);
		}
		// Same guide may appear in multiple route sections (design behavior, no dedupe)
		const exampleGuideLinks = guidesHtml.match(/href="\/example-game\/example-guide\/"/g) ?? [];
		assert.ok(exampleGuideLinks.length >= 2, `Example Guide should appear in 2+ route sections, got ${exampleGuideLinks.length}`);
		// Route visual optional: one route is content-only in the index
		assert.ok(guidesHtml.includes('exp-route-section--content-only'));
		assert.equal(
			(guidesHtml.match(/exp-route-section__visual/g) ?? []).length,
			2,
			'guides index should render the two visual routes from runtime config',
		);
		for (const section of guidesHtml.match(/<div class="exp-route-section exp-route-section--content-only"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g) ?? []) {
			assert.doesNotMatch(section, /exp-route-section__visual/, 'content-only guides sections must not render an empty visual frame');
		}
		assert.match(guidesHtml, /All Guides/);
		assert.doesNotMatch(guidesHtml, /experience-prototype\.css/, 'formal guides index must not load prototype CSS');

		// Dynamic Route Hubs generated for every route in config
		for (const id of ['getting-started', 'core-gameplay', 'world-exploration', 'story-characters']) {
			assert.ok(
				existsSync(path.join(workspace, `dist/example-game/routes/${id}/index.html`)),
				`route hub missing for ${id}`,
			);
		}

		// Routes Index (Player Task Map) generated — distinct from Guides Index
		const routesIndexHtml = readFileSync(path.join(workspace, 'dist/example-game/routes/index.html'), 'utf8');
		assert.match(routesIndexHtml, /Player Routes/);
		assert.match(routesIndexHtml, /trying to do/);
		for (const label of ['Getting Started', 'Core Gameplay', 'World &amp; Exploration', 'Story &amp; Characters']) {
			assert.ok(routesIndexHtml.includes(label), `routes index missing route ${label}`);
		}
		assert.match(routesIndexHtml, /Open Getting Started route →/);
		assert.equal(
			(routesIndexHtml.match(/exp-route-topic-card__visual/g) ?? []).length,
			2,
			'routes index should render the two visual routes from runtime config',
		);
		for (const routeCard of routesIndexHtml.match(/<a class="exp-route-topic-card[^"]*exp-route-topic-card--text[\s\S]*?<\/a>/g) ?? []) {
			assert.doesNotMatch(routeCard, /exp-route-topic-card__visual/, 'content-only task routes must not render an empty visual frame');
		}
		// Task Map previews route membership but does NOT render the full guide timeline.
		assert.match(routesIndexHtml, /exp-route-topic-card__preview/);
		assert.doesNotMatch(routesIndexHtml, /exp-route-section__guide-link/);
		assert.doesNotMatch(routesIndexHtml, /exp-route-step__title/);
		assert.doesNotMatch(routesIndexHtml, /experience-prototype\.css/, 'formal routes index must not load prototype CSS');
		// Routes Index SEO
		assert.match(routesIndexHtml, /<title>Routes — Example Game Guide &amp; Wiki/);
		assert.match(routesIndexHtml, /rel="canonical" href="https:\/\/example-game\.example\/example-game\/routes\//);

		// Unified top navigation: Home / Routes / Guides / About on every Experience page
		const guidesNav = guidesHtml.match(/<nav class="exp-topbar__nav"[\s\S]*?<\/nav>/)?.[0] ?? '';
		assert.match(guidesNav, /href="\/example-game\/"[^>]*>Home</);
		assert.match(guidesNav, /href="\/example-game\/routes\/"[^>]*>Routes</);
		assert.match(guidesNav, /href="\/example-game\/guides\/"[^>]*>Guides</);
		assert.match(guidesNav, /href="\/example-game\/#about"[^>]*>About</);
		assert.doesNotMatch(guidesNav, /\/prototype\//, 'Experience chrome must never link the prototype homepage');
		assert.match(guidesNav, /aria-current="page"/, 'guides index should mark Guides active');

		const routesNav = routesIndexHtml.match(/<nav class="exp-topbar__nav"[\s\S]*?<\/nav>/)?.[0] ?? '';
		assert.match(routesNav, /<a[^>]*class="[^"]*is-active[^"]*"[^>]*href="\/example-game\/routes\/"[^>]*>Routes</, 'routes index should mark Routes active');

		// Unified footer mirrors nav URLs
		const guidesFooter = guidesHtml.match(/<footer class="exp-footer"[\s\S]*?<\/footer>/)?.[0] ?? '';
		assert.match(guidesFooter, /href="\/example-game\/"[^>]*>Home</);
		assert.match(guidesFooter, /href="\/example-game\/routes\/"[^>]*>Routes</);
		assert.match(guidesFooter, /href="\/example-game\/guides\/"[^>]*>Guides</);
		assert.match(guidesFooter, /href="\/example-game\/#about"[^>]*>About</);

		// Follow the Route preserves site-spec order
		const gettingStartedHtml = readFileSync(
			path.join(workspace, 'dist/example-game/routes/getting-started/index.html'),
			'utf8',
		);
		const stepTitles = [...gettingStartedHtml.matchAll(/exp-route-step__title">([^<]+)</g)].map((m) => m[1]);
		assert.deepEqual(stepTitles, ['Beginner Overview', 'Example Guide', 'Key Location', 'How to Make Money']);

		// Route Hub nav keeps the full set and marks Routes active
		const hubNav = gettingStartedHtml.match(/<nav class="exp-topbar__nav"[\s\S]*?<\/nav>/)?.[0] ?? '';
		assert.match(hubNav, /<a[^>]*class="[^"]*is-active[^"]*"[^>]*href="\/example-game\/routes\/"[^>]*>Routes</, 'route hub should mark Routes active');
		assert.match(hubNav, /href="\/example-game\/#about"[^>]*>About</, 'route hub nav must include About');

		// Fast Answers optional: getting-started has them, story-characters does not
		assert.match(gettingStartedHtml, /exp-fast-answer__q/);
		const storyHtml = readFileSync(
			path.join(workspace, 'dist/example-game/routes/story-characters/index.html'),
			'utf8',
		);
		assert.doesNotMatch(storyHtml, /exp-fast-answer__q/);
		assert.ok(storyHtml.includes('exp-route-hero--content-only'));

		// Other Routes excludes the current route and keeps config order
		const otherLabels = [...gettingStartedHtml.matchAll(/exp-other-route__label">([^<]+)</g)].map((m) => m[1]);
		assert.deepEqual(otherLabels, ['Core Gameplay', 'World &amp; Exploration', 'Story &amp; Characters']);

		// Route Hub SEO: title, description, canonical
		assert.match(gettingStartedHtml, /<title>Getting Started — Example Game Guide &amp; Wiki/);
		assert.match(gettingStartedHtml, /Everything you need before your first serious run/);
		assert.match(gettingStartedHtml, /rel="canonical" href="https:\/\/example-game\.example\/example-game\/routes\/getting-started\//);
		// Guides Index SEO
		assert.match(guidesHtml, /<title>All Guides — Example Game Guide &amp; Wiki/);
		assert.match(guidesHtml, /rel="canonical" href="https:\/\/example-game\.example\/example-game\/guides\//);

		// Sitemap includes guides + routes index + all route hubs; pagefind indexes them
		const sitemap = readFileSync(path.join(workspace, 'dist/sitemap-0.xml'), 'utf8');
		assert.match(sitemap, /example-game\/guides\//);
		assert.match(sitemap, /<loc>https:\/\/example-game\.example\/example-game\/routes\/<\/loc>/);
		for (const id of ['getting-started', 'core-gameplay', 'world-exploration', 'story-characters']) {
			assert.match(sitemap, new RegExp(`example-game/routes/${id}/`));
		}
			const entry = JSON.parse(readFileSync(path.join(workspace, 'dist/pagefind/pagefind-entry.json'), 'utf8')) as {
				languages: Record<string, { page_count: number }>;
			};
			const enPages = entry.languages.en?.page_count ?? 0;
			assert.ok(enPages >= 15, `pagefind should index the formal template pages, got ${enPages}`);
			for (const file of [
				'dist/example-game/index.html',
				'dist/example-game/routes/index.html',
				'dist/example-game/routes/getting-started/index.html',
				'dist/example-game/guides/index.html',
				'dist/example-game/example-guide/index.html',
			]) {
				assert.match(readFileSync(path.join(workspace, file), 'utf8'), /data-pagefind-body/);
			}
	} finally {
		rmSync(workspace, { recursive: true, force: true });
	}
});

test('formal routes UI: zh-CN chrome renders when locale is zh-CN', { timeout: 240_000 }, () => {
	const workspace = copyTemplateWorkspace();
	try {
		const generated = path.join(workspace, 'src/config/site.generated.ts');
		writeFileSync(
			generated,
			readFileSync(generated, 'utf8').replace("locale: 'en',", "locale: 'zh-CN',"),
			'utf8',
		);
		const build = buildTemplate(workspace);
		assert.equal(build.status, 0, build.stdout + build.stderr);
		const guidesHtml = readFileSync(path.join(workspace, 'dist/example-game/guides/index.html'), 'utf8');
		assert.match(guidesHtml, /全部攻略/);
		// Unified zh-CN navigation: 首页 / 路径 / 攻略 / 关于
		const guidesNav = guidesHtml.match(/<nav class="exp-topbar__nav"[\s\S]*?<\/nav>/)?.[0] ?? '';
		assert.match(guidesNav, /href="\/example-game\/"[^>]*>首页</);
		assert.match(guidesNav, /href="\/example-game\/routes\/"[^>]*>路径</);
		assert.match(guidesNav, /href="\/example-game\/guides\/"[^>]*>攻略</);
		assert.match(guidesNav, /href="\/example-game\/#about"[^>]*>关于</);
		assert.doesNotMatch(guidesNav, /\/prototype\//, 'Experience chrome must never link the prototype homepage');
		// Routes Index zh-CN task map
		const routesIndexHtml = readFileSync(path.join(workspace, 'dist/example-game/routes/index.html'), 'utf8');
		assert.match(routesIndexHtml, /玩家路径/);
		assert.match(routesIndexHtml, /选择你现在想做的事。/);
		const hubHtml = readFileSync(
			path.join(workspace, 'dist/example-game/routes/getting-started/index.html'),
			'utf8',
		);
		assert.match(hubHtml, /快速解答/);
		assert.match(hubHtml, /跟随路径/);
		assert.match(hubHtml, /其他路径/);
	} finally {
		rmSync(workspace, { recursive: true, force: true });
	}
});

test('formal routes UI: site without routes still builds and skips route hubs', { timeout: 240_000 }, () => {
	const workspace = copyTemplateWorkspace();
	try {
		const generated = path.join(workspace, 'src/config/site.generated.ts');
		const stripped = readFileSync(generated, 'utf8').replace(
			/\troutes: \[[\s\S]*?\n\t\],\n\tcategories:/,
			'\tcategories:',
		);
		assert.ok(!stripped.includes('routes: ['), 'expected routes block to be stripped');
		writeFileSync(generated, stripped, 'utf8');
		const build = buildTemplate(workspace);
		assert.equal(build.status, 0, build.stdout + build.stderr);
		// Guides Index still builds without routes (no sections)
		const guidesHtml = readFileSync(path.join(workspace, 'dist/example-game/guides/index.html'), 'utf8');
		assert.match(guidesHtml, /All Guides/);
		assert.doesNotMatch(guidesHtml, /exp-route-section__label/);
		// No route hub pages generated
		assert.equal(existsSync(path.join(workspace, 'dist/example-game/routes/getting-started')), false);
		// Routes Index still builds as an empty task map
		const routesIndexHtml = readFileSync(path.join(workspace, 'dist/example-game/routes/index.html'), 'utf8');
		assert.match(routesIndexHtml, /Player Routes/);
		assert.doesNotMatch(routesIndexHtml, /exp-task-route__title/);
	} finally {
		rmSync(workspace, { recursive: true, force: true });
	}
});
