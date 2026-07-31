---
name: follow-bunup
description: ตั้งค่าและใช้งาน Bunup สำหรับ bundle TypeScript libraries ด้วย Bun's native bundler - เร็ว ง่าย และ auto-detect entry points
---

## Goal

ตั้งค่า Bunup เป็น library bundler ที่ใช้ Bun's native bundler สำหรับ TypeScript libraries ที่ต้องการความเร็วสูงและ type declarations generation

รองรับการติดตั้ง Bunup, กำหนดค่า bunup.config.ts, เพิ่ม build scripts ใน package.json, และรองรับ multiple output formats (ESM, CJS)

## Scope

ใช้สำหรับ TypeScript library projects ที่ต้องการ bundling ด้วย Bun's native bundler

## Execute

### 1. Analyze Project

1. ตรวจสอบว่าเป็น TypeScript library project
2. ยืนยันว่ามี Bun ติดตั้งแล้ว
3. ตรวจสอบว่ามี package.json อยู่แล้ว
4. ระบุ output formats ที่ต้องการ (ESM, CJS)

### 2. Setup Bunup

1. ติดตั้ง Bunup ด้วยคำสั่ง `bun add --dev bunup`
2. สร้างไฟล์ bunup.config.ts พร้อมกำหนด entry, format, dts generation
3. เพิ่ม build scripts ใน package.json (build, dev)
4. รัน build เพื่อตรวจสอบว่าทำงานได้ถูกต้อง

### 3. Verify Setup

1. ตรวจสอบ output ใน dist/ ว่าสร้างถูกต้อง
2. ยืนยันว่า type declarations (.d.ts) สร้างครบถ้วน
3. ทดสอบ build scripts ว่าทำงานได้

## Rules

1. การติดตั้ง

- ใช้คำสั่ง `bun add --dev bunup` เท่านั้น
- ตรวจสอบ installation สำเร็จก่อนดำเนินการต่อ

2. การกำหนดค่า

- สร้างไฟล์ `bunup.config.ts` ใช้ TypeScript format
- Bunup auto-detect entry points: index.ts, index.tsx, src/index.ts, src/index.tsx, cli.ts, src/cli.ts, src/cli/index.ts
- กำหนด output formats ด้วย `--format` flag ใน CLI หรือ config
- Enable dts generation ด้วย default (auto-generate)

3. Build Scripts

- เพิ่ม script `"build": "bunup"` ใน package.json
- เพิ่ม script `"dev": "bun run src/index.ts"` สำหรับ development
- เพิ่ม script `"build:watch": "bunup --watch"` สำหรับ watch build

4. Output Configuration

- ใช้ `--format esm,cjs` สำหรับ multiple formats
- ใช้ `--exports` สำหรับ generate และ sync package exports อัตโนมัติ
- ใช้ `--watch` สำหรับ development mode

5. โครงสร้างไฟล์

```text
project/
├── bunup.config.ts      # Bundle config (optional)
├── package.json          # Build scripts
├── src/
│   ├── index.ts         # Entry point (auto-detected)
│   └── cli.ts           # CLI entry (auto-detected)
└── dist/                 # Output
```

6. Expected Output

- package.json มี build scripts ครบถ้วน
- dist/ มี bundled files (ESM หรือ ESM + CJS)
- dist/*.d.ts มี type declarations ครบถ้วน

## Configuration Options Reference

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

## Reference

- `/validate` - ตรวจสอบความถูกต้องก่อนเริ่ม
- `/connect-workflows` - เชื่อมโยง workflows
- [Bunup Documentation](https://bunup.dev)

## Expected Outcome

- Bunup ติดตั้งและกำหนดค่าใน project
- `bunup.config.ts` พร้อม entry points และ output formats
- `package.json` มี build scripts สำหรับ bunup
- รองรับ ESM และ CJS formats
- สร้าง type declarations (dts) อัตโนมัติ
