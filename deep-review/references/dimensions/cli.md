# cli

Row bundle for the `cli` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `cli-ux` | `artifact-match` | `capture` | `quality` | `/improve cli` |

## Run

- `/deep-review <scope> cli-ux` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the `cli-ux` row in `../dimension-checks.md`
- evidence: no CLI slice — run the golden-output capture, `tui-test`, `hyperfine`, `vhs`, and `shellcheck` first, then pass that output in as the slice
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve cli`, applied only through `/deep-review <scope> then-fix` after confirmation
