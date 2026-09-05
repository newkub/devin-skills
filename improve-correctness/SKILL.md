---
name: improve-correctness
description: แก้ไขความถูกต้องของ code จาก findings ของ `/review-correctness`
argument-hint: "[target-or-scope]"
related:
  - review-correctness
  - review-quality
  - review-test
  - run-test
  - run-verify
  - use-astgrep
  - resolve-errors
  - refactor
  - report-table
  - suggest-next-action
  - ask-me
---

## Goal

แก้ไขความถูกต้องของ implementation ตาม findings จาก `/review-correctness` ครอบคลุม logic, types, edge cases, contracts, concurrency, และ tests

## Scope

ใช้กับ code, configuration, และ tests ที่มี findings ด้าน correctness จาก `/review-correctness` — ไม่รวม security, performance, UX/UI (ใช้ `/improve-security`, `/optimize-*`, `/improve-uxui` แทน)

## Execute

### 1. Review Findings

> Goal: เข้าใจ findings ก่อนแก้

1. อ่าน report จาก `/review-correctness`
2. จัดลำดับตาม severity: Critical → High → Medium → Low
3. แยกประเภท: logic, types, edge cases, contracts, concurrency, tests
4. ระบุ file path, line number, และ reproduction ถ้ามี

### 2. Fix Logic Errors

> Goal: แก้ logic ให้ตรงกับ requirements

1. เปรียบเทียบ expected vs actual behavior
2. แก้ control flow, calculations, transformations
3. เพิ่ม/แก้ boundary checks และ invariants
4. รัน `run-test` หรือ `run-verify` เพื่อยืนยัน

### 3. Fix Type Issues

> Goal: ปรับปรุง type safety

1. แก้ unsafe type assertions (`as`, `!` ที่ไม่จำเป็น)
2. เพิ่ม narrowing, guards, generic constraints
3. ตรวจ `tsc` หรือ typecheck ของ project
4. รัน `run-verify` เพื่อยืนยัน

### 4. Fix Edge Cases

> Goal: จัดการ edge cases ที่ขาด

1. ระบุ inputs ที่เป็น null, undefined, empty, หรือ extreme values
2. เพิ่ม guard clauses หรือ validation
3. เพิ่ม tests สำหรับ edge cases
4. ตรวจว่า existing tests ยังผ่าน

### 5. Fix Contract Violations

> Goal: ให้ API signatures และ interfaces สอดคล้อง

1. ตรวจ pre/post conditions
2. แก้ API signatures ให้ตรงกับ contracts
3. อัปเดต consumers ที่เรียกใช้
4. รัน tests ของ consumers

### 6. Fix Concurrency Issues

> Goal: แก้ race conditions, ordering, shared state

1. ระบุ critical sections
2. ใช้ locks, atomic operations, หรือ immutable state ตามเหมาะสม
3. แก้ async cancellation / cleanup
4. รัน concurrency tests ถ้ามี

### 7. Fix Test Correctness

> Goal: ให้ tests ตรวจสอบสิ่งที่ต้องการจริง

1. แก้ assertions ที่ผิด
2. ลบ tests ที่ไม่มีประโยชน์หรือ duplicate
3. เพิ่ม tests สำหรับ gaps ที่ review พบ
4. รัน `run-test` และ `run-test-coverage`

### 8. Validate And Report

> Goal: ยืนยันว่า correctness ผ่าน

1. ทำ `/run-verify`
2. ทำ `/run-test`
3. ทำ `/review-correctness` อีกครั้งเพื่อ verify
4. ทำ `/report-table` สรุป fixes
5. ทำ `/suggest-next-action`

## Rules

### 1. Fix Only Findings

- แก้เฉพาะสิ่งที่ `/review-correctness` ระบุ หรือชัดเจนว่าเป็น correctness issue
- ไม่ refactor โครงสร้างใหญ่ ถ้าไม่จำเป็น

### 2. Test First

- ถ้าเป็นไปได้ เขียน/แก้ test ให้ fail ก่อน แล้วค่อย fix
- ทุก fix ควรมี test coverage

### 3. Minimal Change

- แก้ทีละ issue ตาม priority
- ไม่เพิ่ม dependencies ใหม่ถ้าไม่จำเป็น

### 4. Verification

- รัน `run-test` และ `run-verify` หลังแก้
- ถ้ายังมี failures → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง

### 5. No Hidden Assumptions

- ไม่ใช้ `any`, `as`, `!` โดยไม่มีเหตุผล
- ไม่ลบ error handling เพื่อให้ tests ผ่าน

## Expected Outcome

- Logic, types, edge cases, contracts, concurrency, และ tests ถูกต้อง
- `run-test` และ `run-verify` ผ่าน
- `/review-correctness` ไม่พบ issues เดิม
- รายงาน fixes พร้อม evidence และ next action
