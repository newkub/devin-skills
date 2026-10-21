# stability

Row bundle for the `stability` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `resilience` | `artifact-match` | `cli` | `quality` | `/improve resilience` |
| `resource-leaks` | `artifact-match` | `manual` | `quality` | `/optimize memory` |
| `graceful-shutdown` | `artifact-match` | `capture` | `—` | `/improve stability` |

## Run

- `/deep-review <scope> resilience, resource-leaks, graceful-shutdown` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the same-named row in `../dimension-checks.md`
- evidence: the `quality` slice from `/run-review --domain quality` plus `/follow-tool-semgrep` retry rules for `resilience`; the listener/handle release paths for `resource-leaks`; the `kill -TERM` in-flight probe for `graceful-shutdown`
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve resilience`, `/optimize memory`, and `/improve stability` — applied only through `/deep-review <scope> then-fix` after confirmation
