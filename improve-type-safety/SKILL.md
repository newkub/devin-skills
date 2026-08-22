---
name: improve-type-safety
description: วิเคราะห์และปรับปรุง type safety ลด any เพิ่ม type inference และ strictness
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
---

## Goal

วิเคราะห์และปรับปรุง type safety ใน codebase ลด `any`, เพิ่ม type inference, และเพิ่ม strictness

## Scope

ใช้สำหรับ TypeScript codebase — ลด `any`, `unknown` ที่ไม่จำเป็น, เพิ่ม branded types, discriminated unions, และ type narrowing — ไม่รวมการ refactor ทั้งไฟล์ (ใช้ `/refactor`)

## Execute

### 1. Analyze Type Safety Issues

> Goal: วิเคราะห์ type safety issues ใน codebase
> Goal: รู้ว่ามี type issues อะไรบ้าง และจัดลำดับตาม severity

1. ทำ `/scan-codebase`, รัน `tsc --noEmit`, ทำ `/review-codebase` — ระบุ `any`, `as`, non-null assertions, missing return types
2. ค้นหา patterns: `: any`, `as any`, `as unknown`, `!`, `@ts-ignore`, `@ts-expect-error`, missing type annotations
3. จัดลำดับตาม severity: runtime bugs > type errors > missing types > style issues — ถ้าไม่มี issues → stop และ report

### 2. Fix Critical Type Issues

> Goal: แก้ไข type issues ที่มีผลกระทบต่อ runtime safety
> Goal: ไม่มี `any` ที่ทำให้เกิด runtime bugs

1. แทนที่ `any` ด้วย `unknown` + type narrowing หรือ specific types
2. ลบ `as` assertions ที่ไม่จำเป็น — ใช้ type guards หรือ proper type definitions แทน
3. ลบ `@ts-ignore` และ `@ts-expect-error` — แก้ root cause แทนการ suppress
4. แทนที่ non-null assertions (`!`) ด้วย proper null checks หรือ optional chaining
5. ถ้าแก้ไม่ได้ → ทำ `/resolve-errors` ก่อนดำเนินต่อ

### 3. Improve Type Design

> Goal: ปรับปรุง type design ให้ expressive และ maintainable
> Goal: Types เป็น single source of truth และ expressive

1. ใช้ type inference จาก schema และ API, เพิ่ม branded types สำหรับ IDs และ domain types, ใช้ discriminated unions สำหรับ state machines
2. เพิ่ม return types สำหรับ public functions — ใช้ `satisfies` แทน type annotations เมื่อเหมาะสม
3. ใช้ generic constraints และ conditional types แทน `any` — ใช้ `const` type parameters เมื่อเหมาะสม
4. ตรวจสอบ type flow: schema → validation → API → UI — ทำ `/follow-code-quality` สำหรับ type safety rules

### 4. Increase Strictness

> Goal: เพิ่ม strictness ใน `tsconfig.json` เพื่อป้องกัน type issues ในอนาคต
> Goal: tsconfig strict สุด เพื่อ catch type issues ตั้งแต่ compile time

1. ทำ `/follow-typescript` เพื่อตั้งค่า `tsconfig.json` ให้ strict สุด — ถ้าเป็น TS project ทุกครั้ง
2. ตรวจสอบ strict options: `strict: true`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`
3. เพิ่ม strict options ที่ขาด — ถ้าเพิ่มแล้วมี errors → แก้ก่อน (ไม่ suppress)
4. ถ้าเป็น monorepo → ตรวจสอบว่าทุก workspace ใช้ strict settings เดียวกัน
5. ถ้า strictness increase ทำให้เกิด errors เกิน 50 → แบ่งเป็น batches และทำทีละ batch

### 5. Validate And Report

> Goal: ตรวจสอบผลลัพธ์และรายงาน
> Goal: Type safety ดีขึ้น ผ่าน typecheck และมี report ชัดเจน

1. รัน `tsc --noEmit`, ทำ `/run-typecheck`, รัน lint (`bunx biome lint`)
2. เทียบ before/after: `any` count, `as` count, non-null assertion count, `@ts-ignore` count
3. ถ้า typecheck fail → ทำ `/resolve-errors` แล้ว retry (max 3 → stop/report)
4. รายงานเป็นตาราง: metric | before | after | status — ทำ `/suggest-next-action`

## Rules

### 1. Type Safety Principles

- ไม่มี `any` ใน production code — ใช้ `unknown` + type narrowing แทน
- ใช้ type inference จาก schema ไม่ประกาศ type ซ้ำ — ใช้ `satisfies` เมื่อต้องการ type check โดยไม่ lose inference
- ไม่ใช้ `as` assertions โดยไม่จำเป็น — ใช้ type guards, `instanceof`, หรือ proper type definitions
- ไม่ใช้ `@ts-ignore` หรือ `@ts-expect-error` — แก้ root cause แทนการ suppress

### 2. Strictness Progression

- เพิ่ม strictness ทีละ option ไม่เพิ่มทั้งหมดพร้อมกัน — แก้ errors ที่เกิดจากแต่ละ option ก่อนเพิ่ม option ถัดไป
- ถ้าเพิ่ม strictness แล้ว errors เกิน 50 → แบ่งเป็น batches
- ทุก workspace ใน monorepo ต้องใช้ strict settings เดียวกัน

### 3. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder — ไม่ลด type safety เพื่อแก้ปัญหาชั่วคราว

## Expected Outcome

- ไม่มี `any`, `as any`, `@ts-ignore` ใน production code
- Type flow ครบ: schema → validation → API → UI
- `tsconfig.json` strict สุด — ทุก strict options เปิด
- ตาราง report: metric | before | after | status
