# seo

Row bundle for the `seo` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `seo` | `artifact-match` | `capture` | `—` | `/improve seo` |
| `seo-ai` | `artifact-match` | `capture` | `—` | `/improve seo` |

## Run

- `/deep-review <scope> seo, seo-ai` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the same-named row in `dimension-checks.md`
- evidence: no CLI slice — run `/follow-tool-openseo` and `/follow-tool-unlighthouse`, crawl `sitemap`/`robots`, and fetch `llms.txt` plus the per-bot rules, then pass that output in
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve seo`, applied only through `/deep-review <scope> then-fix` after confirmation
