---
name: review-performance
description: Review performance: network, bundler, memory, and I/O patterns
allowed-tools:
  - ask_user_question
  - edit
  - exec
  - glob
  - grep
  - read
triggers:
  - user
  - model
related:
  - review-codebase
  - review-correctness
  - review-docs
  - review-frontend
  - review-infrastructure
  - review-quality
  - review-reliability
  - review-security
  - suggest-next-action
  - validate
---

## Goal

ตรวจสอบ performance ครอบคลุม network, bundler, memory, I/O, caching และ runtime bottlenecks พร้อมคะแนน review

## Scope

- ครอบคลุม network: DNS, connection, bandwidth, latency, payload, cache headers
- ครอบคลุม bundler/build tool: chunk splitting, tree shaking, minification, source maps
- ครอบคลุม memory: heap, GC, leaks, large data, streaming, caches
- ครอบคลุม I/O: file, database, network I/O, serialization, queues
- ครอบคลุม caching: invalidation, key design, TTL, storage, stale-while-revalidate
- ครอบคลุม time complexity และ runtime profiling บน critical paths
- ไม่ครอบคลุม `review-security`, `review-reliability`, `review-quality`

## Execute

### 1. Prepare and Scan

> Goal: เข้าใจ performance patterns และ profiling setup

1. ทำ `/scan-codebase` เพื่อเข้าใจ performance patterns, build tool และ dependencies
2. ระบุ runtime: Node.js, Bun, browser, Rust หรืออื่น
3. ระบุ performance tools: profiling, heap snapshots, monitoring, `lighthouse` ถ้ามี
4. ถ้าไม่พบ performance concerns → stop และ report

### 2. Network and API Review

> Goal: ระบุ network bottlenecks

1. ตรวจสอบ HTTP client, API endpoints, CDN, proxy, load balancer
2. ตรวจสอบ DNS records, TTL, prefetch/preconnect สำหรับ third-party origins
3. ตรวจสอบ connection pooling, keep-alive, HTTP/2, HTTP/3, compression
4. ตรวจสอบ latency, payload size, cache headers, retry strategy
5. ถ้าไม่มี network layer → stop และ report

### 3. Bundler and Build Review

> Goal: ระบุ build/bundler issues

1. ตรวจสอบ build tool จาก `package.json` และ config: `bunup.config.ts`, `tsdown.config.ts`, `vite.config.ts`, `tauri.conf.json`
2. ตรวจสอบ chunk splitting: vendor chunks, route-level chunks, dynamic imports
3. ตรวจสอบ tree shaking: side effects in `package.json`, unused exports, dead code
4. ตรวจสอบ minification, source maps, `external` dependencies
5. ตรวจสอบ asset optimization: image, font, SVG, gzip size
6. ถ้าไม่มี build step → ข้าม step นี้

### 4. Memory Usage Review

> Goal: ระบุ memory issues

1. ตรวจสอบ memory profiling scripts, heap snapshots, monitoring
2. ตรวจสอบ large data processing, streaming, caches, queues
3. ตรวจสอบ memory leaks, GC pressure, unbounded collections
4. ทำ `/deep-analyze` เพื่อหา root cause ของ memory hotspots

### 5. I/O and Storage Review

> Goal: ระบุ I/O bottlenecks

1. อ่าน `package.json`, `Cargo.toml` หรือ manifest ที่เกี่ยวข้อง
2. ตรวจสอบ file I/O, database I/O, network I/O, cache, queues
3. ตรวจสอบ serialization, batching, async I/O patterns
4. ถ้าไม่พบ I/O patterns ที่มีความเสี่ยง → ข้าม step นี้

### 6. Caching and Complexity Review

> Goal: ระบุ caching และ algorithmic issues

1. ตรวจสอบ cache invalidation, key design, TTL, storage, stale-while-revalidate
2. ตรวจสอบ cache stampede, thundering herd, warming
3. ทำ `/check-time-complexity` เพื่อวิเคราะห์ time complexity บน critical paths
4. ตรวจสอบ N+1 queries, missing indexes, anti-patterns ที่ทำให้ช้า

### 7. Validate and Report

> Goal: สรุป findings พร้อมคะแนนและส่งต่อ action ถัดไป

1. ทำ `/validate` สำหรับ findings ทุกรายการ
2. จัดลำดับ severity: Critical → High → Medium → Low → Info
3. คำนวณ review score เป็น percentage ต่อ dimension และ overall
4. ทำ `/report` พร้อม `/report-table` และ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้าไม่มี build step → ข้าม Bundler and Build Review
- ถ้าไม่มี caching → ข้าม Caching and Complexity Review
- ถ้าไม่มี network layer → ข้าม Network and API Review
- ถ้าไม่พบ I/O patterns ที่มีความเสี่ยง → ข้าม I/O and Storage Review

### 2. Severity

- Critical: blocking bottleneck, bundle size ที่ส่งผลกระทบรุนแรง, broken build config, Core Web Vitals ไม่ผ่าน, cache poisoning, no invalidation, cache stampede, complexity เกิน budget 10× บน user-facing hot path
- High: N+1 query, missing cache บน hot path, missing code splitting, large vendor chunk, missing tree shaking, missing TTL, inconsistent cache key, complexity เกิน budget บน hot path
- Medium: suboptimal query, missing lazy load, suboptimal chunk, inconsistent cache key, complexity เกิน budget บน cold path
- Low: minor optimization, minor cache improvement, complexity ใกล้ budget

### 3. Complexity Tiers

| Input Size | Acceptable Complexity | Use Case |
|------------|----------------------|----------|
| ≤ 10² | O(n²), O(n³) | UI lists, config parsing |
| ≤ 10⁴ | O(n log n) | API queries, sorting |
| ≤ 10⁶ | O(n), O(n log n) | Batch processing, data transform |
| ≤ 10⁸ | O(log n), O(1) | Lookup, search, real-time |
| > 10⁸ | O(1), O(log n) | Stream processing, indexing |

### 4. Evidence

- ทุก finding ต้องมี file path, line number
- ทุก time complexity finding ต้องมี complexity classification และ input size estimate
- ไม่เดา complexity — วิเคราะห์จาก code structure
- ใช้ metrics ก่อน/หลัง ยืนยันผลเมื่อได้

### 5. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่ optimize ก่อนมี evidence — premature optimization เป็น anti-pattern
- ถ้า complexity เท่ากัน → เลือก algorithm ที่อ่านง่ายกว่า

### 6. Formatting

- ห้ามใช้ double-asterisk markers สำหรับเน้นข้อความ — ใช้ backticks สำหรับ `tools`, `commands`, paths และ skill references
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน performance findings พร้อม evidence, severity, metrics
- คะแนน review ต่อ dimension: network, bundler, memory, I/O, caching, complexity
- คะแนน overall performance score
- ตารางสรุป findings ด้วย `/report-table`
- ข้อเสนอแนะ action ถัดไป

*Merged from source review-* skills.*