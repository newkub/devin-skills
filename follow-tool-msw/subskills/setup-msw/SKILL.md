---
name: follow-tool-msw-setup-msw
description: ติดตั้ง MSW พร้อม worker (browser) และ server (node) setup และ handler พื้นฐาน
argument-hint: "[scope]"
related:
  - follow-tool-msw
  - follow-tool-vitest
  - run-test
  - review-dependencies
---

## Goal

ติดตั้งและตั้งค่า MSW ครั้งแรกให้ mock network requests ได้ทั้ง browser dev และ Node tests — worker, server, handlers พื้นฐาน

## Scope

- First-time setup ของ MSW ใน frontend หรือ Node project
- ครอบคลุม: install, `msw init`, `setupWorker`/`setupServer`, entry wiring, smoke test
- ไม่ครอบคลุม: handler organization ขั้นสูง (`subskills/config-handlers`)

## Execute

### 1. Check Prerequisites

> Goal: รู้ stack และ environments ที่ต้อง mock

1. ทำ `/review-dependencies` — ระบุ HTTP client (`fetch`, `axios`, `graphql-request`) — MSW intercept ที่ network layer ได้หมด
2. ระบุ environments: browser dev, Node tests (Vitest/Jest), หรือทั้งสอง
3. ระบุ public dir ของ dev server (`public/` สำหรับ Vite เป็นต้น)
4. ตรวจ `package.json` — ถ้ามี `msw` แล้ว (idempotent check) → skip install

### 2. Install And Init

> Goal: ติดตั้ง MSW และ scaffold worker file

1. ติดตั้ง `bun add -D msw` (dev dependency)
2. ถ้าใช้ browser → รัน `bunx msw init public/ --save` — สร้าง `mockServiceWorker.js` และบันทึก dir ใน `package.json` (`msw.workerDirectory`)

### 3. Create Handlers And Entry Points

> Goal: สร้าง handlers + worker/server entry

1. สร้าง `src/mocks/handlers.ts` — export `handlers` array
2. เขียน handler พื้นฐาน: `http.get('/api/users', () => HttpResponse.json([...]))` สำหรับ REST, `graphql.query('GetUser', ...)` สำหรับ GraphQL
3. สร้าง `src/mocks/browser.ts` — `export const worker = setupWorker(...handlers)`
4. สร้าง `src/mocks/node.ts` — `export const server = setupServer(...handlers)`

### 4. Wire Browser Dev

> Goal: mock ทำงานใน dev server (opt-in)

1. ใน entry (`src/main.ts`): start worker เฉพาะ dev + flag เช่น `import.meta.env.DEV && import.meta.env.VITE_MSW`
2. `await worker.start({ onUnhandledRequest: 'bypass' })` ก่อน render app — ทำให้ async bootstrap
3. ใช้ `'warn'` แทน `'bypass'` ช่วงแรกเพื่อหา endpoints ที่ยังไม่ mock

### 5. Wire Node Tests

> Goal: mock ทำงานใน test suite

1. สร้าง test setup file: `beforeAll(() => server.listen())`, `afterEach(() => server.resetHandlers())`, `afterAll(() => server.close())`
2. ชี้ setup file ใน `vitest.config.ts` → `test.setupFiles` (หรือ equivalent ของ runner)
3. ทำ `/run-test` — tests ที่ยิง API ต้องผ่านกับ mock layer

### 6. Verify

> Goal: smoke check ทั้งสอง environments

1. Dev: เปิด app ด้วย flag → requests ถูก intercept (ดู console "[MSW] Mocking enabled")
2. Tests: spec ที่ hit mocked endpoint ผ่านโดยไม่แตะ network จริง
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ห้าม patch `fetch`/`axios` — ใช้ MSW intercept ที่ network เท่านั้น
- Worker เป็น opt-in ผ่าน env flag — ห้ามบังคับ dev ทุกคนใช้ mock
- `mockServiceWorker.js` เป็น generated file — อย่าแก้เอง (update ด้วย `msw init` ใหม่)
- `afterEach(() => server.resetHandlers())` บังคับ — tests ต้องไม่รั่ว handlers ข้ามกัน
- secrets/real tokens ห้ามอยู่ใน handlers — mock data เท่านั้น

## Expected Outcome

- MSW ทำงานทั้ง browser dev (opt-in) และ Node tests
- `handlers.ts`, `browser.ts`, `node.ts` อยู่ใน `src/mocks/`
- Test suite รันผ่านโดยไม่พึ่ง real network
