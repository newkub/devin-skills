---
name: review-test-result
description: ตรวจสอบผลลัพธ์จากการ run tests, coverage, และ flaky เพื่อสรุป action ถัดไป
related:
  - review-test
  - run-test
  - run-test-coverage
  - update-test
  - follow-test
  - update-devin-global-skills
---

## Goal

Review ผลลัพธ์จากการ run tests (pass/fail, coverage, flaky) แล้วสรุป action ถัดไป พร้อมอัปเดต skill ผ่าน `/update-devin-global-skills` เมื่อพบ gap ทีควรปรับปรุง

## Scope

ใช้หลัง `run-test`, `run-test-coverage`, `write-test`, `follow-tdd`, `update-test`, หรือ `follow-test` เพื่อวิเคราะห์ผลลัพธ์ ไม่ใช่ตอนก่อน run

## Execute

### 1. Capture Test Output

> Goal: เก็บผลลัพธ์จากการ run tests ให้พร้อมวิเคราะห์

1. อ่าน stdout/stderr จาก `run-test` หรือ `run-test-coverage`
2. บันทึกไฟล์ผลลัพธ์: `vitest` → `vitest-output.jsonl`, `cargo test` → `cargo-test-output.txt`
3. ตรวจสอบ exit code: `0` = pass, `non-zero` = fail
4. ถ้ามี coverage report → เก็บไฟล์ `coverage/index.html` หรือ `coverage/coverage-summary.json`

### 2. Classify Failures

> Goal: จัดหมวดหมู่ failures เพื่อ prioritize

1. แยก failures เป็น:
   - `assertion`: test logic ผิดหรือ implementation ผิด
   - `runtime`: exception, timeout, unhandled rejection
   - `flaky`: ผ่านบางครั้ง ไม่ผ่านบางครั้ง โดยไม่มีการเปลี่ยน code
   - `setup`: fixture, mock, database, หรือ environment ผิด
2. ระบุ file path และ test name สำหรับทุก failure
3. ตรวจสอบ stack trace แล้วหา root cause

### 3. Analyze Coverage Delta

> Goal: ตรวจ coverage หลัง run tests

1. เปรียบเทียบ coverage กับ target: Minimal 70%, Standard 85%, Complete 100%
2. ระบุไฟล์ที coverage ลดลง หรือ source files ทีไม่ถูก test
3. ใช้ `jq` อ่าน `coverage/coverage-summary.json` เพื่อดูเปอร์เซ็นต์
4. ระบุ branches/functions/statements ที missing

### 4. Detect Flakiness

> Goal: หา tests ทีไม่เสถียร

1. รัน test ซ้ำ 3 รอบ ถ้า result ไม่ consistent
2. ตรวจสอบ race condition, shared state, async timing, random data
3. ตรวจ `beforeEach`/`afterEach` cleanup
4. ถ้า flaky → คั่นด้วย `tag` และแนะนำให้แก้ก่อน merge

### 5. Decide Actions

> Goal: สรุปว่าต้องทำอะไรต่อ

1. ถ้ามี assertion/implementation failure → แนะนำ `update-test` หรือ `deep-debug`
2. ถ้ามี runtime/setup failure → แนะนำ `resolve-errors` หรือ `follow-config`
3. ถ้ามี coverage gap → แนะนำ `write-test` หรือ `update-test`
4. ถ้ามี flaky → แนะนำ refactor test หรือ `follow-test`
5. ถ้าผลลัพธ์ทำให้รู้ว่า skill/flow ใดควรปรับปรุง → ใช้ `/update-devin-global-skills`

### 6. Update Global Skill (If Needed)

> Goal: ปรับปรุง skill ถ้าพบ systemic test gap

1. ถ้าพบว่า skill ทีใช้ (เช่น `write-test`, `update-test`, `follow-test`) ยังไม่ครอบคลุมกรณีทีเจอ → บันทึก gap
2. รัน� `/update-devin-global-skills <skill-name>` เพื่อ update skill นั้น
3. ทำ `validate` และ `check-reference` หลัง update
4. ไม่ update skill โดยไม่มี evidence จาก test result

### 7. Report

> Goal: สรุปผลและ action ถัดไป

1. ทำ `/report-table` ด้วยคอลัมน์: Test, Status, Category, Root Cause, Action
2. ทำ Coverage Delta Report: File, Before, After, Gap, Priority
3. ทำ Flaky Report: Test, Run 1, Run 2, Run 3, Suspected Cause
4. ทำ `/suggest-next-action` ตาม priority

## Rules

### 1. Review Only

- ทำ review ผลลัพธ์เท่านั้น ไม่แก้ไข source/test code ระหว่าง review
- ถ้าต้องแก้ไข code → ส่งต่อให้ `update-test`, `write-test`, `deep-debug` หรือ `resolve-errors`

### 2. Evidence-Based

- ทุก finding ต้องมี evidence จาก test output หรือ coverage report
- ระบุ file path, test name, line number (ถ้ามี)
- ใช้ `jq` หรือ `grep` ดึงข้อมูลจาก output ไฟล์

### 3. Skill Update Discipline

- ใช้ `/update-devin-global-skills` เฉพาะเมื่อ test result พบ gap ใน skill ทีมีอยู่จริง
- ไม่อัปเดต skill เพียงเพราะ project test fail ปกติ
- ต้องสร้าง issue/หมายเหตุก่อน update skill

### 4. Safety

- ไม่ expose secrets จาก test output หรือ coverage report
- ไม่รัน destructive commands ระหว่าง review
- ทำ dry run ถ้าต้อง re-run tests เพื่อ verify flakiness

## Expected Outcome

- รายงานผลการ run tests ทีสมบูรณ์: failures, coverage, flaky
- รายการ action ถัดไปเรียงตาม priority
- Coverage delta report เปรียบเทียบกับ target
- Flaky test report ถ้ามี
- Skill ทีเกี่ยวข้องถูกอัปเดตผ่าน `/update-devin-global-skills` เมื่อจำเป็น
- `/suggest-next-action` แนะนำขั้นตอนถัดไปชัดเจน
