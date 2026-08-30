---
name: follow-tool-ultracite
description: ตั้งค่า Ultracite กับ Biome สำหรับ zero-config linting และ formatting
related:
  - follow-tool-biome
  - follow-tool-oxlint
  - follow-tool-eslint
  - follow-tool-formatter
  - follow-tool-linter
  - follow-lang-typescript
---

## Goal

ติดตั้งและตั้งค่า Ultracite กับ Biome/ESLint/Oxlint สำหรับ linting และ formatting แบบ zero-config

## Scope

ใช้สำหรับ JavaScript/TypeScript projects ที่ต้องการ linting และ formatting ทีเร็ว ไม่ต้อง config เยอะ

## Execute

### 1. Installation

> Goal: ติดตั้ง Ultracite และ dependencies

1. ตรวจสอบ package manager และ existing linter config
2. ติดตั้ง `bun add -D ultracite @biomejs/biome`
3. ติดตั้ม optional dependencies ถ้าจำเป็น เช่น `oxlint`
4. ดู install options ใน [references/ultracite.md](references/ultracite.md)

### 2. Initialize Configuration

> Goal: สร้าง config สำหรับ Ultracite

1. รัน `bunx ultracite init` สำหรับ interactive setup
2. เลือก linter toolchain เช่น `biome`, `eslint`, `oxlint`
3. เลือก frameworks ทีใช้งานจริง
4. สร้าง `biome.json` ด้วย `extends: ["ultracite/biome/core"]`
5. เพิ่ม framework presets ตามจำเป็น

### 3. Package Scripts

> Goal: เพิ่ม lint scripts

1. เพิ่ม `"lint": "ultracite check"` ใน `package.json`
2. เพิ่ม `"lint:fix": "ultracite fix"`
3. ทดสอบ `bun run lint`
4. ทดสอบ `bun run lint:fix`

### 4. Run Lint and Fix

> Goal: รัน linting และ auto-fix

1. รัน `bunx ultracite check` สำหรับ lint only
2. รัน `bunx ultracite fix` สำหรับ lint and auto-fix
3. รัน `bunx ultracite doctor` เพื่อ verify setup
4. ตรวจสอบไฟล์ที่แก้ไข แล้ว review diff

### 5. Customize and CI

> Goal: ปรับแต่ง rules และ integrate CI

1. ใช้ Ultracite presets ก่อน custom rules
2. เพิ่ม custom overrides อย่าง minimum
3. เพิ่ม lint step ใน CI pipeline
4. ไม่ commit ถ้า lint ไม่ผ่าน
5. ดู config options ใน [references/ultracite.md](references/ultracite.md)

## Rules

### 1. Configuration

- ใช้ `ultracite/biome/core` เป็น preset หลัก
- เลือก framework presets ตามทีใช้งานจริง
- custom overrides ต้อง minimum และมีเหตุผล

### 2. Scripts

- ใช้ `ultracite check` สำหรับ lint
- ใช้ `ultracite fix` สำหรับ auto-fix
- ใช้ `ultracite doctor` สำหรับ diagnose

### 3. CI

- รัน `bun run lint` ใน CI
- ไม่ commit ถ้า lint ไม่ผ่าน
- ใช้ `bun run lint:fix` ก่อน commit ถ้าจำเป็น

### 4. Migration

- ถ้ามี ESLint/Prettier config เดิม ให้ค่อยๆ migrate
- ใช้ Ultracite presets ก่อน
- ตรวจสอบว่า config ไม่ conflict

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- Ultracite ติดตั้งและ init เสร็จ
- `biome.json` สอดคล้องกับ Ultracite presets
- Lint scripts พร้อมใช้
- `bun run lint` ผ่าน
- CI รัน linting อัตโนมัติ
