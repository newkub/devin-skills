---
name: review-reliability
description: Review reliability: observability, disaster recovery, rate limiting, predictability, concurrency
allowed-tools:
  - ask_user_question
  - edit
  - exec
  - glob
  - grep
  - read
triggers:
  - user
  - model
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

ตรวจสอบ reliability, resilience และ recoverability ครอบคลุม failure points, retries, timeouts, circuit breakers, fallback, backup/restore และ health checks พร้อมคะแนน review

## Scope

- ครอบคลุม single points of failure, graceful degradation, redundancy, load balancing
- ครอบคลุม timeout, retry, idempotency, circuit breaker, bulkhead, backpressure
- ครอบคลุม fallback, queue/DLQ, transaction safety, migration safety, restart policies
- ครอบคลุม health checks, readiness/liveness probes
- ครอบคลุม observability, monitoring, alerts, SLOs, dashboards, traces, logs
- ครอบคลุม rate limiting, throttling, backoff
- ครอบคลุม predictability: random, seed, timestamps, global state, concurrency
- ไม่ครอบคลุม `review-infrastructure`, `review-security`, `review-quality`

## Execute

### 1. Prepare and Scan

> Goal: เข้าใจ dependencies, critical paths และ reliability controls

1. ทำ `/scan-codebase` เพื่อหา failure points, retry config, timeout config, circuit breaker, fallback, health checks
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่มเติม
3. ระบุ dependencies สำคัญ: database, cache, message broker, external APIs, third-party services
4. ถ้าไม่พบ reliability concerns → stop และ report

### 2. Failure Points and Redundancy Review

> Goal: ระบุจุดเสี่ยงและ single points of failure

1. ตรวจสอบ dependencies ภายในและภายนอก: database, cache, queue, external APIs, file system
2. ตรวจสอบ redundancy, replication, multi-zone/multi-region
3. ตรวจสอบ graceful degradation: ระบบยังทำงานบางส่วนได้เมื่อ dependency ล้ม
4. ระบุ dependencies ที่ไม่มี fallback หรือ redundancy

### 3. Retries, Timeouts and Idempotency Review

> Goal: ลดผลกระทบจาก transient failures

1. ตรวจสอบ timeout บน external calls: default timeout, connect vs read timeout
2. ตรวจสอบ retry policy: max retries, conditions, exponential backoff, jitter, retry budget
3. ตรวจสอบ idempotency สำหรับ retries และ duplicate requests
4. ตรวจสอบความปลอดภัยของ retry บน non-idempotent operations

### 4. Circuit Breakers and Resilience Review

> Goal: ป้องกัน cascade failure และรับมือ overload

1. ตรวจสอบ circuit breaker: failure threshold, half-open state, recovery
2. ตรวจสอบ bulkhead / resource isolation: thread pools, semaphores, connection limits
3. ตรวจสอบ rate limiting, throttling: per-route, per-user, per-IP, headers, 429 handling
4. ตรวจสอบ load balancing, queue, backpressure, concurrency limits, DLQ
5. ระบุ dependencies ที่ไม่มี circuit breaker หรือ isolation

### 5. Fallback and Graceful Degradation Review

> Goal: ระบบยังทำงานได้เมื่อ dependency ล้ม

1. ตรวจสอบ fallback: default value, cached data, cached response
2. ตรวจสอบ graceful degradation: ปิด feature บางส่วน, ลด functionality, แสดงข้อความ users
3. ตรวจสอบ queue/worker fallback: dead letter queue, error recovery, replay
4. ตรวจสอบ feature flags หรือ toggles สำหรับ degraded mode
5. ระบุ critical paths ที่ไม่มี fallback

### 6. Observability and Disaster Recovery Review

> Goal: ตรวจสอบ observability และ DR

1. ตรวจสอบ metrics, logs, traces, alerts, dashboards, SLOs, telemetry, auditability
2. ระบุ tools: `Prometheus`, `Grafana`, `OpenTelemetry`, `Datadog`, `Sentry`
3. ตรวจสอบ DR plan, RPO/RTO, backup/restore, runbooks, incident response
4. ถ้าไม่พบ DR setup → บันทึก finding Critical

### 7. Rate Limiting and Predictability Review

> Goal: ตรวจสอบ rate limiting และ predictability

1. ตรวจสอบ rate limit config: window, threshold, per-route vs global, per-IP vs per-user
2. ตรวจสอบ rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`
3. ตรวจสอบ 429 handling, distributed rate limiting, race condition prevention
4. ตรวจสอบ random/seed, timestamps, UUID, global/shared mutable state
5. ตรวจสอบลำดับการทำงานที่อาจเปลี่ยน: concurrency, race conditions

### 8. Concurrency Review

> Goal: ตรวจสอบ concurrency patterns

1. ระบุ async patterns, primitives: `Promise.all`, `Promise.race`, `AbortController`
2. ตรวจสอบ shared state mechanisms, worker setup, locks, atomic operations
3. ตรวจสอบ file I/O ที่ไม่มี lock/atomic
4. ถ้า project ไม่มี async operations → ข้าม step นี้

### 9. Validate and Report

> Goal: สรุป findings พร้อมคะแนนและส่งต่อ action ถัดไป

1. ทำ `/validate` สำหรับ findings ทุกรายการ
2. จัดลำดับ severity: Critical → High → Medium → Low → Info
3. คำนวณ review score เป็น percentage ต่อ dimension และ overall
4. ทำ `/report` พร้อม `/report-table` และ `/suggest-next-action`

## Rules

### 1. Severity

- Critical: no timeout/retries บน critical external call, no fallback สำหรับ critical dependency, SPOF โดยไม่มี redundancy, no backup/restore, no health check บน critical path, missing circuit breaker ที่ก่อให้เกิด cascade failure, data loss จาก failure ที่ไม่มี recovery
- High: missing retry, missing timeout, missing fallback, missing circuit breaker, missing health check, missing backup, missing idempotency, missing graceful degradation, missing queue/DLQ
- Medium: suboptimal retry/backoff, partial health check, missing runbook, minor backup gaps, missing monitoring บน non-critical path
- Low: cosmetic, documentation gap, minor naming improvement

### 2. Evidence

- ทุก finding ต้องมี file path, line number
- ระบุ dependency, retry config, timeout value, endpoint, config file ที่เกี่ยวข้อง
- ใช้ output จาก `/scan-codebase`, `/review-codebase`, `/deep-validate` เป็น evidence
- ไม่เดา ใช้ tools สำหรับ verification

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code หรือ config ระหว่าง review
- ไม่ apply fixes, ไม่ลบ, ไม่ merge, ไม่ย้ายเนื้อหาใน review reference นี้
- ถ้าต้องการแก้ไข ให้ทำ `/review-reliability` หรือ `/resolve-errors` หลัง review

### 4. Scope

- ไม่ review deployment / CI/CD — ใช้ `/review-infrastructure`
- ไม่ review security controls — ใช้ `/review-security`
- ไม่ review code quality — ใช้ `/review-quality`

### 5. Formatting

- ห้ามใช้ double-asterisk markers สำหรับเน้นข้อความ — ใช้ backticks สำหรับ `tools`, `commands`, paths และ skill references
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

### 6. Health Score

- คำนวณ review score เป็น percentage (0-100)
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after

## Expected Outcome

- รายงาน reliability findings พร้อม evidence, severity, dependency/config
- คะแนน review ต่อ dimension: SPOF, retries, circuit breakers, fallback, observability, rate limiting, predictability, concurrency
- คะแนน overall reliability score
- ตารางสรุป findings ด้วย `/report-table`
- ข้อเสนอแนะ action ถัดไป

*Merged from source review-* skills.*