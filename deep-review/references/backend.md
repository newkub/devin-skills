# backend

Row bundle for the `backend` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `api` | `artifact-match` | `capture` | `—` | `/improve api` |
| `resource-leaks` | `artifact-match` | `manual` | `quality` | `/optimize memory` |

## Run

- `/deep-review <scope> api, resource-leaks` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the same-named row in `dimension-checks.md`
- evidence: `capture`/`manual` on every row — run the request suite (`hurl`) or the listener/handle grep first, then pass that output in as the slice
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve api` and `/optimize memory`, applied only through `/deep-review <scope> then-fix` after confirmation
