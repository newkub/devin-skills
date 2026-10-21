# dx

Row bundle for the `dx` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `bundle-size` | `artifact-match` | `cli` | `quality` | `/optimize bundle` |
| `ci-cd` | `artifact-match` | `cli` | `config` | `/optimize ci` |
| `repo-hygiene` | `artifact-match` | `cli` | `config` | `/improve code-quality` |
| `onboarding-dx` | `on-demand` | `capture` | `—` | `/improve dx` |

## Run

- `/deep-review <scope> bundle-size, ci-cd, repo-hygiene, onboarding-dx` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the same-named row in `../dimension-checks.md`
- evidence: the `quality`/`config` slices from `/run-review` for the `cli` rows; a fresh-clone trial through `/run-dev` with its setup timing and failures for `onboarding-dx`
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/optimize bundle`, `/optimize ci`, `/improve code-quality`, and `/improve dx` — applied only through `/deep-review <scope> then-fix` after confirmation
