---
name: follow-lib-zod-migrate-zod-v4
description: migrate Zod v3 → v4 — breaking changes, import path, API renames
argument-hint: "[scope]"
related:
  - follow-lib-zod
  - plan
  - scan-codebase
  - use-astgrep
  - check-deprecated-apis
  - run-typecheck
---

## Goal

migrate codebase จาก Zod v3 เป็น v4 อย่างปลอดภัย — import path, API renames, error handling changes — พร้อม rollback path และ verification ครบ

## Scope

- ใช้เมื่อ project ใช้ `zod@3.x` และต้องการขึ้น v4 หรือใช้ `zod/v4` subpath คู่กัน
- ครอบคลุม: import changes, deprecated APIs, error object changes, verification
- รายละเอียด API v4 ครบอยู่ใน parent `SKILL.md` และ official migration guide (zod.dev)

## Execute

### 1. Plan And Map Impact

> Goal: ระบุทุกจุดที่กระทบก่อนแก้

1. ทำ `/plan` — อ่าน `package.json` ยืนยัน version ปัจจุบัน, เขียน rollback path (revert commit + pin `zod@3`)
2. ทำ `/scan-codebase` หา import sites ทั้งหมด: `from "zod"`, `from "zod/v3"`, `zod/v4`
3. หา usage ของ APIs ที่เปลี่ยน: `.format()`, `.flatten()`, `.merge()`, `.strict()`, `.passthrough()`, `z.string().email()`, `error.errors`, `message` option
4. ตรวจ dependent libraries (เช่น `zod-to-json-schema`, form libs) ว่ารองรับ v4 หรือยัง — ถ้า blocker → stop report

### 2. Upgrade Package And Imports

> Goal: เปลี่ยน version และ import paths ให้ถูก

1. รัน `bun add zod@latest` (v4.x) — หรือถ้าต้อง migrate ค่อยเป็นค่อยไป: `zod@3.x` มี subpath `zod/v4` ให้ใช้ชั่วคราวได้
2. v4 code ใช้ `import * as z from "zod"` ปกติ; code เก่าที่ยัง v3 ให้เปลี่ยนเป็น `import * as z from "zod/v3"` ชั่วคราว
3. ใช้ codemod ถ้ามี (`zod` มี official codemod — ดู official docs) หรือทำ `/use-astgrep` สำหรับ rename patterns
4. แยก commit: package upgrade / import changes / API renames — ให้ bisect ได้

### 3. Fix API Renames

> Goal: แก้ breaking changes ทีละกลุ่ม

1. Error handling: `error.errors` → `error.issues`; `.format()`/`.flatten()` → `z.treeifyError()`; `message` param → `error` param
2. Schema methods: `.merge()` → `A.extend(B.shape)` หรือ spread; `.strict()` → `z.strictObject()`; `.passthrough()` → `z.looseObject()`
3. String formats: `z.string().email()` → `z.email()`, `.uuid()` → `z.uuid()`, `.url()` → `z.url()`
4. Removed types: `ZodEffects` ถูกลบ — refactor code ที่พึ่งพา internal types (`._zod` เป็น internal ห้ามใช้)
5. `safeParse` error ใน v4 ไม่ extend `Error` — แก้จุดที่เช็ค `instanceof Error`

### 4. Verify

> Goal: typecheck, tests และ runtime smoke ผ่านทั้งหมด

1. รัน `bunx tsc --noEmit` (ทำ `/run-typecheck`) — type errors จะเปิดจุดที่พลาด
2. รัน tests (ทำ `/run-test`) — โดยเฉพาะ schema validation tests และ error shape assertions
3. ทำ `/check-deprecated-apis` — ไม่มี v3 API เหลือ
4. Runtime smoke: parse input จริงผ่าน schema ที่เปลี่ยน — เช็ค error output shape
5. ถ้าค้าง → สร้าง TODO list; เสร็จ → `/report-before-after` แล้ว `/ship`

## Rules

- ห้ามผสม migration กับ feature work ใน commit เดียว — แยก commit ต่อ step
- ใช้ `zod/v3` subpath เป็น bridge ระหว่าง migrate ได้ แต่ต้องมีแผนย้ายออก
- ตรวจ dependent libraries ก่อน upgrade — lib ที่ยัง require v3 คือ blocker
- ถ้า API ใดไม่แน่ใจ → ดู official docs (zod.dev migration guide)

## Expected Outcome

- `zod` เป็น v4 ใน `package.json` ไม่มี v3 imports เหลือ (หรือเหลือเฉพาะ bridge ที่มีแผน)
- Typecheck, tests, runtime smoke ผ่าน
- ไม่มี deprecated APIs — พร้อม `/ship`
