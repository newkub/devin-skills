# business

Row bundle for the `business` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `correctness` | `always` | `cli` | `quality` | `/improve correctness` |
| `state-machine-integrity` | `artifact-match` | `capture` | `—` | `/improve consistency` |

## Run

- `/deep-review <scope> correctness, state-machine-integrity` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the same-named row in `../dimension-checks.md`
- evidence: the `quality` slice from `/run-review --domain quality` for `correctness`; the state-diagram-vs-code slice plus property tests for `state-machine-integrity`
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve correctness` and `/improve consistency`, applied only through `/deep-review <scope> then-fix` after confirmation
