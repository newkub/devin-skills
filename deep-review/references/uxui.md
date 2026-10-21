# uxui

Row bundle for the `uxui` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `uxui` | `artifact-match` | `capture` + `manual` | `quality` | `/improve uxui` |
| `ux-writing` | `artifact-match` | `manual` | `quality` | `/improve writing` |
| `visual-regression` | `artifact-match` | `capture` | `—` | `/improve tests` |

## Run

- `/deep-review <scope> uxui, ux-writing, visual-regression` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the same-named row in `dimension-checks.md`
- evidence: `/deep-test website` roleplay and `/use-agent-browser` captures per state for the interface half; `/follow-tool-argos` or `/deep-test visual` for `visual-regression`; every user-facing string read against the `improve-writing` criteria for `ux-writing`
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve uxui`, `/improve writing`, and `/improve tests` — applied only through `/deep-review <scope> then-fix` after confirmation
