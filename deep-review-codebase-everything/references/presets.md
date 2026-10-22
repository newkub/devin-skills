# Preset Reference

Single source for the deep-review family: the `deep-review-codebase-everything` engine plus eleven `review-*` doors. It maps each preset's tier, the matrix labels it seeds, and the fix route it owns. The matrix in `review.md` stays the row contract — a preset never restates a check, never runs its own scan, and never fixes outside the rows it seeded. `scripts/verify-matrix.ts` proves every row below resolves.

## Preset Map

- A `review-*` door is deep inside: it reuses the `deep-review-codebase-everything` pipeline (Think → Run once → Fan out → Report → Persist → Route → Fix) and owns only its labels and fix route. The prefix marks the user-facing door, not a single-dimension assessor.
- The engine keeps the `deep-review-codebase-everything` name because it is the shared pipeline and the dispatcher's default door.
- `Seeded labels` are dimension names or `Aliases` entries in `review.md` `## Dimension Matrix`; the engine resolves each through `### Label resolution`.
- `all` (engine only) means the standard tiered sweep: `always` + matching `artifact-match` + any user-requested `on-demand`.
- `—` means the preset carries its own evidence model instead of matrix labels (the engine still runs the `always` tier).
- `on-demand` presets are never chosen by the dispatcher unless the user asks for that domain.

| Preset | Tier | Seeded labels | Fix route |
|---|---|---|---|
| `deep-review-codebase-everything` | core | all | `review.md` `## Domain Map` per finding |
| `review-refactor` | core | architecture, code-quality | `/refactor`; architecture → `/follow-architecture` |
| `review-implement-to-production` | core | — | `/implement-to-production` |
| `review-update` | core | docs, config, dependencies | `/update-project`, `/update-docs`, `/update-agents-md`, `/update-config`, `/update-references` |
| `review-design` | core | uxui, a11y | `/improve uxui`, `/improve a11y` |
| `review-tests` | core | tests, test-data-hygiene | `/update-tests`, `/improve tests` |
| `review-security` | core | security, injection, ssrf-open-redirect, path-traversal, prototype-pollution, untrusted-deserialization, redos, auth, authz-policy, tenant-isolation, csrf, cors, password-storage, oauth-flow, secret-lifecycle, secrets-in-artifacts, crypto-hygiene, http-headers-csp, uploads, llm-security, privacy, mass-assignment, xxe | `/improve security`, `/improve auth`, `/improve privacy`; advisories → `/run-audit` |
| `review-performance` | core | performance, web-vitals, bundle-size, http-delivery, media-optimization, caching, rendering-strategy, resource-leaks, llm-cost-latency, capacity-scaling, cold-start, concurrency | `/optimize perf`, `/optimize web-vitals`, `/optimize bundle`, `/optimize cache`, `/optimize network`, `/optimize llm`, `/optimize memory`, `/optimize startup`, `/optimize docker`, `/optimize cost`, `/optimize queries` |
| `review-data` | core | data, database, migration, data-schema-evolution, schema-drift, backfill-migration, transactions-isolation, soft-delete-integrity, backup-restore, dual-write-consistency, state-machine-integrity, client-state-migration, client-state-consistency, analytics-integrity | `/improve data`, `/improve database`, `/improve migration`, `/improve consistency`, `/improve retention` |
| `review-ops` | core | dependencies, dependency-health, runtime-eol, lib-usage, ci-cd, iac-cloud-config, infra-drift, observability, delivery, runbook-oncall, slo-error-budget, cost, containers, dns-certificate, versioning-changelog, build-reproducibility | `/improve deps`, `/improve platform`, `/optimize ci`, `/improve delivery`, `/update-version-to-latest` |
| `review-api` | on-demand | api, contract-compat, graphql-oas-surface, pagination-correctness, idempotency, inbound-webhooks, webhook-lifecycle, api-deprecation-policy, input-limits, mass-assignment, error-handling | `/improve api`, `/improve events`, `/improve auth` |
| `review-a11y` | on-demand | a11y, theming-dark-mode, motion, responsive-layout, form | `/improve a11y`, `/improve uxui` |

## Notes

- A preset exists only when it owns a domain-level fix sequence across several matrix rows; a single-row rename stays a label call (`/deep-review <scope> <label>`), never a new door.
- Adding a door means a new row here + its `review-<domain>` `SKILL.md` + a dispatcher door; `verify-matrix.ts` fails when any of the three is missing. The engine row is the only `deep-review-*` name in this table.
- Presets do not inherit each other — a broad domain (security, performance, ops) states its rows explicitly and leaves everything else to `deep-review-codebase-everything`.
