---
name: follow-lib-testing-library-setup-testing
description: Setup Testing Library — vitest integration, jest-dom, user-event
argument-hint: "[framework]"
related:
  - follow-lib-testing-library
  - run-install
  - run-test
  - run-verify
  - resolve-errors
---

## Goal

Setup Testing Library ใน project — install กับ Vitest, jest-dom matchers และ `user-event` พร้อมใช้งาน

## Scope

ใช้เมื่อต้อง setup component testing ครั้งแรก — ครอบคลุม `@testing-library/*` install, test environment (jsdom/happy-dom), setup file, jest-dom matchers และ `userEvent` config

## Execute

### 1. Check Current State

> Goal: ตรวจ test runner และ framework ก่อนติดตั้ง

1. ตรวจ `package.json` ว่าใช้ `vitest` หรือ `jest` — ใช้ runner ที่มีอยู่
2. ตรวจ framework: React (`@testing-library/react`), Vue (`@testing-library/vue`), Solid (`@solidjs/testing-library`), หรือ DOM-only (`@testing-library/dom`)
3. ถ้ามี setup อยู่แล้ว → verify เท่านั้น (idempotent)

### 2. Install Packages

> Goal: ติดตั้ง testing packages ตาม framework

1. Core + framework wrapper เช่น `bun add -D vitest @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event`
   - `@testing-library/react@16` ต้องติดตั้ง `@testing-library/dom` เป็น peer dependency และใช้กับ React 18+
2. DOM environment: `bun add -D jsdom` หรือ `happy-dom` — เลือกตามที่ project ใช้
3. ถ้าไม่แน่ใจ package สำหรับ framework → ดู official docs ที่ `https://testing-library.com`

### 3. Configure Test Environment

> Goal: ตั้งค่า runner ให้รัน DOM tests ได้

1. Vitest: ตั้ง `test.environment: 'jsdom'` (หรือ `happy-dom`) ใน `vite.config.ts`/`vitest.config.ts`
2. สร้าง setup file เช่น `test/setup.ts`:

   ```ts
   import '@testing-library/jest-dom/vitest'
   ```

3. ชี้ setup file ใน config: `test.setupFiles: ['./test/setup.ts']`
4. เปิด `globals: true` หรือ import `describe/it/expect` จาก `vitest` ตาม convention ของ project
5. cleanup อัตโนมัติผ่าน `globals` หรือ `afterEach(cleanup)` ใน setup file ถ้าไม่ใช้ globals

### 4. Configure user-event

> Goal: ใช้ `userEvent` แบบถูกต้อง

1. สร้าง instance ต่อ test: `const user = userEvent.setup()` ในแต่ละ test
2. ใช้ `await user.click(...)`, `await user.type(...)` — `userEvent` methods เป็น async เสมอ
3. ห้ามใช้ `fireEvent` เมื่อ `userEvent` ทำได้ — `userEvent` จำลอง user behavior จริง

### 5. Verify

> Goal: เขียน smoke test และรัน

1. เขียน test ตัวอย่าง: `render(<Comp />)` → `screen.getByRole(...)` → `await user.click(...)` → assert ด้วย `toBeInTheDocument()`
2. ทำ `/run-test` — test ต้องผ่าน
3. ทำ `/run-verify` สำหรับ lint/typecheck
4. ถ้าพัง → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ใช้ `screen` object เสมอ — ไม่ destructure render result
- `userEvent` methods เป็น async — `await` เสมอและ `userEvent.setup()` ต่อ test
- jest-dom matchers import ผ่าน setup file — `@testing-library/jest-dom/vitest` สำหรับ Vitest
- ใช้ `jsdom`/`happy-dom` ตามที่ project ใช้อยู่ — อย่าเพิ่มสองตัว
- ใช้ `/follow-lib-testing-library` สำหรับ query priority และ best practices

## Expected Outcome

- Testing Library + runner + DOM environment พร้อมใช้งาน
- jest-dom matchers และ `userEvent` ใช้ได้ใน tests
- Smoke test ผ่าน — lint, typecheck, tests ทั้งหมดเขียว
