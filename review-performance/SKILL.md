---
name: review-performance
description: Review application performance ครอบคลุม network, build, runtime, memory, I/O, database, caching
related:
  - review-frontend
  - review-quality
  - run-profiler
  - run-bench
  - deep-analyze
  - run-review
  - deep-validate
  - validate
  - report-table
  - suggest-next-action
  - use-ast-grep
  - follow-my-tech-stack
---

## Goal

Review application performance ครอบคลุม network, build/runtime, memory, I/O, database, caching และ algorithmic complexity พร้อม severity ratings และ review score

## Scope

ใช้สำหรับ review performance บน critical paths ครอบคลุม:

- `network`: DNS, connection, latency, payload, cache headers, HTTP/2, CDN
- `bundler`: chunk splitting, tree shaking, minification, source maps, assets
- `runtime`: CPU hot paths, event loop, main thread, async, concurrency
- `memory`: heap, GC, leaks, large data, streaming
- `io`: file, database, network I/O, serialization, batching
- `caching`: invalidation, TTL, key design, stampede
- `database`: N+1 queries, indexes, query optimization
- `complexity`: Big O, data structures

ไม่รวม security หรือ stability (ใช้ `/review-security` และ `/review-stability`)

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ project structure, tech stack และ performance setup

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, tech stack, build tools
2. ระบุ performance tools ที่มี: `lighthouse`, `react-scan`, `unlighthouse`, `bun profile`, `Chrome DevTools`
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติ
4. ทำ `/run-review` เพื่อดึง review metrics ล่าสุด

### 2. Network And API Performance

> Goal: API calls และ network layer มีประสิทธิภาพ

Review HTTP client, CDN, DNS, connection pooling, latency, payload, compression, and cache headers. See [references/network-and-api.md](references/network-and-api.md).

### 3. Bundler And Build Performance

> Goal: bundle และ build output มีขนาดเล็ก โหลดเร็ว

Review build tool config, chunk splitting, tree shaking, minification, source maps, and asset optimization. See [references/bundler-and-build.md](references/bundler-and-build.md).

### 4. Runtime And CPU Performance

> Goal: runtime execution ไม่มี hot paths หรือ bottlenecks

Review hot paths, event loop blocking, main thread work, and run profilers for critical flows. See [references/runtime-and-cpu.md](references/runtime-and-cpu.md).

### 5. Memory Performance

> Goal: memory usage อยู่ในเกณฑ์ ไม่มี leaks

Review heap snapshots, GC pressure, unbounded collections, cleanup, and streaming for large data. See [references/memory.md](references/memory.md).

### 6. I/O And Database Performance

> Goal: I/O operations มีประสิทธิภาพ

Review file/database/network I/O, batching, connection pooling, N+1 queries, indexes, and hot-path queries. See [references/io-and-database.md](references/io-and-database.md).

### 7. Caching And Complexity

> Goal: caching และ algorithms มีประสิทธิภาพ

Review cache invalidation, TTL, key design, stampede, and time/space complexity on critical paths. See [references/caching.md](references/caching.md).

### 8. Concurrency Review

> Goal: ตรวจสอบ concurrent programming ใน application code

Review async/await, parallel execution, resource management, synchronization, and race conditions. See [references/concurrency.md](references/concurrency.md).

### 9. Validate, Score And Report

> Goal: findings ถูกต้อง พร้อม review score

1. ทำ `/deep-validate` เพื่อ validate findings ทุกรายการ
2. ทำ `/validate` สำหรับ issues จาก scripts
3. จัดลำดับ severity: Critical → High → Medium → Low → Info
4. คำนวณ review score ตาม [references/scoring.md](references/scoring.md)
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Scope Boundary

- เน้น performance บน critical paths
- ไม่ซ้ำกับ `/review-security` หรือ `/review-stability`
- ถ้าพบ security/stability issues → ระบุเป็น info เท่านั้น
- รายละเอียด rendering performance อยู่ใน `/review-frontend`

### 2. Skip Conditions

- ถ้าไม่มี build step → ข้าม Bundler and Build Review
- ถ้าไม่มี caching → ข้าม Caching and Complexity Review
- ถ้าไม่มี network layer → ข้าม Network and API Review
- ถ้าไม่มี database → ข้าม I/O And Database Review
- ถ้าไม่มี frontend → ข้าม runtime ที่เกี่ยวกับ render

### 3. Severity Classification

- Critical: blocking bottleneck, bundle size ที่ส่งผลกระทบรุนแรง, broken build config, Core Web Vitals ไม่ผ่าน, cache poisoning, cache stampede, complexity เกิน budget 10x บน hot path
- High: N+1 query, missing cache บน hot path, missing code splitting, large vendor chunk, missing tree shaking, missing TTL, complexity เกิน budget บน hot path
- Medium: suboptimal query, missing lazy load, suboptimal chunk, complexity เกิน budget บน cold path
- Low: minor optimization, minor cache improvement, complexity ใกล้ budget

### 4. Evidence-Based Findings

- ทุก finding ต้องมี file path, line number
- ระบุ function, query, config ที่เกี่ยวข้อง
- ใช้ profiling data หรือ measurements ประกอบ
- ไม่ optimize ก่อนมี evidence

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`
- ใช้ symbols: ผ่าน, ไม่ผ่าน, warning

### 6. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder

## Expected Outcome

- รายงาน performance findings ครอบคลุมทุก dimension
- Review score ต่อ dimension และ overall
- Severity และ recommendations ชัดเจน
- ไม่ซ้ำซ้อนกับ review skills อื่น
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
