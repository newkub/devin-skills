---
name: review-memory
description: Review memory usage ครอบคลุม heap, GC, leaks, buffers, caches, closures, และ memory profiling
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - validate
  - suggest-next-action
---

## Goal

Review memory usage and management patterns ใน codebase พร้อมระบุ leaks, bloat, GC pressure, และ optimization opportunities

## Scope

ใช้สำหรับ review heap usage, garbage collection, memory leaks, buffer/ArrayBuffer management, caches, closures, event listeners, streams, large allocations, memory limits, และ profiling

## Execute

### 1. Prepare And Scan

เตรียม context และสแกน codebase

> Goal: เข้าใจ patterns การใช้ memory และ runtime

1. ทำ `/scan-codebase` เพื่อหา patterns ที่เกี่ยวกับ memory
2. ระบุ runtime: Node.js, Bun, browser, Rust, หรืออื่น
3. ตรวจหา memory profiling scripts, heap snapshots, และ monitoring
4. ระบุ large data processing, streaming, caches, queues

### 2. Deep Analyze

วิเคราะห์ memory อย่างลึกซึ้ง

> Goal: พบ root cause ของ memory issues

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติ
2. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. ทำ `/run-review` เพื่อดึง review report
4. วิเคราะห์ heap growth patterns
5. ตรวจหา synchronous bulk allocation (`JSON.parse` ไฟล์ใหญ่, `Buffer.concat`, array ขนาดใหญ่)
6. ตรวจหา unbounded caches, Map, Set, arrays
7. ตรวจหา leaked closures, event listeners, timers
8. ตรวจหา streams/buffers ที่ไม่ถูกปิดหรือรีเซ็ต
9. ตรวจหา global/module-level state ที่เติบโต
10. ตรวจหา circular references

### 3. Heap And GC Review

Review heap และ garbage collection configuration

> Goal: ระบุ heap bloat และ GC pressure

1. ตรวจสอบ runtime heap config: `--max-old-space-size`, `--smol`, `BUN_JSC_forceRAMSize`, `BUN_JSC_gcMaxHeapSize`
2. ตรวจสอบ GC flags และ environment variables
3. วิเคราะห์ `process.memoryUsage()`, `Bun.heapSize()`, heap snapshots
4. ระบุ object retention นานผิดปกติ
5. Critical: heap grows unbounded, OOM risk, no GC tuning in constrained environment
6. High: large old-space usage, frequent GC pauses, missing memory monitoring
7. Medium: suboptimal heap config, missing `--smol` in memory-constrained CI
8. Low: minor heap tuning opportunities

### 4. Leak Patterns Review

Review common memory leak patterns

> Goal: จับ memory leaks ใน code

1. ตรวจหา event listeners ที่ไม่ remove หรือสะสม
2. ตรวจหา closures ที่เก็บ reference ใหญ่
3. ตรวจหา timers/intervals ไม่ clear
4. ตรวจหา caches ไม่มี size limit หรือ eviction
5. ตรวจหา subscriptions/observers ไม่ unsubscribe
6. ตรวจหา DOM nodes, WebSocket, TCP connections ไม่ปิด
7. ตรวจหา recursive data/circular references
8. ตรวจหา global/module-level state ที่เติบโต
9. ตรวจหา orphan objects จาก promises/futures

### 5. Buffer And Stream Review

Review buffer และ stream management

> Goal: ลด external memory และ native heap

1. ตรวจสอบ `Buffer`, `ArrayBuffer`, `TypedArray` allocation และ release
2. ตรวจสอบ stream backpressure, pause/resume, pipeline
3. ตรวจสอบ file uploads: size limits, streaming vs buffering
4. ตรวจหา buffer concatenation ใน loop
5. ตรวจหา streams ที่ไม่ `destroy()`/`end()` หรือ close
6. ตรวจสอบ `external`/`arrayBuffers` memory ใน Node.js

### 6. Caching And State Review

Review cache และ state management

> Goal: ป้องกัน unbounded growth

1. ตรวจสอบ cache size limits, TTL, LRU/LFU eviction
2. ตรวจสอบ in-memory state/store ที่โตเรื่อยๆ
3. ตรวจสอบ session storage, connection pooling
4. ตรวจสอบ large Map/Set/array accumulation
5. ตรวจสอบ state retention ใน Redux, Pinia, TanStack Store, Svelte stores

### 7. Validate Findings

ตรวจสอบ findings

> Goal: issues ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate หลายมิติ: cross-reference, type safety, runtime, security
2. ทำ `/validate` สำหรับแต่ละ finding — จัดลำดับ Critical → High → Medium → Low
3. ตัด false positives และขาด evidence ไม่ report

### 8. Report

รายงานผล review

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

1. ทำ `/report-review` และ `/report-table`
2. สร้างตาราง findings พร้อม severity, file, line, recommendation
3. ทำ `/suggest-next-action`

### 9. Implement All

ตรวจสอบ implementation completeness

> Goal: ไม่มี TODO, MOCK, STUB ค้าง

1. ทำ `/implement-all` สำหรับ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings

## Rules

### 1. Scope And Delegation

- ไม่ duplicate กับ performance review หรือ concurrency review — focus ที่ memory-specific issues
- ถ้า issue ซ้อนทับกับ review อื่น → อ้างอิงแทน
- ถ้า project ไม่มี memory-sensitive dimension → ข้าม workflow นี้

### 2. Severity Classification

- Critical: OOM risk, unbounded heap growth, memory leak บน hot path
- High: large old-space usage, frequent GC pauses, missing cache limits
- Medium: suboptimal heap config, buffer reuse, missing profiling
- Low: minor tuning opportunities

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path, line number, code snippet หรือ config evidence
- ไม่ report โดยไม่มี evidence
- ใช้ heap snapshots, memory metrics, หรือ code structure เป็น evidence

### 4. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- Findings พร้อม severity, review score, และ actionable recommendations
- Review score ต่อ dimension และ overall
- Before/after memory metrics ถ้ามี
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

