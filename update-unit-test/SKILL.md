---
name: update-unit-test
description: Update หรือเขียน unit tests ให้ครอบคลุม logic ปัจจุบัน ตาม framework ที่ตรวจพบ
argument-hint: "[scope-or-files]"
related:
  - run-test
  - run-test-coverage
  - follow-tool-vitest
  - update-test-and-fix
  - improve-tests
  - resolve-errors
  - run-check
  - report
  - suggest-next-action
---

## Goal

อัปเดตหรือเขียน unit tests ให้ครอบคลุม logic ปัจจุบัน — functions, components, utils — ด้วย test framework ที่ project ใช้อยู่ แล้วรันจนผ่าน

## Scope

ใช้เมื่อ code เปลี่ยนแล้ว tests ต้องตาม, หรือ module ขาด unit coverage — focus เฉพาะ unit layer (isolated, fast, mocked externals)

- ถ้าต้องการรัน unit tests เฉยๆ → `/run-test`
- ถ้า integration/e2e → `/update-integration` หรือ `/update-e2e-test`
- ถ้า improve test suite quality → `/improve-tests`
- ถ้า general updates หลาย layers → `/update-test-and-fix`

## Execute

### 1. Detect Framework And Conventions

> Goal: ใช้ setup เดิมของ project

1. ตรวจ manifest — `vitest`, `jest`, `bun test`, `pytest`, `go test` ตาม ecosystem
2. อ่าน test files เดิม — naming, structure, assertion style, mock patterns
3. ทำตาม `/follow-tool-vitest` ถ้าเป็น Vitest — อย่าสร้าง config ใหม่ถ้ามีอยู่แล้ว

### 2. Identify Gaps

> Goal: รู้ว่าต้องเพิ่ม/แก้อะไร

1. diff code changes vs tests — functions/branches ใหม่ที่ยังไม่มี test
2. `/run-test-coverage` ดู coverage report หา gaps บน critical logic
3. tests ที่พังจาก code changes → ระบุ expected change หรือ regression

### 3. Update Or Write Tests

> Goal: tests ตรง behavior ปัจจุบัน

1. tests ที่พังเพราะ intended change → อัปเดต expectations; พังเพราะ bug → report แก้ code แทน
2. เขียน tests ใหม่: happy path + edge cases (empty/null/boundary) + error paths
3. mock เฉพาะ external boundary — ไม่ mock สิ่งที่ควร test ร่วมกัน
4. snapshot เฉพาะ output ที่ stable จริง

### 4. Run And Fix

> Goal: tests ผ่านจริง

1. `/run-test` หรือรัน framework ของ project — failures แยก test bug vs code bug
2. test bug → แก้ test; code bug → `/resolve-errors` หรือ report
3. loop จนผ่าน (สูงสุด 3 รอบ)

### 5. Verify

> Goal: สะอาดและเสถียร

1. `/run-check` lint/typecheck ผ่าน
2. รันซ้ำ — deterministic, ไม่มี order dependence
3. coverage delta บน scope ที่แก้

### 6. Report

> Goal: ส่งมอบ

1. ทำ `/report` — tests added/updated, coverage delta, failures ที่เป็น code bugs
2. ทำ `/suggest-next-action`

## Rules

### 1. Behavior Over Implementation

- assert behavior/output — ห้าม assert internal implementation details ที่ refactor แล้วพัง
- test names บอก behavior

### 2. Minimal Mocks

- mock เฉพาะ I/O, network, time, randomness — internals test ร่วมกัน
- ห้าม mock จน test ไม่พิสูจน์อะไร

### 3. No Code Changes To Pass

- ห้ามแก้ source เพื่อให้ test เขียว — ถ้า test เผย bug → fix bug แยกหรือ report
- intended behavior change เท่านั้นที่อัปเดต expectations

### 4. Deterministic

- ไม่มี time/random/order dependence — ใช้ fake timers/seeded values
- ทุก test independent — รันเดี่ยวหรือรวมได้ผลเดียวกัน

## Expected Outcome

- unit tests ครอบคลุม logic ปัจจุบันบน critical paths
- suite ผ่าน deterministic — ไม่มี flaky
- report สรุป coverage delta และ issues ที่พบ
