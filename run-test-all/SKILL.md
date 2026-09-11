---
name: run-test-all
description: Orchestrate test suite ทั้งหมด — เลือก run-test-* ที่เหมาะกับ project แล้วรันจนครบ จำแนก failures
argument-hint: "[scope]"
related:
  - review-test
  - run-lint
  - run-typecheck
  - run-test
  - run-test-integration
  - run-test-e2e
  - run-test-api
  - run-test-cli
  - run-test-contract
  - run-test-visual
  - run-test-coverage
  - run-test-mutation
  - update-tests

  - deep-review-codebase
  - resolve-errors
---

## Goal

รัน test suite ทั้งหมดอย่างเป็นระบบ — เลือก `run-test-*` ที่เหมาะกับ project จาก signals จริง รันตามลำดับ fail-fast แล้ว validate/classify failures ว่าแก้ source หรือ test โดยไม่แก้ให้ผ่านอัตโนมัติ

## Scope

Orchestrator ของ test runners ทั้งหมด — ไม่รัน test เอง แต่เลือกและเรียก `run-test-*` ตามสิ่งที่ project มีจริง

- ถ้าต้องการ update/เขียน tests → `/update-tests`, `/update-tests`, `/update-tests` ตาม layer (run-* เป็น run-only)

| No. | Signal ที่พบ | Skill ที่เลือก |
|----:|-------------|---------------|
| 1 | `*.test.*`, `*.spec.*`, vitest/jest/pytest/go test | `/run-test` (unit/fast) |
| 2 | shared modules, DB, services integration | `/run-test-integration` |
| 3 | HTTP endpoints, OpenAPI spec, API routes | `/run-test-api` + `/test-all-api-routes` |
| 4 | CLI binary, `bin` field, command definitions | `/run-test-cli` |
| 5 | consumer/provider services, Pact, contract files | `/run-test-contract` |
| 6 | web frontend, browser flows | `/run-test-e2e` (Playwright; agent-browser headless ถ้ายังไม่มี suite) |
| 7 | UI components, design system, screenshots | `/run-test-visual` |
| 8 | coverage config หรือ target กำหนดไว้ | `/run-test-coverage` |
| 9 | critical logic, mutation config | `/run-test-mutation` |
| 10 | ทุก case | `/run-lint` + `/run-typecheck` ก่อนเสมอ |

ดูเพิ่มเติม: /update-tests, /deep-review-codebase

## Execute

> Pre-Run: ทำ `/review-test` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test all)

### 1. Lint And Typecheck First

> Goal: code quality pass ก่อนรัน tests

1. ทำ `/run-lint` และ `/run-typecheck`
2. แก้ lint/type errors ก่อน — ไม่ใช่ test failure

### 2. Detect Applicable Test Types

> Goal: เลือก `run-test-*` ที่เกี่ยวข้องจาก signals

1. สแกน `package.json`, configs, test dirs, routes — เทียบกับตารางใน Scope
2. ถ้า project ยังไม่มี tests หรือ coverage ไม่ครบ → `/update-tests` สร้าง tests ที่ขาดก่อน
3. บันทึกรายการ test types ที่จะรันและเหตุผล — ไม่รันทุก type โดยไม่มี signal

### 3. Run In Fail-Fast Order

> Goal: รันเร็วสุดก่อน เจอปัญหาเร็ว

1. ลำดับ: `/run-test` (unit) → `/run-test-integration` → `/run-test-api` / `/run-test-cli` / `/run-test-contract` (ตาม signals) → `/run-test-e2e` → `/run-test-visual`
2. ต่อ type: บันทึกผลลัพธ์, duration, รายการ tests ที่ fail
3. ถ้ามี fail → ไปขั้นตอน Validate/Classify ทันที ไม่แก้ไข code ก่อน

### 4. Validate And Classify Failures

> Goal: ระบุว่า source หรือ test ผิด

1. ทำ `/deep-validate` กับ source ที่เกี่ยวข้อง และ review test files (`/deep-review-codebase` ถ้าต้องการ)
2. จำแนกผล:
   - source ผิด → ระบุไฟล์ แนะนำ `/resolve-errors` หรือ `/edit-manual`
   - test ผิด (assertion, mock, expectation outdated) → ระบุไฟล์ แนะนำ `/update-tests` หรือ `/edit-manual`
   - ไม่ชัดเจน → report ก่อนดำเนินการ
3. ห้ามแก้โดยไม่มี evidence

### 5. Fix Based On Classification

> Goal: แก้ตามผล classify แล้วรันซ้ำ

1. source ผิด → `/resolve-errors`; test ผิด → `/update-tests` หรือ `/edit-manual`
2. รัน tests ที่ fail อีกครั้ง — ถ้ายัง fail กลับไป Step 4
3. Failure เดิมซ้ำ ≥3 ครั้ง → stop และ report

### 6. Coverage And Report

> Goal: ครอบคลุมและรายงาน

1. ทำ `/run-test-coverage` เมื่อ project มี coverage target
2. ถ้าไม่ถึงเป้า → `/update-tests` เพิ่ม แล้วรันใหม่
3. ทำ `/report` สรุป: test types ที่รัน, pass/fail ต่อ type, classification, coverage, action items
4. persist raw results → `.devin/reports/<workspace>/test-all-<time>.md` ตาม format `/create-report-in-dot-devin` เพื่อให้ `/update-docs` reuse

### 7. Continue To Full Verify

> Goal: ส่งต่อ verify ครบวงจรถ้าจำเป็น

1. ถ้า tests ผ่านทั้งหมด → `/run-verify`
2. ถ้า `/run-verify` fail → `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง

## Rules

### 1. Test Selection

- เลือก `run-test-*` จาก signals จริงเท่านั้น — ไม่รันทุก type
- ถ้าไม่แน่ใจว่า type ไหนเกี่ยวข้อง → ถามผู้ใช้

### 2. Test Failure Handling

- Test fail: ห้ามแก้ให้ผ่านโดยไม่ validate/review ก่อน
- ก่อนแก้ไขต้องมี evidence ว่า source หรือ test ผิด
- ห้าม `.skip`, `.only`, `xit`, `xtest` เพื่อหลีกเลี่ยง failure

### 3. Fix Direction

- ถ้า source ผิด → แก้ source ไม่ใช่ test
- ถ้า test ผิด → แก้ test
- ห้ามแก้ assertion ให้อ่อนลงเพื่อให้ผ่าน
- ห้ามแก้ source ให้เข้ากับ test ที่ผิด

### 4. Coverage

- ตรวจ coverage ทุก category (line, branch, function, statement)
- ถ้ายังไม่ถึงเป้า → เพิ่ม tests ไม่ใช่ลด coverage target

### 5. Reporting

- รายงานชัดเจน action-oriented แยก source issue กับ test issue
- ระบุ priority

## Expected Outcome

- ทุก applicable `run-test-*` ถูกรันครบตาม signals ของ project
- Test failures ได้รับ validate/classify ว่าเป็น source หรือ test issue
- ไม่มีการแก้ไขโดยไม่มี evidence
- Coverage ผ่านเป้าหมาย (ถ้ามี)
- รายงานผล test results, coverage, และ action items ชัดเจน
