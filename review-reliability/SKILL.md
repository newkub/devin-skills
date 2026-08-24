---
name: review-reliability
description: Review reliability including observability, disaster recovery, rate limiting, predictability, and co
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
  - review-performance
  - review-quality
  - review-security
  - suggest-next-action
  - validate
---

## Goal

Review reliability, resilience, และ recoverability ครอบคลุม failure points, retries, timeouts, circuit breakers, fallback, backup/restore, และ health checks พร้อม review score Review observability ครอบคลุม metrics, logs, traces, alerts, dashboards, SLOs, telemetry, auditability และ incident respo...

## Scope

reliability review สำหรับ: single points of failure, graceful degradation, redundancy, timeouts, retries, idempotency, circuit breakers, bulkheads, fallback, rate limiting, load balancing, queue, backpressure, backup/restore, rollback, transaction safety, migration safety, self-healing, restart policies, health checks, readiness/liveness probes ใช้สำหรับ review observability setup — อยู่ภายใต้ ...

## Execute

### 1. Prepare And Scan

เตรียม context และ scan หา reliability patterns ใน codebase

> Goal: เข้าใจ dependencies, critical paths, และ reliability controls ที่มี

1. ทำ `/scan-codebase` เพื่อหา failure points, retry config, timeout config, circuit breaker, fallback, backup/restore, health checks
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่มเติม
3. ระบุ dependencies สำคัญ: database, cache, message broker, external APIs, third-party services
4. ระบุ critical paths และ config files ที่เกี่ยวข้อง
5. ถ้าไม่พบ reliability concerns -> stop และ report

### 2. Review Failure Points And Single Points Of Failure

ตรวจสอบจุดเสี่ยงและ single points of failure

> Goal: ระบุจุดที่อาจทำให้ระบบล้มทั้งหมด

1. ตรวจสอบ dependencies ภายในและภายนอก: database, cache, queue, external APIs, file system
2. ตรวจสอบ single points of failure: มี redundancy, replication, หรือ multi-zone/multi-region หรือไม่
3. ตรวจสอบ graceful degradation: ระบบยังทำงานบางส่วนได้เมื่อ dependency ล้มหรือไม่
4. ตรวจสอบ impact ของ failure ต่อ critical paths และ users
5. ระบุ dependencies ที่ไม่มี fallback หรือ redundancy

### 3. Review Retries, Timeouts And Idempotency

ตรวจสอบ retry, timeout, และ idempotency

> Goal: ลดผลกระทบจาก transient failures

1. ตรวจสอบ timeout บน external calls และ critical operations: default timeout, connect vs read timeout
2. ตรวจสอบ retry policy: max retries, retry conditions, exponential backoff, jitter, retry budget
3. ตรวจสอบ idempotency สำหรับ retries และ duplicate requests
4. ตรวจสอบความปลอดภัยของ retry บน non-idempotent operations
5. ระบุ calls ที่ไม่มี timeout หรือ retry

### 4. Review Circuit Breakers And Resilience Patterns

ตรวจสอบ circuit breaker, bulkhead, rate limiting, load balancing, queue, backpressure

> Goal: ป้องกัน cascade failure และรับมือ overload

1. ตรวจสอบ circuit breaker สำหรับ unstable dependencies: failure threshold, half-open state, recovery
2. ตรวจสอบ bulkhead / resource isolation: thread pools, semaphores, connection limits
3. ตรวจสอบ rate limiting และ throttling: per-route, per-user, per-IP, headers, 429 handling
4. ตรวจสอบ load balancing: distribution, health-aware routing, failover
5. ตรวจสอบ queue, backpressure, concurrency limits, dead letter queue
6. ระบุ dependencies ที่ไม่มี circuit breaker หรือ isolation

### 5. Review Fallback And Graceful Degradation

ตรวจสอบ fallback และ graceful degradation

> Goal: ระบบยังทำงานได้เมื่อ dependency ล้ม

1. ตรวจสอบ fallback behavior สำหรับ dependencies สำคัญ: default value, cached data, cached response
2. ตรวจสอบ graceful degradation: ปิด feature บางส่วน, ลด functionality, แสดงข้อความแจ้ง users
3. ตรวจสอบ queue / worker fallback: dead letter queue, error recovery, replay
4. ตรวจสอบ feature flags หรือ toggles สำหรับ degraded mode
5. ระบุ critical paths ที่ไม่มี fallback
### Observability Deep Checks

> Goal: เข้าใจ observability stack และ requirements

1. เรียก `/scan-codebase` เพื่อหา observability config, SDK, exporters
2. เรียก `/review-codebase` เพื่อรายละเอียดเพิ่มถ้ามี
3. ระบุ tools: `Prometheus`, `Grafana`, `OpenTelemetry`, `Datadog`, `Sentry`
4. ระบุ SLOs, SLIs และ critical paths ที่ต้อง monitor


> Goal: metrics และ telemetry ครอบคลุม business และ technical signals

1. ตรวจสอบ business metrics: conversion, active users, error rate
2. ตรวจสอบ technical metrics: latency, throughput, errors, resource usage
3. ตรวจสอบ telemetry collection: `OpenTelemetry`, `Prometheus`, `Datadog`
4. ตรวจสอบ metric labels, cardinality, naming conventions


### Disaster Recovery Deep Checks

รวบรวม context ก่อน review disaster-recovery

> Goal: เข้าใจ DR setup, dependencies, และ critical services

1. ทำ `/scan-codebase` เพื่อหาไฟล์และ config ที่เกี่ยวข้องกับ disaster-recovery, backup, restore, runbooks
2. ระบุ critical services, databases, storage, และ external dependencies
3. หาเอกสาร DR plan, runbooks, backup schedules, และ incident response ที่มีอยู่
4. ถ้าไม่พบ DR setup หรือ backup ใดๆ -> บันทึก finding Critical และไปที่ `Validate and Report`


ตรวจสอบ DR plan

> Goal: DR plan ครอบคลุม goals, scope, และ recovery objectives

1. ตรวจสอบ RPO/RTO targets: มีการกำหนดต่อ service, วัดผลได้, และสอดคล้องกับ business requirements

### Rate Limiting Deep Checks

> Goal: เข้าใจสถานะปัจจุบันของ rate limiting ใน codebase

1. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ระบุ rate limiter, throttling mechanism, และ backoff implementation ที่ใช้
4. ถ้าไม่พบ rate-limiting ที่เกี่ยวข้อง -> stop และ report


> Goal: ตรวจสอบ rate limiting, throttling, และ backoff ตาม checklist


1. ตรวจสอบ rate limit configuration: window, threshold, per-route vs global, per-IP vs per-user
2. ตรวจสอบ rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`
3. ตรวจสอบ 429 Too Many Requests handling และ client guidance
4. ตรวจสอบ distributed rate limiting: shared store, Redis, race condition prevention

### Predictability Deep Checks

> Goal: เข้าใจสถานะปัจจุบันของ predictability

1. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ระบุ global state, random/seed, timestamps, UUID, file I/O, external services
4. ถ้าไม่พบ issues -> stop และ report


> Goal: ตรวจสอบว่าโค้ดมีพฤติกรรมที่คาดการณ์ได้

1. ตรวจสอบ seed / initialization ของ random, UUID, timestamp
2. ตรวจสอบการใช้ global state หรือ shared mutable state
3. ตรวจสอบลำดับการทำงานที่อาจเปลี่ยน เช่น concurrency, race conditions
4. ตรวจสอบการอ่าน/เขียนไฟล์ที่ไม่มี lock / atomic


### Concurrency Deep Checks

> Goal: เข้าใจ concurrency patterns ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ concurrency structure
2. ระบุ async patterns, concurrency primitives (Promise.all, Promise.race, AbortController), worker setup, shared state mechanisms ที่ใช้
3. ถ้า project ไม่มี async operations → stop และ report


> Goal: ครอบคลุมทุก concurrency dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ concurrency patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้




## Rules

### 1. Severity Classification

- Critical: no timeout/retries บน critical external call, no fallback สำหรับ critical dependency, single point of failure บน critical service โดยไม่มี redundancy, no backup/restore สำหรับ critical data, no health check บน critical path, missing circuit breaker ที่ก่อให้เกิด cascade failure, data loss จาก failure ที่ไม่มี recovery
- High: missing retry, missing timeout, missing fallback, missing circuit breaker, missing health check, missing backup, missing idempotency, missing graceful degradation, missing queue/DLQ
- Medium: suboptimal retry/backoff, partial health check, missing runbook, minor backup gaps, missing monitoring บน non-critical path
- Low: cosmetic, documentation gap, minor naming improvement

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ dependency, retry config, timeout value, endpoint, config file ที่เกี่ยวข้อง
- ใช้ output จาก `/scan-codebase`, `/review-codebase`, `/deep-validate` เป็น evidence
- ไม่เดา ใช้ tools สำหรับ verification

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code หรือ config ระหว่าง review
- ไม่ apply fixes, ไม่ลบ, ไม่ merge, ไม่ย้ายเนื้อหาใน review reference นี้
- ถ้าต้องการแก้ไข ให้ทำ `/review-reliability` หรือ `/resolve-errors` หลัง review

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`
- ใช้ heading levels สำหรับ structure
- ใช้ backticks สำหรับ `tools`, `commands`, file paths, skill references

### 1. Scope

- ไม่ review deployment / CI/CD — ใช้ `/review-codebase`
- ไม่ review debugging practices — ใช้ `/review-codebase`

### 2. Severity

- Critical: no monitoring on critical path, missing alert for critical metric, secrets in logs, no trace context propagation
- High: missing key metric, alert fatigue, no runbook, missing trace sampling
- Medium: inconsistent log format, missing log correlation, dashboard gap
- Low: minor metric naming, cosmetic dashboard improvement

### 3. Evidence

- ทุก finding ต้องมี config file หรือ dashboard link
- ระบุ metric / log / trace / audit event ที่ขาด

### 4. Review Independence

- เป็นการ review เท่านั้น ไม่แก้ไข code หรือ config โดยตรง
- ไม่เปลี่ยนแปลง environment หรือ production settings
- ทุก finding ต้องเป็น objective และมี evidence สนับสนุน

### 5. Formatting

- ห้ามใช้ bold markers
- ใช้ backticks สำหรับ `tools`, `commands`, `paths` และ skill references
- รายงานเป็นตารางด้วย `/report-table`
- ห้ามใช้ placeholder หรือ generic filler


*Some details from merged source skills were condensed to keep the skill under 250 lines.*
