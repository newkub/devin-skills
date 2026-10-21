# docs

Row bundle for the `docs` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `docs` | `always` | `cli` + `manual` | `quality` | `/improve docs` |

## Run

- `/deep-review <scope> docs` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the `docs` row in `dimension-checks.md`
- evidence: the `quality` slice from `/run-review --domain quality`, plus `/check-reference` for every claim and `lychee`/`linkinator` + `markdownlint` for the mechanical half
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve docs`, applied only through `/deep-review <scope> then-fix` after confirmation
