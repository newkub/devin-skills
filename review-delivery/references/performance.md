# Performance Checks

## Goal

ตรวจสอบ performance ครอบคลุม network, bundler, memory, I/O, caching และ runtime bottlenecks

## Scope

ครอบคลุม network, bundler/build tool, memory, I/O, caching, time complexity และ runtime profiling บน critical paths — ไม่ครอบคลุม security, reliability, quality

## Checks

### Network And API

1. ตรวจสอบ HTTP client, API endpoints, CDN, proxy, load balancer
2. ตรวจสอบ DNS records, TTL, prefetch/preconnect สำหรับ third-party origins
3. ตรวจสอบ connection pooling, keep-alive, HTTP/2, HTTP/3, compression
4. ตรวจสอบ latency, payload size, cache headers, retry strategy
5. ถ้าไม่มี network layer → ข้าม step นี้

### Bundler And Build

1. ตรวจสอบ build tool จาก `package.json` และ config: `bunup.config.ts`, `tsdown.config.ts`, `vite.config.ts`, `tauri.conf.json`
2. ตรวจสอบ chunk splitting: vendor chunks, route-level chunks, dynamic imports
3. ตรวจสอบ tree shaking: side effects in `package.json`, unused exports, dead code
4. ตรวจสอบ minification, source maps, `external` dependencies
5. ตรวจสอบ asset optimization: image, font, SVG, gzip size
6. ถ้าไม่มี build step → ข้าม step นี้

### Memory Usage

1. ตรวจสอบ memory profiling scripts, heap snapshots, monitoring
2. ตรวจสอบ large data processing, streaming, caches, queues
3. ตรวจสอบ memory leaks, GC pressure, unbounded collections
4. ทำ `/deep-analyze` เพื่อหา root cause ของ memory hotspots

### I/O And Storage

1. ตรวจสอบ file I/O, database I/O, network I/O, cache, queues
2. ตรวจสอบ serialization, batching, async I/O patterns
3. ถ้าไม่พบ I/O patterns ที่มีความเสี่ยง → ข้าม step นี้

### Caching And Complexity

1. ตรวจสอบ cache invalidation, key design, TTL, storage, stale-while-revalidate
2. ตรวจสอบ cache stampede, thundering herd, warming
3. ทำ `/check-time-complexity` เพื่อวิเคราะห์ time complexity บน critical paths
4. ตรวจสอบ N+1 queries, missing indexes, anti-patterns ที่ทำให้ช้า

## Complexity Tiers

| Input Size | Acceptable Complexity | Use Case |
|---|---|---|
| <= 10^2 | O(n^2), O(n^3) | UI lists, config parsing |
| <= 10^4 | O(n log n) | API queries, sorting |
| <= 10^6 | O(n), O(n log n) | Batch processing, data transform |
| <= 10^8 | O(log n), O(1) | Lookup, search, real-time |
| > 10^8 | O(1), O(log n) | Stream processing, indexing |

## Severity

- Critical: blocking bottleneck, bundle size ที่ส่งผลกระทบรุนแรง, broken build config, Core Web Vitals ไม่ผ่าน, cache poisoning, cache stampede, complexity เกิน budget 10x บน hot path
- High: N+1 query, missing cache บน hot path, missing code splitting, large vendor chunk, missing tree shaking, missing TTL, complexity เกิน budget บน hot path
- Medium: suboptimal query, missing lazy load, suboptimal chunk, complexity เกิน budget บน cold path
- Low: minor optimization, minor cache improvement, complexity ใกล้ budget

## Rules

- ถ้าไม่มี build step → ข้าม Bundler and Build Review
- ถ้าไม่มี caching → ข้าม Caching and Complexity Review
- ถ้าไม่มี network layer → ข้าม Network and API Review
- ทุก finding ต้องมี file path, line number
- ทุก time complexity finding ต้องมี complexity classification และ input size estimate
- ไม่เดา complexity — วิเคราะห์จาก code structure
- ทำ review เท่านั้น ไม่ optimize ก่อนมี evidence
- ถ้า complexity เท่ากัน → เลือก algorithm ที่อ่านง่ายกว่า
