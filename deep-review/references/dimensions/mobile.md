# mobile

Row bundle for the `mobile` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `mobile` | `artifact-match` | `capture` | `—` | `/improve mobile-app` |
| `native-permissions` | `artifact-match` | `cli` | `config` | `/improve mobile-app` |

## Run

- `/deep-review <scope> mobile, native-permissions` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the same-named row in `../dimension-checks.md`
- evidence: the `config` slice from `/run-review --domain config` for the manifest audit; `/follow-tool-maestro` flows and their captures for `mobile`
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve mobile-app`, applied only through `/deep-review <scope> then-fix` after confirmation
