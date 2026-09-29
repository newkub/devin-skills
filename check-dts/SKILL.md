---
name: check-dts
description: ตรวจ .d.ts emit config — declaration options, types field, bundler dts
argument-hint: "[workspace]"
related:
  - run-typecheck
  - check-config-drift
  - check-monorepo
  - list-workspaces
  - follow-lang-typescript
  - review-config
  - report

---

## Goal

ตรวจสอบว่าแต่ละ package/workspace ใน project emit `.d.ts` ถูกต้องหรือไม่ — รวม tsconfig declaration options, `package.json` types field และ bundler dts config — แล้ว report เป็น table โดยมี column เป็น dts options

## Scope

- อ่าน `tsconfig*.json`, `package.json`, bundler config (`tsdown.config.*`, `tsup.config.*`, `bunup.config.*`, `build.ts`) ของทุก workspace
- report-only — ไม่แก้ไข config ใดๆ
- ใช้กับ TypeScript library/package ที่ต้อง ship types เป็นหลัก — app workspace ที่ไม่ publish ไม่บังคับ

## Execute

### 1. Discover Targets

> Goal: รู้ว่าต้องตรวจ workspace/tsconfig ไหนบ้าง

1. ทำ `/check-monorepo` เพื่อดูว่าเป็น monorepo หรือไม่
2. ถ้า monorepo → ทำ `/list-workspaces` เอา package list; ถ้าระบุ `[workspace]` → scope เฉพาะตัวนั้น
3. หา `tsconfig*.json` ทุกตัวในแต่ละ workspace (รวม `tsconfig.build.json`, `tsconfig.app.json` ที่ใช้ emit)

### 2. Collect Dts Options

> Goal: รวบรวมค่า dts-related options ของแต่ละ target

ต่อ target เก็บค่า:

1. tsconfig `compilerOptions`:
   - `declaration` — emit `.d.ts` หรือไม่
   - `declarationMap` — emit `.d.ts.map` สำหรับ go-to-definition
   - `emitDeclarationOnly` — emit เฉพาะ types
   - `declarationDir` — output dir ของ dts
   - `stripInternal` — ตัด `@internal` ออก
2. `package.json`:
   - `types` / `typings` field — path ชี้ไป entry `.d.ts`
   - `exports["."].types` — types condition ใน exports map
3. bundler/build config:
   - `tsdown`/`tsup` → `dts: true` หรือ `dts: {...}`
   - `bunup` → `dts` option
   - `tsc` emit โดยตรงใน build script
4. ถ้า value ไม่ได้ตั้ง → mark `-` (inherit/default)

### 3. Evaluate

> Goal: ตัดสิน pass/fail ต่อ target

1. library workspace (มี `main`/`exports` หรือ publish) → ต้องมี types entry ที่ resolve ได้ + dts emit เปิดอยู่ที่ใดที่หนึ่ง (tsconfig หรือ bundler)
2. types field ชี้ไปไฟล์ที่ไม่มีจริง/ไม่ถูก generate → fail
3. app workspace (no publish, `private: true`) → ไม่บังคับ ให้ mark `n/a`
4. `declarationMap` หายไปใน library → warn (DX ตก)

### 4. Report

> Goal: สรุปเป็น table ที่ column เป็น dts options

ทำ `/report` เป็น markdown table — column = dts types options:

| No. | Workspace | declaration | declarationMap | emitDeclarationOnly | declarationDir | types field | exports.types | bundler dts | Status |

- `No.` เป็นคอลัมน์แรก เรียง 1, 2, 3, ...
- cell แสดงค่าจริง (`true`, `false`, path) หรือ `-` ถ้าไม่ได้ตั้ง
- `Status` = `pass` / `warn` / `fail` / `n/a` พร้อมเหตุผลสั้นใน summary ใต้ตาราง

## Rules

- report-only — ห้ามแก้ config (check-* contract); ถ้าพบ fail ให้แนะนำ fix ใน summary
- อ่านค่าจากไฟล์จริงเท่านั้น — ห้ามเดา default ถ้าไม่ได้ระบุ ให้ mark `-`
- monorepo ต้องครบทุก workspace ที่เป็น library
- ใช้ `/report` เสมอ ห้าม plain list

## Expected Outcome

- Table รายงาน dts options ครบทุก library workspace พร้อม Status ต่อแถว
- ชี้ชัดว่า package ไหน ship โดยไม่มี types หรือ types field ชี้ผิด
