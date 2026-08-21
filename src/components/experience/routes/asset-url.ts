/**
 * Resolve runtime asset paths (relative to `src/assets/`, e.g. `placeholder.svg`)
 * to built asset URLs inside Route components.
 *
 * Runtime config stores asset references as plain strings; Astro only emits
 * hashed URLs for assets that are statically imported. This eager glob turns
 * the whole `src/assets/` tree into a key → URL map without hardcoding a game.
 */
const assetMap: Record<string, string> = import.meta.glob('../../../assets/**/*', {
	eager: true,
	import: 'default',
	query: '?url',
});

export function assetUrl(rel?: string): string | undefined {
	if (!rel) return undefined;
	return assetMap[`../../../assets/${rel}`] ?? undefined;
}
