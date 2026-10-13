# Scope Map — signal → optimize-* skill → review domain

Table-only SSOT (`/follow-single-of-source`) — canonical mapping ที่ `/follow-optimize` และ `/optimize` ใช้ route scope. ห้าม copy ตารางนี้ไป placeอื่น — reference กลับมาที่ไฟล์นี้.

| Signal (วัดได้) | Skill | `/deep-review` domain(s) |
|-----------------|-------|--------------------------|
| bundle output ใหญ่, chunks ไม่ balance, build/time ช้า, toolchain cache พัง | `/optimize-bundle` | `review-bundle` |
| CI pipeline นาน, ไม่มี cache/parallelism | `/optimize-ci` | `review-delivery` |
| cloud/infra spend สูง | `/optimize-cost` | `review-cost` |
| LLM token/spend สูง, no caching, oversized context | `/optimize-llm` | `review-ai` + `review-cost` |
| Docker image ใหญ่, layers ไม่ cache | `/optimize-docker` | `review-iac` |
| memory usage สูง, leaks, OOM | `/optimize-memory` | `review-performance` (memory scope) |
| network payload ใหญ่, waterfalls | `/optimize-network` | `review-performance` (network scope) |
| runtime perf ช้าทั่วไป, bottleneck ไม่ชัด | `/optimize-perf` | `review-performance` |
| N+1, missing indexes, slow queries | `/optimize-queries` | `review-database` |
| cold start/boot ช้า | `/optimize-startup` | `review-performance` (startup scope) |
| API latency p50/p95/p99 สูง | `/optimize-api-latency` | `review-performance` + `review-api` + `review-backend` |
| cache hit rate ต่ำ, TTL/invalidation พัง | `/optimize-cache` | `review-performance` + `review-backend` |
| contention, locks, worker pools | `/optimize-concurrency` | `review-performance` + `review-backend` |
| image assets ใหญ่, ไม่ lazy/responsive | `/optimize-images` | `review-bundle` + `review-frontend` |
| app size, battery, memory on device | `/optimize-mobile` | `review-mobile` + `review-performance` + `review-bundle` |
| DB size bloat, missing vacuum, archival | `/optimize-storage` | `review-database` + `review-backend` |
| test suite นาน, flaky, ไม่ parallel | `/optimize-test-suite` | `review-test` + `review-dx` (flaky detection/quarantine → `/check-flaky-tests`) |
| LCP/CLS/INP พ้น budget | `/optimize-web-vitals` | `review-performance` + `review-frontend` |
