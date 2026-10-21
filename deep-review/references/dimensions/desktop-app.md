# desktop-app

Row bundle for the `desktop-app` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `desktop` | `artifact-match` | `manual` | `config` | `/improve desktop-app` |
| `auto-update-safety` | `artifact-match` | `capture` | `config` | `/improve desktop-app` |

## Run

- `/deep-review <scope> desktop, auto-update-safety` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the same-named row in `../dimension-checks.md`
- evidence: `manual`/`capture` on every row — read the windowing, IPC, packaging, and signing config directly; run the updater signature verification and pass that output in
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve desktop-app`, applied only through `/deep-review <scope> then-fix` after confirmation
