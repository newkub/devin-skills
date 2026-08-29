---
name: follow-tool-bunup
description: ตั้งค่า Bunup สำหรับ bundle TypeScript libraries ด้วย ESM, CJS, และ dts
---

## Goal

ตั้งค่า Bunup เป็น library bundler สำหรับ TypeScript libraries ด้วย Bun's native bundler

## Scope

ใช้สำหรับ TypeScript library projects ที่ต้องการ bundling ด้วย Bun's native bundler — ดู `/follow-runtime-bun` สำหรับ setup Bun runtime

## Execute

### 1. Analyze Project

> Goal: ตรวจสอบ project, entry points, output formats, และ prerequisites ก่อนใช้ Bunup

1. ตรวจสอบว่าเป็น TypeScript library project
2. ยืนยันว่ามี Bun ติดตั้งแล้ว
3. ตรวจสอบว่ามี `package.json` อยู่แล้ว
4. ระบุ output formats ที่ต้องการ (ESM, CJS)

### 2. Setup Bunup

> Goal: ติดตั้ง Bunup, ตั้งค่า config, build scripts, และ build ลอง

1. ติดตั้ง Bunup ด้วยคำสั่ง `bun add --dev bunup`
2. สร้างไฟล์ `bunup.config.ts` พร้อมกำหนด `entry`, `format`, `dts`
3. เพิ่ม build scripts ใน `package.json` (`build`, `dev`, `build:watch`)
4. รัน build เพื่อตรวจสอบว่าทำงานได้ถูกต้อง

### 3. Verify Setup

> Goal: ตรวจสอบ build output, type declarations, และ build scripts

1. ตรวจสอบ output ใน `dist/` ว่าสร้างถูกต้อง
2. ยืนยันว่า type declarations (`.d.ts`) สร้างครบถ้วน
3. ทดสอบ build scripts ว่าทำงานได้

## Rules

### 1. Installation

- ใช้คำสั่ง `bun add --dev bunup` เท่านั้น
- ตรวจสอบ installation สำเร็จก่อนดำเนินการต่อ

### 2. Configuration

- สร้างไฟล์ `bunup.config.ts` ใช้ TypeScript format
- Bunup auto-detect entry points: `index.ts`, `index.tsx`, `src/index.ts`, `src/index.tsx`, `cli.ts`, `src/cli.ts`, `src/cli/index.ts`
- กำหนด output formats ด้วย `--format` flag ใน CLI หรือ config
- Enable dts generation ด้วย default (auto-generate)

### 3. Build Scripts

- เพิ่ม script `"build": "bunup"` ใน `package.json`
- เพิ่ม script `"dev": "bun run src/index.ts"` สำหรับ development
- เพิ่ม script `"build:watch": "bunup --watch"` สำหรับ watch build

### 4. Output Configuration

- ใช้ `--format esm,cjs` สำหรับ multiple formats
- ใช้ `--exports` สำหรับ generate และ sync package exports อัตโนมัติ
- ใช้ `--watch` สำหรับ development mode

### 5. Project Structure

```text
project/
├── bunup.config.ts      # Bundle config (optional)
├── package.json          # Build scripts
├── src/
│   ├── index.ts         # Entry point (auto-detected)
│   └── cli.ts           # CLI entry (auto-detected)
└── dist/                 # Output
```

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- Bunup ติดตั้งและกำหนดค่าใน project
- `bunup.config.ts` พร้อม entry points และ output formats
- `package.json` มี build scripts สำหรับ bunup
- รองรับ ESM และ CJS formats
- สร้าง type declarations (dts) อัตโนมัติ

## Guide

### CLI Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--format` | `string` | `esm` | Output format (esm, cjs, or esm,cjs) |
| `--exports` | `boolean` | `false` | Generate and sync package exports |
| `--watch` | `boolean` | `false` | Watch mode for development |
| `--config` | `string` | - | Path to config file |

### Default Entry Points

Bunup auto-detects:
- `index.ts`, `index.tsx`
- `src/index.ts`, `src/index.tsx`
- `cli.ts`, `src/cli.ts`, `src/cli/index.ts`

### Config File

Create `bunup.config.ts` for advanced configuration:

```typescript
import { defineConfig } from "bunup";

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true
})
```
