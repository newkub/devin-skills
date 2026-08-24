---
name: improve-reliability
description: ปรับปรุง reliability, resilience และ recoverability ของ project
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
  - improve-codebase
---

## Goal

ปรับปรุงระบบให้ทำงานเสถียร รับมือความล้มเหลวได้ดีขึ้น และฟื้นตัวกลับมาได้เร็ว

## Scope

ใช้กับ project หรือ workspace ที่ต้องการปรับปรุง reliability, resilience, หรือ recoverability

## Execute

### 1. Analyze
> Goal: วิเคราะห์สถานะปัจจุบันและจุดเสี่ยง
1. ทำ /scan-codebase เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ /review-codebase เพื่อรายละเอียดเพิ่ม
3. ระบุ failure points, retry policy, circuit breaker, fallback, backup/restore และ monitoring
4. ถ้าไม่พบ issues -> stop และ report

### 2. Improve Reliability
> Goal: ลดความล้มเหลวและผลกระทบ
1. ลบ single points of failure ด้วย redundancy หรือ graceful degradation
2. เพิ่ม timeout, retries, และ idempotency
3. ใช้ /review-correctness หรือ /validate เพื่อลด bugs
4. ตรวจสอบ health checks, readiness, liveness probes
5. ใช้ /follow-best-practice หรือ /learn-from-web หา best practices เฉพาะ runtime

### 3. Improve Resilience
> Goal: รับมือ failure โดยไม่ทำระบบล้มทั้งหมด
1. ใช้ circuit breaker, bulkhead, หรือ retry with exponential backoff
2. เพิ่ม fallback/default behavior สำหรับ dependency สำคัญ
3. ตรวจสอบ rate-limiting, load balancing, queue, backpressure
4. ใช้ /review-rate-limiting ถ้า load หรือ rate เป็นปัญหา

### 4. Improve Recoverability
> Goal: ฟื้นตัวกลับมาเร็วหลังเกิด failure
1. ใช้ /review-disaster-recovery หรือ /improve-backup สำหรับ backup/restore
2. ตรวจสอบ rollback procedures, database transaction, migration safety
3. เพิ่ม self-healing, restart policies, หรือ automated recovery
4. บันทึก runbook หรือ incident response steps ลง `docs/runbooks/`

### 5. Validate
> Goal: ยืนยันว่าปรับปรุงแล้วดีขึ้น
1. ทำ /validate หรือ /run-check
2. ถ้าไม่ผ่าน -> ทำ /resolve-errors แล้ว retry (max 3)
3. ทำ /suggest-next-action

## Rules
### 1. Minimal Changes
- ใช้ minimal changes
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ -> stop และ /ask-me

## Expected Outcome
- reliability, resilience, recoverability ดีขึ้นตาม criteria
- ไม่มี regression
- รายงานสรุปผล
