---
name: follow-tool-jsdom
description: ใช้ jsdom เป็น DOM environment สำหรับ tests — setup, limitations, polyfills
argument-hint: "[target-or-scope]"
related:
  - follow-best-practice
  - run-verify
  - run-test
  - report-table
---

## Goal

ใช้ jsdom เป็น DOM environment สำหรับ tests — setup, limitations, polyfills

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. ตั้ง `environment: jsdom` ใน vitest/jest config — ใช้กับ component tests เท่านั้น
1. mock browser APIs ที่ jsdom ไม่มี: `matchMedia`, `IntersectionObserver`, `ResizeObserver`, `scrollTo`
1. ใส่ mocks ใน setup file (`tests/setup.ts`) ไม่ใช่ในแต่ละ test
1. สำหรับ layout/visual behavior ใช้ Playwright แทน — jsdom ไม่ render จริง

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- jsdom ไม่ใช่ browser จริง — ไม่มี layout engine, CSS computation, navigation
- อย่า polyfill ทุกอย่าง — ถ้า test ต้องการ browser behavior จริงให้ใช้ e2e
- isolate jsdom tests จาก node tests ด้วย project/environment config

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน