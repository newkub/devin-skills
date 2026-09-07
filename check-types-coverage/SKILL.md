---
name: check-types-coverage
description: วัด type coverage ของ TypeScript หา any, ts-ignore และ weak types ที่กระจายอยู่
argument-hint: "[path-or-threshold]"
related:
  - use-astgrep
  - report
  - review-then-fix
---

## Goal

วัดระดับ type safety ของ TypeScript codebase โดยนับ `any`, `@ts-ignore`, `@ts-expect-error`, `as` casts และ non-null assertions เพื่อหาไฟล์/โมดูลที่ type อ่อน

## Scope

- ตรวจไฟล์ `*.ts`, `*.tsx` (ข้าม `*.d.ts` ของ dependencies และ generated files)
- ตัวชี้วัด: `any`, `unknown` ที่ไม่ narrowing, `@ts-ignore`, `@ts-expect-error`, `as <type>` cast, `!` non-null assertion, `Function`/`object` types
- Read-only: รายงานสถิติและจุดที่ควรแก้ — ไม่แก้ไข code

## Execute

### 1. Scan Weak Types

> Goal: นับ weak type patterns ทั้ง project

1. ใช้ `use-astgrep` หรือ `search-files-patterns` ค้นหา patterns:
   - `: any`, `<any>`, `as any`, `Array<any>`
   - `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`
   - non-null assertion `foo!.bar`
   - `as <ConcreteType>` casts (ยกเว้น `as const`)
2. นับจำนวนต่อไฟล์และต่อ directory
3. ถ้า project มี `typescript-coverage-report` หรือ `type-coverage` ใน devDeps ให้รันเพื่อได้ % coverage จริง

### 2. Score Per Module

> Goal: จัดอันดับไฟล์/โมดูลที่ type อ่อนที่สุด

1. คำนวณ weak-type density = weak patterns / lines of code ต่อไฟล์
2. จัดกลุ่มตาม directory/feature
3. flag ไฟล์ที่มี `@ts-nocheck` (ปิด type check ทั้งไฟล์) เป็น critical

### 3. Check Config Strictness

> Goal: ตรวจ tsconfig ว่าเปิด strict ครบ

1. อ่าน `tsconfig.json` ทุกไฟล์ใน project
2. ตรวจ `strict`, `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
3. flag flag ที่ปิดหรือ override ใน sub-config

### 4. Report

> Goal: รายงาน coverage และ priority fixes

1. ใช้ `/report` คอลัมน์: `No.`, `File/Module`, `Weak Patterns`, `Density`, `Severity`, `Suggestion`
2. สรุป overall type coverage % และ weak pattern totals
3. แนะนำ quick wins (ไฟล์ที่แก้น้อยแต่ได้ coverage เยอะ)

## Rules

### 1. Evidence-Based

- ทุก finding ต้องมี file path + line number
- แยก `any` ที่จำเป็น (เช่น third-party boundary) ออกจาก `any` ที่แก้ได้

### 2. Context Aware

- ข้าม test files, generated code, และ declaration files จากการนับ density
- `@ts-expect-error` ที่มี comment อธิบาย = severity ต่ำกว่าที่ไม่มี

### 3. Read-Only

- ไม่แก้ code — ถ้าต้องการแก้ให้ทำ `/review-then-fix` หรือ `/refactor`

## Expected Outcome

- Type coverage % และจำนวน weak patterns แยกตามชนิด
- ตารางไฟล์/โมดูลที่ type อ่อนที่สุดพร้อม severity
- tsconfig strictness gaps พร้อมคำแนะนำ
