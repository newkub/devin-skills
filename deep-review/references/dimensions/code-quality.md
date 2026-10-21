# code-quality

Row bundle for the `code-quality` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `code-quality` | `always` | `cli` | `quality` | `/improve code-quality` |

## Run

- `/deep-review <scope> code-quality` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the `code-quality` row in `../dimension-checks.md`
- evidence: the `quality` slice from `/run-review --domain quality`, corroborated with `/follow-tool-jscpd`, `/check-long-files`, and `/follow-tool-knip`
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve code-quality`, applied only through `/deep-review <scope> then-fix` after confirmation
- this is the canonical target of the merged `alignment` and `redundancy` labels — `alignment.md` and `redundancy.md` forward here
