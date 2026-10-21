# security

Row bundle for the `security` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `security` | `always` | `cli` + `capture` | `security` | `/improve security` |

## Run

- `/deep-review <scope> security` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the `security` row in `dimension-checks.md`
- evidence: the `security` slice from `/run-review --domain security`, plus the capture passes `/scan-security`, `/follow-tool-semgrep`, `/follow-tool-gitleaks` (`/follow-tool-deepsec` for a full pass)
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve security`, applied only through `/deep-review <scope> then-fix` after confirmation
