# workflow

Row bundle for the `workflow` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `ci-cd` | `artifact-match` | `cli` | `config` | `/optimize ci` |
| `scheduled-jobs` | `artifact-match` | `manual` | `config` | `/improve scheduled-jobs` |

## Run

- `/deep-review <scope> ci-cd, scheduled-jobs` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the same-named row in `../dimension-checks.md`
- evidence: the `config` slice from `/run-review --domain config` plus `actionlint`, `zizmor`, and `/check-deployment-fails` for `ci-cd`; every cron definition read for idempotency and missed-run handling for `scheduled-jobs`
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/optimize ci` and `/improve scheduled-jobs`, applied only through `/deep-review <scope> then-fix` after confirmation
