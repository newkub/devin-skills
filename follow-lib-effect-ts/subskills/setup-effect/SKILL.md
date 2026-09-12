---
name: follow-lib-effect-ts-setup-effect
description: ติดตั้ง Effect-TS, tsconfig และ basics (Effect/Layer/Service) ให้พร้อมใช้งาน
argument-hint: "[runtime]"
related:
  - follow-lib-effect-ts
  - follow-lang-typescript
  - follow-tool-vitest
  - learn-web
  - resolve-errors
---

## Goal

ติดตั้ง Effect-TS และตั้งค่า TypeScript/project structure ให้เขียน `Effect`, `Layer`, `Service` ได้ถูกต้อง — first-time setup เท่านั้น

## Scope

- ใช้เมื่อ project ยังไม่มี `effect` หรือต้อง setup ใหม่ (ถ้ามีอยู่แล้ว → verify เท่านั้น)
- ครอบคลุม: install, `tsconfig.json`, project structure, Effect/Layer/Service basics
- ไม่ครอบคลุมการย้าย codebase เดิม — ทำ `subskills/migrate-to-effect/SKILL.md` แทน

## Execute

### 1. Check Precondition

> Goal: ตรวจสอบ environment ก่อน setup

1. อ่าน `package.json` — ถ้ามี `effect` แล้ว → skip ไป verify; ถ้า version เป็น v4 RC → อ่าน Version Notes ใน [../../references/effect-ts.md](../../references/effect-ts.md)
2. ยืนยัน TypeScript `>= 5.4` (`bunx tsc --version`)
3. ตรวจ package manager จาก lockfile แล้วใช้ command ที่ตรงกัน

### 2. Configure TypeScript

> Goal: tsconfig รองรับ Effect types

1. ตั้ง `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`, `skipLibCheck: true`
2. `target: "ES2022"`+, `moduleResolution: "bundler"` หรือ `"nodenext"` ตาม runtime
3. ทำ `/follow-lang-typescript` ถ้า base config ยังไม่พร้อม

### 3. Install Packages

> Goal: ติดตั้ง effect และ platform packages ตาม runtime

1. รัน `bun add effect` — runtime dependency ห้ามใส่ `-D`
2. `bun add @effect/platform` + `@effect/platform-bun` (Bun) หรือ `@effect/platform-node` (Node) ตาม runtime
3. `bun add -D vitest @effect/vitest` สำหรับ tests — ตรวจ peer `vitest ^3.2` ก่อน (setup ดู `/follow-tool-vitest`)
4. `Schema` อยู่ใน core `effect` — ห้ามติดตั้ง `@effect/schema` แยก (legacy)

### 4. Create Structure And Basics

> Goal: โครงสร้างโฟลเดอร์และ patterns พื้นฐาน

1. สร้าง `src/app` (composition root), `src/domain` (pure logic), `src/services` (services+layers), `src/adapters`, `src/config`, `src/types`, `src/utils`, `test/unit`, `test/integration`
2. Effect basics: `Effect.gen` + `yield*` สำหรับ composition, `pipe` สำหรับ chaining, `Effect.fn` สำหรับ named functions
3. Errors: `Data.TaggedError` สำหรับ expected errors แล้วจับด้วย `Effect.catchTag`/`catchTags`
4. DI: `Effect.Service` (v3.9+) สำหรับ service พร้อม default layer หรือ `Context.Tag` + `Layer.succeed`/`Layer.effect` สำหรับ manual
5. Config: `Config.string`/`Config.redacted` สำหรับ env — ห้ามอ่าน `process.env` ตรงๆ ใน services
6. Run เฉพาะ boundary: `Effect.runPromise`/`BunRuntime.runMain` ที่ entry point เท่านั้น — ดู [../../references/patterns.md](../../references/patterns.md)

### 5. Verify

> Goal: typecheck และ smoke effect ผ่าน

1. รัน `bunx tsc --noEmit` ให้ผ่าน
2. เขียน smoke effect เล็กๆ (service + layer + run ที่ entry) แล้วรันให้ได้ output
3. ถ้ามี tests → `bunx vitest run` ผ่าน (ใช้ `it.effect` จาก `@effect/vitest`)
4. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report; ผ่าน → `/suggest-next-action`

## Rules

- Idempotent — ถ้า setup ไปแล้วให้ verify เท่านั้น ห้าม reinstall/overwrite config เดิม
- `effect` เป็น runtime dep; import namespace: `import { Effect, Layer, Context } from "effect"`
- Run (`Effect.run*`) เฉพาะ application boundary — ห้ามใน service/library code
- ตรวจ version ใน `package.json` ก่อนเลือก API (v3 vs v4 RC ต่างกัน) — ถ้าไม่แน่ใจ → ดู official docs

## Expected Outcome

- `effect` + platform packages ติดตั้งตรง peer constraints
- `tsconfig.json` strict พร้อม, structure ตาม Effect architecture
- Service/Layer basics ทำงาน, typecheck + smoke test ผ่าน
