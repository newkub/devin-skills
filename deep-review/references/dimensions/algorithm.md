# algorithm

Row bundle for the `algorithm` review dimension — correctness and complexity share the `correctness` row, so the angle here is termination and cost, not a separate matrix row.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `correctness` | `always` | `cli` | `quality` | `/improve correctness` |

## Run

- `/deep-review <scope> correctness` — adds the `always` tier and runs the full pipeline; this file only narrows the review to algorithmic correctness and complexity
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the `correctness` row in `../dimension-checks.md`
- evidence: the `quality` slice from `/run-review --domain quality`, corroborated with `/check-correctness` and the concrete input that triggers the path; a complexity claim needs the bound stated, not a hunch
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve correctness`, applied only through `/deep-review <scope> then-fix` after confirmation
