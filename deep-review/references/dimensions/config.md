# config

Row bundle for the `config` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `config` | `artifact-match` | `cli` | `config` | `/improve config` |

## Run

- `/deep-review <scope> config` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the `config` row in `../dimension-checks.md`
- evidence: the `config` slice from `/run-review --domain config` — the secret-hygiene and drift findings come from it
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve config`, applied only through `/deep-review <scope> then-fix` after confirmation
