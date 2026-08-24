---
name: optimize-runtime
description: ปรับปรุง project runtime ด้าน cpu, memory, concurrency, event loop, GC และ startup
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - optimize-codebase
  - validate
---

## Goal

ปรับปรุง runtime ของ project ให้เร็ว ประหยัด resource และเสถียร

## Scope

ใช้กับ process/thread runtime, CPU, memory, GC, event loop, concurrency, startup time, throughput ใน project หรือ workspace

## Execute

### 1. Detect Runtime Context
> Goal: เข้าใจ runtime stack และปัญหา
1. อ่าน `package.json`, `Cargo.toml`, หรือ manifest ที่ระบุ runtime
2. ระบุ language/runtime: Node.js, Bun, Deno, Python, Rust, Go, JVM
3. ทำ /scan-codebase เพื่อหา issues ที่เกี่ยวข้อง
4. ทำ /review-codebase เพื่อรายละเอียดเพิ่ม
5. ถ้าไม่พบ issues → stop และ report

### 2. Optimize CPU
> Goal: ลด CPU usage และ hot paths
1. ระบุ hot functions ด้วย profiler ( clinic, 0x, perf, py-spy )
2. ลด unnecessary computation, loops, recursion
3. ใช้ efficient algorithms และ data structures
4. parallelize CPU-bound work ถ้าเหมาะสม

### 3. Optimize Memory
> Goal: ลด heap และ leaks
1. ตรวจสอบ memory leaks ด้วย heap snapshot หรือ profiler
2. ลด object allocations ใน hot paths
3. ใช้ object pooling, buffer reuse, lazy loading
4. ใช้ /review-reliability ถ้าพบ OOM หรือ crash

### 4. Optimize Garbage Collection And Event Loop
> Goal: ลด GC pauses และ event loop blocking
1. ตรวจสอบ long-running synchronous tasks
2. แบ่งงานใหญ่เป็น chunks หรือใช้ worker threads/processes
3. ลดการสร้าง short-lived objects
4. ใช้ stream แทน buffer ทั้งหมดถ้าได้

### 5. Optimize Concurrency And Throughput
> Goal: ใช้ parallelism อย่างมีประสิทธิภาพ
1. ตรวจสอบ thread pool, worker count, async patterns
2. หลีกเลี่ยง contention, deadlocks, race conditions
3. ใช้ queues, backpressure, throttling ที่เหมาะสม
4. ใช้ /review-rate-limiting ถ้า throughput ลดลง

### 6. Optimize Startup
> Goal: ลด cold start time
1. ลด module loading, lazy initialize heavy services
2. ใช้ code splitting หรือ deferred imports
3. ตรวจสอบ top-level await, sync initialization
4. ใช้ /optimize-build ถ้า startup ช้าเพราะ bundle

### 7. Validate
> Goal: ยืนยันว่า runtime ปรับปรุงแล้วดีขึ้น
1. ทำ /validate และ /run-check
2. รัน load test หรือ benchmark เปรียบเทียบ before/after
3. ถ้าไม่ผ่าน → ทำ /resolve-errors แล้ว retry (max 3)
4. สรุปผลด้วย /report และ /suggest-next-action

## Rules

### 1. Minimal Changes
- แก้เฉพาะสิ่งที่วัดผลได้ว่าดีขึ้น
- ไม่เปลี่ยน architecture หลักโดยไม่ได้รับการยืนยัน
- ถ้าไม่แน่ใจ → ทำ /ask-me

### 2. Evidence Based
- ใช้ profilers, benchmarks, metrics ก่อน/หลัง
- ไม่อ้างว่างานเสร็จถ้า validation ไม่ผ่าน

## Expected Outcome

- runtime เร็วขึ้น ประหยัด memory หรือ CPU ลง
- ไม่มี OOM, GC pause, หรือ startup regression
- รายงานสรุป before/after และ next action
