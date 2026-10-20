# Scope Map — signal → `/optimize <scope>` → review domain

Table-only SSOT (`/follow-single-of-source`) — the canonical mapping that `/optimize` and callers use to route the scope. Do not copy this table elsewhere — reference back to this file.
Every scope runs through `/optimize <scope>` (thin entry) — review → `/deep-review` dimension in the table | fix → `/deep-review <scope> then-fix`
**Label resolution (mandatory)** — every `review-*` name in the table is a real thin skill (`review-<label>`) that delegates to `/deep-review`; invoke `/review-<label>` for one dimension. The skill resolves its label by stripping `review-` and taking the row(s) in `deep-review/references/dimension-matrix.md` whose `Aliases` column lists it (or whose row name equals it), plus the `always` tier. A label with no row and no skill is a matrix gap → dispatch the `always` tier + closest artifact-match rows and report the gap.

| Signal (measurable) | Scope (`/optimize <scope>`) | `/deep-review` domain(s) |
|-----------------|-----------------------------|--------------------------|
| large bundle output, unbalanced chunks, slow build/time, broken toolchain cache | `bundle` | `review-bundle` (measurement layer → `/follow-tool-vite-devtools` Rolldown DevTools) |
| long CI pipeline, no cache/parallelism | `ci` | `review-delivery` |
| high cloud/infra spend | `cost` | `review-cost` |
| high LLM token/spend, no caching, oversized context | `llm` | `review-ai` + `review-cost` |
| large Docker image, layers not cached | `docker` | `review-iac` (guided workflow → `follow-create-docker/workflows/optimize-image`) |
| high memory usage, leaks, OOM | `memory` | `review-performance` (memory scope) |
| large network payload, waterfalls | `network` | `review-performance` (network scope) |
| generally slow runtime perf, unclear bottleneck | `perf` | `review-performance` |
| N+1, missing indexes, slow queries | `queries` | `review-database` |
| slow cold start/boot | `startup` | `review-performance` (startup scope) |
| high API latency p50/p95/p99 | `api-latency` | `review-performance` + `review-api` + `review-backend` |
| low cache hit rate, broken TTL/invalidation | `cache` | `review-performance` + `review-backend` |
| contention, locks, worker pools | `concurrency` | `review-performance` + `review-backend` |
| large image assets, not lazy/responsive | `images` | `review-bundle` + `review-frontend` |
| app size, battery, memory on device | `mobile` | `review-mobile` + `review-performance` + `review-bundle` |
| DB size bloat, missing vacuum, archival | `storage` | `review-database` + `review-backend` |
| long test suite, flaky, not parallel | `test-suite` | `review-test` + `review-dx` (flaky detection/quarantine → `/check-flaky-tests`) |
| LCP/CLS/INP over budget | `web-vitals` | `review-performance` + `review-frontend` |
