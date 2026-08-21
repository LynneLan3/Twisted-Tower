# QA checklist

## Live site generation (`$create-hotword-wiki`)

- [ ] `npm run verify:context`
- [ ] Identity mode is `remote-verified` or `content-marker-verified` (not a false remote failure in Cloud)
- [ ] Missing `site-spec.yaml` / `site-input` reported as input Error (not identity Error)
- [ ] `npm run site:generate -- --dry-run`
- [ ] `npm run site:generate`
- [ ] Second generate is idempotent (`written=0`)
- [ ] `npm run site:generate -- --check`
- [ ] `npm run validate:generated` (not `validate` / `validate:template` / `verify:template`)
- [ ] Hub route and guide routes exist
- [ ] Internal links resolve (CTA, startHere, related, placeholders)
- [ ] Images render; missing alt fails validation
- [ ] No leftover `{{page:...}}` / `{{hub}}`
- [ ] Locale chrome matches `site.locale`
- [ ] Desktop Hub + one guide spot-check
- [ ] Mobile viewport spot-check when browser tools exist
- [ ] No Git pollution: `node_modules`, `dist`, `.astro`, `.env`, temp dirs
- [ ] No secrets in the diff

## Intent Content checks (per core Guide)

- [ ] Can state the Primary Intent in one sentence
- [ ] `intents[0]` is the Primary Intent
- [ ] H1 corresponds to a real search task
- [ ] Quick Answer directly answers the primary intent above the fold
- [ ] `facts` are all backed by evidence (no speculation)
- [ ] H2 sections address real player tasks or questions (not filler)
- [ ] `next-step` relations point to genuine next questions
- [ ] Images have semantic purpose (not decorative filler)
- [ ] Community speculation is not presented as verified fact

## Homepage checks

- [ ] Hero has readable contrast
- [ ] Routes are player tasks, not category mirrors
- [ ] Start Here entries are player tasks, not a copy of categories
- [ ] Popular Questions sourced from real demand (not invented)
- [ ] `context` on Popular Questions does not repeat the question
- [ ] No empty visual frame renders when a visual is absent

## Experience Route checks

- [ ] Route order is intentional and preserved
- [ ] Visual and content-only routes both render deliberately
- [ ] Route Hub `fastAnswers` point to real pages in the same route
- [ ] Follow the Route order matches `routes[].pages`

## Experience Guide checks

- [ ] No desktop Starlight rails on production Guide pages
- [ ] Quick Answer directly answers the Primary Intent
- [ ] Facts are evidence-backed
- [ ] Inline On This Page anchors work
- [ ] Next Questions work
- [ ] Route Context and Other Routes work

## Global Experience checks

- [ ] Home / Routes / Guides / About / Search nav all click to production URLs
- [ ] Search opens, returns results, and result navigation works
- [ ] Mobile has no horizontal overflow

## Template maintenance / CI only

- [ ] `npm run test:context`
- [ ] `npm run test:generator`
- [ ] `npm run test:validation` when changing validation workflows
- [ ] `npm run validate:template` (includes `verify:template`)
- [ ] Template mode still allows Example Game; generated-site rejects it
