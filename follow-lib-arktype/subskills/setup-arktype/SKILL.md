---
name: follow-lib-arktype-setup-arktype
description: ติดตั้ง ArkType, type() syntax basics และ scope config ให้พร้อมใช้งาน
argument-hint: "[scope]"
related:
  - follow-lib-arktype
  - follow-lib-zod
  - follow-lang-typescript
  - learn
  - resolve-errors
---

## Goal

ติดตั้ง ArkType และตั้งค่า TypeScript/editor ให้ `type()` syntax และ `scope()` ทำงานถูกต้อง — first-time setup เท่านั้น

## Scope

- ใช้เมื่อ project ยังไม่มี ArkType หรือต้อง setup ใหม่ (ถ้ามีอยู่แล้ว → verify เท่านั้น)
- ครอบคลุม: install, `tsconfig.json`, editor settings, `type()` basics, `scope()` config
- ไม่ครอบคลุม advanced patterns — ดู parent `SKILL.md` และ `references/`

## Execute

### 1. Check Precondition

> Goal: ตรวจสอบ environment ก่อน setup

1. อ่าน `package.json` — ถ้าไม่มี → stop report; ถ้ามี `arktype` แล้ว → skip ไป verify
2. ยืนยัน TypeScript `>= 5.1` (`bunx tsc --version`)
3. ยืนยัน `"type": "module"` หรือ runtime รองรับ ESM — ArkType ต้องการ ESM
4. ถ้าไม่แน่ใจ requirement → ทำ `/learn-from-references` ดู official docs (arktype.io)

### 2. Install

> Goal: ติดตั้ง arktype เป็น runtime dependency

1. รัน `bun add arktype` (หรือ package manager ตาม lockfile)
2. ยืนยัน `arktype` อยู่ใน `dependencies` (ห้ามใส่ devDependencies — ใช้ที่ runtime)
3. ถ้าต้องการ regex types ติดตั้ง `arkregex` เพิ่ม (optional)

### 3. Configure TypeScript And Editor

> Goal: tsconfig และ editor รองรับ string-embedded type syntax

1. เปิด `strict: true` (หรือ `strictNullChecks: true` ขั้นต่ำ) ใน `tsconfig.json`
2. เปิด `exactOptionalPropertyTypes: true` และ `skipLibCheck: true`
3. เพิ่ม `.vscode/settings.json`: `"editor.quickSuggestions": { "strings": "on" }` และ exclude `"^(node:)?os$"` จาก auto-import (กันชนกับ Node `os` module)
4. ทำ `/follow-lang-typescript` ถ้า base config ยังไม่พร้อม

### 4. Define First Types

> Goal: สร้าง schemas ด้วย `type()` basics

1. `import { type } from "arktype"` แล้วกำหนด primitives: `type("string")`, `type("number")`
2. Object: `type({ name: "string", "age?": "number" })` — optional ด้วย `"key?"`
3. Union/intersection: `"string | number"`, `"a & b"` หรือ `.or()`/`.and()`
4. Validate: `Schema(data)` คืน output หรือ `ArkErrors`; `.assert(data)` throw; `.allows(data)` คืน boolean
5. Infer type: `typeof Schema.t` — ห้ามเขียน TS type ซ้ำแยก

### 5. Configure Scope

> Goal: grouped type definitions ที่ reference กันด้วย `scope()`

1. ใช้ `scope({ User: {...}, Post: { author: "User" } })` สำหรับ types ที่อ้างถึงกันใน scope เดียว
2. Export ด้วย `scope.export()` แล้วใช้ `scope.type()` สำหรับ scoped definitions
3. ใช้ `configure()` จาก `arktype/config` สำหรับ global options เมื่อจำเป็น
4. จัด scopes ตาม domain/feature — ห้ามรวมทุก type ใน global scope

### 6. Verify

> Goal: smoke check ว่า setup ทำงานจริง

1. รัน `bunx tsc --noEmit` ให้ผ่าน
2. รัน smoke: parse data จริงผ่าน `type()` ที่สร้าง — ได้ output หรือ `ArkErrors` ถูกต้อง
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report; ผ่าน → `/suggest-next-action`

## Rules

- Idempotent — ถ้า setup ไปแล้วให้ verify เท่านั้น ห้าม reinstall/overwrite config เดิม
- `arktype` เป็น runtime dependency เสมอ
- ใช้ type inference (`typeof Schema.t`) แทน manual type definitions
- เขียน config ขั้นต่ำก่อน แล้วค่อยเพิ่ม options — ถ้าไม่แน่ใจ → ดู official docs

## Expected Outcome

- `arktype` ติดตั้งเป็น runtime dep, tsconfig + editor พร้อม
- `type()` และ `scope()` ใช้งานได้ — validate ผ่าน smoke test
- Typecheck ผ่าน พร้อมใช้ patterns ขั้นสูงจาก parent `SKILL.md`
