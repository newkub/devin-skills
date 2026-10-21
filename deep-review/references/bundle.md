# bundle

Row bundle for the `bundle` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `bundle-size` | `artifact-match` | `cli` | `quality` | `/optimize bundle` |

## Run

- `/deep-review <scope> bundle-size` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the `bundle-size` row in `dimension-checks.md`
- evidence: the `quality` slice from `/run-review --domain quality`, corroborated with `/follow-tool-sonda` or the `/report-bundle` output
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/optimize bundle`, applied only through `/deep-review <scope> then-fix` after confirmation
