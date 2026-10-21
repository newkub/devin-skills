# writing

Row bundle for the `writing` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `docs` | `always` | `cli` + `manual` | `quality` | `/improve docs` |
| `ux-writing` | `artifact-match` | `manual` | `quality` | `/improve writing` |

## Run

- `/deep-review <scope> docs, ux-writing` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the same-named row in `dimension-checks.md`
- evidence: the `quality` slice from `/run-review --domain quality`; `/check-reference` on every claim and an `/improve-writing` pass over the microcopy for the `manual` side
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve docs` and `/improve writing`, applied only through `/deep-review <scope> then-fix` after confirmation
- the criteria themselves belong to the top-level `improve-writing` skill (clear, concise, explicit, bounded, terminology, ordered, followable)
