---
name: follow-lib-testing-library
description: ใช้ Testing Library — queries by role/text, user-event, jest-dom matchers
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
  - follow-tool-vitest
  - follow-tool-playwright
---

## Goal

ใช้ Testing Library — queries by role/text, user-event, jest-dom matchers

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ component/unit testing ด้วย Testing Library — setup, queries, user-event, assertions, debugging

- ใช้ skill นี้สำหรับ component tests ที่ test behavior เหมือน user — React (`@testing-library/react`), Vue (`@testing-library/vue`), Solid (`@solidjs/testing-library`), หรือ DOM-only (`@testing-library/dom`)
- Test runner config (Vitest options, coverage, CI) → `/follow-tool-vitest`
- Browser e2e tests (real navigation, multi-page flows) → `/follow-tool-playwright` — Testing Library ไม่ใช่ e2e tool

- Latest: `@testing-library/dom@10.4.1` / `react@16.3.3` / `jest-dom@7.0.1` / `user-event@14.6.7` / `vue@8.1.0` (verified 2026-09-13)
- References: [apis](references/apis.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. query ด้วย priority: `getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByTestId` (last resort)
1. เลือก query variant ให้ถูก: `getBy*` throw เมื่อไม่เจอ, `queryBy*` return null (ใช้สำหรับ assert ว่าไม่มี element), `findBy*` async (รอ element ปรากฏ)
1. ใช้ `screen` object เสมอ — ห้าม destructure จาก `render()` result
1. ใช้ `within(el)` สำหรับ scoped queries ภายใน container (เช่น dialog, row)
1. ใช้ `userEvent` แทน `fireEvent` — จำลอง user behavior จริง; `const user = userEvent.setup()` แล้ว `await user.click(...)` / `await user.type(...)` ทุก method เป็น async
1. ใช้ async `findBy*`, `waitFor` หรือ `waitForElementToBeRemoved` สำหรับ async updates
1. assert ด้วย `@testing-library/jest-dom` matchers (`toBeInTheDocument`, `toHaveAttribute`) — Vitest import ผ่าน `import '@testing-library/jest-dom/vitest'` ใน setup file

### 2. Common Mistakes

> Goal: หลีกเลี่ยง pitfalls ที่พบบ่อย

1. test behavior ไม่ใช่ implementation — ห้าม query ด้วย class/id ที่เป็น internal หรือ container.firstChild
2. ห้ามใช้ `getBy*` เพื่อ assert ว่า element ไม่มี — ใช้ `queryBy*` แล้ว expect `toBeNull()` / `not.toBeInTheDocument()`
3. ห้ามลืม `await` กับ `userEvent` methods และ `findBy*` — assertion จะรันก่อน update เสร็จ
4. ห้าม assert ทันทีหลัง action ที่ trigger async update — ใช้ `findBy*`/`waitFor` แทน
5. cleanup อัตโนมัติผ่าน test runner `globals` — ถ้าไม่ใช้ globals ให้ `afterEach(cleanup)` เอง

### 3. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib testing library)

### Subskills

- Setup กับ Vitest — jsdom/happy-dom, jest-dom matchers, user-event → `subskills/setup-testing/SKILL.md`

## Rules

- test behavior ไม่ใช่ implementation — ห้าม query ด้วย class/id ที่เป็น internal
- `@testing-library/react@16` ต้องติดตั้ง `@testing-library/dom` เป็น peer dependency และใช้กับ React 18+
- ใช้ `screen` object เสมอ — ไม่ destructure render result
- อย่า assert element absence ด้วย `queryBy` ผสม `getBy` — ใช้ `queryBy` ตรงๆ
- cleanup อัตโนมัติผ่าน test setup

- ใช้ `/run-verify` ถ้าจำเป็น
- ใช้ `/run-test` ถ้าจำเป็น
- ใช้ `/follow-tool-vitest` ถ้าจำเป็น
- ใช้ `/follow-tool-playwright` ถ้าจำเป็น

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib testing library)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib testing library)
- Lint, typecheck, tests ผ่าน
