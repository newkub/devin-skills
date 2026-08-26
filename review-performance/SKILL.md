---
name: review-performance
description: Review application performance ครอบคลุม network, build, runtime, memory, I/O, database, caching
related:
  - review-frontend
  - review-quality
  - run-profiler
  - run-bench
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

1. ตรวจสอบ HTTP client, API endpoints, CDN, proxy, load balancer
2. ตรวจสอบ DNS records, TTL, prefetch/preconnect สำหรับ third-party origins
3. ตรวจสอบ connection pooling, keep-alive, HTTP/2, HTTP/3, compression
4. ตรวจสอบ latency, payload size, cache headers, retry strategy
5. ถ้าไม่มี network layer → ข้าม step นี้

### 3. Bundler And Build Performance

> Goal: bundle และ build output มีขนาดเล็ก โหลดเร็ว

1. ระบุ build tool จาก `package.json` และ config: `bunup.config.ts`, `tsdown.config.ts`, `vite.config.ts`
2. ตรวจสอบ chunk splitting: vendor chunks, route-level chunks, dynamic imports
3. ตรวจสอบ tree shaking: `sideEffects` in `package.json`, unused exports, dead code
4. ตรวจสอบ minification, source maps, `external` dependencies
5. ตรวจสอบ asset optimization: image, font, SVG, gzip size
6. ถ้าไม่มี build step → ข้าม step นี้

### 4. Runtime And CPU Performance

> Goal: runtime execution ไม่มี hot paths หรือ bottlenecks

1. ตรวจสอบ hot paths ด้วย profiling: `run-profiler`, `bun profile`, Chrome DevTools
2. ตรวจสอบ event loop blocking, synchronous operations ที่ยาว
3. ตรวจสอบ main thread work, expensive computations, render bottlenecks
4. ทำ `/run-profiler` สำหรับ critical user flows
5. ถ้าเป็น frontend ให้ทำ `/review-frontend` สำหรับ rendering performance

### 5. Memory Performance

> Goal: memory usage อยู่ในเกณฑ์ ไม่มี leaks

1. ตรวจสอบ heap snapshots, GC pressure, large allocations
2. ตรวจสอบ unbounded collections, caches ที่โตไม่จำกัด, event listeners ที่ไม่ถูก cleanup
3. ตรวจสอบ streaming และ pagination สำหรับ large data
4. ทำ `/deep-analyze` เพื่อหา memory hotspots

### 6. I/O And Database Performance

> Goal: I/O operations มีประสิทธิภาพ

1. ตรวจสอบ file I/O, database I/O, network I/O, serialization
2. ตรวจสอบ batching, async I/O, connection pooling
3. ตรวจสอบ N+1 queries, missing indexes, slow queries
4. ตรวจสอบ ORM queries, query builders, raw SQL บน hot paths
5. ถ้าไม่มี database → ข้าม step นี้

### 7. Caching And Complexity

> Goal: caching และ algorithms มีประสิทธิภาพ

1. ตรวจสอบ cache invalidation, TTL, key design, storage
2. ตรวจสอบ cache stampede, thundering herd, warming
3. ทำ `/review-quality` อ้างอิง `references/time-complexity.md` เพื่อวิเคราะห์ Big O บน critical paths
4. ตรวจสอบ data structure selection กับ input size

### 8. Validate, Score And Report

> Goal: findings ถูกต้อง พร้อม review score

1. ทำ `/deep-validate` เพื่อ validate findings ทุกรายการ
2. ทำ `/validate` สำหรับ issues จาก scripts
3. จัดลำดับ severity: Critical → High → Medium → Low → Info
4. คำนวณ review score ตาม `references/scoring.md`
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
