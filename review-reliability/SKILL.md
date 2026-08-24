---
name: review-reliability
description: Review reliability: failure points, retries, timeouts, circuits, fallback, backup, health checks
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

Review reliability, resilience, และ recoverability ครอบคลุม failure points, retries, timeouts, circuit breakers, fallback, backup/restore, และ health checks พร้อม review score

## Scope

reliability review สำหรับ: single points of failure, graceful degradation, redundancy, timeouts, retries, idempotency, circuit breakers, bulkheads, fallback, rate limiting, load balancing, queue, backpressure, backup/restore, rollback, transaction safety, migration safety, self-healing, restart policies, health checks, readiness/liveness probes

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

### 6. Review Backup, Restore And Recoverability

ตรวจสอบ backup, restore, และ recoverability

> Goal: ฟื้นตัวกลับมาได้เร็วหลังเกิด failure

1. ตรวจสอบ backup/restore procedures: มี automation, schedule, coverage ของ database, files, config, secrets
2. ตรวจสอบ rollback procedures: deployment rollback, database transaction, migration safety
3. ตรวจสอบ point-in-time recovery: snapshots, WAL, binlog, retention policy
4. ตรวจสอบ self-healing, restart policies, automated recovery
5. ตรวจสอบ runbook หรือ incident response steps ใน `docs/runbooks/`
6. ตรวจสอบ RPO/RTO ถ้ามี
7. ระบุข้อมูลหรือ services ที่ไม่มี backup หรือ restore procedure

### 7. Review Health Checks And Monitoring

ตรวจสอบ health checks, readiness, liveness probes, และ monitoring

> Goal: ระบบรู้ตัวก่อนเกิด failure

1. ค้นหา health check endpoints: `/health`, `/ready`, `/live`
2. ตรวจสอบ liveness/readiness probes: ใช้งานถูกต้อง, ไม่ซ่อน dependencies
3. ตรวจสอบว่า health checks ตรวจ dependencies จริง: database, cache, queue, external APIs
4. ตรวจสอบ health checks ที่ dummy หรือไม่ตรวจอะไร
5. ตรวจสอบ startup/shutdown hooks และ graceful shutdown
6. ตรวจสอบ monitoring, alerting, metrics สำหรับ reliability: error rate, retry rate, circuit breaker state, queue depth
7. ระบุ critical paths ที่ไม่มี health checks หรือ monitoring

### 8. Validate Findings

ตรวจสอบความถูกต้องของ findings

> Goal: Findings ถูกต้อง มี evidence ครบ ไม่มี false positive

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ findings จากทุก section
3. ตรวจสอบ false positives และแยกออกจาก report หลัก
4. จัดลำดับ findings ตาม severity: Critical -> High -> Medium -> Low

### 9. Rate And Report

ให้คะแนนและรายงาน findings

> Goal: รายงานชัดเจน พร้อม severity, review score และ action ถัดไป

1. คำนวณ review score: `(Critical=0, High=25, Medium=50, Low=75, Info=100)` -> weighted average
2. ทำ `/report-table` เพื่อรายงาน findings: category, issue, severity, location, recommendation
3. ทำ `/report` พร้อมสรุป findings และ review score
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

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

## Expected Outcome

- รายงาน findings ของ reliability, resilience, recoverability พร้อม file path, line number, severity, และ recommendation
- review score ต่อ dimension และ overall
- ระบุ failure points, retry gaps, timeout gaps, circuit breaker gaps, fallback gaps, backup/restore gaps, health check gaps
- รายงานเป็นตารางผ่าน `/report-table`
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

