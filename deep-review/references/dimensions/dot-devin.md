# dot-devin

Row bundle for the `dot-devin` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `ai-agent-assets` | `on-demand` | `manual` | `—` | `/improve devin-global-skills` |

## Run

- `/deep-review <scope> ai-agent-assets` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the `ai-agent-assets` row in `../dimension-checks.md`
- `on-demand` — run it only when the user asks for an agent-assets review
- evidence: no CLI slice — run the `review-devin-global-harness` checklist over the assets and audit every MCP tool description, then pass the collected evidence in
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve devin-global-skills`, applied only through `/deep-review <scope> then-fix` after confirmation
