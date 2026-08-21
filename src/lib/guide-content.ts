/**
 * Guide content bundle for the Experience editorial layout.
 *
 * Computes every data dependency the Experience Guide page needs from the
 * existing Starlight entry — no new schema. Shared by the header and footer
 * section components so the two halves of the layout stay in sync.
 */
import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { game } from '../config/game';
import type { GameRoute } from '../config/game-types';
import { findRoutesForPage } from './routes';
import { nextStepSlugs, mergeRelatedSlugs } from './page-relations';
import { getGuides, resolveRelated } from './guides';
import { topLevelHeadings, type GuideHeading } from './guide-headings';

export interface GuideContent {
	canonical: string;
	cover?: ImageMetadata;
	facts: Array<{ label: string; value: string }>;
	quickAnswer?: string;
	lastUpdated?: Date;
	headings: GuideHeading[];
	nextGuides: CollectionEntry<'docs'>[];
	related: CollectionEntry<'docs'>[];
	currentRoutes: GameRoute[];
	primaryRoute?: GameRoute;
	otherRoutes: GameRoute[];
	routes: readonly GameRoute[];
	pageId: string;
}

export async function loadGuideContent(entry: CollectionEntry<'docs'>): Promise<GuideContent> {
	const routes = game.routes ?? [];
	const pageId = entry.id.split('/').pop() ?? entry.id;
	const currentRoutes = findRoutesForPage(pageId, routes);
	const currentRouteIds = new Set(currentRoutes.map((route) => route.id));
	const otherRoutes = routes.filter((route) => !currentRouteIds.has(route.id)).slice(0, 3);

	const headings = topLevelHeadings(entry.body ?? '');
	const lastUpdated = entry.data.lastUpdated instanceof Date ? entry.data.lastUpdated : undefined;

	const guides = await getGuides();
	const nextSlugs = nextStepSlugs(entry.data.relations);
	const nextGuides = nextSlugs.length > 0 ? resolveRelated(guides, nextSlugs, entry.id) : [];
	const relatedSlugs = mergeRelatedSlugs(entry.data.related, entry.data.relations).filter(
		(slug) => !nextSlugs.includes(slug),
	);
	const related = relatedSlugs.length > 0 ? resolveRelated(guides, relatedSlugs, entry.id) : [];

	return {
		canonical: new URL(`/${entry.id}/`, game.siteUrl).href,
		cover: entry.data.cover,
		facts: entry.data.facts ?? [],
		quickAnswer: entry.data.quickAnswer,
		lastUpdated,
		headings,
		nextGuides,
		related,
		currentRoutes,
		primaryRoute: currentRoutes[0],
		otherRoutes,
		routes,
		pageId,
	};
}
