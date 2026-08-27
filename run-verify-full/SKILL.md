---
name: run-verify-full
description: รัน verify แบบครบวงจร ครอบคลุมทุก test suite, build และ run all tasks
related:
  - run-verify-fast
  - run-task-all
  - run-test-all
  - run-test-unit
  - run-test-integration
  - run-test-e2e
  - run-test-api
  - run-test-coverage
  - run-scan
  - run-lint
  - run-typecheck
  - run-build
---

## Goal

รัน verify แบบครบวงจร ตั้งแต่ code quality checks, tests ทุกประเภท, build จนถึงการรัน pending tasks ทั้งหมด

## Scope

ใช้เมื่อต้องการตรวจสอบโปรเจกต์แบบเต็มรูปแบบก่อน ship, deploy, หรือ merge สำคัญ
ไม่แก้ source หรือ test โดยอัตโนมัติ

## Execute

### 1. Setup Tasks

> Goal: ตั้งค่า scripts และ config ก่อนรัน verify

1. ทำ `/follow-tasks` เพื่อตั้งค่า scripts มาตรฐานใน package manifest
2. ถ้า project ยังไม่มี verify script ให้สร้างตามมาตรฐาน
3. ทำ `/review-delivery` เพื่อตั้งค่า config files ตาม dependencies
4. ทำ `/follow-gitignore` เพื่อตั้งค่า gitignore

### 2. Run Fast Verify

> Goal: เริ่มต้นด้วยการ verify แบบเร็ว

1. ทำ `/run-verify-fast` เพื่อตรวจ scan, lint, typecheck, unit test และ build
2. ถ้า fail → ทำ `/resolve-errors` แล้ว retry (max 3)

### 3. Run All Test Suites

> Goal: รัน test suite ทั้งหมด

1. ทำ `/run-test-all` เพื่อรัน unit, integration, e2e, api, coverage ตาม project
2. บันทึกผลลัพธ์, duration, รายการ tests ที่ fail
3. ถ้า fail → เก็บ errors แล้ว continue ไป validate

### 4. Validate And Classify Failures

> Goal: ตรวจสอบและจำแนก failures

1. ถ้ามี test fail → ทำ `/deep-validate` กับ source ที่เกี่ยวข้อง
2. ทำ `/run-test` กับ test files เพื่อตรวจ test quality
3. จำแนก: source ผิด, test ผิด, หรือไม่ชัดเจน
4. ถ้าไม่ชัด → ทำ `/deep-review` แล้ว report

### 5. Run Build

> Goal: รัน build เพื่อสร้าง production-ready artifacts

1. ทำ `/run-build` เพื่อสร้าง production-ready artifacts
2. ถ้า build errors ให้ทำ `/resolve-errors` แล้วรันซ้ำ — retry max 3

### 6. Run All Tasks

> Goal: รันงานที่ค้างอยู่ทั้งหมด

1. ทำ `/run-task-all` เพื่อรัน pending tasks ทั้งหมดจากคิว
2. บันทึกผลลัพธ์และสถานะงาน
3. ถ้ามีงาน fail → ทำ `/resolve-errors` แล้ว retry (max 3)

### 7. Report

> Goal: สรุปผลรวม verify full

1. ใช้ `/report-table` สรุปผลแต่ละขั้นตอน
2. ระบุ action items ตาม classification
3. ทำ `/suggest-next-action`

## Rules

### 1. Execution Order

- รันตามลำดับ: fast verify → all tests → validate → build → all tasks
- เก็บผลลัพธ์ทุก step ก่อน report
- ไม่หยุดทันทีเมื่อเจอ fail ยกเว้น step ที่ทำให้ environment เสียหาย

### 2. No Auto Fix

- ห้ามแก้ source หรือ test โดยไม่มี evidence
- ถ้า fail → validate/review ก่อน
- ห้ามลด coverage target เพื่อให้ผ่าน

### 3. Build Required

- ต้องรัน build ให้สำเร็จก่อนสิ้นสุด
- build artifacts ต้อง valid
- ถ้า build fail → resolve ก่อน continue

### 4. Run All Tasks

- ใช้ `/run-task-all` เฉพาะเมื่อมี pending tasks
- ถ้าไม่มี queue ให้ skip และระบุใน report

## Expected Outcome

- Code ผ่าน scan, lint, typecheck และทุก test suite
- ไม่มี scan, typecheck, lint, หรือ test errors
- Build สำเร็จ ไม่มี build errors
- Pending tasks ถูกรันหรือระบุสาเหตุที่ skip
- รายงานผลรวมทุก step ชัดเจน
- ไม่มีการแก้ไขโดยไม่มี evidence
