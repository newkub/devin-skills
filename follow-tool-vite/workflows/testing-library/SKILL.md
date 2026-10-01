---
name: follow-tool-vite-testing-library
description: Testing Library ใน Vite projects — Vitest setup, queries by role, user-event, jest-dom matchers
argument-hint: "[framework]"
related:
  - follow-tool-vite
  - follow-tool-vitest
  - follow-tool-playwright
  - run-test
  - run-verify
  - resolve-errors
---

## Goal

ใช้ Testing Library ใน Vite project — setup กับ Vitest, queries by role/text, `user-event`, jest-dom matchers

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ component/unit testing ใน Vite project — React (`@testing-library/react`), Vue (`@testing-library/vue`), Solid (`@solidjs/testing-library`), หรือ DOM-only (`@testing-library/dom`)

- Test runner config (Vitest options, coverage, CI) → `/follow-tool-vitest`
- Browser e2e tests → `/follow-tool-playwright` — Testing Library ไม่ใช่ e2e tool
- Latest: `@testing-library/dom@10.4.2` / `react@16.3.3` / `jest-dom@7.0.1` / `user-event@14.6.7` / `vue@8.1.0` (verified 2026-09-16)
- API reference: [apis](references/apis.md)

## Execute

### 1. Setup

> Goal: install + config กับ Vitest พร้อมใช้งาน

1. ตรวจ `package.json` ว่าใช้ `vitest` — ถ้าไม่มี → ทำ `/follow-tool-vitest` ก่อน; ถ้ามี setup อยู่แล้ว → verify เท่านั้น (idempotent)
2. Install core + framework wrapper + DOM env:
   `bun add -D vitest @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event jsdom`
   - `@testing-library/react@16` ต้องติดตั้ง `@testing-library/dom` เป็น peer dependency และใช้กับ React 18+
   - DOM environment: `jsdom` หรือ `happy-dom` — เลือกตามที่ project ใช้ ห้ามเพิ่มสองตัว
3. ตั้ง `test.environment: 'jsdom'` ใน `vite.config.ts`/`vitest.config.ts` + `test.setupFiles: ['./test/setup.ts']`
4. สร้าง `test/setup.ts`:

   ```ts
   import '@testing-library/jest-dom/vitest'
   ```

5. เปิด `globals: true` (cleanup อัตโนมัติ) หรือ `afterEach(cleanup)` ใน setup file

### 2. Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. query ด้วย priority: `getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByTestId` (last resort)
2. เลือก query variant ให้ถูก: `getBy*` throw เมื่อไม่เจอ, `queryBy*` return null (assert absence), `findBy*` async
3. ใช้ `screen` object เสมอ — ห้าม destructure จาก `render()` result
4. ใช้ `within(el)` สำหรับ scoped queries (dialog, row)
5. ใช้ `userEvent` แทน `fireEvent` — `const user = userEvent.setup()` ต่อ test, `await user.click(...)`/`await user.type(...)` ทุก method async
6. ใช้ `findBy*`, `waitFor` หรือ `waitForElementToBeRemoved` สำหรับ async updates
7. assert ด้วย `@testing-library/jest-dom` matchers (`toBeInTheDocument`, `toHaveAttribute`)

### 3. Common Mistakes

> Goal: หลีกเลี่ยง pitfalls ที่พบบ่อย

1. test behavior ไม่ใช่ implementation — ห้าม query ด้วย class/id ที่เป็น internal หรือ `container.firstChild`
2. ห้ามใช้ `getBy*` assert absence — ใช้ `queryBy*` แล้ว expect `toBeNull()` / `not.toBeInTheDocument()`
3. ห้ามลืม `await` กับ `userEvent` และ `findBy*` — assertion จะรันก่อน update เสร็จ
4. ห้าม assert ทันทีหลัง action ที่ trigger async update — ใช้ `findBy*`/`waitFor` แทน

### 4. Verify

> Goal: smoke test ผ่าน

1. เขียน test ตัวอย่าง: `render(<Comp />)` → `screen.getByRole(...)` → `await user.click(...)` → `toBeInTheDocument()`
2. ทำ `/run-test` + `/run-verify`
3. ถ้าพัง → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- test behavior ไม่ใช่ implementation — ห้าม query ด้วย internal class/id
- `userEvent` methods เป็น async — `await` เสมอและ `userEvent.setup()` ต่อ test
- jest-dom matchers import ผ่าน setup file เท่านั้น
- ตรวจ official docs (`https://testing-library.com`) ก่อนใช้ API ที่ไม่แน่ใจ

- ใช้ `/follow-tool-vitest` ถ้าจำเป็น
- ใช้ `/run-test`, `/run-verify`, `/follow-tool-playwright` ถ้าจำเป็น

## Expected Outcome

- Testing Library + Vitest + DOM environment พร้อมใช้งาน
- jest-dom matchers และ `userEvent` ใช้ได้ใน tests
- Smoke test, lint, typecheck ผ่าน
