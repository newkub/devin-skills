# accessibility

Row bundle for the `accessibility` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `a11y` | `artifact-match` | `capture` | `quality` | `/improve a11y` |
| `theming-dark-mode` | `artifact-match` | `capture` | `quality` | `/improve a11y` |

## Run

- `/deep-review <scope> a11y, theming-dark-mode` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the same-named row in `dimension-checks.md`
- evidence: no CLI slice — run the axe capture, Lighthouse, `/deep-test a11y`, and the token-diff grep first, then pass that output in as the slice
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve a11y`, applied only through `/deep-review <scope> then-fix` after confirmation
