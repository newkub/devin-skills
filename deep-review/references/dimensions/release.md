# release

Row bundle for the `release` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `delivery` | `on-demand` | `capture` | `config` | `/improve delivery` |
| `versioning-changelog` | `artifact-match` | `cli` | `config` | `/improve delivery` |

## Run

- `/deep-review <scope> delivery, versioning-changelog` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the same-named row in `../dimension-checks.md`
- evidence: the `config` slice from `/run-review --domain config` for `versioning-changelog`; the pipeline health check (`/check-deployment-fails`, `/follow-release`) plus `git log` against the manifest and `/gen-changelog-md` output for `delivery`
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve delivery`, applied only through `/deep-review <scope> then-fix` after confirmation
