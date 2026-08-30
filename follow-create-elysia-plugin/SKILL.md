---
name: follow-create-elysia-plugin
description: สร้าง Elysia plugin ด้วย TypeScript/Bun พร้อม type safety และ lifecycle hooks
related:
  - follow-create-bun-cli
  - follow-create-sdk
  - follow-lang-typescript
  - run-test
  - follow-my-tech-stack
  - review-techstack
  - report-table
---
## Goal

สร้าง Elysia plugin package ด้วย TypeScript/Bun ทีสามารถ `.use()` ใน Elysia app ได้ พร้อม decorators, state, hooks, routes, และ tests

## Scope

ใช้สำหรับสร้าง reusable Elysia plugin สำหรับ Bun/Node runtime รองรับ typed context, lifecycle hooks, prefix, scope, และ build package

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Setup Project

> Goal: สร้างโครงสร้าง plugin package

1. สร้าง directory `packages/{plugin-name}/`
2. สร้าง `package.json` ด้วย `name: elysia-{plugin-name}`
3. สร้าง `tsconfig.json` ด้วย `strict: true`
4. รัน `bun init` หรือ `npm init`

### 3. Create Plugin

> Goal: implement Elysia plugin

1. สร้าง `src/index.ts` ด้วย function ที return `new Elysia({ name, seed })`
2. เพิ่ม `.state()`, `.decorate()`, `.derive()` สำหรับ shared context
3. เพิ่ม routes ด้วย `.get()`, `.post()` ตาม need
4. เพิ่ม lifecycle hooks ด้วย `.onBeforeHandle()`, `.onAfterHandle()`, `.onError()`

### 4. Configure Plugin Options

> Goal: รองรับ options และ type safety

1. รับ options object เป็น parameter
2. ใช้ `asconst` หรือ Zod สำหรับ validate options
3. ส่ง generic types ผ่าน `Elysia<...>` ถ้าจำเป็น
4. ใช้ `seed` สำหรับ deduplication

### 5. Build Package

> Goal: build สำหรับ npm

1. ติดตั้ง `tsup` หรือ `bun build`
2. ตั้งค่า output `cjs` และ `esm`
3. external `elysia` ใน `package.json`
4. ระบุ `types`, `main`, `exports` ใน `package.json`

### 6. Add Tests

> Goal: ทดสอบ plugin

1. สร้าง `test/plugin.test.ts`
2. สร้าง Elysia app แล้ว `.use(plugin({ ... }))`
3. เรียก `app.handle(new Request('http://localhost/...'))` เพื่อทดสอบ
4. รัน `bun test`

### 7. Add Examples

> Goal: สร้างตัวอย่างการใช้งาน

1. สร้าง `examples/basic.ts`
2. สร้าง `examples/with-options.ts`
3. รันตัวอย่างให้ผ่าน

### 8. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

- ใช้ function ที return `new Elysia()` เป็น pattern เริ่มต้น
- `elysia` ต้องอยู่ใน `peerDependencies` ไม่ bundle เข้าไป
- ตั้งชื่อ plugin ด้วย `elysia-{name}`
- ใช้ lifecycle hooks สำหรับ cross-cutting concerns
- ทดสอบด้วย `app.handle()` โดยไม่ต้อง listen port

## Expected Outcome

- Elysia plugin package build ผ่าน
- Plugin สามารถ `.use()` ใน Elysia app ได้
- Type inference ของ context ทำงาน
- Tests ผ่าน
- Examples รันได้
