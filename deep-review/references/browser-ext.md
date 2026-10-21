# browser-ext

Row bundle for the `browser-ext` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `browser-extensions` | `artifact-match` | `cli` | `config` | `/improve browser-extensions` |

## Run

- `/deep-review <scope> browser-extensions` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the `browser-extensions` row in `dimension-checks.md`
- evidence: the `config` slice from `/run-review --domain config`, corroborated with `web-ext lint` and the manifest audit
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve browser-extensions`, applied only through `/deep-review <scope> then-fix` after confirmation
