---
name: improve-reliability
description: ปรับปรุง reliability, predictability, resilience, observability, และ recoverability ของ project
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - follow-best-practice
  - learn-from-web
  - improve-correctness
  - improve-resilience
  - improve-security
  - validate
  - resolve-errors
  - suggest-next-action
---

## Goal

ปรับปรุงระบบให้ทำงานเสถียร, predictable, resilient, observable, และ recoverable ขึ้น

## Scope

ใช้กับ project หรือ workspace ที่ต้องการปรับปรุง reliability, predictability, resilience, observability, telemetry, auditability, และ disaster recovery

## Execute

### 1. Analyze
> Goal: วิเคราะห์สถานะปัจจุบันและจุดเสี่ยง
1. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ระบุ failure points, retry policy, circuit breaker, fallback, backup/restore, observability gaps, และ non-deterministic behavior
4. ถ้าไม่พบ issues → stop และ report

### 2. Improve Predictability
> Goal: ทำให้ระบบ deterministic และคาดการณ์ได้
1. หา sources ของ non-determinism: time, randomness, external state, uninitialized variables
2. ใช้ dependency injection สำหรับ `Date`, `Math.random`, environment variables
3. ทำให้ functions pure เมื่องปลอดภัย
4. ลบ race conditions และทำให้ execution order ชัดเจน

### 3. Improve Reliability
> Goal: ลดความล้มเหลวและผลกระทบ
1. ลบ single points of failure ด้วย redundancy หรือ graceful degradation
2. เพิ่ม timeout, retries, และ idempotency
3. ตรวจสอบ health checks, readiness, liveness probes
4. ใช้ `/follow-best-practice` หรือ `/learn-from-web` หา best practices เฉพาะ runtime
5. ใช้ `/improve-correctness` หรือ `/validate` เพื่อลด bugs

### 4. Improve Resilience
> Goal: รับมือ failure โดยไม่ทำระบบล้มทั้งหมด
1. ใช้ circuit breaker, bulkhead, หรือ retry with exponential backoff
2. เพิ่ม fallback/default behavior สำหรับ dependency สำคัญ
3. ตรวจสอบ rate-limiting, load balancing, queue, backpressure
4. ใช้ `/improve-resilience` ถ้า load หรือ rate เป็นปัญหา

### 5. Improve Observability
> Goal: มองเห็นระบบและตรวจสอบย้อนหลังได้
1. ตรวจสอบ log levels, structured logging, correlation IDs — ลด noise, เพิ่ม context
2. ระบุ metrics สำคัญ: latency, throughput, errors, resource usage; เพิ่ม dashboards, alerts, SLOs ถ้าขาด
3. ตรวจสอบ distributed tracing: trace IDs, spans, baggage; เพิ่ม instrumentation สำหรับ critical paths
4. ระบุ events ที่ต้อง audit: user actions, data changes, security events; ตรวจสอบ timestamp, actor, action, result
5. ใช้ `/improve-security` ถ้าพบ sensitive data logging

### 6. Improve Disaster Recovery
> Goal: ฟื้นตัวกลับมาเร็วหลังเกิด failure
1. ตรวจสอบ backup/restore procedures, database transaction, migration safety
2. เพิ่ม self-healing, restart policies, หรือ automated recovery ถ้าเหมาะสม
3. บันทึก runbook หรือ incident response steps ลง `docs/runbooks/`
4. ทดสอบ recovery procedures ด้วย drills หรือ chaos tests เมื่องปลอดภัย

### 7. Validate
> Goal: ยืนยันว่าปรับปรุงแล้วดีขึ้น
1. ทำ `/validate` หรือ `/run-check`
2. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)
3. ทำ `/suggest-next-action`

## Rules

### 1. Minimal Changes
- ใช้ minimal changes
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ → stop และ `/ask-me`

### 2. Fail Fast And Deterministic
- ตรวจ context, references, และ non-determinism ให้เร็วที่สุด
- ทุก recoverable failure ต้องมี retry limit (max 3 → stop/report)

### 3. Safety
- ทำ dry run ก่อน destructive changes กับ backups, migrations, หรือ policies
- ไม่แก้ security policies, credentials, หรือ compliance controls โดยไม่รายงาน

## Expected Outcome
- reliability, predictability, resilience, observability, recoverability ดีขึ้นตาม criteria
- ไม่มี regression
- รายงานสรุปผล
