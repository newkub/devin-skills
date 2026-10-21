# techstack

Row bundle for the `techstack` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `dependencies` | `always` | `cli` | `deps` | `/improve deps` |
| `supply-chain` | `artifact-match` | `cli` + `capture` | `deps` | `/improve deps` |

## Run

- `/deep-review <scope> dependencies, supply-chain` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the same-named row in `dimension-checks.md`
- evidence: the `deps` slice from `/run-review --domain deps` and its audit findings; the `capture` side adds `osv-scanner`, `zizmor`, `actionlint`, and `syft`/`grype`
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve deps`, applied only through `/deep-review <scope> then-fix` after confirmation
