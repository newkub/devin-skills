---
name: follow-tool-msw
description: ตั้งค่าและใช้งาน MSW (Mock Service Worker) สำหรับ API mocking ใน dev และ test
argument-hint: "[scope]"
related:
  - run-test-api
  - implement-to-production
  - follow-my-tech-stack
  - review-techstack
  - report
---

## Goal

ตั้งค่าและใช้งาน MSW เพื่อ mock network requests ที่ระดับ network จริง — ครอบคลุม dev (browser worker) และ test (Node server) โดยไม่ต้อง patch fetch/axios

## Scope

- ใช้เมื่อ frontend หรือ Node app ต้องการ mock API responses ใน dev, unit tests หรือ integration tests
- ครอบคลุม REST และ GraphQL handlers, `setupWorker` (browser) และ `setupServer` (Node/Vitest)
- ใช้ร่วมกับ `/implement-to-production` เมื่อต้องการแปลง mock เป็น production code ภายหลัง

- Latest: `msw@2.15.0` (verified 2026-09-11)
- References: [apis](references/apis.md) | [cli](references/cli.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### 1. Review Tech Stack

> Goal: รู้ stack และ test runner ก่อนติดตั้ง

1. ทำ `/follow-my-tech-stack` และ `/review-techstack`
2. ระบุ environment: browser dev, Node tests, หรือทั้งสอง
3. ระบุ HTTP client ที่ใช้ (`fetch`, `axios`, `graphql-request`) — MSW intercept ที่ network layer ได้หมด

### 2. Install And Scaffold

> Goal: MSW ติดตั้งและ init ถูกต้อง

1. ติดตั้ง `bun add -D msw` (dev dependency)
2. ถ้าใช้ browser → `bunx msw init public/ --save` เพื่อสร้าง `mockServiceWorker.js`
3. สร้าง `src/mocks/handlers.ts` สำหรับ request handlers
4. สร้าง `src/mocks/browser.ts` (`setupWorker`) และ `src/mocks/node.ts` (`setupServer`)

### 3. Write Handlers

> Goal: handlers ครอบคลุม endpoints ที่ต้อง mock

1. ใช้ `http.get('/api/users', () => HttpResponse.json([...]))` สำหรับ REST
2. ใช้ `graphql.query('GetUser', ...)` สำหรับ GraphQL
3. เขียน happy path, error (4xx/5xx), network error (`HttpResponse.error()`) และ delay (`await delay()`)
4. แยก handlers ตาม domain ถ้าเยอะ: `src/mocks/handlers/<domain>.ts`

### 4. Wire Dev Mode

> Goal: mock ทำงานใน browser dev

1. ใน entry (`src/main.ts`): start worker เฉพาะ `import.meta.env.DEV` และ flag เปิดใช้
2. `await worker.start({ onUnhandledRequest: 'bypass' })` ก่อน render app
3. ทำให้ opt-in ผ่าน env เช่น `VITE_MSW=1` — ไม่บังคับ dev ทุกคนใช้ mock

### 5. Wire Test Mode

> Goal: mock ทำงานใน test suite

1. ใน test setup file: `beforeAll(() => server.listen())`, `afterEach(() => server.resetHandlers())`, `afterAll(() => server.close())`
2. ชี้ setup file ใน `vitest.config.ts` → `test.setupFiles`
3. ต่อ test ที่ต้องการ response เฉพาะ → `server.use(http.get(...))` override
4. ทำ `/run-test-unit` เพื่อยืนยัน tests ผ่านกับ mock layer

### 6. Report

> Goal: สรุปสิ่งที่ตั้งค่า

1. ทำ `/report` คอลัมน์: `No.`, `Endpoint`, `Method`, `Handler File`, `Covered Cases`
2. ระบุ endpoints ที่ยัง unhandled (`onUnhandledRequest: 'warn'` ช่วยหา)

## Rules

- ห้าม mock ด้วยการ patch `fetch`/`axios` — ใช้ MSW intercept ที่ network เท่านั้น
- Handlers ต้อง reflect real API contract — ถ้า API เปลี่ยนให้อัปเดต handlers
- ใช้ `onUnhandledRequest: 'warn'` ใน dev เพื่อหา endpoints ที่ยังไม่ mock
- แยก test override ด้วย `server.use()` — ห้ามแก้ base handlers เพื่อ test เดียว
- ไม่ commit `mockServiceWorker.js` ที่ generate เองนอก `public/` convention

- ใช้ /implement-to-production ถ้าจำเป็น
- ใช้ /run-test-api ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น

## Expected Outcome

- MSW ทำงานทั้ง browser dev และ test environments
- Handlers ครอบคลุม endpoints หลักพร้อม success/error cases
- Tests ไม่พึ่ง real network และ deterministic
