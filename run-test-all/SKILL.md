---
name: run-test-all
description: รัน test suites ทั้งหมดตั้งแต่ unit, integration, e2e, api จนถึง coverage
related:
  - run-test
  - run-test-unit
  - run-test-integration
  - run-test-e2e
  - run-test-api
  - run-test-coverage
  - deep-validate
  - report-table
---

## Goal

รัน test suite ทั้งหมดแบบครบวงจร ตั้งแต่ unit จนถึง coverage โดยเรียกใช้แต่ละ `run-test-*` skill ตามลำดับ

## Scope

ใช้เมื่อต้องการรัน tests ทุกประเภทที่ project รองรับ ไม่แก้ source หรือ test โดยอัตโนมัติ

## Execute

### 1. Run Unit Tests

> Goal: รัน unit tests เป็นพื้นฐาน

1. ทำ `/run-test-unit`
2. บันทึกผลลัพธ์, duration, รายการ tests ที่ fail
3. ถ้ามี fail → บันทึกไว้และ continue ไป suite ถัดไป

### 2. Run Integration Tests

> Goal: รัน integration tests สำหรับ module interactions

1. ถ้า project มี integration tests หรือ config สำหรับ integration → ทำ `/run-test-integration`
2. บันทึกผลลัพธ์, duration, รายการ tests ที่ fail
3. ถ้ามี fail → บันทึกไว้และ continue ไป suite ถัดไป

### 3. Run E2E Tests

> Goal: รัน E2E tests ถ้ามี web frontend

1. ถ้า project มี web frontend, `playwright.config.ts`, `cypress.config.ts`, หรือ `tests/e2e/` → ทำ `/run-test-e2e`
2. บันทึกผลลัพธ์, duration, รายการ tests ที่ fail
3. ถ้ามี fail → บันทึกไว้และ continue ไป suite ถัดไป

### 4. Run API Tests

> Goal: รัน API tests ถ้ามี API endpoints

1. ถ้า project มี API endpoints หรือ API tests → ทำ `/run-test-api`
2. บันทึกผลลัพธ์, duration, รายการ tests ที่ fail
3. ถ้ามี fail → บันทึกไว้และ continue ไป suite ถัดไป

### 5. Run Coverage Analysis

> Goal: ตรวจสอบ coverage รวม

1. ทำ `/run-test-coverage`
2. บันทึก coverage metrics ทุก category
3. ถ้า coverage ไม่ถึงเป้า → ระบุ gaps แต่ไม่แก้ให้ผ่านอัตโนมัติ

### 6. Validate And Classify Failures

> Goal: ตรวจสอบและจำแนก failures

1. ถ้ามี test fail → ทำ `/deep-validate` กับ source ที่เกี่ยวข้อง
2. ทำ `/run-test` กับ test files เพื่อตรวจ test quality
3. จำแนก: source ผิด, test ผิด, หรือไม่ชัดเจน
4. ถ้าไม่ชัด → ทำ `/deep-review` แล้ว report

### 7. Report

> Goal: สรุปผลรวมทุก test suite

1. ใช้ `/report-table` สรุปผลแต่ละ suite: pass/fail, duration, fail count
2. ระบุ action items ตาม classification
3. ทำ `/suggest-next-action`

## Rules

### 1. Execution Order

- รัน tests ตามลำดับ unit → integration → e2e → api → coverage
- เก็บผลลัพธ์ของทุก suite ก่อน report
- ไม่หยุดทันทีเมื่อเจอ fail ยกเว้น environment เสียหาย

### 2. Conditional Running

- รันเฉพาะ test types ที่ project รองรับ
- ถ้าไม่แน่ใจว่ามี test type ใด → ตรวจสอบ config files หรือถาม user
- ไม่รันทุก type โดยไม่จำเป็น

### 3. No Auto Fix

- ห้ามแก้ source หรือ test โดยไม่มี evidence
- ถ้า fail → validate/review ก่อน
- ห้ามลด coverage target เพื่อให้ผ่าน

### 4. Reporting

- รายงานผลรวมทุก suite ใน table เดียว
- ระบุ priority ของ fail
- แยก source issue กับ test issue ชัดเจน

## Expected Outcome

- Unit, integration, e2e, api tests (ถ้ามี) ถูกรัน
- Coverage ถูกวิเคราะห์
- Failures ถูก validate/review และจำแนก
- รายงานผลรวมทุก suite ชัดเจน
- ไม่มีการแก้ไขโดยไม่มี evidence
