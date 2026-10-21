# iac

Row bundle for the `iac` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `iac-cloud-config` | `artifact-match` | `cli` | `config` | `/improve platform` |
| `containers` | `artifact-match` | `cli` + `capture` | `config` | `/optimize docker` |
| `dns-certificate` | `artifact-match` | `capture` | `config` | `/improve delivery` |
| `serverless-runtime-constraints` | `artifact-match` | `cli` | `config` | `/improve platform` |

## Run

- `/deep-review <scope> iac-cloud-config, containers, dns-certificate, serverless-runtime-constraints` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `dimension-matrix.md`; the proof statement is the same-named row in `dimension-checks.md`
- evidence: the `config` slice from `/run-review --domain config`; the live probe first (`dig`, `openssl s_client`, `hadolint`, `dive`, `trivy`, `wrangler dev`) for the `capture` rows
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve platform`, `/optimize docker`, and `/improve delivery` — applied only through `/deep-review <scope> then-fix` after confirmation
