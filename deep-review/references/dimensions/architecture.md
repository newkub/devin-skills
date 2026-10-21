# architecture

Row bundle for the `architecture` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `architecture` | `always` | `cli` | `structure` | `/improve architecture` |

## Run

- `/deep-review <scope> architecture` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the `architecture` row in `../dimension-checks.md`
- evidence: the `structure` slice from `/run-review --domain structure`, corroborated with `/follow-tool-madge` and `/check-code-structure` — boundary breaks and coupling need the dependency direction, not a naming hunch
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve architecture`, applied only through `/deep-review <scope> then-fix` after confirmation
