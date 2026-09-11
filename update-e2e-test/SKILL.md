---
name: update-e2e-test
description: Update หรือเขียน Playwright e2e tests ให้ครอบคลุม flows ปัจจุบัน แล้วรันจนผ่าน
argument-hint: "[scope-or-url]"
related:
  - follow-tool-playwright
  - run-test-e2e
  - watch-browser-and-test
  - update-test-and-fix
  - resolve-errors
  - run-check
  - report
  - suggest-next-action
---

## Goal

อัปเดตหรือเขียน e2e tests ด้วย Playwright ให้ครอบคลุม flows/routes ปัจจุบันของ app แล้วรันจนผ่าน — ใช้หลังเปลี่ยน flows, เพิ่ม routes, หรือหลัง `/watch-browser-and-test` พบ coverage gaps

## Scope

ใช้เมื่อต้องการ sync Playwright suite กับพฤติกรรมจริงของ app — เขียนใหม่, อัปเดต selectors ที่พัง, เพิ่ม flows ที่ยังไม่มี test

- ถ้าต้องการรัน e2e เฉยๆ → `/run-test-e2e`
- ถ้าต้องการ exploratory test ก่อนเขียน → `/watch-browser-and-test`
- ถ้า general test updates หลาย layers → `/update-test-and-fix`

## Execute

### 1. Assess Current Suite

> Goal: รู้ว่ามีอะไรอยู่แล้วและขาดอะไร

1. หา Playwright config (`playwright.config.ts`) และ test files (`e2e/`, `tests/e2e/`, `*.spec.ts`)
2. map tests ที่มี → routes/flows ที่ cover
3. เทียบกับ route inventory (codebase router config + `/watch-browser-and-test` results ถ้ามี) → coverage gaps
4. ทำตาม `/follow-tool-playwright` สำหรับ setup/commands ที่ถูกต้อง

### 2. Update Or Write Tests

> Goal: suite ครอบคลุม flows จริง

1. selectors ที่พัง → เปลี่ยนเป็น `data-testid` หรือ role-based locators (`getByRole`, `getByLabel`) ไม่ใช่ CSS selectors เปราะ
2. เขียน tests สำหรับ gaps: critical flows ก่อน (auth, forms, navigation, mutations) แล้ว edge flows
3. ใช้ evidence จาก `/watch-browser-and-test` ถ้ามี — repro steps กลายเป็น test cases
4. ตาม conventions ของ suite เดิม — fixtures, page objects, auth state reuse (`storageState`)

### 3. Run And Fix

> Goal: tests ผ่านจริงบน app จริง

1. รัน `bunx playwright test` (หรือ script ของ project) — headed/headedless ตาม context
2. FAIL → แยก test bug vs app bug: test bug แก้ selector/wait; app bug จริง → `/resolve-errors` หรือ report
3. flaky → ใช้ auto-waiting locators + `expect` polling ไม่ใช่ `waitForTimeout` มั่ว
4. loop จนผ่าน (สูงสุด 3 รอบต่อ failure)

### 4. Verify

> Goal: suite เสถียร

1. รันซ้ำ 2-3 ครั้งยืนยันไม่ flaky
2. `/run-check` lint/typecheck ผ่าน
3. trace/video artifacts ไป test-results dir ตาม Playwright config — ไม่ commit artifacts

### 5. Report

> Goal: ส่งมอบ

1. ทำ `/report` — tests added/updated/removed, coverage ต่อ route/flow, pass rate
2. ทำ `/suggest-next-action`

## Rules

### 1. Real Flows Only

- test ต้องตรงพฤติกรรมจริงของ app — ห้ามเขียน test ที่ assert สิ่งที่ app ไม่ทำ
- ทุก test ต้องผ่านจริง — ห้าม skip/xfail เพื่อให้เขียว

### 2. Stable Selectors

- ใช้ `data-testid` หรือ role/text locators — ห้าม CSS class selectors ที่เปลี่ยนง่าย
- ถ้า UI ขาด testable hooks → เพิ่ม `data-testid` ใน component (minimal change)

### 3. Evidence-Based

- flows จาก `/watch-browser-and-test` findings ให้แปลงเป็น regression tests
- FAIL ที่เป็น app bug ห้ามแก้ test ให้ผ่าน — report/แก้ app แทน

### 4. Ecosystem

- Playwright เท่านั้นสำหรับ e2e — ใช้ commands/config ของ project ไม่สร้าง framework ใหม่
- test artifacts (traces, videos, screenshots) ไม่ commit

## Expected Outcome

- Playwright suite ครอบคลุม routes/flows ปัจจุบัน
- tests ผ่านและเสถียร — ไม่มี flaky
- report สรุป coverage และ fixes
