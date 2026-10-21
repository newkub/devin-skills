# sdk

Row bundle for the `sdk` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `contract-compat` | `artifact-match` | `cli` | `quality` | `/improve api` |
| `api` | `artifact-match` | `capture` | `—` | `/improve api` |

## Run

- `/deep-review <scope> contract-compat, api` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the same-named row in `../dimension-checks.md`
- evidence: the `quality` slice from `/run-review --domain quality`, cross-checked with `publint` and `oasdiff`; the `hurl` consumer suite for `api`
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve api`, applied only through `/deep-review <scope> then-fix` after confirmation
