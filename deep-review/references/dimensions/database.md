# database

Row bundle for the `database` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `database` | `artifact-match` | `capture` | `—` | `/improve database` |

## Run

- `/deep-review <scope> database` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the `database` row in `../dimension-checks.md`
- evidence: no CLI slice — run `squawk`/`sqlfluff` on the schema and `EXPLAIN ANALYZE` on the hot queries first (with `/follow-tool-drizzle-kit` where it owns migrations), then pass that output in as the slice
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve database`, applied only through `/deep-review <scope> then-fix` after confirmation
