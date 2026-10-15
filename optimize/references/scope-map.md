# Scope Map — signal → `/optimize <scope>` → review domain

Table-only SSOT (`/follow-single-of-source`) — canonical mapping ที่ `/optimize` และ callers ใช้ route scope. ห้าม copy ตารางนี้ไป placeอื่น — reference กลับมาที่ไฟล์นี้.
ทุก scope รันผ่าน `/optimize <scope>` (thin entry) — review → `/deep-review` domain ในตาราง | fix → `/deep-review-then-fix`

| Signal (วัดได้) | Scope (`/optimize <scope>`) | `/deep-review` domain(s) |
|-----------------|-----------------------------|--------------------------|
| bundle output ใหญ่, chunks ไม่ balance, build/time ช้า, toolchain cache พัง | `bundle` | `review-bundle` (measurement layer → `/follow-tool-vite-devtools` Rolldown DevTools) |
| CI pipeline นาน, ไม่มี cache/parallelism | `ci` | `review-delivery` |
| cloud/infra spend สูง | `cost` | `review-cost` |
| LLM token/spend สูง, no caching, oversized context | `llm` | `review-ai` + `review-cost` |
| Docker image ใหญ่, layers ไม่ cache | `docker` | `review-iac` (guided workflow → `follow-create-docker/workflows/optimize-image`) |
| memory usage สูง, leaks, OOM | `memory` | `review-performance` (memory scope) |
| network payload ใหญ่, waterfalls | `network` | `review-performance` (network scope) |
| runtime perf ช้าทั่วไป, bottleneck ไม่ชัด | `perf` | `review-performance` |
| N+1, missing indexes, slow queries | `queries` | `review-database` |
| cold start/boot ช้า | `startup` | `review-performance` (startup scope) |
| API latency p50/p95/p99 สูง | `api-latency` | `review-performance` + `review-api` + `review-backend` |
| cache hit rate ต่ำ, TTL/invalidation พัง | `cache` | `review-performance` + `review-backend` |
| contention, locks, worker pools | `concurrency` | `review-performance` + `review-backend` |
| image assets ใหญ่, ไม่ lazy/responsive | `images` | `review-bundle` + `review-frontend` |
| app size, battery, memory on device | `mobile` | `review-mobile` + `review-performance` + `review-bundle` |
| DB size bloat, missing vacuum, archival | `storage` | `review-database` + `review-backend` |
| test suite นาน, flaky, ไม่ parallel | `test-suite` | `review-test` + `review-dx` (flaky detection/quarantine → `/check-flaky-tests`) |
| LCP/CLS/INP พ้น budget | `web-vitals` | `review-performance` + `review-frontend` |
