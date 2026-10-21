# data-validation

Row bundle for the `data-validation` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `data` | `artifact-match` | `capture` | `—` | `/improve data` |

## Run

- `/deep-review <scope> data` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the `data` row in `../dimension-checks.md`
- evidence: no CLI slice — run `/follow-tool-data-validation` across the boundaries and `/deep-test database` for the constraints first, then pass that output in as the slice
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve data`, applied only through `/deep-review <scope> then-fix` after confirmation
