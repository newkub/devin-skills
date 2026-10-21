# Review Checks

Everything `deep-review` proves and routes: the per-dimension "what must be proven" statements (`## Dimension Checks`) and the fix routing map (`## Domain Map`). The row data — tier, evidence, severity, N/A, CLI domain, enforcement, gate, aliases, tool, fix owner — lives in `references/review.md` (`## Dimension Matrix`), never duplicated here.

## Dimension Checks

Per-dimension verification detail for `deep-review` `### 3. Fan out` — one row per dimension in `references/review.md` `## Dimension Matrix`, same names, same order of concern. This file owns the **"what must be proven"** statement only: `Evidence`, `Default severity` (+ upgrade/downgrade trigger), `N/A condition`, `CLI domain`, `Enforcement`, `Gate`, and the tool live in the matrix row, never duplicated here.

A `capture` row means: run the matrix `Tool/skill` first, then dispatch the reviewer with its output as input (`### 3` step 4). A `manual` row has no deterministic source → dispatch a reviewer whose inputs are the matrix row + the files named in evidence; the parent absorbs it only under the ≤ 2-findings rule. Nothing here may be skipped silently — the only legal `skipped` reasons are the matrix `N/A condition` (recorded as the ledger reason).

| Dimension | Check — what must be proven |
|---|---|
| `correctness` | every claim/action in scope does what its spec says; no dead action, silent failure, wrong guard |
| `security` | ASVS-chapter items applicable to the artifact pass; no known-vuln dep, committed secret, unsafe default |
| `architecture` | chosen pattern holds: layer boundaries respected, no cycles, no SRP violations in touched units |
| `code-quality` | no duplication above threshold, no >250-line files, naming consistent with repo conventions |
| `dependencies` | every dep used, one version per package, no unresolved advisories, lockfile committed |
| `docs` | documented commands/APIs match reality; no dead links; freshness stated |
| `performance` | bottleneck is measured (profile/EXPLAIN/trace), not guessed; hot paths inside budget |
| `web-vitals` | p75 LCP/INP/CLS within good thresholds on key routes |
| `bundle-size` | per-chunk size within budget; no accidental heavy dep in entry chunk |
| `a11y` | axe reports 0 WCAG 2.2 AA violations on audited views; keyboard path exists for every action |
| `seo` | indexable routes have unique titles/meta/canonical; structured data validates; robots/sitemap consistent with intent |
| `seo-ai` | AI-crawler robots policy is intentional per bot (never accidental full block); `/llms.txt` exists only where claimed and is a valid link map (proposed standard — absence is not a defect) |
| `i18n` | no hardcoded strings in localized UI; every locale has the same key set; plural/RTL rules hold |
| `uxui` | every flow has empty/loading/error/success states; destructive actions confirm; design-system tokens used |
| `ux-writing` | microcopy follows `improve-writing` criteria: clear, bounded, one term per concept |
| `form` | native validation used before libraries; every field has accessible label + error association |
| `visual-regression` | current screenshots match the approved baseline or diffs are explained |
| `typesafe` | public surfaces typed; no `any`/unchecked casts on boundaries; type tests pass |
| `tests` | behavior of touched code is asserted; no flaky signal; suite runs green |
| `config` | no secret in tracked config; every nondefault override is intentional; env parity |
| `observability` | errors leave a trace/log with correlation id; no PII in log lines; alerts wired to signals |
| `supply-chain` | lockfile + registry provenance verified; published artifacts attest build origin; no unpinned third-party action |
| `ci-cd` | workflow `permissions:` least-privilege; failures block merge; caching does not stale-build |
| `iac-cloud-config` | no public exposure without intent; least-privilege IAM; resource tags/cost labels present |
| `license-compliance` | every dep license allowed by policy; attribution shipped where required |
| `privacy` | PII map: collected → stored → purged per retention; consent gates writes; no PII in logs/analytics |
| `data` | constraints exist at write boundaries; pipelines idempotent; integrity checks runnable |
| `database` | no N+1/unindexed hot query; schema changes reviewed; migrations ordered |
| `migration` | every schema/config migration has a tested rollback or documented forward-only reason; no destructive gap |
| `contract-compat` | public API changes are semver-correct; old consumers still work or are deprecated with notice |
| `api` | spec matches implementation; error shapes consistent; auth on every mutating route |
| `events` | message schema versioned; ordering/idempotency guarantees hold per consumer |
| `queues` | consumer lag bounded; poison messages dead-lettered; worker sizing documented |
| `realtime` | reconnect + heartbeat recover state; presence conflicts defined |
| `scheduled-jobs` | jobs idempotent; missed runs catch up or alert |
| `resilience` | external calls have timeout+bounded retry+backoff; degradation path exists |
| `concurrency` | shared mutable state has a proven synchronization story |
| `resource-leaks` | every acquired handle/listener/connection released on all paths incl. error paths |
| `error-handling` | errors caught where recoverable, surfaced where not; no swallowed error; error UI owned |
| `repo-hygiene` | no tracked secret/large-file history gaps; ignore rules match artifact reality |
| `mobile` | platform API use matches store rules; permissions requested in context |
| `desktop` | IPC surface minimal; packaging/signing verified on target OS |
| `cli-ux` | flags/`--help`/exit codes follow the documented convention; golden-output tests cover every command; startup measured |
| `llm-security` | prompt injection, tool-abuse, and identity/privilege paths from OWASP GenAI LLM Top 10 2026 + Agentic ASI01–ASI03 probed (red-team run), model output never reaches a privileged sink unchecked |
| `auth` | session/token lifecycle correct (expiry, rotation, revocation); every mutating route behind the right check; no IDOR path |
| `containers` | Dockerfile passes `hadolint`; layers cached and minimal; image CVE scan clean or triaged |
| `browser-extensions` | MV3 manifest permissions are the minimum the feature needs; content-script CSP holds; `web-ext lint` clean |
| `monorepo-graph` | task graph acyclic and correctly ordered (build→test→publish); one version per package across workspaces; no workspace depends on its own output paths |
| `datetime-timezone` | timestamps stored UTC, ISO 8601 at boundaries, rendered in user locale; DST and midnight-crossing cases asserted |
| `numeric-currency` | amounts in minor units or exact decimal, never float; rounding rule explicit and consistent end-to-end |
| `text-integrity` | no bidirectional Trojan-Source sequences accepted from input; unicode normalization form stated and applied at boundaries |
| `email-deliverability` | SPF/DKIM/DMARC records aligned with every sending path; bounce/complaint handled; templates render per locale |
| `billing-payments` | webhook signature verified before mutation; idempotency keys on every charge path; card data never touches own servers |
| `search-quality` | representative query suite returns expected results/states (empty/typo/facet); ranking changes gated by the suite |
| `uploads` | server enforces size + real MIME (not extension-only); storage path non-executable; virus scan or documented policy; resumable only if claimed |
| `offline` | core routes work from cache with connectivity off; queued writes replay with a stated conflict rule |
| `crypto-hygiene` | no weak algorithm (MD5/SHA1/ECB for data), no homegrown construction, CSPRNG for every secret/token/mask value |
| `http-headers-csp` | every user-facing route sends enforced CSP (no `unsafe-eval`) + HSTS + frame-ancestors matching intent |
| `cookies-storage` | cookie flags SameSite/Secure/expiry correct; no token or PII written to localStorage/sessionStorage |
| `tenant-isolation` | every query path tenant-scoped; the cross-tenant probe suite denies (A's credential never reads B) |
| `rate-limit-abuse` | mutating/auth endpoints bounded per route; retry-storm and bot paths handled |
| `media-optimization` | responsive formats (srcset) + lazy loading + alt text aligned; modern formats served |
| `third-party-embeds` | SRI where loadable; embed/analytics count minimal; no PII in third-party query params |
| `notifications` | dedupe keys prevent spam paths; token lifecycle handled; deep links valid; quiet-hours policy stated |
| `caching` | writes invalidate the right keys; TTL/stale-while-revalidate policy stated and matched by headers |
| `transactions-isolation` | isolation level stated per unit of work; lost-update and deadlock paths tested |
| `parser-robustness` | decompression/size bombs and malformed inputs bounded before allocation |
| `id-generation` | public ids unguessable/non-enumerable; distributed id generation clock-safe |
| `graceful-shutdown` | in-flight requests drain on SIGTERM; deregistration before close; probes do not flap during deploy |
| `dns-certificate` | records match deployment intent; cert has a valid chain and a renewal path before expiry; apex/www redirect defined |
| `serverless-runtime-constraints` | no Node-API leaks into edge runtime; CPU-time and env-size budgets respected on the target runtime |
| `usage-examples` | every documented command/example in README/USAGE executes successfully (global rules `## 3`) |
| `mcp-surface` | tool descriptions match actual behavior; least-privilege per tool; no PII or secret echoed in prompts/results |
| `routing-deeplinks` | deep link to every key view state opens that state directly; URL/params are the state source; no redirect loops; missing routes give real 404/410 |
| `theming-dark-mode` | colors come only from theme tokens; contrast passes WCAG in both modes; no hardcoded hex outside token definitions |
| `rendering-strategy` | per-route SSR/ISR/CSR choice matches intent; revalidation serves fresh content within the stated window; streaming delivers first paint early |
| `graphql-oas-surface` | depth/complexity limits enforced; introspection off in production; field-level authz holds; resolver N+1 bounded by measured dataloader/profile evidence; the documented OpenAPI/GraphQL surface matches the shipped schema (`oasdiff`/`graphql-inspector` diff empty or explained) |
| `webhook-lifecycle` | outgoing delivery retries with backoff, dead-letters after bound, replay path exists, every payload signed and verifiable |
| `state-machine-integrity` | every transition not in the declared diagram is rejected; concurrent transitions to the same state resolve deterministically; no orphan terminal state |
| `backfill-migration` | backfill runs in bounded batches with throttle, is resumable/idempotent, and the dual-write window states its consistency rule |
| `test-data-hygiene` | fixtures seeded/deterministic; no real user PII in any fixture or snapshot; shared factories instead of per-test copies |
| `model-supply-provenance` | model weights pinned to registry revision/hash from a trusted source; unsafe deserialization (pickle) avoided or sandboxed; C2PA credentials present only where generation is claimed |
| `llm-cost-latency` | token budget enforced per flow; caching on repeatable prompts; cheap-first routing; streaming on interactive paths — all measured, not asserted |
| `agent-memory-integrity` | stored memory scoped per user with TTL; a cross-session injection probe returns no poisoned content; memory writes bounded |
| `secret-lifecycle` | every deployed secret has a rotation schedule and expiry; per-service scoping; no long-lived personal tokens in CI or apps |
| `onboarding-dx` | fresh clone → running app without undocumented manual steps |
| `cold-start` | measured startup within budget for the target (worker invoke, CLI run, app open) |
| `cost` | spend drivers identified with baseline + delta; no unbounded scaling path |
| `ai-agent-assets` | instruction files/MCP descriptions accurate, non-conflicting, findable |
| `delivery` | release path green end-to-end; rollback command exists and is tested |
| `llm-eval` | golden eval set exists per LLM feature; score above the agreed threshold; prompt/model changes re-scored before merge |
| `feature-flags` | every flag has an owner + expiry or kill-list review; no code behind a flag shipped fully for > 1 release without promotion/removal plan |
| `sustainability-energy` | energy/carbon drivers of the main workload identified directionally (measurement, not certification) — standard still emerging, no hard pins |
| `dast-runtime` | ZAP baseline run on the live instance reports no unresolved alerts (or each alert is triaged with reason) |
| `fuzzing` | fuzz targets exist for every untrusted parser/decoder and run in CI or a nightly job; findings triaged |
| `backup-restore` | RPO/RTO stated; a restore drill to a scratch environment executed successfully (a backup that cannot restore is none) |
| `capacity-scaling` | autoscale policy + load target (p75) stated and measured; no code path triggers unbounded scaling |
| `audit-trail` | sensitive operations (access, mutation, admin) leave a tamper-evident, retained log per the applicable regulation |
| `dsar-rights` | export and delete endpoints executed end-to-end; deletion proven to propagate to backups and subprocessors (or a documented hold rule) |
| `data-residency` | every storage/processing resource pinned to the required region; subprocessor list current and reviewed |
| `regulatory-ai-compliance` | each AI feature has a stated risk tier, the required transparency notice, and a human-oversight hook where the tier demands one |
| `post-quantum-readiness` | hybrid KEX (ML-KEM) offered on TLS where the stack allows; an inventory names the long-lived secrets/data exposed to harvest-now-decrypt-later |
| `runbook-oncall` | every alert rule links a runbook and an owner; paging thresholds justified by past-noise evidence |
| `chaos-drills` | a recorded failure-injection run proves behavior under timeout/5xx/partition of each critical dependency — evidence of the drill, not just retry code |
| `input-limits` | every user-reachable list/query/payload boundary has a stated max and enforces it server-side; no unbounded scan path |
| `log-hygiene` | no PII or secret in any log line; levels used as documented; every request log carries a correlation id |
| `ssr-data-leakage` | the HTML payload carries no secret, token, or privileged server state; only what the view needs is serialized |
| `debug-surface` | no debug route, source map, verbose error body, or admin surface reachable in production |
| `client-state-migration` | persisted client state is versioned and migrated (or safely invalidated) across a deploy; an old shape never crashes the app |
| `data-schema-evolution` | schema changes are additive-first (expand → migrate → contract); no single step both adds and drops a used column |
| `mock-fidelity` | every mock/stub matches the real contract or is generated from it; a contract break fails the suite instead of passing silently |
| `test-performance` | suite runtime within the stated CI budget; slow suites parallelized or sharded, not tolerated |
| `flaky-tests` | repeated runs are stable at the stated threshold; no shipped path covered only by flaky tests |
| `asset-licensing` | every redistributed font/image/icon/stock asset has an allowed license recorded; attribution shipped where required |
| `api-deprecation-policy` | removals ship only after the stated deprecation window with a `Sunset` header and a migration note |
| `abuse-prevention` | signup/spam/abuse paths have signals, limits, and a block path; a burst does not silently create accounts or cost |
| `rag-retrieval-quality` | the golden query set meets the agreed recall@k and citation accuracy; chunking/embedding changes are re-measured |
| `native-permissions` | every mobile/desktop permission in the manifest is used by a shipped feature and prompted in context |
| `auto-update-safety` | update artifacts are signed and verified before apply; a bad release has a rollback path |
| `email-template-safety` | user data in templates is escaped; no header injection; a plaintext alternative exists |
| `versioning-changelog` | published version, tag, and changelog agree with the actual change set; breaking changes are not shipped as patches |
| `telemetry-consent` | no analytics/telemetry collection before consent; a withdrawal path stops collection |
| `content-freshness` | dated docs/claims are within the staleness policy or were re-verified |
| `slo-error-budget` | each claimed SLO has a measurement source and a stated error-budget policy |
| `multi-region-failover` | failover between regions is drilled with recorded evidence, not just configured |

### Check Notes

- Severity, evidence type, N/A condition, gate, and enforcement are the matrix row's columns — never restated here. `upgrade/downgrade` triggers are the only legal way to move off the matrix `Default severity`; cite the trigger in the report's `Risk` column.
- When a `capture` row's tool is missing on the machine, resolve via `/download-program`; if unavailable on the platform (e.g. Lightpanda on Windows — see `use-lightpanda`), mark the dimension `failed (tool-unavailable)` in the ledger, not `skipped`.
- The proof statement must stay checkable by a reviewer with no codebase context: if it cannot be answered by reading the named files or the captured output, it is too vague to dispatch.

## Domain Map

Fix routing table for `deep-review` `### 7. Fix` — every finding is fixed by the route matching its domain. The review side is always `/deep-review <dimension>` (step 3 fan-out); metric domains route to `/optimize <scope>`, convention/behavior domains to the `### Fix boilerplate` below.

**Lookup order (never fuzzy name matching):** (1) the row in this file matching the finding's domain; (2) a `### Dimension-name aliases` entry; (3) the matrix row's `Fix owner` in `references/review.md` — that column exists on every row, so a finding cannot be orphaned; (4) `/ask-me` only when a finding matches none of the above (and then report it as a matrix gap).

| Domain | Fix route |
|--------|-----------|
| seo | `## Fix` — meta, structured data, sitemap, CWV |
| security | `## Fix` — secrets rotation, headers, vuln deps (`/run-audit`) |
| auth | `## Fix` — sessions, tokens, OAuth, MFA; authz/RBAC UI → the `authz` and `frontend` dimension slices |
| api | `## Fix` — contract drift, versioning, errors |
| backend | `## Fix` — services, handlers, data flow |
| frontend | `## Fix` — components, state, rendering, hydration; scoped slices: forms, i18n, a11y |
| data-validation | `## Fix` — schemas, boundary validation |
| database | `## Fix` — migrations, schema + query perf → `/optimize queries` |
| dependencies | `## Fix` — updates (`/update-version-to-latest`, `/run-audit`) |
| bundle+assets+build speed | `/optimize bundle` |
| performance | `/optimize perf` (network → `/optimize network`; startup → `/optimize startup`) |
| memory | `/optimize memory` |
| cost | `/optimize cost` |
| ci/pipeline | `/optimize ci` |
| docker | `/optimize docker` (guided workflow → `follow-create-docker/workflows/optimize-image`) |
| tests | `## Fix` (flaky → `/check-flaky-tests`) + `/update-tests` for writing new tests |
| uxui | `## Fix` — design system/interaction/motion/UX copy + `/watch-browser fix` (browser pass) |
| observability / iac / platform | `## Fix` — metrics, tracing, alerting, infra code |
| accessibility | `## Fix` — WCAG, keyboard, contrast |
| i18n | `## Fix` — catalogs, RTL, formats |
| events | `## Fix` — schemas, ordering, idempotency, DLQ (queue ops same route, per scope-map boundaries) |
| compliance | `## Fix` — consent, retention, PII handling |
| business | `## Fix` — domain logic vs requirements |
| release | `## Fix` — versioning, changelog, publish |
| delivery | `## Fix` — CI/CD, release pipeline |
| stability | `## Fix` — crash/recovery (error paths/UI → error-handling slice; messaging → events slice) |
| error-handling | `## Fix` (sole owner: error paths, retries, recovery, error states, error UI, error boundaries) |
| architecture | `/follow-architecture` (choose + apply pattern; move files/split layers → `/refactor`) |
| migration | `## Fix` — backward compat, data integrity, rollback, cutover |
| quality/types | `## Fix` — complexity, imports |
| usage | `improve-usage-md` → `/update-usage-md` + verify via `/deep-test usage` |

### Dimension-name aliases

The `references/review.md` (`## Dimension Matrix`) row name → the Domain row above it (the matrix names dimensions, this table names domains). A dimension not listed here — including everything the old catch-all `others (...)` row used to hold — routes by its matrix `Fix owner`, which exists on every row. The `review-<label>` names used by the `improve`/`optimize` scope-maps are not here either — each resolves through the matrix `Aliases` column (see `### Label resolution`).

| Matrix dimension | Domain row |
|------------------|------------|
| `a11y`, `theming-dark-mode` | accessibility |
| `ci-cd` | ci/pipeline |
| `containers` | docker |
| `bundle-size` | bundle+assets+build speed |
| `usage-examples` | usage |
| `code-quality`, `repo-hygiene` | quality/types |
| `observability`, `iac-cloud-config`, `serverless-runtime-constraints` | observability / iac / platform |

### Label resolution

The `improve`/`optimize` scope-maps name review targets as `review-<label>` — each name is answered by **every** row in `references/review.md` (`## Dimension Matrix`) whose `Aliases` cell lists it **or whose row name equals it** (a label may map to several dimensions — e.g. `frontend` → `routing-deeplinks`, `rendering-strategy`, `uxui`, `form`), plus the `always` tier; read that set from the table and hand it to `/deep-review`, never re-resolve by hand. `review-issues` and `review-gaps` are exempt: they hold their own work. A label found on no row is a matrix gap — dispatch the `always` tier plus the closest artifact-match rows and report the gap, never invent a dimension; `scripts/verify-matrix.ts` proves every scope-map label resolves.

### Fix boilerplate

> The canonical fix steps — applied to the findings of one run

1. Rank findings by severity — critical first, then fix one at a time with verification immediately after each fix
2. Pick the fix route matching each finding from the lookup order above
3. Every fix preserves existing behavior, passes `/run-check` and `/run-test` if present, then summarizes with `/report-before-after`

Boundaries kept from the scope-maps: events=semantics / queues=ops / realtime=transport; stability=crash-recovery, resilience=patterns, error-handling=paths+UI (error UI owned by `error-handling`); data=integrity chain, data-validation=validation layer.
