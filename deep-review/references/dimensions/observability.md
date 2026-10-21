# observability

Row bundle for the `observability` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `observability` | `artifact-match` | `manual` | `—` | `/improve platform` |
| `log-hygiene` | `artifact-match` | `manual` | `security` | `/improve privacy` |
| `runbook-oncall` | `on-demand` | `manual` | `—` | `/improve platform` |
| `slo-error-budget` | `on-demand` | `manual` | `—` | `/improve platform` |

## Run

- `/deep-review <scope> observability, log-hygiene, runbook-oncall, slo-error-budget` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the same-named row in `../dimension-checks.md`
- `runbook-oncall` and `slo-error-budget` are `on-demand` — run them only when the user asks for an operations pass
- evidence: `manual` on every row — grep the log/trace wiring, read the alert config against the runbook set, and pass the inventory in
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve platform` and `/improve privacy`, applied only through `/deep-review <scope> then-fix` after confirmation
