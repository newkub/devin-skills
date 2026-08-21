---
name: review-performance
description: Performance review ครอบคลุม bundler, caching, time complexity, Core Web Vitals, bottlenecks
---

## Goal

Review performance ครอบคลุมทุก dimension ของ performance พร้อม aggregate findings และ review score

## Scope

performance review สำหรับ: bundler config, caching strategy, time complexity, Core Web Vitals, rendering performance, resource usage

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
2. ทำ `/update-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. รัน `bun --filter @booking/tools-review review:json` เพื่อดึง review report พร้อม metrics
4. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
5. ทำ `/check-time-complexity` วิเคราะห์ time complexity ของ critical paths
6. Analyzer ตรวจสอบ N+1 queries, missing indexes, caching gaps
7. Analyzer ตรวจสอบ bundle size, chunk splitting, tree shaking, และ asset optimization
8. Analyzer ตรวจสอบ rendering performance, unnecessary re-renders, และ lazy loading
9. Analyzer ตรวจสอบ Core Web Vitals: LCP, INP, CLS, FCP, TBT, Speed Index
10. Review CLI คำนวณ performance review score จาก review report

### 3. Bundler Review

Review bundler/build tool config ครอบคลุม chunk splitting, tree shaking, minification, source maps, plugins

> Goal: ครอบคลุมทุก bundler dimension

1. ตรวจสอบ chunk splitting strategy: vendor chunks, route-level chunks, dynamic imports
2. ตรวจสอบ tree shaking: side effects in package.json, unused exports, dead code elimination
3. ตรวจสอบ minification: JS minification, CSS minification, HTML minification
4. ตรวจสอบ source maps: production source maps, source map exposure, source map quality
5. ตรวจสอบ plugin configuration: build plugins, transform plugins, plugin ordering
6. ตรวจสอบ asset optimization: image compression, font subsetting, SVG optimization
7. ตรวจสอบ build output: bundle size, chunk count, asset count, gzip size

### 4. Caching Review

Review caching strategy ครอบคลุม invalidation, key design, TTL, storage, stale-while-revalidate

> Goal: ครอบคลุมทุก caching dimension

1. ตรวจสอบ cache invalidation strategy, key design, และ namespace management
2. ตรวจสอบ TTL configuration, expiration policy, และ cache eviction
3. ตรวจสอบ cache storage selection, memory vs persistent, และ distributed cache
4. ตรวจสอบ stale-while-revalidate patterns, cache warming, และ cache hit ratio

### 5. Time Complexity Review

Review time complexity ของ critical paths ครอบคลุม Big O analysis, anti-patterns, input bounds

> Goal: ครอบคลุมทุก time complexity dimension

1. สแกน codebase เพื่อระบุ functions ที่รับ input ขนาด variable: loops, recursion, nested iteration, sorting, searching
2. วิเคราะห์ Big O ของแต่ละ critical path: single loop = O(n), nested loop = O(n²), binary search = O(log n)
3. วิเคราะห์ recursion: ใช้ Master Theorem หรือ tree method
4. วิเคราะห์ data structure operations: array access = O(1), hash lookup = O(1) avg, tree = O(log n)
5. วิเคราะห์ composed operations: เช่น sort + binary search = O(n log n)
6. ตรวจสอบ input bounds: UI = 10³, API = 10⁴, batch = 10⁶, data pipeline = 10⁸
7. ตรวจหา anti-patterns: nested loop โดยไม่ใช้ hash map, sort ทุกครั้งแทน binary search, recursive โดยไม่ memoize, `array.indexOf` ใน loop

### 6. Validate Findings

ตรวจสอบและ validate issues จากทุก section และ core analysis

> Goal: Issues ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues จากทุก section และ core analysis
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low

### 7. Report

รายงานผล review ในรูปแบบตาราง

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-format-table`
2. สร้างตาราง aggregate findings จากทุก section และ core analysis
3. ทำ `/suggest-next-action`

### 8. Implement All

ตรวจสอบว่า findings ที่พบสามารถ implement ได้จริง

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

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
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก performance section และ core analysis
- รายงาน recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
