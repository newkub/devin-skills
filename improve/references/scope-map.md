# Improve Scope Map (SSOT)

The single mapping table of scope → review domain + ownership boundary — other skills must not copy this table; point to this file instead (`/follow-single-of-source`)
Every scope is handled by the `/improve` thin entry (or `/optimize` for metric-driven scope): review → `/deep-review-codebase <domain>` | fix → `/deep-review-codebase-then-fix`

| Scope (`/improve <scope>`) | Review domain(s) | Ownership / boundary |
|---|---|---|
| (generic) | (broad scan) | `/improve` dispatches on its own; metric-driven findings → `/optimize` |
| `a11y` | review-accessibility | WCAG, screen reader, keyboard nav; native-element semantics + ARIA ordering → `/follow-web-standard` |
| `ai` | review-ai | prompts, evals, token/cost, hallucination guards; safety → `/improve ai-safety`, LLM spend → `/optimize llm` |
| `algorithm` | review-algorithm | complexity, algorithm correctness |
| `api` | review-api, review-backend | contract, versioning, endpoints |
| `architecture` | review-architecture | pattern/coupling/boundary findings — pick a pattern + apply restructure + monorepo layout → `/follow-architecture`, file-level passes → `/refactor` |
| `astgrep-rules` | review-config, review-code-quality | ruleset review → fix via `/update-astgrep-rules` |
| `auth` | review-auth | authn/authz flows, sessions, tokens; RBAC UI → scope `auth` + review-frontend |
| `backend` | review-backend | handlers, service boundaries |
| `billing` | review-api, review-business, review-security | payments, invoicing, webhooks; raw spend optimization → `/optimize cost` |
| `browser-extensions` | review-browser-ext | manifest V3, permissions, content scripts |
| `business` | review-business | domain logic vs requirements |
| `cache` | review-backend, review-data-validation | cache correctness: invalidation ทุก write path, TTL, cache key design, stale data; hit rate/perf → `/optimize cache`; source data integrity → `/improve data` |
| `cli` | review-cli | flags, output, exit codes |
| `code-quality` | review-code-quality, review-redundancy | error-handling findings → `/improve error-handling`; correctness → `/improve correctness` |
| `collaboration` | review-frontend, review-backend, review-data-validation | concurrent edits, CRDT/OT merge, presence; transport → `/improve realtime`, messaging → `/improve events` |
| `compliance` | review-compliance | legal/regulatory requirements |
| `config` | review-config | config hygiene, drift |
| `consistency` | review-alignment, review-redundancy, review-code-quality, review-writing | naming/pattern/style/layer sync |
| `correctness` | review-code-quality, review-data-validation, review-test | bugs/logic errors + regression tests |
| `coverage` | review-coverage, review-gaps | gap-filling: ตรวจและเติมส่วนที่ขาด (content/skill/code) — code coverage → `/update-tests` + `/deep-test coverage`; flaky → `/check-flaky-tests` |
| `data` | review-data-validation | data integrity end to end (pipeline, schema/constraints, retention); validation layer only → `/improve data-validation` |
| `database` | review-database | ORM, schema design; query perf → `/optimize queries` |
| `delivery` | review-delivery | release pipeline end-to-end |
| `deps` | review-dependencies | versions, lockfile, supply chain |
| `desktop-app` | review-desktop-app | windowing, IPC, packaging |
| `devin-global-skills` | review-devin-global-harness | harness review (skills, subagents, hooks, MCP, global rules) — fix via `/deep-review-codebase-then-fix`, standards via `/update-devin-global-skills` |
| `docs` | review-docs | README/guides/structure; writing findings → `/improve writing` |
| `dot-devin` | review-dot-devin | project devin config/assets |
| `dx` | review-dx, review-bundle | tooling, onboarding; devtools dock/integrations → `/follow-tool-vite-devtools`, standalone devtool → `/follow-tool-devfra`; size → `/optimize bundle` |
| `email` | review-backend, review-frontend | deliverability (SPF/DKIM/DMARC), bounces, templates; notifications channel → `/improve notifications`; sending service → `/follow-service-resend` |
| `env-parity` | review-config, review-iac | dev/staging/prod config drift; never copy secret values — → `/follow-secret-manager` |
| `error-handling` | review-stability, review-code-quality, review-frontend, review-uxui, review-api, review-cli | **sole owner** of error paths, retries, recovery, error states/error UI/error boundaries |
| `events` | review-events | **messaging semantics**: schema, versioning, ordering, idempotency, DLQ, retry/backoff |
| `features` | review-gaps, review-uxui, review-business | type-driven: inventory every type option via `/check-types-definition` → dead declared options → `/implement-to-production`, weak-UX → `/improve uxui`, new features → extend type options via `/create-plan-in-dot-devin`; net-new + platform → `/idea-features`; flags → `/update-config` |
| `form` | review-frontend, review-data-validation, review-accessibility | form UX + validation; native controls + Constraint Validation API first → `/follow-web-standard` |
| `i18n` | review-i18n | locales, message format |
| `mcp` | review-mcp | tools, resources, server hygiene |
| `migration` | review-migration | backward compat, data integrity, rollback, cutover |
| `mobile-app` | review-mobile | platform APIs, store compliance |
| `monorepo` | review-architecture, review-config, review-dx | workspace/task graph |
| `notifications` | review-backend, review-api | channels, delivery, preferences |
| `offline` | review-frontend, review-performance | cache-first, sync queue, conflict replay; storage quota → `/optimize storage` |
| `onboarding` | review-uxui, review-frontend, review-business | first-run journey |
| `platform` | review-observability, review-release, review-iac | hosting/runtime platform, alerting, auto-update, scheduled infra jobs |
| `privacy` | review-compliance | consent, PII handling, data rights; purge jobs → `/improve retention` |
| `queues` | review-backend, review-stability | **queue ops**: consumer lag, worker sizing, priority, poison-message ops; messaging semantics → `/improve events` |
| `rate-limiting` | review-security, review-api, review-stability | quotas, throttling policy |
| `realtime` | review-backend, review-stability | **transport**: WebSocket/SSE reconnect, heartbeat, presence; messaging semantics → `/improve events` |
| `release` | review-release | versioning, changelog, publish |
| `resilience` | review-stability, review-backend | **resilience patterns**: circuit breaker, bulkhead, graceful degradation; broad crash/recovery → `/improve stability` |
| `retention` | review-compliance, review-database | purge jobs, retention policy enforcement; consent → `/improve privacy` |
| `scalability` | review-performance, review-architecture | load growth design; metric-driven tuning → `/optimize` |
| `scheduled-jobs` | review-backend, review-stability | cron idempotency, catch-up, missed-run handling; queue ops → `/improve queues` |
| `sdk` | review-sdk | public API surface, compat |
| `search` | review-backend, review-frontend, review-performance | relevance, ranking, query parsing, result UX; index/store → `/improve database` |
| `security` | review-security | vulnerabilities, OWASP; secrets → `/follow-secret-manager` |
| `seo` | review-seo | meta, sitemap, structured data |
| `service-integrations` | review-api, review-stability, review-security | external APIs/webhooks/credentials |
| `stability` | review-stability | **broad crash/recovery**; error paths + error UI → `/improve error-handling`; messaging → `/improve events` |
| `techstack` | review-techstack, review-dependencies | framework/runtime upgrades |
| `tests` | review-test, review-coverage | test suite quality incl. test data (factories, seeds, fixtures isolation); flaky → `/check-flaky-tests`, assertion quality → `/deep-test test-correctness`, seed table schema → `/improve database` |
| `typesafe` | review-code-quality, review-data-validation, review-sdk, review-frontend | type safety surfaces |
| `uploads` | review-frontend, review-backend, review-security | size/type limits, direct-to-storage, resumable; storage → `/optimize storage`; images → `/optimize images` |
| `usage-md` | usage | top-level skill `improve-usage-md` — USAGE.md/examples actually work |
| `uxui` | review-uxui, review-accessibility, review-mobile, review-frontend, review-writing | design system/theme + interaction/navigation (RBAC UI, UX routing), motion (reduced-motion fallback + lib via `/follow-lib-animejs`), UX copy clarity/tone/consistency; native semantics/widgets → `/follow-web-standard`; error UI/copy → `/improve error-handling`, docs prose → `/improve writing`, onboarding copy → `/improve onboarding` |
| `web` | review-seo, review-frontend | routing/SEO/metadata; error UI → `/improve error-handling`; SEO findings → `/improve seo` |
| `workflows` | review-workflow | CI/CD workflow files |
| `writing` | review-writing | prose quality — top-level skill `improve-writing` owns the criteria (clear, concise, explicit, bounded, terminology, ordered, followable) |
