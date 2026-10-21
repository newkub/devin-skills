# mcp

Row bundle for the `mcp` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `mcp-surface` | `artifact-match` | `cli` + `manual` | `config` | `/improve mcp` |

## Run

- `/deep-review <scope> mcp-surface` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the `mcp-surface` row in `dimension-checks.md`
- evidence: the `config` slice from `/run-review --domain config`, then dump the MCP schema and audit every tool description by hand (`ui-inspector` where available)
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve mcp`, applied only through `/deep-review <scope> then-fix` after confirmation
