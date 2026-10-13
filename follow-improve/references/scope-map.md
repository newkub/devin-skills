# Improve Scope Map (SSOT)

The single mapping table of `improve-*` → review domain + ownership boundary — other skills must not copy this table; point to this file instead (`/follow-single-of-source`)
Every thin entry: review → `/deep-review <domain>` | fix → `/deep-review-then-fix` (`## Domain Map`)

| Skill | Review domain(s) | Ownership / boundary |
|---|---|---|
| `improve` | (generic — broad scan) | thin entry dispatches on its own; metric-driven findings → `/optimize` |
| `improve-a11y` | review-accessibility | WCAG, screen reader, keyboard nav |
| `improve-ai` | review-ai | prompts, evals, token/cost, hallucination guards; safety → `/improve-ai-safety`, LLM spend → `/optimize-llm` |
| `improve-ai-safety` | review-ai, review-security | prompt injection, jailbreak, output sanitization, data exfiltration; eval/quality → `/improve-ai` |
| `improve-alerting` | review-observability | alert noise, routing, escalation, runbook coverage; logs/metrics/traces coverage → `/improve-observability` |
| `improve-algorithm` | review-algorithm | complexity, algorithm correctness |
| `improve-api` | review-api, review-backend | contract, versioning, endpoints |
| `improve-api-deprecation` | review-api, review-docs | Deprecation/Sunset headers, migration guide, usage telemetry before retiring endpoints |
| `improve-architecture` | review-architecture | pattern/coupling/boundary findings — pick a pattern → `/follow-architecture`, apply restructure → `/refactor` |
| `improve-astgrep-rules` | review-config, review-code-quality | ruleset review → fix via `/update-astgrep-rules` |
| `improve-auth` | review-auth | authn/authz flows, sessions, tokens |
| `improve-auto-update` | review-desktop-app, review-mobile, review-release | update channel, delta, failure paths; publish pipeline → `/improve-release` |
| `improve-backend` | review-backend | handlers, service boundaries |
| `improve-billing` | review-api, review-business, review-security | payments, invoicing, webhooks; raw spend optimization → `/optimize-cost` |
| `improve-browser-extensions` | review-browser-ext | manifest V3, permissions, content scripts |
| `improve-business` | review-business | domain logic vs requirements |
| `improve-cache` | review-backend, review-data-validation | cache correctness: invalidation ทุก write path, TTL, cache key design, stale data; hit rate/perf → `/optimize-cache`; source data integrity → `/improve-data` |
| `improve-cli` | review-cli | flags, output, exit codes |
| `improve-code-quality` | review-code-quality, review-redundancy | error-handling findings → `/improve-error-handling`; correctness → `/improve-correctness` |
| `improve-collaboration` | review-frontend, review-backend, review-data-validation | concurrent edits, CRDT/OT merge, presence; transport → `/improve-realtime`, messaging → `/improve-events` |
| `improve-compliance` | review-compliance | legal/regulatory requirements |
| `improve-config` | review-config | config hygiene, drift |
| `improve-consistency` | review-alignment, review-redundancy, review-code-quality, review-writing | naming/pattern/style/layer sync |
| `improve-correctness` | review-code-quality, review-data-validation, review-test | bugs/logic errors + regression tests |
| `improve-coverage` | (exception — not a thin entry) | gap-filling implementer for content/skill/code coverage |
| `improve-data` | review-data-validation | data integrity end to end (pipeline, schema/constraints, retention); validation layer only → `/improve-data-validation` |
| `improve-data-validation` | review-data-validation | validation layer: schema-per-input, DTO, boundary validation |
| `improve-database` | review-database | ORM, schema design; query perf → `/optimize-queries` |
| `improve-datetime` | review-code-quality, review-data-validation | timezone correctness, UTC storage, DST edge cases; lib → `/follow-lib-remedajs` |
| `improve-delivery` | review-delivery | release pipeline end-to-end |
| `improve-deps` | review-dependencies | versions, lockfile, supply chain |
| `improve-desktop-app` | review-desktop-app | windowing, IPC, packaging |
| `improve-devin-global-skills` | (orchestrator) | runs review across the whole repo, then merges findings |
| `improve-docs` | review-docs | README/guides/structure; writing findings → `/improve-writing` |
| `improve-dot-devin` | review-dot-devin | project devin config/assets |
| `improve-dx` | review-dx, review-bundle | tooling, onboarding; size → `/optimize-bundle` |
| `improve-email` | review-backend, review-frontend | deliverability (SPF/DKIM/DMARC), bounces, templates; notifications channel → `/improve-notifications`; sending service → `/follow-service-resend` |
| `improve-env-parity` | review-config, review-iac | dev/staging/prod config drift; never copy secret values — → `/follow-secret-manager`; drift report → `/deep-review` domain `review-config` |
| `improve-error-handling` | review-stability, review-code-quality, review-frontend, review-uxui, review-api, review-cli | **sole owner** of error paths, retries, recovery, error states/error UI/error boundaries |
| `improve-events` | review-events | **messaging semantics**: schema, versioning, ordering, idempotency, DLQ, retry/backoff |
| `improve-features` | review-gaps, review-uxui, review-business | extends/gaps of core business only; net-new + platform → `/idea-features`; flag hygiene → `/improve-features-flags` |
| `improve-features-flags` | review-config, review-code-quality | stale-flag removal, targeting hygiene, kill-switch coverage; feature gaps → `/improve-features`, rollout → `/improve-release` |
| `improve-form` | review-frontend, review-data-validation, review-accessibility | form UX + validation |
| `improve-graphql` | review-api, review-database | schema/resolvers/N+1 |
| `improve-i18n` | review-i18n | locales, message format |
| `improve-iac` | review-iac | IaC modules, state, drift |
| `improve-mcp` | review-mcp | tools, resources, server hygiene |
| `improve-metering` | review-backend, review-business | usage tracking, aggregation, billing reconciliation; charges/invoices → `/improve-billing` |
| `improve-migration` | review-migration | backward compat, data integrity, rollback, cutover |
| `improve-mobile-app` | review-mobile | platform APIs, store compliance |
| `improve-monorepo` | review-architecture, review-config, review-dx | workspace/task graph |
| `improve-motion` | review-uxui, review-frontend, review-accessibility | animation timing/motion consistency, reduced-motion; lib → `/follow-lib-animejs` |
| `improve-notifications` | review-backend, review-api | channels, delivery, preferences |
| `improve-observability` | review-observability | logs/metrics/traces coverage |
| `improve-offline` | review-frontend, review-performance | cache-first, sync queue, conflict replay; storage quota → `/optimize-storage` |
| `improve-onboarding` | review-uxui, review-frontend, review-business | first-run journey |
| `improve-pagination` | review-api, review-database | cursor vs offset, page stability, total counts; query perf → `/optimize-queries` |
| `improve-payment-recovery` | review-backend, review-business | dunning, retry schedule, grace period; invoicing → `/improve-billing`; gateway integration → `/follow-service-stripe` |
| `improve-platform` | review-observability, review-release, review-iac | hosting/runtime platform |
| `improve-privacy` | review-security, review-compliance | PII, consent, data minimization |
| `improve-queues` | review-backend, review-stability | **queue ops**: consumer lag, worker sizing, priority, poison-message ops; messaging semantics → `/improve-events` |
| `improve-rate-limiting` | review-security, review-api, review-stability | quotas, throttling policy |
| `improve-rbac` | review-auth, review-frontend | roles/permissions + role-based UI |
| `improve-realtime` | review-backend, review-stability | **transport**: WebSocket/SSE reconnect, heartbeat, presence; messaging semantics → `/improve-events` |
| `improve-release` | review-release | versioning, changelog, publish |
| `improve-resilience` | review-stability, review-backend | **resilience patterns**: circuit breaker, bulkhead, graceful degradation; broad crash/recovery → `/improve-stability` |
| `improve-retention` | review-compliance, review-database | purge jobs, retention policy enforcement; consent → `/improve-privacy` |
| `improve-scalability` | review-performance, review-architecture | load growth design; metric-driven tuning → `/optimize-*` |
| `improve-scheduled-jobs` | review-backend, review-stability | cron idempotency, catch-up, missed-run handling; queue ops → `/improve-queues` |
| `improve-sdk` | review-sdk | public API surface, compat |
| `improve-search` | review-backend, review-frontend, review-performance | relevance, ranking, query parsing, result UX; index/store → `/improve-database` |
| `improve-secrets` | review-security, review-config | secrets hygiene fix path — hardcoded values, git-history leaks, rotation; detection-only → `/check-secrets`, general vulns → `/improve-security`, secret store tooling → `/follow-secret-manager` |
| `improve-security` | review-security | vulnerabilities, OWASP |
| `improve-seo` | review-seo | meta, sitemap, structured data |
| `improve-service-integrations` | review-api, review-stability, review-security | external APIs/webhooks/credentials |
| `improve-stability` | review-stability | **broad crash/recovery**; error paths + error UI → `/improve-error-handling`; messaging → `/improve-events` |
| `improve-techstack` | review-techstack, review-dependencies | framework/runtime upgrades |
| `improve-test-data` | review-test | factories, seeds, fixtures isolation; assertion quality → `/improve-tests`; flaky → `/check-flaky-tests` |
| `improve-tests` | review-test, review-coverage | test suite quality (unlike `/improve-coverage`, which fills gaps directly); flaky → `/check-flaky-tests`, fixtures → `/improve-test-data` |
| `improve-typesafe` | review-code-quality, review-data-validation, review-sdk, review-frontend | type safety surfaces |
| `improve-uploads` | review-frontend, review-backend, review-security | size/type limits, direct-to-storage, resumable; storage → `/optimize-storage`; images → `/optimize-images` |
| `improve-usage` | review-usage | USAGE.md/examples actually work |
| `improve-ux-writing` | review-uxui, review-writing | UI copy clarity/tone/consistency; error copy → `/improve-error-handling`, onboarding copy → `/improve-onboarding` |
| `improve-uxui` | review-uxui, review-accessibility, review-mobile, review-frontend | design system/interaction/navigation (RBAC UI); error UI → `/improve-error-handling` |
| `improve-web` | review-seo, review-frontend | routing/SEO/metadata; error UI → `/improve-error-handling`; SEO findings → `/improve-seo` |
| `improve-workflows` | review-workflow | CI/CD workflow files |
| `improve-writing` | review-writing | prose quality |

