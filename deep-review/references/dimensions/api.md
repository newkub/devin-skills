# api

Row bundle for the `api` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `api` | `artifact-match` | `capture` | `—` | `/improve api` |

## Run

- `/deep-review <scope> api` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the `api` row in `../dimension-checks.md`
- evidence: no CLI slice — run `hurl`, `/follow-tool-scalar`, and the oRPC type-drift check first, then pass that output in as the slice
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve api`, applied only through `/deep-review <scope> then-fix` after confirmation
