---
name: review-performance
description: Review performance across network, bundler, memory, and I/O
allowed-tools:
  - ask_user_question
  - edit
  - exec
  - glob
  - grep
  - read
triggers:
  - model
  - user
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

Review performance ครอบคลุมทุก dimension ของ performance พร้อม aggregate findings และ review score Review network ครอบคลุม DNS, connection, bandwidth, latency, caching, payload พร้อม review score Review build/bundler configuration ครอบคลุม chunk splitting, tree shaking, minification, sourcemap, p...

## Scope

performance review สำหรับ: bundler config, caching strategy, time complexity, Core Web Vitals, rendering performance, resource usage network review สำหรับ: HTTP requests, API calls, CDN, DNS resolution, connection pooling, compression, cache headers, response time, payload size Bundler review สำหรับ build tool (`bunup`, `tsdown`, `vite`, `tauri`), build config file (`bunup.config.ts`, `tsdown.c...

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ performance patterns และ profiling setup ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ performance patterns
2. ระบุ performance tools และ profiling setup ที่มี

### 2. Deep Analyze Core

วิเคราะห์ performance core อย่างลึกซึ้ง

> Goal: ครอบคลุมทุก performance dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. รัน `bun --filter tools-review review:json` เพื่อดึง review report พร้อม metrics
4. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
5. ทำ `/check-time-complexity` วิเคราะห์ time complexity ของ critical paths
6. Analyzer ตรวจสอบ N+1 queries, missing indexes, caching gaps
7. Analyzer ตรวจสอบ bundle size, chunk splitting, tree shaking, และ asset optimization
8. Analyzer ตรวจสอบ rendering performance, unnecessary re-renders, และ lazy loading
9. Analyzer ตรวจสอบ Core Web Vitals: LCP, INP, CLS, FCP, TBT, Speed Index
10. Review CLI คำนวณ performance review score จาก review report

### 3. Runtime Network And IO Review

Review runtime, network, และ I/O โดยใช้ references เฉพาะทาง

> Goal: ระบุ bottlenecks บน runtime, network, และ I/O

1. ตรวจสอบ CPU, memory, GC, event loop, concurrency, startup, throughput
2. ตรวจสอบ DNS, connection, bandwidth, latency, payload, caching ด้วย `review-performance`
3. ตรวจสอบ file I/O, storage, serialization, database I/O ด้วย `review-performance`
4. บันทึก findings พร้อม metrics และ evidence

### 4. Bundler Review

Review bundler/build tool config ครอบคลุม chunk splitting, tree shaking, minification, source maps, plugins

> Goal: ครอบคลุมทุก bundler dimension

1. ตรวจสอบ chunk splitting strategy: vendor chunks, route-level chunks, dynamic imports
2. ตรวจสอบ tree shaking: side effects in package.json, unused exports, dead code elimination
3. ตรวจสอบ minification: JS minification, CSS minification, HTML minification
4. ตรวจสอบ source maps: production source maps, source map exposure, source map quality
5. ตรวจสอบ plugin configuration: build plugins, transform plugins, plugin ordering
6. ตรวจสอบ asset optimization: image compression, font subsetting, SVG optimization
7. ตรวจสอบ build output: bundle size, chunk count, asset count, gzip size

### 5. Caching Review

Review caching strategy ครอบคลุม invalidation, key design, TTL, storage, stale-while-revalidate

> Goal: ครอบคลุมทุก caching dimension

1. ตรวจสอบ cache invalidation strategy, key design, และ namespace management
2. ตรวจสอบ TTL configuration, expiration policy, และ cache eviction
3. ตรวจสอบ cache storage selection, memory vs persistent, และ distributed cache
### Network Deep Checks

> Goal: เข้าใจ network stack และ context

1. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ระบุ HTTP client, API endpoints, CDN, proxy, load balancer
4. ถ้า project ไม่มี network layer → stop และ report


> Goal: ตรวจสอบ DNS resolution และ routing

1. ตรวจสอบ DNS records, TTL, และจำนวน round-trips
2. ตรวจสอบการใช้ DNS prefetch/preconnect สำหรับ third-party origins
3. ตรวจสอบ CDN edge locations และ routing
4. ตรวจสอบว่า best practices สำหรับ DNS ถูกนำไปใช้


### Bundler Deep Checks

> Goal: เข้าใจ bundler setup และ build configuration

1. ตรวจสอบ build tool จาก `package.json` และ config file (`bunup.config.ts`, `tsdown.config.ts`, `vite.config.ts`, `tauri.conf.json`)
2. ระบุ build mode, package manager, entry points, output format, target browser/runtime
3. ตรวจสอบว่า project มี build step หรือไม่ — ถ้าไม่มีให้ stop และ report
4. บันทึก baseline build time และ output size ถ้า build ได้


> Goal: ประเมิน build config ปัจจุบัน

1. ตรวจสอบ output format และ `target` ตรงกับ runtime ที่รองรับ
2. ตรวจสอบ `minify` เปิดใน production และ minifier ที่ใช้ (esbuild, terser, swc)
3. ตรวจสอบ `sourcemap` ใน development และ production — ประเมิน exposure risk
4. ตรวจสอบ `external` สำหรับ dependencies ที่ไม่ควร bundle


### Memory Deep Checks

เตรียม context และสแกน codebase

> Goal: เข้าใจ patterns การใช้ memory และ runtime

1. ทำ `/scan-codebase` เพื่อหา patterns ที่เกี่ยวกับ memory
2. ระบุ runtime: Node.js, Bun, browser, Rust, หรืออื่น
3. ตรวจหา memory profiling scripts, heap snapshots, และ monitoring
4. ระบุ large data processing, streaming, caches, queues


วิเคราะห์ memory อย่างลึกซึ้ง

> Goal: พบ root cause ของ memory issues

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติ

### Io Deep Checks

> Goal: เข้าใจ io stack และปัญหา

1. อ่าน `package.json`, `Cargo.toml`, หรือ manifest ที่เกี่ยวข้อง
2. ระบุ patterns: file I/O, database I/O, network I/O, cache, queues
3. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
4. ถ้าไม่พบ I/O patterns ที่มีความเสี่ยง → stop และ report


> Goal: ครอบคลุมทุก io dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ io patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้



## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี build step ให้ข้าม Section 3
- ถ้า project ไม่มี caching ให้ข้าม Section 4
- ถ้า project ไม่มี critical paths ที่รับ input ขนาด variable ให้ข้าม Section 5

### 2. Severity Classification

- Critical: blocking performance bottleneck, bundle size ที่ส่งผลกระทบรุนแรง, broken build config, Core Web Vitals ไม่ผ่าน, cache poisoning, no invalidation on data change, cache stampede, complexity เกิน budget 10× บน user-facing hot path
- High: N+1 query, missing cache on hot path, missing code splitting, large vendor chunk, missing tree shaking, missing source maps, missing TTL, inconsistent cache key, no cache warming, complexity เกิน budget บน hot path, anti-pattern ที่แน่นอนว่าทำให้ช้า
- Medium: suboptimal query, missing lazy load, suboptimal chunk, inconsistent cache key, complexity เกิน budget บน cold path
- Low: minor optimization opportunity, minor cache improvement, complexity ใกล้ budget

### 3. Complexity Tiers

| Input Size | Acceptable Complexity | Use Case |
|------------|----------------------|----------|
| ≤ 10² | O(n²), O(n³) | UI lists, config parsing |
| ≤ 10⁴ | O(n log n) | API queries, sorting |
| ≤ 10⁶ | O(n), O(n log n) | Batch processing, data transform |
| ≤ 10⁸ | O(log n), O(1) | Lookup, search, real-time |
| > 10⁸ | O(1), O(log n) | Stream processing, indexing |

### 4. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ทุก time complexity finding ต้องมี complexity classification และ input size estimate
- ไม่เดา complexity — วิเคราะห์จาก code structure
- ไม่เดา ใช้ tools สำหรับ verification

### 5. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่ optimize ก่อนมี evidence — premature optimization เป็น anti-pattern
- ถ้า complexity เท่ากัน → เลือก algorithm ที่อ่านง่ายกว่า

### 6. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 7. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

### 1. Skip Conditions

- ถ้า project ไม่มี network layer → ข้ามทั้งหมด
- ถ้า project ไม่มี CDN → ข้าม Section 2 item 3
- ถ้า project ไม่มี third-party origins → ข้าม Section 2 item 2
- ถ้า project ไม่มี connection pool → ข้าม Section 3 item 1
- ถ้า project ไม่มี HTTP/2 หรือ HTTP/3 → ข้าม Section 3 item 2

### 2. Severity Classification

- Critical: broken endpoint, no compression บน text responses, missing cache invalidation ทำให้ข้อมูลผิด, broken DNS ทำให้ service down
- High: high latency บน critical path, missing keep-alive, missing retry strategy, missing cache headers บน static assets, large payload ทำให้ช้า
- Medium: suboptimal TTL, suboptimal connection pool size, minor cache key issue, unnecessary headers
- Low: cosmetic, documentation gap, minor naming

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ endpoint, HTTP method, header, หรือ config ที่เกี่ยวข้อง
- ใช้ metrics ก่อน/หลัง ยืนยันผลเมื่อได้

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

*Some details from merged source skills were condensed to keep the skill under 250 lines.*
