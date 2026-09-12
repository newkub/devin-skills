---
name: follow-tool-msw-config-handlers
description: จัดระเบียน MSW handlers — error simulation, passthrough, overrides และ organization
argument-hint: "[scope]"
related:
  - follow-tool-msw
  - follow-config
  - run-test-api
  - report
---

## Goal

จัดระเบียนและขยาย MSW handlers ให้ maintainable — domain-based organization, error/network failure simulation, passthrough patterns, per-test overrides

## Scope

- ปรับ handlers ของ MSW ที่ setup แล้ว (setup → `subskills/setup-msw`)
- ครอบคลุม: file organization, success/error/delay responses, `passthrough()`, `server.use()` overrides, `onUnhandledRequest` strategies
- ไม่ครอบคลุม: install/scaffold ครั้งแรก

## Execute

### 1. Audit Current Handlers

> Goal: รู้ coverage และ gaps ของ handlers เดิม

1. อ่าน `src/mocks/handlers.ts` (หรือที่มีอยู่) — list endpoints ที่ mock แล้ว
2. เทียบกับ real API surface — ทำ `/report` คอลัมน์ `No.`, `Endpoint`, `Method`, `Handler File`, `Covered Cases`
3. ใช้ `onUnhandledRequest: 'warn'` หา endpoints ที่ app ยิงแต่ยังไม่มี handler

### 2. Organize By Domain

> Goal: handlers structure scale ได้

1. แยก handlers ตาม domain ถ้าเยอะ: `src/mocks/handlers/users.ts`, `orders.ts` เป็นต้น
2. `handlers.ts` รวมเป็น single export: `export const handlers = [...userHandlers, ...orderHandlers]`
3. แยก mock data/fixtures ออกเป็น `src/mocks/data/` — handlers ไม่ควร inline data เยอะ
4. ตั้งชื่อ handler exports ตาม domain — `userHandlers` ไม่ใช่ `handlers2`

### 3. Cover Response Cases

> Goal: ครอบคลุม success, error, delay, network failure

1. Happy path: `HttpResponse.json(data)` พร้อม status ที่ตรง contract (200/201)
2. Error responses: `HttpResponse.json({ message }, { status: 400/404/500 })` — ครอบ status ที่ app handle จริง
3. Network failure: `HttpResponse.error()` — จำลอง connection drop ไม่ใช่ HTTP error
4. Latency: `await delay(200)` หรือ `delay('infinite')` สำหรับ pending states
5. Dynamic responses: อ่าน `request`, `params`, `cookies` ใน resolver — ทำให้ mock ตอบตาม input

### 4. Passthrough And Selective Mocking

> Goal: mock เฉพาะที่ต้องการ ปล่อยที่เหลือผ่าน

1. ใช้ `passthrough()` จาก `msw` ใน resolver — intercept แล้วปล่อย request จริงต่อ (เช่น conditional บน header)
2. ตั้ง `onUnhandledRequest` ตาม context: `'warn'` (dev หา gaps), `'error'` (test strict), `'bypass'` (ปล่อยเงียบ), หรือ function สำหรับ whitelist เช่น analytics/sentry hosts
3. อย่าใช้ `http.all('*')` catch-all แทน passthrough — ไม่ได้ response จริงกลับมา

### 5. Per-Test Overrides

> Goal: test-specific responses โดยไม่แก้ base handlers

1. ใน test ที่ต้องการพฤติกรรมเฉพาะ → `server.use(http.get('/api/x', ...))` override ชั่วคราว
2. `server.resetHandlers()` ใน `afterEach` (จาก setup) reset overrides อัตโนมัติ
3. ห้ามแก้ base handlers เพื่อ test เดียว — ใช้ `server.use()` เสมอ
4. ทำ `/run-test-api` หรือ `/run-test` ยืนยัน suite ผ่าน

## Rules

- Handlers ต้อง reflect real API contract — API เปลี่ยนให้อัปเดต handlers ทันที
- Base handlers คือ happy path — error cases ทำผ่าน `server.use()` หรือ dedicated error handlers
- `passthrough()` ใช้ใน resolver เท่านั้น — ไม่ใช่สร้าง request ใหม่
- `onUnhandledRequest: 'error'` ใน tests ช่วยจับ unmocked calls — แต่ต้อง whitelist ของจริงก่อน
- อย่า inline mock data จำนวนมากใน resolver — แยก `data/` fixtures

## Expected Outcome

- Handlers จัดกลุ่มตาม domain พร้อม fixtures แยก
- ครอบคลุม success/error/delay/network-failure cases
- Per-test overrides ผ่าน `server.use()` — base handlers สะอาด
- Unhandled requests ถูกจัดการตาม context (warn/error/bypass)
