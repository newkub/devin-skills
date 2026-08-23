---
name: review-app-stability
description: Review ความเสถียรของ application ครอบคลุม crashes, errors, recovery, monitoring
---

## Goal

Review ความเสถียรของ application เพื่อหา issues เกี่ยวกับ crashes, errors, recovery, monitoring, logging, และ health checks

## Scope

ใช้สำหรับ review ความเสถียรของ app ครอบคลุมกว่าแค่ app crash — รวม error handling, monitoring, logging, health checks, graceful degradation

## Execute

### 1. Identify Stability Concerns

ระบุ areas ที่เกี่ยวข้องกับความเสถียร

> Goal: รู้ว่าต้อง review อะไรบ้าง

1. ทำ `/scan-codebase` เพื่อหา error handling, logging, monitoring, health checks
2. ระบุ files ที่เกี่ยวข้องกับ top-level error boundaries หรือ crash handlers
3. ค้นหา patterns: try-catch, unhandled rejections, global error handlers
4. ค้นหา memory leaks, infinite loops, recursive calls ที่อาจทำให้ crash

### 2. Review Error Handling

ตรวจสอบการจัดการ errors

> Goal: errors ถูกจัดการอย่างถูกต้อง

1. ทำ `/review-codebase` สำหรับ try-catch, error boundaries, unhandled rejections
2. ตรวจสอบว่ามี global error handler หรือไม่
3. ตรวจสอบว่า errors ถูก log ไว้และมี context พอ
4. ระบุ errors ที่ถูก swallow หรือไม่ได้ handle

### 3. Review Crash Boundaries

ตรวจสอบ crash boundaries ของ app

> Goal: app ไม่ crash ทั้งหมดเมื่อส่วนใดส่วนหนึ่งพัง

1. ตรวจสอบ React Error Boundaries, Vue error handlers, หรือ framework equivalent
2. ระบุ components หรือ modules ที่ไม่มี error boundary
3. ตรวจสอบ graceful fallback UI เมื่อ error
4. ตรวจสอบ process-level crash handlers สำหรับ backend/CLI

### 4. Review Monitoring And Logging

ตรวจสอบ observability

> Goal: เห็นปัญหาก่อน user รายงาน

1. ตรวจสอบ logging framework และ log levels
2. ระบุ logs ที่ขาด context หรือ trace ID
3. ตรวจสอบ monitoring, alerts, metrics ถ้ามี
4. ระบุ critical paths ที่ไม่มี logs

### 5. Review Health Checks

ตรวจสอบ health check endpoints และ liveness/readiness

> Goal: ระบบรู้ตัวก่อนจะล่ม

1. ค้นหา health check endpoints `/health`, `/ready`, `/live`
2. ตรวจสอบว่า health checks ตรวจ dependencies จริง เช่น database, queue
3. ระบุ health checks ที่ dummy หรือไม่ตรวจอะไร
4. ตรวจสอบ startup/shutdown hooks

### 6. Review Recovery And Degradation

ตรวจสอบ recovery patterns และ graceful degradation

> Goal: ระบบพังบางส่วนได้โดยไม่หยุดทำงานทั้งหมด

1. ค้นหา retry, circuit breaker, fallback patterns
2. ตรวจสอบ timeout และ backoff strategies
3. ระบุ dependencies ที่ไม่มี fallback
4. ตรวจสอบ queue, dead letter queue, และ error recovery workers

### 7. Check Related Workflows

ใช้ workflows อื่นๆ เพื่อหลีกเลี่ยง duplication

> Goal: ไม่ซ้ำซ้อนกับ review skills อื่น

1. ทำ `/consider-use-in-another-skills` เพื่อหา skills ที่เกี่ยวข้อง
2. ถ้าพบ performance issues ให้ทำ `/review-codebase`
3. ถ้าพบ concurrency issues ให้ทำ `/review-codebase`
4. ถ้าพบ security issues ให้ทำ `/review-codebase`
5. ใช้ `/report-table` เพื่อจัดรูปแบบผลลัพธ์

### 8. Format Report

สรุป findings เป็นรายงาน

> Goal: รายงานชัดเจน พร้อม severity และ recommendations

1. ทำ `/report-table` เพื่อจัดรูปแบบตาราง
2. กำหนด columns: `No`, `Category`, `Issue`, `Severity`, `Location`, `Recommendation`
3. จัดกลุ่มตาม category: Crashes, Errors, Monitoring, Recovery, Health
4. แยก section: Critical, High, Medium, Low

## Rules

### 1. Scope Boundary

- เน้นความเสถียรของ app โดยรวม ไม่ใช่แค่ app crash
- ไม่ซ้ำกับ `/review-codebase`
- ใช้ workflows เหล่านั้นแทนการเขียนซ้ำ

### 2. Stability Criteria

- ระบุ crashes, unhandled exceptions, OOM, infinite loops
- ระบุ error boundaries และ fallback UI
- ระบุ monitoring gaps, missing logs, missing health checks
- ระบุ recovery patterns, retries, circuit breakers

### 3. Output Format

- ระบุ severity ชัดเจน: `critical`, `high`, `medium`, `low`
- ให้ actionable recommendations ทุกรายการ
- ใช้ backticks สำหรับ `files`, `functions`, `commands`

## Expected Outcome

- รายงานความเสถียรของ app ครอบคลุมทุกด้าน
- Crashes, errors, unhandled exceptions ถูกระบุ
- Error boundaries, recovery patterns, health checks ถูกประเมิน
- Severity และ recommendations ชัดเจน
- ไม่ซ้ำซ้อนกับ review skills อื่น
