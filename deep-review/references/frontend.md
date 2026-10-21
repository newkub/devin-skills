# frontend

Row bundle for the `frontend` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `uxui` | `artifact-match` | `capture` + `manual` | `quality` | `/improve uxui` |
| `form` | `artifact-match` | `cli` + `capture` | `quality` | `/improve form` |
| `routing-deeplinks` | `artifact-match` | `capture` | `—` | `/improve uxui` |
| `rendering-strategy` | `artifact-match` | `capture` | `config` | `/improve web` |

## Run

- `/deep-review <scope> uxui, form, routing-deeplinks, rendering-strategy` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the same-named row in `dimension-checks.md`
- evidence: the `quality`/`config` slices from `/run-review` for the `cli` rows; `/use-agent-browser` direct-nav captures per state, `/deep-test component`, and `/deep-test website` roleplay for `capture`/`manual`
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve uxui`, `/improve form`, and `/improve web` — applied only through `/deep-review <scope> then-fix` after confirmation
