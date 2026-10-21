# cost

Row bundle for the `cost` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `cost` | `on-demand` | `capture` | `—` | `/optimize cost` |

## Run

- `/deep-review <scope> cost` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the `cost` row in `dimension-checks.md`
- `on-demand` — run it only when the user asks for a spend review
- evidence: no CLI slice — run `infracost` and the provider usage CLI first, then pass that output in; token spend is measured through `/optimize llm`
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/optimize cost`, applied only through `/deep-review <scope> then-fix` after confirmation
