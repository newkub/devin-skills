---
name: improve-performance
description: ปรับปรุง performance ด้าน network, latency, caching, runtime, io และ resource ใช้งาน
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
  - improve-codebase
  - improve-database
  - improve-frontend
  - improve-reliability
  - improve-resilience
  - run-check
  - suggest-next-action
  - validate
---

## Goal

ปรับปรุง performance ของ project ให้เร็วขึ้น ใช้ resource น้อยลง และเสถียรขึ้น ครอบคลุม network, latency, caching, runtime และ io

## Scope

ใช้กับ project หรือ workspace ที่ต้องการปรับปรุง network, latency, caching, runtime, io, CPU, memory, serialization และ storage

## Execute

### 1. Detect Context And Stack
> Goal: เข้าใจ tech stack, runtime และ pain points
1. อ่าน `package.json`, `Cargo.toml`, manifest, environment variables ที่เกี่ยวข้อง
2. ระบุ language/runtime, HTTP client, CDN, database, cache, storage
3. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
4. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
5. ถ้าไม่พบ issues หรือ context ไม่ชัด → stop และ report

### 2. Analyze Network And Latency
> Goal: ลด response time และ round trips
1. ทำ `/check-web-performance` หรือ `/review-performance` ถ้ามี API endpoints
2. ระบุ slow endpoints, DNS, connection pool, timeout, retry strategy
3. ใช้ DNS prefetch/preconnect, HTTP/2/HTTP/3, keep-alive ถ้าเหมาะสม
4. รวม batch requests, ลด unnecessary headers/cookies/payload fields
5. ใช้ exponential backoff และ circuit breaker ถ้าจำเป็น

### 3. Optimize Caching
> Goal: ใช้ cache อย่างมีประสิทธิภาพ
1. ตรวจ cache headers, TTL, CDN, browser cache, service worker
2. ระบุ over-caching/under-caching, stale data, cache invalidation
3. ใช้ cache ระดับ application, database, CDN ตาม use case
4. ตรวจสอบ cache consistency และ warm-up strategy

### 4. Optimize Runtime (CPU And Memory)
> Goal: ลด CPU, memory, GC และ startup
1. ระบุ hot functions ด้วย profiler (clinic, 0x, perf, py-spy)
2. ลด unnecessary computation, loops, object allocations ใน hot paths
3. ใช้ efficient algorithms, data structures, parallelization ถ้าเหมาะสม
4. แบ่งงานใหญ่เป็น chunks หรือ worker threads; ลด event loop blocking
5. ลด module loading, lazy initialize, code splitting, deferred imports

### 5. Optimize IO And Serialization
> Goal: ลด latency และขนาดข้อมูลของ IO
1. ใช้ streaming แทน loading ทั้งหมดลง memory
2. ลด synchronous file/database/network IO
3. ใช้ connection pooling, batching, async IO ถ้าเหมาะสม
4. เลือก serialization format ทีเหมาะสม (JSON, MessagePack, Protobuf) และ schema validation
5. ใช้ `/review-database` ถ้า database เป็นปัญหา

### 6. Validate
> Goal: ยืนยันว่า performance ดีขึ้น
1. ทำ `/validate` และ `/run-check`
2. รัน benchmark/load test เปรียบเทียบ before/after
3. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)
4. สรุปผลด้วย `/report` และ `/suggest-next-action`

## Rules

### 1. Minimal Changes
- แก้เฉพาะสิ่งที่วัดผลได้ว่าดีขึ้น
- ไม่เปลี่ยน architecture หลักโดยไม่ได้รับการยืนยัน
- ถ้าไม่แน่ใจ → `/ask-me`

### 2. Reliability Over Speed
- ไม่ลด timeout หรือ retry จนเสี่ยง fail
- รักษา idempotency, error handling, cache consistency
- ทำ dry run กับ storage/serialization migrations

### 3. Evidence Based
- ใช้ metrics ก่อน/หลัง ยืนยันผล
- ไม่อ้างว่างานเสร็จถ้า validation ไม่ผ่าน

## Expected Outcome
- network ลด latency, round trips, bandwidth
- caching ใช้งานได้เหมาะสม ไม่มี stale data
- runtime เร็วขึ้น CPU/memory ลดลง GC/startup ดีขึ้น
- io เร็วขึ้น latency ลดลง throughput สูงขึ้น
- ไม่มี data loss, regression, หรือ reliability ลดลง
- รายงาน before/after metrics และ next action
