# compliance

Row bundle for the `compliance` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `license-compliance` | `artifact-match` | `cli` | `deps` | `/improve compliance` |
| `privacy` | `artifact-match` | `manual` | `security` | `/improve privacy` |
| `audit-trail` | `on-demand` | `manual` | `security` | `/improve compliance` |
| `dsar-rights` | `on-demand` | `capture` | `security` | `/improve privacy` |
| `data-residency` | `on-demand` | `cli` + `manual` | `config` | `/improve compliance` |

## Run

- `/deep-review <scope> license-compliance, privacy, audit-trail, dsar-rights, data-residency` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the same-named row in `dimension-checks.md`
- `audit-trail`, `dsar-rights`, and `data-residency` are `on-demand` — run them only when the user asks for a compliance pass
- evidence: the `deps`/`config` slices from `/run-review` for the `cli` rows; the row's `Tool/skill` first (`licenseeye`, `cargo deny`, PII-in-log grep, delete/export integration run, region grep) for `capture`/`manual`
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve compliance` and `/improve privacy`, applied only through `/deep-review <scope> then-fix` after confirmation
