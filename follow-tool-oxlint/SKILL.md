---
name: follow-tool-oxlint
description: ตั้งค่า eslint-plugin-oxlint สำหรับ fast linting ผ่าน ESLint 9+ flat config
related:
  - follow-tool-eslint
  - follow-tool-biome
  - follow-lang-typescript
  - follow-lang-javascript
---

## Goal

ติดตั้งและตั้งค่า `eslint-plugin-oxlint` สำหรับใช้งานร่วมกับ ESLint 9+ (flat config) เพื่อ linting ที่เร็วขึ้นด้วย Rust-based linter

## Scope

ใช้สำหรับตั้งค่าและใช้งาน oxlint ร่วมกับ ESLint 9+ flat config

## Execute

### 1. Install Dependencies

> Goal: ติดตั้ง oxlint และ eslint-plugin-oxlint

1. ติดตั้ง oxlint และ `eslint-plugin-oxlint` ด้วย package manager ของ project:
   - Bun: `bun add -D oxlint@latest eslint-plugin-oxlint`
   - npm: `npm install -D oxlint@latest eslint-plugin-oxlint`
   - pnpm: `pnpm add -D oxlint@latest eslint-plugin-oxlint`
   - yarn: `yarn add -D oxlint@latest eslint-plugin-oxlint`
2. ดูรายละเอียดใน [references/oxlint.md](references/oxlint.md)

### 2. Configure Oxlint

> Goal: สร้าง oxlint config สำหรับ project

1. สร้าง `oxlint.config.ts` หรือ `.oxlintrc.json`
2. กำหนด categories, rules และ plugins ตาม project
3. ดูรายละเอียดใน [references/oxlint.md](references/oxlint.md)

### 3. Configure ESLint

> Goal: ตั้งค่า ESLint flat config ใช้ร่วมกับ oxlint

1. สร้างหรือแก้ไข `eslint.config.js` ที่ root
2. ใช้ `oxlint.configs['flat/recommended']` หรือ `oxlint.buildFromOxlintConfig({ plugins: ['react', 'typescript', 'import'] })`
3. วาง oxlint config สุดท้ายใน array
4. ดูรายละเอียดใน [references/oxlint.md](references/oxlint.md)

### 4. Add Scripts

> Goal: เพิ่ม lint scripts ใน package.json

1. เพิ่ม `lint` script รัน `oxlint --type-aware`
2. เพิ่ม `lint:fix` script รัน `oxlint --type-aware --fix`
3. รัน `bun run lint` เพื่อทดสอบ
4. ดูรายละเอียดใน [references/oxlint.md](references/oxlint.md)

### 5. Verify

> Goal: ตรวจสอบว่า oxlint และ ESLint integration ทำงานได้

1. รัน `bun run lint`
2. ตรวจสอบว่า oxlint rules ทำงานถูกต้อง
3. ตรวจสอบว่า ESLint integration ทำงานได้
4. ดูรายละเอียดใน [references/oxlint.md](references/oxlint.md)

## Rules

### 1. Installation

- ใช้ package manager ของ project: `bun add -D` เป็นค่าเริ่มต้น, ยกเว้น project ใช้ npm เป็นหลักให้ใช้ `npm install -D`
- ติดตั้ง `oxlint` และ `eslint-plugin-oxlint` ให้เวอร์ชันตรงกัน

### 2. Configuration

- ใช้ flat config (ESLint 9+) เท่านั้น
- ไม่รองรับ legacy config (ESLint < 9)
- oxlint config ต้องอยู่สุดท้ายใน array เพื่อปิด rules ที่ซ้ำกับ ESLint

### 3. Scripts

- ต้องมี script `lint` ที่รัน `oxlint` ก่อน `eslint`
- ต้องมี script `lint:fix` สำหรับ auto fix

### 4. Performance

- รัน `oxlint` ก่อน `eslint` เสมอ เพราะเร็วกว่ามาก
- ใช้ `--cache` flag เมื่อรันบ่อย
- รันเฉพาะไฟล์ที่เปลี่ยนแปลงใน pre-commit hook

### 5. Plugins

- ใช้ oxlint built-in plugins ผ่าน `eslint-plugin-oxlint` configs
- ใช้ `buildFromOxlintConfig` กับ plugins array

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- `eslint-plugin-oxlint` ติดตั้งและทำงานได้
- Oxlint rules ทำงานผ่าน ESLint flat config
- Scripts `lint` และ `lint:fix` พร้อมใช้งาน
- สามารถใช้ร่วมกับ ESLint rules อื่นๆ ได้
