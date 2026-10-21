# migration

Row bundle for the `migration` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `migration` | `artifact-match` | `manual` | `config` | `/improve migration` |

## Run

- `/deep-review <scope> migration` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the `migration` row in `dimension-checks.md`
- evidence: `manual` — audit every up/down pair and the flag gating against the rollout plan (`/migration-with-astgrep` where the change is mechanical), then pass the verdicts in
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve migration`, applied only through `/deep-review <scope> then-fix` after confirmation
