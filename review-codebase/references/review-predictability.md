---
name: review-predictability
description: Review predictable behavior, determinism, and idempotency of the codebase
---


## Goal

Review predictability ของ project ครอบคลุม predictable behavior, determinism, และ idempotency พร้อม review score

## Scope

ใช้สำหรับ review predictability ใน project หรือ workspace ที่ต้องการตรวจสอบ: predictable behavior, determinism, idempotency, side effects, flaky tests, unstable ordering, non-deterministic operations

## Execute

### 1. Prepare and Scan

> Goal: เข้าใจสถานะปัจจุบันของ predictability

1. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ระบุ global state, random/seed, timestamps, UUID, file I/O, external services
4. ถ้าไม่พบ issues -> stop และ report

### 2. Review Predictable Behavior

> Goal: ตรวจสอบว่าโค้ดมีพฤติกรรมที่คาดการณ์ได้

1. ตรวจสอบ seed / initialization ของ random, UUID, timestamp
2. ตรวจสอบการใช้ global state หรือ shared mutable state
3. ตรวจสอบลำดับการทำงานที่อาจเปลี่ยน เช่น concurrency, race conditions
4. ตรวจสอบการอ่าน/เขียนไฟล์ที่ไม่มี lock / atomic
5. ตรวจสอบการพึ่งพา environment variables หรือเวลาที่ไม่คงที่
6. ตรวจสอบ error handling ที่ทำให้ผลลัพธ์เปลี่ยนไป
7. สรุป findings พร้อม file path และ line number

### 3. Review Determinism

> Goal: ตรวจสอบว่ารันใหม่ด้วย input เดิมได้ผลเหมือนเดิม

1. ตรวจสอบ pure function vs side effects
2. ตรวจสอบว่า output ไม่ขึ้นกับ external service หรือ state ที่ไม่ควบคุม
3. ตรวจสอบ flaky tests ที่ผลเปลี่ยนแปลง
4. ตรวจสอบการใช้ hash/map/dict iteration ที่ไม่เรียงลำดับ
5. ตรวจสอบ floating point ที่ไม่ deterministic
6. บันทึก findings พร้อม evidence

### 4. Review Idempotency

> Goal: ตรวจสอบว่ารันซ้ำด้วย state เดิมได้ผลเดิมและไม่เกิด side effects ซ้ำ

1. ตรวจสอบ API / operations ที่ควร idempotent เช่น create, update, delete, migrate
2. ตรวจสอบ duplicate insert / double submit
3. ตรวจสอบ script / migration ที่รันซ้ำได้หรือไม่
4. ตรวจสอบ side effects ซ้ำ เช่น write file, send event, publish message
5. ตรวจสอบ retry logic ที่อาจประมวลผลซ้ำ
6. ระบุ operations ที่ไม่ idempotent พร้อม recommendation

### 5. Validate and Report

> Goal: ยืนยันการ review ครบถ้วนและรายงานผล

1. ทำ `/validate` หรือ `/run-check` สำหรับ findings
2. จัดลำดับตาม severity: Critical -> High -> Medium -> Low
3. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) -> weighted average
4. ทำ `/report` พร้อม `/report-table`
5. ถ้าพบปัญหา -> ระบุ priority และแนะนำ `/improve-predictability`
6. ถ้าไม่พบ issues -> report ตาม evidence
7. ทำ `/suggest-next-action`

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไขหรือลบ code
- ไม่ลบไฟล์, ไม่ลบ logic, ไม่ลบ test
- ถ้าจำเป็นต้องแก้ไข code -> ขออนุญาตก่อนหรือ stop และ `/ask-me`

### 2. Minimal Changes

- ใช้ minimal changes ถ้าได้รับอนุญาตให้แก้ไข
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ -> stop และ `/ask-me`

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ function, operation, หรือ test ที่เกี่ยวข้อง
- ไม่อ้างอิงผลที่ยังไม่ตรวจสอบ

### 4. Determinism Criteria

- ระบุ random/seed ที่ไม่ควบคุม
- ระบุ global/shared mutable state
- ระบุ flaky tests หรือ output ที่เปลี่ยนแปลง
- ระบุ dependency ที่ไม่คงที่ เช่น time, filesystem, network

### 5. Idempotency Criteria

- ระบุ operation ที่รันซ้ำแล้วเกิด side effects ซ้ำ
- ระบุ migration / script ที่ไม่มี guard กับการรันซ้ำ
- ระบุ retry logic ที่ทำให้ duplicate processing
- ระบุ API ที่ไม่ idempotent

## Expected Outcome

- รายงาน predictability issues ครอบคลุม predictable behavior, determinism, idempotency
- Review score ต่อ dimension และ overall
- ไม่มีการลบหรือแก้ไข code โดยไม่จำเป็น
- ระบุ priority และแนะนำ next action
