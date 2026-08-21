# Asset policy

- Never auto-download remote artwork in V1.
- Every asset needs local `source`, `target`, `alt`, `sourceType`, and `usageStatus`.
- `unknown` / `review-required` are **not** commercial clearance.
- Hero images require meaningful alt text.
- `target` must stay under `src/assets/`; path traversal (`..`, backslashes, absolute paths) is a hard error.
- Symlinked `source` files are rejected in V1 (prevents escaping the allowed input tree).
- Do not overwrite unknown/non-managed files; stop on collision instead.
- Keep provenance (`sourceUrl`) when available for later review.
- `sourceType` / `usageStatus` are recorded in `.site-generator-manifest.json` for audit; they are not game UI chrome.
