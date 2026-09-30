---
name: follow-lib-orpc-setup-orpc
description: ติดตั้ง oRPC, router/procedure basics, zod integration และ server handler
argument-hint: "[runtime-or-scope]"
related:
  - follow-lib-orpc
  - follow-lib-zod
  - follow-lib-effect-ts
  - learn
  - resolve-errors
---

## Goal

ติดตั้ง oRPC และสร้าง router/procedure พร้อม Zod validation + server handler ให้ API call ได้จริง — first-time setup เท่านั้น

## Scope

- ใช้เมื่อ project ยังไม่มี oRPC (ถ้ามีอยู่แล้ว → verify เท่านั้น)
- ครอบคลุม: install, `os` builder, procedures + zod `.input()`/`.output()`, `RPCHandler` mounting
- ไม่ครอบคลุม client, middleware, OpenAPI, TanStack Query — ดู parent `SKILL.md`

## Execute

### 1. Check Precondition

> Goal: ตรวจสอบ environment ก่อน setup

1. อ่าน `package.json` — ถ้ามี `@orpc/server` แล้ว → skip ไป verify; ตรวจ version (v1 stable vs v2 beta ต่างกัน — ดู Version Notes ใน parent)
2. ระบุ runtime/framework (Bun, Node, TanStack Start, Next.js) — เลือก handler package ให้ตรง
3. ถ้าไม่มี `zod` → ทำ `/follow-lib-zod` ก่อน (oRPC ใช้ Zod เป็น validator หลัก)

### 2. Install

> Goal: ติดตั้ง packages ขั้นต่ำ

1. รัน `bun add @orpc/server` (เพิ่ม `@orpc/client` ถ้า same-repo client ต้องใช้)
2. ยืนยันอยู่ใน `dependencies`; `zod` ต้องมีอยู่แล้ว

### 3. Define Procedures And Router

> Goal: router พร้อม zod-validated procedures

1. สร้าง `os` builder: `import { os } from "@orpc/server"` — เพิ่ม `.$context<{ headers: Headers }>()` ถ้าต้องการ initial context
2. Procedure: `.input(zodSchema).handler(async ({ input }) => { ... })` — ทำ `/follow-lib-zod` สำหรับ schemas
3. เพิ่ม `.output(zodSchema)` เมื่อต้อง validate response; `.errors({...})` เมื่อต้องการ type-safe errors
4. รวม procedures เป็น router: `{ users: { list, create } }` แล้ว `export type Router = typeof router`

### 4. Setup Server Handler

> Goal: handler ตอบ request ได้

1. ใช้ `RPCHandler` จาก `@orpc/server/fetch` (edge/fetch runtimes) หรือ `@orpc/server/node` (Node.js)
2. Mount ที่ route เช่น `/rpc/*` แล้วเรียก `handler.handle(request, { prefix: "/rpc", context: { headers: request.headers } })`
3. เช็ค `matched` — ถ้า false → return `404`/next handler
4. ตั้ง `interceptors: [onError((error) => console.error(error))]` สำหรับ error logging

### 5. Verify

> Goal: call procedure จริงผ่าน HTTP

1. Smoke: call procedure ผ่าน HTTP request หรือ test client — input ถูก validate, output ถูกต้อง
2. Invalid input → error response ชัดเจน (zod validation)
3. รัน `bunx tsc --noEmit` + lint — ถ้าไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report; ผ่าน → `/suggest-next-action`

## Rules

- Idempotent — ถ้า setup ไปแล้วให้ verify เท่านั้น
- `.input()` ทุก procedure ที่รับ input — Zod เป็น validator หลัก
- Export `type Router` เสมอ — client type inference ขึ้นกับมัน
- เลือก handler package ตาม runtime (`/fetch` vs `/node`) — ถ้าไม่แน่ใจ → ดู official docs (orpc.unnoq.com)
- ตรวจ version ก่อนเลือก API — v2 beta มี breaking changes (`isDefinedError` → `isInferableError` ฯลฯ)

## Expected Outcome

- `@orpc/server` ติดตั้ง, router + procedures พร้อม zod validation
- `RPCHandler` mount ถูก route — smoke call ผ่าน
- พร้อมทำ client/middleware ต่อตาม parent `SKILL.md`
