# auth

Row bundle for the `auth` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `auth` | `artifact-match` | `cli` + `capture` | `security` | `/improve auth` |

## Run

- `/deep-review <scope> auth` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the `auth` row in `dimension-checks.md`
- evidence: the `security` slice from `/run-review --domain security`, then the auth flow suite (`hurl`) and semgrep auth rules as the `capture` half
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve auth`, applied only through `/deep-review <scope> then-fix` after confirmation
