---
name: follow-lib-testing-library
description: ใช้ Testing Library — queries by role/text, user-event, jest-dom matchers
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
---

## Goal

ใช้ Testing Library — queries by role/text, user-event, jest-dom matchers

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. query ด้วย priority: `getByRole` > `getByLabelText` > `getByText` > `getByTestId` (last resort)
1. ใช้ `userEvent` แทน `fireEvent` — จำลอง user behavior จริง
1. ใช้ async `findBy*` หรือ `waitFor` สำหรับ async updates
1. assert ด้วย `@testing-library/jest-dom` matchers (`toBeInTheDocument`, `toHaveAttribute`)

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- test behavior ไม่ใช่ implementation — ห้าม query ด้วย class/id ที่เป็น internal
- ใช้ `screen` object เสมอ — ไม่ destructure render result
- อย่า assert element absence ด้วย `queryBy` ผสม `getBy` — ใช้ `queryBy` ตรงๆ
- cleanup อัตโนมัติผ่าน test setup

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน