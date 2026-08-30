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
