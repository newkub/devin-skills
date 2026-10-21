# performance

Row bundle for the `performance` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `performance` | `artifact-match` | `capture` | `—` | `/optimize perf` |

## Run

- `/deep-review <scope> performance` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the `performance` row in `../dimension-checks.md`
- evidence: no CLI slice — measure first with `/run-profiler`, `/follow-tool-lighthouse`, `/follow-tool-unlighthouse`, `EXPLAIN ANALYZE`, or continuous profiling, then pass the p95 delta in; a finding without a measured before/after is not evidence
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/optimize perf`, applied only through `/deep-review <scope> then-fix` after confirmation
