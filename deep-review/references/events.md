# events

Row bundle for the `events` review dimension — the matrix row below is the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `events` | `artifact-match` | `manual` | `—` | `/improve events` |

## Run

- `/deep-review <scope> events` — adds the `always` tier and runs the full pipeline; this file only selects the row
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the `events` row in `dimension-checks.md`
- evidence: no CLI slice — take the `/review-issues` slice on consumer code and read it against the ordering and idempotency guarantees, then pass the findings in
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve events`, applied only through `/deep-review <scope> then-fix` after confirmation
