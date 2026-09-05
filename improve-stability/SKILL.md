---
name: improve-stability
description: แก้ไข stability findings ด้าน error handling, recovery, monitoring, debuggability
argument-hint: "[target-or-scope]"
related:
  - review-stability
  - run-test
  - run-verify
  - report-table
  - suggest-next-action
---

## Goal

แก้ไข stability findings จาก `/review-stability` ให้ระบบทำงานเสถียร, recover ได้, debug ง่าย, และ monitor ได้

## Scope

ใช้กับ code, services, workflows ที่มี findings ด้าน error handling, recovery, monitoring, logging, alerting, debuggability — ไม่รวม business logic หรือ performance (ใช้ `/improve-business`, `/optimize-*` แทน)

## Execute

### 1. Review Findings

> Goal: เข้าใจ stability findings

1. อ่าน report จาก `/review-stability`
2. จัดลำดับตาม severity และ impact
3. แยกประเภท: error handling, recovery, monitoring, logging, alerting, debuggability
4. ระบุ critical paths ที่อาจล่ม

### 2. Improve Error Handling

> Goal: จัดการ errors อย่างเหมาะสม

1. แก้ catch-all `try/catch` ที่ซ่อน bugs
2. เพิ่ม specific error classes/types
3. ใช้ early returns และ guard clauses
4. ตรวจว่า errors ไม่รั่วไปยัง user โดยไม่ได้ตั้งใจ

### 3. Improve Recovery

> Goal: ระบบ recover ได้เมื่อเกิด failure

1. เพิ่ม retry logic พร้อม exponential backoff
2. เพิ่ม circuit breaker ถ้าจำเป็น
3. เพิ่ม graceful degradation
4. ระบุ fallback สำหรับ external services

### 4. Improve Monitoring And Alerting

> Goal: รู้เมื่อระบบมีปัญหา

1. เพิ่ม structured logging สำหรับ critical paths
2. เพิ่ม metrics: error rate, latency, availability
3. เพิ่ม alerts สำหรับ conditions ที่สำคัญ
4. เชื่อมกับ observability stack ของ project

### 5. Improve Debuggability

> Goal: หา root cause ได้เร็ว

1. เพิ่ม correlation IDs
2. ปรับปรุง error messages ให้บอกสาเหตุและ context
3. เพิ่ม stack traces หรือ breadcrumbs ที่เหมาะสม
4. ตรวจ log levels ให้ถูกต้อง

### 6. Add Resilience Patterns

> Goal: ลด single points of failure

1. เพิ่ม timeouts สำหรับ external calls
2. ใช้ bulkhead หรือ isolation ถ้าจำเป็น
3. จัดการ rate limits
4. ทดสอบ failure scenarios

### 7. Validate Stability

> Goal: ยืนยันว่า fixes ทำงาน

1. รัน `run-test`
2. รัน `run-verify`
3. ทดสอบ error/edge scenarios ด้วย integration tests ถ้ามี
4. ทำ chaos/failure tests ถ้าเหมาะสม

### 8. Report And Monitor

> Goal: สรุปผลและติดตามต่อ

1. ทำ `/report-table` สรุป fixes
2. ทำ `/review-stability` อีกครั้งเพื่อ verify
3. ทำ `/suggest-next-action`

## Rules

### 1. Fail Fast, Recover Gracefully

- ระบุข้อผิดพลาดชัดเจน ไม่ปิดบัง
- recover โดยไม่ทำให้ state เสียหาย

### 2. Observability First

- ทุก critical path ต้อง log/metric ได้
- ทุก error ต้อง trace ได้

### 3. Minimal Change

- แก้เฉพาะ findings ทีระบุ
- ไม่ over-engineer resilience

### 4. Safety

- ไม่ลบ error handling ที่มีอยู่เพื่อให้ code สะอาด
- ไม่เปลี่ยน public API โดยไม่ migration

## Expected Outcome

- Error handling ครอบคลุม critical paths
- Recovery และ monitoring ทำงานได้
- `run-test` และ `run-verify` ผ่าน
- `/review-stability` ไม่พบ issues เดิม
- รายงาน fixes พร้อม next action
