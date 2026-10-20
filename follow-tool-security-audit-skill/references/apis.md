| key | value |
|---|---|
| package | coding-agent skill `cloudflare/security-audit-skill` (no npm package) |
| install | `npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit` (add `--global` for user-level) |
| version | track repo `main` — no versioned release (checked 2026-10-20) |
| license | MIT |
| repo | https://github.com/cloudflare/security-audit-skill |
| requires | agent with tool use + parallel sub-agents; Node.js for the zero-dependency validators; OS-enforced sandbox for target-controlled execution |
| mode | full audit for audit/pen-test requests; guidance mode for security questions unless report artifacts are requested |

| api | description | signature/example |
|---|---|---|
| `architecture.md` | phase 1 recon output — trust boundaries, input surfaces, prior evidence | written by the skill before hunting |
| `coverage-ledger.json` | deterministic coverage units that hunters are assigned from | ledger for every run; repeat runs target its gaps |
| `validate-coverage-ledger.cjs` | zero-dependency ledger validator | `node validate-coverage-ledger.cjs` — after creation and every update |
| `findings.json` | all three verdict records (`confirmed`, `needs_validation`, `rejected`) | validated against `report-schema.json` |
| `validate-findings.cjs` | zero-dependency findings validator | `node validate-findings.cjs` — phase 4 and after every phase 5 replacement |
| `REPORT.md` | target-neutral summary derived only from verified records + ledger | phase 6 |
| `FINDINGS-DETAIL.md` | per-finding detail from verified records | phase 6 |
| `NEEDS-VALIDATION.md` | unresolved facts with the exact blocking condition, no severity | phase 6 |
| verdict `confirmed` | complete source trace + bounded observed result | only established boundary failures |
| verdict `needs_validation` | exact unresolved fact; never carries a severity | blocked lead, source-grounded |
| verdict `rejected` | disproved candidate | records the reason it failed |
| attack-class files | `ATTACK-CLASSES.md` + per-target classes (memory/binary, AI/LLM, web protocol/auth, client-side, supply-chain, cloud, RPC/messaging, resource exhaustion, data isolation, desktop/mobile IPC) | loaded per target |
| output dir | default is outside the repo | `~/security-audit-skill/<repo-name>/run-<N>` |
