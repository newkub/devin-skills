---
name: improve-tests
description: Apply test improvements จาก review-test findings — coverage, isolation, flaky fixes, edge cases
argument-hint: "[scope]"
related:
  - review-test
  - run-test
  - run-test-all
  - update-tests
  - check-test-isolation
  - use-subagents
  - run-check
  - report
  - suggest-next-action
---

## Goal

ยกระดับ test suite ตาม findings จาก `/review-test` — เพิ่ม coverage ที่มีคุณค่า, แก้ flaky/isolation issues, เติม edge cases — ไม่ใช่เขียน test เพิ่มมั่วๆ

## Scope

ใช้หลัง `/review-test` มี findings หรือเมื่อ test suite มีปัญหา (flaky, ช้า, coverage ต่ำ, mocks พัง)

- ถ้าต้องการรัน tests เฉยๆ → `/run-test` หรือ `/run-test-all`
- ถ้าต้องการ update/เขียน tests ตาม layer → `/update-tests`
- ถ้า scope ใหญ่หลาย modules → dispatch ผ่าน `/use-subagents`

## Execute

### 1. Collect Findings And Baseline

> Goal: รู้สถานะ test suite ปัจจุบัน

1. ทำ `/review-test` หรืออ่าน findings เดิม
2. เก็บ baseline: coverage report, test count, suite duration, known flaky tests
3. ทำ `/check-test-isolation` หา shared-state/leaky tests

### 2. Fix Isolation And Flakiness

> Goal: tests deterministic — run เดิมได้ผลเดิม

1. shared mutable state → per-test setup/teardown
2. time/random/network dependence → fake timers, seeded RNG, mocks ที่ boundary
3. order-dependent tests → ทำให้ independent ไม่ใช่แค่บังคับลำดับ
4. flaky tests ที่แก้ไม่ได้ทันที → quarantine แยก + ticket อย่าให้ทำ suite แดง

### 3. Fill Coverage Gaps

> Goal: cover paths ที่สำคัญไม่ใช่แค่ไล่ %

1. critical paths ที่ไม่มี test → เขียนก่อน (auth, payments, data mutations) — delegate ไป `/update-tests` ถ้าต้องการ focused write
2. edge cases: empty/null/boundary values, error paths, permission denied
3. untested branches ตาม coverage report — prioritize by risk ไม่ใช่ไล่ตัวเลข

### 4. Improve Test Quality

> Goal: tests อ่านง่าย maintain ได้ จับ bugs จริง

1. assertion ที่อ่อน (`toBeTruthy` กว้างๆ) → specific assertions
2. mock ที่ test ตัวเอง (mock ทุกอย่างจน test ไม่พิสูจน์อะไร) → integration ที่ boundary จริง
3. duplicate/overlapping tests → merge; test names บอก behavior ไม่ใช่ implementation

### 5. Speed Up Suite

> Goal: suite เร็วพอที่จะรันบ่อย

1. slow tests จาก coverage/profile → แยกเป็น integration suite ถ้าจำเป็น
2. parallelization ถ้า framework รองรับ — แต่ต้อง isolation ก่อน
3. shared expensive setup → setup ครั้งเดียวต่อ suite อย่างปลอดภัย

### 6. Verify

> Goal: suite เขียวและเสถียร

1. `/run-test` + `/run-test-all` — ทั้งหมดผ่าน
2. รันซ้ำ 3 ครั้ง — ไม่มี flaky; `/run-check` lint/typecheck ผ่าน
3. coverage report ใหม่เทียบ baseline

### 7. Report

> Goal: ส่งมอบ

1. ทำ `/report` — coverage delta, tests added/fixed/removed, flaky fixed, duration delta
2. ทำ `/suggest-next-action`

## Rules

### 1. Value Over Coverage

- ห้ามเขียน test เพื่อไล่ % — ทุก test ต้องจับ regression ได้จริง
- prioritize critical paths และ findings จาก `/review-test`

### 2. Deterministic Only

- test ที่ผ่าน/ไม่ผ่านสุ่ม → แก้หรือ quarantine — ห้ามปล่อย flaky ใน suite หลัก
- ไม่เพิ่ม `sleep`/retry เป็น workaround — แก้ root cause

### 3. Minimal Mocks

- mock เฉพาะ external boundary — ไม่ mock internal modules ที่ควร test ร่วมกัน
- snapshot tests เฉพาะ output ที่ stable จริง

### 4. No Behavior Change

- ห้ามแก้ source code เพื่อให้ test ผ่าน — ถ้า test เผย bug จริงให้ fix bug แยก
- tests ใหม่ต้อง fail เมื่อ code พัง (verify ด้วย mutation คร่าวๆ ถ้าสงสัย)

## Expected Outcome

- coverage เพิ่มบน critical paths พร้อม evidence
- ไม่มี flaky/order-dependent tests ใน main suite
- suite เร็วขึ้นหรือเท่าเดิม, assertions แม่นขึ้น
- report สรุป deltas + items ค้าง
