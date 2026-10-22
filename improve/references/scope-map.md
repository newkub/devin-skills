# Improve Scope Map (SSOT)

The single mapping table of scope → review domain + ownership boundary — other skills must not copy this table; point to this file instead (`/follow-single-of-source`)
Every scope is handled by the `/improve` thin entry (or `/optimize` for metric-driven scope): review → `/deep-review <dimension>` | fix → `/deep-review <scope> then-fix`

**Label resolution (mandatory)** — every name in the `Review domain(s)` column is either a plain dimension label, or a standalone skill name kept verbatim (`review-test`, `review-gaps`, `review-devin-global-harness`, `usage`). A dimension label takes the row(s) in `deep-review-codebase-everything/references/review.md` `## Dimension Matrix` whose `Aliases` column lists it (or whose row name equals it), plus the `always` tier — read that set from the table, never re-resolve by hand (resolution rules: `deep-review-codebase-everything/references/review.md` `### Label resolution`). A label with no row is a matrix gap: dispatch the `always` tier + the closest artifact-match rows and report the gap, never invent a dimension.

| Scope (`/improve <scope>`) | Review domain(s) | Ownership / boundary |
|---|---|---|
| (generic) | (broad scan) | `/improve` dispatches on its own; metric-driven findings → `/optimize` |
| `a11y` | accessibility | WCAG, screen reader, keyboard nav; native-element semantics + ARIA ordering → `/follow-web-standard` |
| `ai` | ai | prompts, evals, token/cost, hallucination guards; safety → the `security` scope, LLM spend → `/optimize llm` |
| `algorithm` | algorithm | complexity, algorithm correctness |
| `api` | api, backend | contract, versioning, endpoints |
| `architecture` | architecture | pattern/coupling/boundary findings — pick a pattern + apply restructure + monorepo layout → `/follow-architecture`, file-level passes → `/refactor` |
| `astgrep-rules` | config, code-quality | ruleset review → fix via `/update-astgrep-rules` |
| `auth` | auth | authn/authz flows, sessions, tokens; RBAC UI → scope `auth` + dimension `frontend` |
| `backend` | backend | handlers, service boundaries |
| `billing` | api, business, security | payments, invoicing, webhooks; raw spend optimization → `/optimize cost` |
| `browser-extensions` | browser-ext | manifest V3, permissions, content scripts |
| `business` | business | domain logic vs requirements |
| `cache` | backend, data-validation | cache correctness: invalidation on every write path, TTL, cache key design, stale data; hit rate/perf → `/optimize cache`; source data integrity → `/improve data` |
| `cli` | cli | flags, output, exit codes |
| `code-quality` | code-quality, redundancy | error-handling findings → `/improve error-handling`; correctness → `/improve correctness` |
| `collaboration` | frontend, backend, data-validation | concurrent edits, CRDT/OT merge, presence; transport → `/improve realtime`, messaging → `/improve events` |
| `compliance` | compliance | legal/regulatory requirements |
| `config` | config | config hygiene, drift |
| `consistency` | alignment, redundancy, code-quality, writing | naming/pattern/style/layer sync |
| `correctness` | code-quality, data-validation, review-test | bugs/logic errors + regression tests |
| `coverage` | coverage, review-gaps | gap-filling: check and fill in the missing parts (content/skill/code) — code coverage → `/update-tests` + `/deep-test coverage`; flaky → `/check-flaky-tests` |
| `data` | data-validation | data integrity end to end (pipeline, schema/constraints, retention); validation layer only → the `correctness` scope |
| `database` | database | ORM, schema design; query perf → `/optimize queries` |
| `delivery` | delivery | release pipeline end-to-end |
| `deps` | dependencies | versions, lockfile, supply chain |
| `desktop-app` | desktop-app | windowing, IPC, packaging |
| `devin-global-skills` | review-devin-global-harness | harness review (skills, subagents, hooks, MCP, global rules) — fix via `/deep-review <scope> then-fix`, standards via `/update-devin-global-skills` |
| `docs` | docs | README/guides/structure; writing findings → `/improve writing` |
| `dot-devin` | dot-devin | project devin config/assets |
| `dx` | dx, bundle | tooling, onboarding; devtools dock/integrations → `/follow-tool-vite-devtools`, standalone devtool → `/follow-tool-devfra`; size → `/optimize bundle` |
| `email` | backend, frontend | deliverability (SPF/DKIM/DMARC), bounces, templates; notifications channel → `/improve notifications`; sending service → `/follow-service-resend` |
| `env-parity` | config, iac | dev/staging/prod config drift; never copy secret values — → `/follow-secret-manager` |
| `error-handling` | stability, code-quality, frontend, uxui, api, cli | **sole owner** of error paths, retries, recovery, error states/error UI/error boundaries |
| `events` | events | **messaging semantics**: schema, versioning, ordering, idempotency, DLQ, retry/backoff |
| `features` | review-gaps, uxui, business | type-driven: inventory every type option via `/check-types-definition` → dead declared options → `/implement-to-production`, weak-UX → `/improve uxui`, new features → extend type options via `/create-plan-in-dot-devin`; net-new + platform → `/idea-features`; flags → `/update-config` |
| `form` | frontend, data-validation, accessibility | form UX + validation; native controls + Constraint Validation API first → `/follow-web-standard` |
| `i18n` | i18n | locales, message format |
| `mcp` | mcp | tools, resources, server hygiene |
| `migration` | migration | backward compat, data integrity, rollback, cutover |
| `mobile-app` | mobile | platform APIs, store compliance |
| `monorepo` | architecture, config, dx | workspace/task graph |
| `notifications` | backend, api | channels, delivery, preferences |
| `offline` | frontend, performance | cache-first, sync queue, conflict replay; storage quota → `/optimize storage` |
| `onboarding` | uxui, frontend, business | first-run journey |
| `platform` | observability, release, iac | hosting/runtime platform, alerting, auto-update, scheduled infra jobs |
| `privacy` | compliance | consent, PII handling, data rights; purge jobs → `/improve retention` |
| `queues` | backend, stability | **queue ops**: consumer lag, worker sizing, priority, poison-message ops; messaging semantics → `/improve events` |
| `rate-limiting` | security, api, stability | quotas, throttling policy |
| `realtime` | backend, stability | **transport**: WebSocket/SSE reconnect, heartbeat, presence; messaging semantics → `/improve events` |
| `release` | release | versioning, changelog, publish |
| `resilience` | stability, backend | **resilience patterns**: circuit breaker, bulkhead, graceful degradation; broad crash/recovery → `/improve stability` |
| `retention` | compliance, database | purge jobs, retention policy enforcement; consent → `/improve privacy` |
| `scalability` | performance, architecture | load growth design; metric-driven tuning → `/optimize` |
| `scheduled-jobs` | backend, stability | cron idempotency, catch-up, missed-run handling; queue ops → `/improve queues` |
| `sdk` | sdk | public API surface, compat |
| `search` | backend, frontend, performance | relevance, ranking, query parsing, result UX; index/store → `/improve database` |
| `security` | security | vulnerabilities, OWASP; secrets → `/follow-secret-manager` |
| `seo` | seo | meta, sitemap, structured data |
| `service-integrations` | api, stability, security | external APIs/webhooks/credentials |
| `stability` | stability | **broad crash/recovery**; error paths + error UI → `/improve error-handling`; messaging → `/improve events` |
| `techstack` | techstack, dependencies | framework/runtime upgrades |
| `tests` | review-test, coverage | test suite quality incl. test data (factories, seeds, fixtures isolation); flaky → `/check-flaky-tests`, assertion quality → `/deep-test test-correctness`, seed table schema → `/improve database` |
| `typesafe` | code-quality, data-validation, sdk, frontend | type safety surfaces |
| `uploads` | frontend, backend, security | size/type limits, direct-to-storage, resumable; storage → `/optimize storage`; images → `/optimize images` |
| `usage-md` | usage | top-level skill `improve-usage-md` — USAGE.md/examples actually work |
| `use-lib-effective` | lib-usage | library usage effectiveness — right lib, current major, documented API, required setup, one lib per job, no hand-rolled duplicate; selection → `/follow-my-techstack`, unused/version → `/improve deps` |
| `uxui` | uxui, accessibility, mobile, frontend, writing | design system/theme + interaction/navigation (RBAC UI, UX routing), motion (reduced-motion fallback + lib via `/follow-lib-animejs`), UX copy clarity/tone/consistency; native semantics/widgets → `/follow-web-standard`; error UI/copy → `/improve error-handling`, docs prose → `/improve writing`, onboarding copy → `/improve onboarding` |
| `web` | seo, frontend | routing/SEO/metadata; error UI → `/improve error-handling`; SEO findings → `/improve seo` |
| `workflows` | workflow | CI/CD workflow files |
| `writing` | writing | prose quality — top-level skill `improve-writing` owns the criteria (clear, concise, explicit, bounded, terminology, ordered, followable) |
