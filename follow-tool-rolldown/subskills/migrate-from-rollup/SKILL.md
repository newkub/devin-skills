---
name: follow-tool-rolldown-migrate-from-rollup
description: Migrate Rollup → Rolldown — plugin mapping, config translation, verify
argument-hint: "[project-path]"
related:
  - follow-tool-rolldown
  - scan-codebase
  - deep-impact
  - check-deprecated-apis
  - report-before-after
---

## Goal

ย้าย `rollup.config.*` ไปเป็น `rolldown.config.ts` โดย output เทียบเท่าเดิม — plugins map ถูก, config แปลงครบ, rollback ได้

## Scope

- ใช้กับ projects ที่มี `rollup.config.js/ts/mjs` และต้องการย้ายไป Rolldown standalone
- ครอบคลุม config translation, plugin mapping (`@rollup/plugin-*` → Rolldown equivalents), output verification
- ถ้า Rollup ถูกใช้ผ่าน Vite → ใช้ `follow-tool-vite` subskill `migrate-to-rolldown` แทน

## Execute

### 1. Inventory Current Setup

> Goal: map ทุกจุดที่กระทบก่อนย้าย

1. อ่าน `rollup.config.*` — list `input`, `output` (dir/file/format/plugins), `external`, `plugins`, `treeshake`, `watch`
2. list plugins ทั้งหมดพร้อม version — แยก `@rollup/plugin-*` official vs community
3. เก็บ baseline: รัน rollup build เก็บ output file list + sizes
4. อ่าน official migration guide ที่ `rolldown.rs` — ทำ `/learn-web` ถ้าไม่แน่ใจ
5. commit state ก่อนเริ่ม — rollback path ต้องพร้อม

### 2. Install And Create Config

> Goal: สร้าง `rolldown.config.ts` คู่กับของเดิม

1. `bun add -D rolldown` — เก็บ `rollup` ไว้ก่อนจนกว่า verify ผ่าน
2. สร้าง `rolldown.config.ts` ใหม่ด้วย `defineConfig` จาก `rolldown` — อย่าลบ rollup config เดิม
3. แปลง options ทีละก้อน: `input` → `input`, `output.*` → `output.*` (ส่วนใหญ่ชื่อเดิม), `plugins` → `plugins`

### 3. Map Plugins

> Goal: ทุก plugin มี equivalent

1. เช็ค official plugin list ของ Rolldown — หลาย `@rollup/plugin-*` ใช้ต่อได้ หรือมี builtin/native replacement
2. priority: builtin feature > official Rolldown plugin (`@rolldown/*` หรือที่ docs ระบุ) > compatible Rollup plugin
3. plugin ที่ไม่มี equivalent → หน่วง migration หรือหา alternative — ดู official docs
4. ทดสอบ plugin ทีละตัว — comment ที่เหลือไว้ เปิดเพิ่มเมื่อ build ผ่าน

### 4. Translate Remaining Options

> Goal: options ทุกตัวมีปลายทาง

1. `external`, `globals`, `paths` → map ตรงใน `external`/`output.*`
2. `manualChunks` → `output.advancedChunks` (หรือ field ที่ official docs ระบุ)
3. `watch`, `onwarn`, `treeshake` → เช็ค equivalents ใน docs
4. options ที่ไม่มี counterpart → ตัดสินใจ: drop (ถ้า Rolldown ทำในตัว) หรือหา plugin

### 5. Verify Output

> Goal: output เทียบเท่า Rollup build

1. รัน `bunx rolldown -c` → build ผ่าน
2. compare file list, sizes, formats กับ baseline — diff ไฟล์สำคัญได้ถ้าจำเป็น
3. import/require ทุก entry ใน consumer → ทำงานเหมือนเดิม รัน test suite
4. ผ่านครบ → ลบ `rollup` deps + config เดิม แยก commit
5. ไม่ผ่านและแก้ไม่ได้ใน 3 รอบ → rollback แล้ว report สิ่งที่ค้าง

## Rules

### 1. Safety

- migration แยก commit ต่อ step — ห้ามผสมกับ feature work
- เก็บ rollup config จนกว่า verify ผ่านครบ — rollback path ต้องพร้อมเสมอ

### 2. Fidelity

- output ต้องเทียบเท่า: formats, externals, globals, sourcemap — ห้าม output ต่างโดยไม่ตั้งใจ
- plugin ที่เปลี่ยน behavior ต้อง flag ใน report

## Expected Outcome

- `rolldown.config.ts` แทน rollup config สมบูรณ์
- build ผ่าน output เทียบเท่าเดิม tests ผ่าน
- build เร็วขึ้นหรือเท่าเดิม
