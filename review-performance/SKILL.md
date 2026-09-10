---
name: review-performance
description: Review application performance ครอบคลุม network, build, runtime, memory, I/O, database, caching
argument-hint: "[scope]"
related:
  - review-frontend
  - review-quality
  - run-profiler
  - run-bench
  - deep-analyze
  - run-review
  - deep-validate
  - report
  - suggest-next-action
  - use-astgrep
  - follow-my-tech-stack
  - review-dependencies
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
- `profiling`: flamegraphs, runtime profilers, hotspot detection

ไม่รวม security หรือ stability (ใช้ `/review-security` และ `/review-stability`)

## Execute

### 1. Prepare

> Goal: เข้าใจ project structure, tech stack และ performance setup

ทำตาม `references/prepare.md`

### 2. Network And API

> Goal: API calls และ network layer มีประสิทธิภาพ

ทำตาม `references/network-and-api.md`

### 3. Bundler And Build

> Goal: bundle และ build output มีขนาดเล็ก โหลดเร็ว

ทำตาม `references/bundler-and-build.md`

### 4. Runtime And CPU

> Goal: runtime execution ไม่มี hot paths หรือ bottlenecks

ทำตาม `references/runtime-and-cpu.md`

### 5. Memory

> Goal: memory usage อยู่ในเกณฑ์ ไม่มี leaks

ทำตาม `references/memory.md`

### 6. I/O And Database

> Goal: I/O operations มีประสิทธิภาพ

ทำตาม `references/io-and-database.md`

### 7. Caching And Complexity

> Goal: caching และ algorithms มีประสิทธิภาพ

ทำตาม `references/caching.md`

### 8. Concurrency

> Goal: ตรวจสอบ concurrent programming ใน application code

ทำตาม `references/concurrency.md`

### 9. Validate Score And Report

> Goal: findings ถูกต้อง พร้อม review score

ทำตาม `references/validate-score-and-report.md`

## Rules

### 1. Scope Boundary

- เน้น performance บน critical paths
- ไม่ซ้ำกับ `/review-security` หรือ `/review-stability`
- ถ้าพบ security/stability issues → ระบุเป็น info เท่านั้น
- รายละเอียด rendering performance อยู่ใน `/review-frontend`
- ห้าม duplicate รายละเอียด checklist จาก `references/`

### 2. Skip Conditions

- ถ้าไม่มี build step → ข้าม Bundler And Build
- ถ้าไม่มี caching → ข้าม Caching And Complexity
- ถ้าไม่มี network layer → ข้าม Network And API
- ถ้าไม่มี database → ข้าม I/O And Database
- ถ้าไม่มี frontend → ข้าม runtime ที่เกี่ยวกับ render

### 3. Severity Classification

| Severity | ลักษณะ |
|---|---|
| Critical | blocking bottleneck, bundle size ที่ส่งผลรุนแรง, broken build config, CWV ไม่ผ่าน, cache poisoning, cache stampede, complexity เกิน budget 10x บน hot path |
| High | N+1 query, missing cache บน hot path, missing code splitting, large vendor chunk, missing tree shaking, missing TTL, complexity เกิน budget บน hot path |
| Medium | suboptimal query, missing lazy load, suboptimal chunk, complexity เกิน budget บน cold path |
| Low | minor optimization, minor cache improvement, complexity ใกล้ budget |

### 4. Evidence-Based Findings

- ทุก finding ต้องมี file path, line number
- ระบุ function, query, config ที่เกี่ยวข้อง
- ใช้ profiling data หรือ measurements ประกอบ
- ไม่ optimize ก่อนมี evidence

### 5. Formatting

- ห้ามใช้ `**` — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report`
- ใช้ symbols: ผ่าน, ไม่ผ่าน, warning

### 6. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder

- ใช้ /review-quality ถ้าจำเป็น
- ใช้ /run-profiler ถ้าจำเป็น
- ใช้ /run-bench ถ้าจำเป็น
- ใช้ /deep-analyze ถ้าจำเป็น
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /deep-validate ถ้าจำเป็น
- ใช้ /use-astgrep ถ้าจำเป็น
- ใช้ /follow-my-tech-stack ถ้าจำเป็น

- ใช้ /review-dependencies ถ้าจำเป็น

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/review` (performance)

Merged from: improve-performance, optimize-memory, optimize-network, optimize-performance, optimize-serialization, optimize-startup

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้ (performance)
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง (performance)
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test-unit` ถ้ามี แล้วสรุปผลด้วย `/report-before-after` (performance)

- `references/fix-improve-performance.md` — แก้ findings จาก review-performance ครอบคลุม network, runtime, memory และ caching
- `references/fix-optimize-memory.md` — ปรับปรุง memory usage: leaks, large objects, caches, garbage collection
- `references/fix-optimize-network.md` — ปรับปรุง network: requests, CDN, compression, caching, HTTP/2, preconnect
- `references/fix-optimize-performance.md` — แก้ web performance — Core Web Vitals (LCP, INP, CLS), long tasks, TTI, third-party scripts ด้วย field data และ targeted fixes
- `references/fix-optimize-serialization.md` — ลดขนาด serialization payloads — JSON trimming, compression และ format selection
- `references/fix-optimize-startup.md` — ลดเวลา startup ของ app/CLI ด้วย lazy loading, defer init และลดงานหนักตอน boot
## Expected Outcome

- รายงาน performance findings ครอบคลุมทุก dimension
- Review score ต่อ dimension และ overall
- Severity และ recommendations ชัดเจน
- ไม่ซ้ำซ้อนกับ review skills อื่น
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
- ถ้าต้อง optimize ให้ทำ section `## Fix`
