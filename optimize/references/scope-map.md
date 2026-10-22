# Scope Map — signal → `/optimize <scope>` → review domain

Table-only SSOT (`/follow-single-of-source`) — the canonical mapping that `/optimize` and callers use to route the scope. Do not copy this table elsewhere — reference back to this file.
Every scope runs through `/optimize <scope>` (thin entry) — review → `/deep-review` dimension in the table | fix → `/deep-review <scope> then-fix`
**Label resolution (mandatory)** — every name in the `/deep-review` domain column is either a plain dimension label, or a standalone skill name kept verbatim (`review-test`). A dimension label takes the row(s) in `deep-review-codebase-everything/references/review.md` `## Dimension Matrix` whose `Aliases` column lists it (or whose row name equals it), plus the `always` tier — read that set from the table, never re-resolve by hand (resolution rules: `deep-review-codebase-everything/references/review.md` `### Label resolution`). A label with no row is a matrix gap → dispatch the `always` tier + closest artifact-match rows and report the gap.

| Signal (measurable) | Scope (`/optimize <scope>`) | `/deep-review` domain(s) |
|-----------------|-----------------------------|--------------------------|
| large bundle output, unbalanced chunks, slow build/time, broken toolchain cache | `bundle` | `bundle` (measurement layer → `/follow-tool-vite-devtools` Rolldown DevTools) |
| long CI pipeline, no cache/parallelism | `ci` | `delivery` |
| high cloud/infra spend | `cost` | `cost` |
| high LLM token/spend, no caching, oversized context | `llm` | `ai` + `cost` |
| large Docker image, layers not cached | `docker` | `iac` (guided workflow → `follow-create-docker/workflows/optimize-image`) |
| high memory usage, leaks, OOM | `memory` | `performance` (memory scope) |
| large network payload, waterfalls | `network` | `performance` (network scope) |
| generally slow runtime perf, unclear bottleneck | `perf` | `performance` |
| N+1, missing indexes, slow queries | `queries` | `database` |
| slow cold start/boot | `startup` | `performance` (startup scope) |
| high API latency p50/p95/p99 | `api-latency` | `performance` + `api` + `backend` |
| low cache hit rate, broken TTL/invalidation | `cache` | `performance` + `backend` |
| contention, locks, worker pools | `concurrency` | `performance` + `backend` |
| large image assets, not lazy/responsive | `images` | `bundle` + `frontend` |
| app size, battery, memory on device | `mobile` | `mobile` + `performance` + `bundle` |
| DB size bloat, missing vacuum, archival | `storage` | `database` + `backend` |
| long test suite, flaky, not parallel | `test-suite` | `review-test` + `dx` (flaky detection/quarantine → `/check-flaky-tests`) |
| LCP/CLS/INP over budget | `web-vitals` | `performance` + `frontend` |
