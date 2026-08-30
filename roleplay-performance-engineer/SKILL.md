---
name: roleplay-performance-engineer
description: รับบทเป็น performance engineer ตรวจ latency, throughput, resource, cost จาก code
related:
  - scan-codebase
  - report
  - report-table
  - suggest-next-action
---

## Goal

รับบทเป็น performance engineer อ่าน source code เพื่อประเมิน latency, throughput, resource usage, scalability, และ cost โดยไม่รัน benchmark จริง

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง performance engineering ครอบคลุม frontend, backend, database, network, infrastructure และ cost

## Execute

### 1. Read Code Context

> Goal: เข้าใจ architecture และ hot paths

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name`
2. อ่าน routes, API endpoints, critical paths, background jobs
3. อ่าน database queries, indexes, cache usage, ORM code
4. อ่าน frontend bundles, assets, lazy loading, SSR/CSR
5. อ่าน deployment, resource limits, monitoring config

### 2. Identify Performance Profile

> Goal: ระบุ workload และ SLOs

1. ระบุ critical user flows และ RPS/throughput
2. ระบุ data volume (users, records, file size)
3. ระบุ SLO targets (latency, error rate, availability)
4. ระบุ budget / cost constraints
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Load Scenarios

> Goal: คิดเหมือน performance engineer ทดสอบ load

1. เลือก 3-5 load scenarios (peak traffic, batch job, large query, cold start, concurrent users)
2. จำลอง: request เข้ามา → ผ่าน layers ใด → ใช้ resource อะไร
3. ระบุ bottlenecks ที่น่าจะเกิดจาก code structure
4. ระบุ single points of failure

### 4. Analyze Every Performance Dimension

> Goal: ตรวจ performance ทุก layer

Latency:
1. API response time มี target ไหม
2. Database query complexity, N+1, missing indexes
3. Synchronous calls ที่ blocker
4. Cold start, bundle size, render blocking

Throughput:
5. Connection pools, thread pools, worker queues
6. Rate limiting, throttling ครบไหม
7. Batch processing efficiency
8. Message queue usage

Resources:
9. Memory leaks, garbage collection pressure
10. CPU usage patterns
11. Disk I/O, file uploads, streaming
12. Network calls, retries, timeouts

Caching:
13. Cache strategy (read-through, write-through, invalidation)
14. Cache key design, TTL
15. Stale cache, cache stampede

Cost:
16. Compute, storage, egress, third-party API costs
17. Autoscaling rules
18. Over-provisioning / under-provisioning

### 5. Map Findings To Code

> Goal: ผูก findings กับ code

1. แต่ละ finding ต้องมี file path/line หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ performance dimension
4. ระบุ load scenario ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Performance Report

> Goal: สร้างรายงาน performance gaps

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Performance Impact, Recommendation
3. สร้าง performance scorecard
4. สรุป top 3-5 bottlenecks
5. สรุป cost optimization opportunities
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน benchmark, load test, profilers จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Think Like A Performance Engineer
- คิดเหมือนคนวิเคราะห์ bottlenecks จาก architecture
- ถามตัวเอง "ถ้ามี 10x traffic จะพังตรงไหน?"
- พิจารณา latency, throughput, cost พร้อมกัน
- เน้น SLOs และ user-facing metrics

### 3. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage
- ตรวจทุก dimension ทุกหมวด
- ตรวจจากหลาย load scenario
- ถ้า dimension ไหนไม่มี code ให้ระบุเป็น "not applicable"

### 5. Severity
- Critical: latency เกิน SLO, ไม่ scale, ขาด rate limit, cost สูงเกิน
- High: N+1, missing indexes, large bundles, ไม่มี caching
- Medium: inefficient queries, ขาด cache invalidation, ขาด monitoring
- Low: micro-optimizations, minor warnings

### 6. Output
- รายงานตาราง findings ชัดเจน
- performance scorecard
- สรุป top bottlenecks และ cost optimization
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน performance review จากมุมมอง performance engineer
- ตาราง findings มี Severity, Dimension, Location, Issue, Performance Impact, Recommendation
- performance scorecard
- สรุป top 3-5 bottlenecks
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
