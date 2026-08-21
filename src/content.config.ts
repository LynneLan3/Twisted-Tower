import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { GUIDE_STATUSES } from './lib/status';
import { PAGE_ROLES, RELATION_TYPES } from './lib/page-relations';
import { EVIDENCE_SOURCE_TYPES, PAGE_ASSET_TYPES, PAGE_SOURCE_TYPES } from './lib/page-evidence';
import { TRUST_PAGE_KINDS } from './lib/trust';

const pageRelationSchema = z.object({
	slug: z.string().min(1),
	type: z.enum(RELATION_TYPES),
});

const pageSourceSchema = z.object({
	type: z.enum(PAGE_SOURCE_TYPES),
	title: z.string().min(1),
	url: z.string().url(),
});

const pageEvidenceSchema = z.object({
	asset: z.string().min(1),
	alt: z.string().min(1),
	caption: z.string().optional(),
	sourceType: z.enum(EVIDENCE_SOURCE_TYPES),
	sourceUrl: z.string().url().optional(),
});

const trustPageSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	trustType: z.enum(TRUST_PAGE_KINDS),
	robots: z.enum(['index,follow', 'noindex,follow']),
});

export const collections = {
	trust: defineCollection({
		loader: glob({ base: './src/content/trust', pattern: '**/*.{md,mdx}' }),
		schema: trustPageSchema,
	}),
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: ({ image }) =>
				z.object({
					category: z.string().optional(),
					status: z.enum(GUIDE_STATUSES).optional(),
					featured: z.boolean().default(false),
					cover: image().optional(),
					quickAnswer: z.string().optional(),
					related: z.array(z.string()).optional(),
					role: z.enum(PAGE_ROLES).default('supporting'),
					intents: z.array(z.string()).optional(),
					relations: z.array(pageRelationSchema).optional(),
					assetType: z.enum(PAGE_ASSET_TYPES).default('article'),
					sources: z.array(pageSourceSchema).optional(),
					evidence: z.array(pageEvidenceSchema).optional(),
					socialImage: z
						.object({
							asset: z.string().min(1),
							alt: z.string().min(1),
						})
						.optional(),
				/** Optional Hub Recently Updated change line. Omit freely on older pages. */
				changeSummary: z.string().optional(),
				eyebrow: z.string().optional(),
				facts: z
					.array(
						z.object({
							label: z.string().min(1),
							value: z.string().min(1),
						}),
					)
					.max(4)
					.optional(),
				}),
		}),
	}),
};
