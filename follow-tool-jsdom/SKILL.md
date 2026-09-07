---
name: follow-tool-jsdom
description: ใช้ jsdom เป็น DOM environment สำหรับ tests — setup, limitations, polyfills
argument-hint: "[scope]"
related:
  - follow-tool-vitest
  - follow-lib-testing-library
  - run-check
  - run-test-unit
---

## Goal

ใช้ jsdom เป็น DOM environment สำหรับ tests — setup, limitations, polyfills

## Scope

ใช้สำหรับ task ที่เกี่ยวข้องกับการ setup jsdom สำหรับ unit/component tests บน Vitest หรือ Jest รวมถึง stubs สำหรับ browser APIs ที่ jsdom ไม่มี

## Execute

### 1. Detect Test Runner

> Goal: ระบุ test runner และ version ที่ถูกต้อง

1. อ่าน `package.json` เพื่อหา `vitest` หรือ `jest`
2. ถ้าไม่มี test runner → ทำ `/follow-tool-vitest` เพื่อตั้งค่า Vitest ก่อน
3. ตรวจ `jsdom` version ล่าสุดจาก `package.json` หรือ npm registry
4. ถ้าใช้ TypeScript ให้ตรวจว่ามี `@types/jsdom` หรือไม่ (Vitest/Bun มักไม่ต้อง)

### 2. Install jsdom

> Goal: ติดตั้ง jsdom ถูกต้องตาม ecosystem

1. Vitest: `bun add -D jsdom` (Vitest มี jsdom integration ในตัว)
2. Jest 28+: `bun add -D jest-environment-jsdom` (Jest 28 แยก jsdom ออกมา)
3. TypeScript: `bun add -D @types/jsdom` ถ้าจำเป็น
4. ตรวจสอบว่า `node_modules/jsdom` หรือ `jest-environment-jsdom` มีอยู่จริง

### 3. Configure Environment

> Goal: บอก test runner ให้ใช้ jsdom เป็น DOM environment

1. Vitest: ตั้งค่าใน `vitest.config.ts`
   ```ts
   export default defineConfig({
     test: {
       environment: 'jsdom',
       setupFiles: ['./tests/setup.ts'],
     },
   })
   ```
2. Jest: ตั้งค่าใน `jest.config.js`
   ```js
   module.exports = { testEnvironment: 'jsdom' }
   ```
3. Vitest monorepo: ใช้ `environment` ใน `test.projects` array
4. ใช้ `// @vitest-environment jsdom` หรือ `/** @jest-environment jsdom */` สำหรับ per-file override
5. อย่าใช้ `jsdom` environment กับ pure unit tests ที่ไม่ต้อง DOM

### 4. Add Browser API Stubs

> Goal: เติม gaps ของ browser APIs ที่ jsdom ไม่มี

1. สร้าง `tests/setup.ts` หรือ `setupFiles` ที่ระบุ
2. Stub `matchMedia` — Vitest ใช้ `vi.fn()`, Jest ใช้ `jest.fn()`
   ```ts
   Object.defineProperty(window, 'matchMedia', {
     writable: true,
     value: (query: string) => ({
       matches: false,
       media: query,
       onchange: null,
       addListener: () => {},
       removeListener: () => {},
       addEventListener: () => {},
       removeEventListener: () => {},
       dispatchEvent: () => true,
     }),
   })
   ```
3. Stub `IntersectionObserver`, `ResizeObserver`, `scrollTo`
4. Stub `URL.createObjectURL` / `URL.revokeObjectURL` ถ้าจำเป็น
5. ใช้ stubs ใน setup file เท่านั้น ไม่ใช่ในแต่ละ test

### 5. Verify And Run

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-check` สำหรับ lint, typecheck
2. ทำ `/run-test-unit` ถ้ามี test ที่เกี่ยวข้อง
3. ถ้าใช้ Testing Library ใน component tests → ทำ `/follow-lib-testing-library` สำหรับ queries และ matchers
4. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ
5. ถ้าเจอ error เกี่ยวกับ DOM จริง → พิจารณา `/run-test-e2e` หรือ `/follow-tool-playwright` แทน

## Rules

- jsdom ไม่ใช่ browser จริง — ไม่มี layout engine, CSS computation, navigation
- ใช้ jsdom เฉพาะ component/unit tests ที่ต้อง DOM API ไม่ใช่ visual/layout
- สำหรับ layout/visual behavior ใช้ Playwright แทน — jsdom ไม่ render จริง
- อย่า polyfill ทุกอย่าง — ถ้า test ต้องการ browser behavior จริงให้ใช้ e2e
- isolate jsdom tests จาก node tests ด้วย project/environment config
- stub browser APIs ใน setup file ไม่ใช่ในแต่ละ test

## Expected Outcome

- jsdom ติดตั้งและทำงานกับ Vitest/Jest ได้
- Test runner ใช้ `jsdom` environment ถูกต้อง
- Browser APIs ที่จำเป็นถูก stub ใน setup file
- Lint, typecheck, tests ผ่าน
- ไม่มี security/performance pitfalls ที่รู้จัก
