# game-wiki-starter

Astro + Starlight starter for a single-game guide / wiki site.

## Production validation

The starter architecture was first production-validated through the Agefield High migration.

This repo stays a neutral Example Game template. Do not copy Agefield content or Agefield-specific config into it.

## Template V2.2 Status

**Production Ready / Frozen**

Core capabilities:

- single-game Experience Homepage + Guide architecture
- GameShell navigation and Pagefind search theme
- player Routes, Route Hubs, and Guide Library
- search-answer-first pages
- Content Relations
- Evidence / Sources
- Trust
- Analytics
- Social Metadata
- Monetization Hooks

Template V2.2 core is frozen. New template-level capabilities should only be added when a real production site exposes a reusable blocker.

Codex Skill / site generator V1 is included: `site-spec.yaml` → `npm run site:generate` → validators.
Keep Example Game demo content for template mode; generated sites must not retain it.

## Template architecture

### Experience Layer

This is the player-facing production shell:

- `/{hubPath}/` → Experience Homepage
- `/{hubPath}/routes/` → Player Route Map
- `/{hubPath}/routes/{routeId}/` → Route Hub
- `/{hubPath}/guides/` → Guide Library
- `/{hubPath}/{guideSlug}/` → Experience Guide

Experience pages use `GameConfig`, the docs content collection, formal Experience components, and the production stylesheets:

- `src/styles/experience.css`
- `src/styles/experience-homepage.css`
- `src/styles/routes.css`
- `src/styles/experience-guide.css`

### Starlight Layer

Starlight remains the technical foundation for content loading, Markdown/MDX rendering, Pagefind indexing, sitemap integration, and fallback docs behavior. It is no longer the primary player experience shell.

Category Landings stay on the Starlight fallback:

- `/{hubPath}/{category}/`
- `robots: noindex,follow`
- excluded from sitemap
- excluded from Pagefind

### Content model

- **Category** = backend organization / fallback browse / sidebar.
- **Route** = player journey / task path.
- **Guide** = answer to one primary search intent.

`routes[].pages` is the single source of Guide → Route membership. `fastAnswers` are scoped to one Route. `homepage.startHere` and `homepage.popularQuestions` are site-wide Homepage modules.

## Requirements

- Node.js `>= 22.12.0`
- npm `>= 9.6.5`

## Install

```bash
npm ci
```

Use `npm ci` for clean installs (CI / fresh machines). `npm install` is fine during local development.

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Local preview at `localhost:4321` |
| `npm run check` | Astro + TypeScript diagnostics |
| `npm run verify:template` | Ensure forbidden build artifacts are not Git-tracked (template maintenance) |
| `npm run verify:context` | Repository identity precheck (`remote-verified` or Cloud `content-marker-verified`) |
| `npm run validate:site` | Validate config, hub slug, images, internal links |
| `npm run validate:site -- --mode=template` | Template config validation (Example Game allowed) |
| `npm run validate:site -- --mode=generated-site` | Same checks + forbid Example Game residue + site-spec/manifest |
| `npm run site:generate -- --spec site-spec.yaml` | Deterministic generate from site-spec |
| `npm run site:generate -- --spec site-spec.yaml --dry-run` | Plan only; no writes |
| `npm run site:generate -- --spec site-spec.yaml --check` | Detect managed-file drift |
| `npm run test:context` | Repository context verifier tests in temp dirs |
| `npm run test:generator` | Generator unit/integration tests in temp dirs |
| `npm run test:validation` | Template vs generated validation-mode regression tests |
| `npm run build` | Static build to `./dist/` |
| `npm run preview` | Preview the production build |
| `npm run validate:template` | Template maintenance: `check` + `verify:template` + `validate:site --mode=template` + `build` |
| `npm run validate:generated` | Generated site: manifest + generator `--check` + generated-site validation + `check` + `build` (no `verify:template`) |
| `npm run validate` | Alias of `validate:template` |
| `npm run deploy:check` | Check Vercel deployment identity without deploying |
| `npm run deploy:production` | Production deploy using `site-spec.yaml` identity (`VERCEL_ORG_ID` / `VERCEL_PROJECT_ID`) |

## Direct dependencies

| Package | Why it is declared |
| --- | --- |
| `astro` | Site framework / build |
| `@astrojs/starlight` | Docs / wiki UI shell |
| `@astrojs/sitemap` | Imported directly in `astro.config.mjs` |
| `sharp` | Required by Astro `<Image>` / `astro:assets` optimization used by Hub, cards, and evidence |
| `zod` | Game config + site validation schemas |
| `yaml` | Parse `site-spec.yaml` for the site generator |
| `@astrojs/check` + `typescript` | `npm run check` |
| `tsx` (dev) | Runs TypeScript-aware validate / generate / test scripts |

Do **not** remove `sharp` just because source files do not `import 'sharp'`. The official image pipeline needs it for production builds.

## Clean template export

Do not zip the whole working directory (that can pull in `.git`, `node_modules`, `dist`, `.astro`, `__MACOSX`, `.DS_Store`).

Recommended:

```bash
git archive --format=zip --output=game-wiki-starter.zip HEAD
```

Then verify:

```bash
npm run verify:template
```

## New game workflow

Preferred (generator V1):

1. Copy `site-spec.example.yaml` → `site-spec.yaml` and add `site-input/` pages + assets
2. Run `npm run verify:context`
3. Run `npm run site:generate -- --spec site-spec.yaml --dry-run`
4. Run `npm run site:generate -- --spec site-spec.yaml`
5. Confirm a second generate is idempotent, then run `npm run site:generate -- --spec site-spec.yaml --check`
6. Run `npm run validate:generated` (do **not** use `validate` / `verify:template` here)
7. Use explicit `$create-hotword-wiki` when driving the flow from Codex

Template maintenance (generator / Skill / starter baseline):

1. Run `npm run test:context` and `npm run test:generator` when those areas change
2. Run `npm run validate:template` (or `npm run validate`)

Manual template editing (still supported for learning the baseline):

1. Copy `game-wiki-starter` (prefer `git archive` or a clone)
2. Edit generated values via `site-spec.yaml` (preferred) or inspect `src/config/site.generated.ts` / `src/config/game-types.ts`
3. Set:
   - game identity (`name`, `shortName`, `description`, `tagline`)
   - `siteUrl`
   - `hubPath` (**only** `/` or a single segment like `/my-game/`)
   - `locale` (`en` default, or `zh-CN`)
   - `hubTitle`
   - `categories`
   - `routes` (optional player-facing paths — see “Routes” below)
   - `accentColor`
4. Keep Hub CTAs on the path helper (`pageHref` / local `href(...)`) so they cannot drift from `hubPath`
5. Align `src/content/docs/index.mdx` splash `slug` with `hubPath` (`example-game` ↔ `/example-game/`; omit slug when hub is `/`)
6. Replace favicon / hero / logo (optional)
7. Delete Example Game demo content
8. Add Markdown / MDX guides under `src/content/docs/`
9. Set frontmatter (`title`, `description`, `category`, `slug`, `status`, …)
10. Run `npm run validate:site -- --mode=generated-site`
11. Run `npm run build`
12. Deploy

Do not hand-edit the hub card list, sidebar groups, or category landing pages. They are generated from `game.categories` and the docs collection.

### Supported Hub paths

| `hubPath` | Hub URL | Category landing |
| --- | --- | --- |
| `/` | `/` | `/{categoryId}/` |
| `/my-game/` | `/my-game/` | `/my-game/{categoryId}/` |

Multi-segment hubs such as `/games/my-game/` are **not** supported and fail validation on purpose.

### Locale

Set `locale: 'en' | 'zh-CN'` in `game.ts`. Chrome UI (Start Here, Quick Answer, status labels, breadcrumbs, …) comes from `src/lib/ui.ts`. Guide body copy stays author-controlled.

### Images

Paths are relative to `src/assets/` and may include subfolders:

```text
src/assets/
  brand/
  hero/
  guides/
  screenshots/
  placeholder.svg
```

Examples in `game.ts`:

```ts
heroImage: 'hero/cover.jpg',
// category.image: 'guides/overview.webp'
```

- Omit an optional image field → text fallback
- Configure a path that does not exist → validate/build fails (typos are not swallowed)

### Hub Hero image

For a formal game site, add official horizontal artwork under `src/assets/` (subfolders allowed), then configure:

```ts
heroImage: 'hero/cover.jpg',
heroAlt: 'Official artwork for Example Game',
heroPosition: 'center',
```

Prefer a horizontal image at least 1600px wide. If reliable artwork is unavailable, omit `heroImage`.

## Validation modes

| Mode | When to use | Example Game allowed? |
| --- | --- | --- |
| `template` (default) | Developing this starter | Yes |
| `generated-site` | After copying for a real game | No — fails on Example Game / example domains / demo slugs |

```bash
VALIDATE_MODE=generated-site npm run validate:site
# or
npm run validate:site -- --mode=generated-site
```

## Category navigation

TopNav categories and Browse category title / CTA links go to a Category Landing. Guide links still go to the article.

Category Landings are generated from `game.categories` plus `frontmatter.category`. They are navigation pages, not SEO landings:

- `robots`: `noindex,follow`
- excluded from Pagefind
- excluded from the sitemap

## Routes (player-facing paths)

Optional in `site-spec.yaml` (backward compatible; specs without `routes` behave exactly as before).

A Route is a player task path (`/{hubPath}/routes/{id}/`), distinct from a Category:

- **Category** = backend organization / fallback browse / sidebar.
- **Route** = player frontend task path. Routes do not replace Categories and are never generated from them.

Key rules:

- `routes[].pages` is the **single authoritative source** for Guide → Route membership. Do not add `page.routes`.
- A Guide may belong to several Routes (Route is a graph/path, not a folder).
- `pages` order is meaningful and preserved by the generator.
- `fastAnswers` (max 3) must point at pages in the same route; distinct from `homepage.popularQuestions`.
- `visualAssetId` reuses the existing `assets[]`; omit for a content-only route.

Runtime helpers: `routeHref(hubPath, routeId)` builds the URL; `findRoutesForPage(pageId, routes)` returns every route containing a page (computed at runtime, never persisted).

## Hub portal config

Optional Hub presentation lives on `game.portal` in `src/config/game.ts`. Prefer `pageHref(hubPath, 'overview')` (or the local `href()` helper in the demo file) for internal targets.

`startHere` is player-task navigation. If omitted, Hub falls back to guides with `featured: true`.

`evidence` is optional. Configured evidence images must resolve; omit the section when you have no assets.

## Content has three independent layers

1. **`category`** — Hub / Sidebar information architecture
2. **Source directory** — files under `src/content/docs/`
3. **`slug`** — public SEO URL

If you are migrating a live site, **always set `slug` explicitly** so existing URLs do not change.

`related` in authored Markdown frontmatter uses the **public slug**. In `site-spec.yaml`, `related` uses **page ids**; the generator converts them.

## Hub URL and legacy redirects

New game sites can keep the Hub at `/` by leaving `src/content/docs/index.mdx` without a custom slug and setting `hubPath: '/'`.

This demo Hub uses `slug: example-game` with `hubPath: '/example-game/'`.

Root → Hub redirects for legacy URLs belong on the deploy platform (for example Vercel), not in this generic starter.

## Production deployment identity

### Vercel production policy

All new hotword sites must be created and deployed under:
lynnelan3s-projects

Do not create new production sites under legacy Vercel accounts.

Existing legacy projects may remain for historical purposes, but all new site creation and production deployment use the primary team.

- Team slug: `lynnelan3s-projects`
- orgId: `team_yAOizMTSVuT0RJATgFdAlQuG`
- One game = one Vercel Project; project name = site slug (not `hot-words-*`)

CLI defaults:

```bash
# Create / link under the primary team
vercel link --yes --scope lynnelan3s-projects --project <site-slug>

# Preview
vercel --scope lynnelan3s-projects

# Production (also used by npm run deploy:production)
vercel --prod --scope lynnelan3s-projects
```

Each generated site must declare its Vercel target in `site-spec.yaml`:

```yaml
deployment:
  provider: vercel
  orgId: "team_yAOizMTSVuT0RJATgFdAlQuG"
  projectId: ""
  projectName: ""
  productionUrl: ""
  productionBranch: ""
```

Fill every field before production. `site.siteUrl` must match `deployment.productionUrl`. New sites always set `orgId` to the primary team above.

```bash
npm run deploy:check
npm run deploy:production
```

`site-spec.yaml` is the authority. Local `.vercel/project.json` is diagnostic / transient CLI state. Empty `projectId` placeholders cannot fall back to a previously linked project. These IDs stay out of `src/config/site.generated.ts`.

`deploy:check` never creates a Vercel deployment. `deploy:production` only requires a usable `projectId` (and defaults empty `orgId` to the primary team). It does not gate on git branch, production URL match, or `projectName` differences. Production CLI always passes `--scope lynnelan3s-projects`.

## Not in this template yet

- GitHub Actions provisioning
- Vercel DNS / Search Console automation
- Auto research / bulk page generation / remote asset download
