---
name: follow-tool-rolldown
description: ตั้งค่าและใช้ Rolldown สำหรับ bundle JavaScript/TypeScript ด้วยความเร็วสูง
related:
  - follow-tool-vite
  - follow-tool-tsdown
  - follow-tool-build-packages
  - follow-lang-typescript
---

## Goal

ตั้งค่าและใช้ Rolldown สำหรับ bundle JavaScript/TypeScript ด้วยความเร็วสูง รองรับ migration จาก Rollup และเลือกใช้ plugins ใน ecosystem ได้อย่างเหมาะสม

## Scope

ใช้สำหรับ JavaScript/TypeScript projects ที่ต้องการ bundler รวดเร็ว ต้องการ code splitting/tree-shaking หรือ migration จาก Rollup/Vite

## Execute

### 1. Installation

> Goal: ติดตั้ง Rolldown บน environment

1. ตรวจสอบ `package.json` และ package manager ที่ project ใช้
2. ติดตั้ง `rolldown` ด้วย `bun add -D rolldown`
3. ตรวจสอบ version ด้วย `bunx rolldown --version`
4. ดูรายละเอียดเพิ่มเติมใน [references/rolldown-commands.md](references/rolldown-commands.md)

### 2. Project Analysis

> Goal: ประเมิน project และเลือก migration path หรือ setup strategy

1. ตรวจสอบ existing bundler จาก `package.json` scripts และ config files
2. ถ้ามี `rollup.config.*` → วิเคราะห์ plugins, input, output ปัจจุบัน
3. ระบุ entry points, output formats (esm/cjs/iife/umd), และ target environment
4. ดูรายละเอียด ecosystem และ official resources ใน [references/official-resources.md](references/official-resources.md)

### 3. Configuration

> Goal: สร้าง `rolldown.config.ts` ที่ถูกต้อง

1. สร้าง `rolldown.config.ts` ที root project
2. ใช้ `defineConfig` จาก `rolldown` เพื่อ type safety
3. กำหนด `input`, `output.dir`, `output.format`, `treeshake`, `plugins`
4. เปิดใช้ `clear: true` สำหรับ production build ถ้าจำเป็น
5. อ่านตัวเลือก top-level ใน [references/rolldown-config-toplevel.md](references/rolldown-config-toplevel.md)

### 4. Build and Watch

> Goal: รัน build และ watch mode แล้วตรวจสอบ output

1. รัน build ด้วย `bunx rolldown`
2. ใช้ `bunx rolldown --watch` สำหรับ development
3. ตรวจสอบ output ใน `dist/` หรือ `output.dir` ที่กำหนด
4. รัน `bun run build` ผ่าน package script ถ้ามี
5. ดูรายละเอียด output options ใน [references/rolldown-config-output.md](references/rolldown-config-output.md)

### 5. Migration from Rollup

> Goal: ย้ายจาก Rollup ไปยัง Rolldown โดยไม่ทำลาย behavior

1. เปรียบเทียบ `rollup.config.*` กับ `rolldown.config.ts`
2. แทนที่ Rollup plugins ด้วย Rolldown-compatible plugins (`@rolldown/*` หรือ verified Rollup plugins)
3. ปรับ `output` options, `manualChunks`, `external`, `globals`
4. รัน build และ test suite เพื่อ verify output
5. ดูคำแนะนำ migration ใน `workflows/migrate-from-rollup-*.md`

### 6. Plugin and Ecosystem Selection

> Goal: เลือก plugins และ libraries ใน Rolldown ecosystem ที่เหมาะสม

1. ตรวจสอบ official plugins: `@rolldown/plugin-commonjs`, `@rolldown/plugin-node-resolve`, `@rolldown/plugin-terser`
2. ตรวจสอบ community plugins ว่า active และ compatible กับ Rolldown version
3. ใช้ `rolldown-plugin-dts` ถ้าต้องการ generate type definitions
4. อัปเดต plugin list เป็นระยะ โดยอ้างอิง official docs
5. ดู plugin list ใน [references/official-resources.md](references/official-resources.md)

## Rules

### 1. Installation

- ใช้ `bun add -D rolldown` สำหรับ local install
- ใช้ `bunx rolldown` สำหรับ one-off build
- ตรวจสอบ version และ Node.js compatibility ก่อนใช้

### 2. Configuration

- ใช้ `rolldown.config.ts` กับ `defineConfig` เสมอ
- กำหนด `input`, `output.dir`, `output.format` ให้ชัดเจน
- เปิดใช้ `treeshake` ตามค่าเริ่มต้น เว้นแต่มีเหตุผลเฉพาะ

### 3. Migration

- ไม่ rewrite source code เพื่อ migration
- เปรียบเทียบ output กับ Rollup build เดิมก่อน deploy
- ตรวจสอบ sourcemap และ chunking behavior

### 4. Plugins

- ใช้ official plugins ก่อน community plugins
- ตรวจสอบ maintenance status และ compatibility
- ไม่ hard-code paths หรือ secrets ใน config

## Expected Outcome

- Rolldown ติดตั้งและ build ได้
- `rolldown.config.ts` ถูกต้องและ maintainable
- Migration จาก Rollup smooth
- Output bundle มี performance ทีดีขึ้น
- Plugins เลือกใช้อย่างเหมาะสม
