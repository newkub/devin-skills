---
name: follow-tool-tsdown
description: ตั้งค่า tsdown เป็น library bundler สำหรับ TypeScript ด้วย Rolldown
related:
  - follow-tool-rolldown
  - follow-tool-vite
  - follow-tool-build-packages
  - follow-lang-typescript
  - follow-tool-vitest
---

## Goal

ตั้งค่า tsdown เป็น library bundler สำหรับ TypeScript ด้วย Rolldown รองรับ type declarations และ multiple output formats

## Scope

ใช้สำหรับ TypeScript library projects ที่ต้องการ bundle ไปยัง ESM/CJS/IIFE พร้อม `.d.ts` generation

## Execute

### 1. Project Analysis

> Goal: ตรวจสอบว่า project เหมาะกับ tsdown

1. ยืนยันว่าเป็น TypeScript library project
2. ตรวจสอบ `package.json` และ Node.js version ไม่ต่ำกว่า 22.18
3. ระบุ output formats ทีต้องการ
4. ตรวจสอบ `src/index.ts` หรือ entry files

### 2. Installation

> Goal: ติดตั้ง tsdown

1. ติดตั้งด้วย `bun add -D tsdown`
2. ตรวจสอบ version ด้วย `bunx tsdown --version`
3. ใช้ `bunx tsdown --help` ดู CLI options
4. ดูรายละเอียดใน [references/tsdown.md](references/tsdown.md)

### 3. Configuration

> Goal: สร้าง `tsdown.config.ts` สำหรับ project

1. สร้าง `tsdown.config.ts` ที root
2. ใช้ `defineConfig` จาก `tsdown`
3. กำหนด `entry`, `format`, `dts`, `outDir`, `clean`
4. ตั้งค่า `platform` เป็น `node`, `browser`, หรือ `neutral`
5. ดู config options ใน [references/tsdown.md](references/tsdown.md)

### 4. Build Scripts

> Goal: เพิ่ม package scripts สำหรับ build

1. เพิ่ม `"build": "tsdown"` ใน `package.json`
2. เพิ่ม `"build:watch": "tsdown --watch"`
3. เพิ่ม `"dev": "tsdown --watch"` ถ้าจำเป็น
4. ตรวจสอบว่า scripts ทำงานบน Bun

### 5. Plugins and Validation

> Goal: เพิ่ม plugins และ validate package

1. เพิ่ม Rolldown/Rollup/unplugin plugins ใน `plugins` array
2. เปิดใช้ `publint: true` และ `attw: true` ถ้าต้องการ validate
3. รัน `bun run build` แล้วตรวจสอบ `dist/`
4. ตรวจสอบ `.d.ts` files สร้างครบถ้วน

### 6. Validate Output

> Goal: ตรวจสอบ output และ watch mode

1. ตรวจสอบ `dist/*.mjs`, `dist/*.cjs`, `dist/*.d.ts`
2. รัน `bunx tsdown --watch` เพื่อทดสอบ watch mode
3. ทดสอบ import output ใน project อื่น
4. ทำ `/follow-test` เพื่อรัน tests หลัง build

## Rules

### 1. Installation

- ใช้ `bun add -D tsdown` สำหรับ local install
- ตรวจสอบ Node.js version ก่อน
- ใช้ `bunx tsdown` สำหรับ one-off

### 2. Configuration

- ใช้ `tsdown.config.ts` และ `defineConfig`
- ระบุ `entry` เป็น array หรือ string
- กำหนด `format` เป็น `['esm', 'cjs']` ถ้าต้องการทั้งสอง

### 3. Build

- เปิดใช้ `clean: true`
- เปิดใช้ `treeshake` ตามค่าเริ่มต้น
- ตรวจสอบ `dist/` output หลัง build

### 4. Type Declarations

- เปิดใช้ `dts: true`
- ใช้ `vue` หรือ `react` dts option ถ้าใช้ framework
- ตรวจสอบ `.d.ts` สร้างครบ

### 5. Migration

- ใช้ `bunx tsdown-migrate` สำหรับ migrate จาก `tsup`
- ตรวจสอบว่า output เหมือนเดิมหลัง migrate
- แก้ config ที่ incompatible

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- `tsdown.config.ts` ถูกต้อง
- package.json มี build scripts
- `dist/` มี bundled files และ `.d.ts`
- Watch mode ทำงาน
- Validation (`publint`, `attw`) ผ่าน
