# dependencies

Row bundle for the `dependencies` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `dependencies` | `always` | `cli` | `deps` | `/improve deps` |

## Run

- `/deep-review <scope> dependencies` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the `dependencies` row in `../dimension-checks.md`
- evidence: the `deps` slice from `/run-review --domain deps` — the audit, unused, and duplicate findings come from it; cross-check with `/follow-tool-taze`, `bun pm audit`/`cargo deny`, and `/follow-tool-node-modules-inspector`
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve deps`, applied only through `/deep-review <scope> then-fix` after confirmation
