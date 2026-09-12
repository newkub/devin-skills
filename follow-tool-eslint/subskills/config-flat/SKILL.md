---
name: follow-tool-eslint-config-flat
description: เขียน ESLint flat config — eslint.config.js structure, plugins, ignores
argument-hint: "[config-topic]"
related:
  - follow-tool-eslint
  - follow-lang-typescript
  - run-lint
---

## Goal

เขียน/ปรับ `eslint.config.js` (flat config) ให้ถูกต้อง — config array structure, plugins, files/ignores scoping

## Scope

- ครอบคลุม flat config format (`eslint.config.js`/`eslint.config.ts`) สำหรับ ESLint 9+/10
- structure: array of config objects, `files`, `ignores`, `plugins`, `rules`, `languageOptions`
- migration ไป oxlint → `subskills/migrate-to-oxlint/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: รู้ state เดิมก่อนแก้

1. เปิด `eslint.config.*` ที่ root — ถ้ามี `.eslintrc*` แทน → ESLint 10 ไม่รองรับ, ต้องแปลงเป็น flat config ก่อน (ดู official migration docs)
2. list plugins/presets ที่ใช้จาก `package.json`
3. ตรวจ `.eslintignore` — ต้องย้ายไป `ignores` ใน flat config

### 2. Config Structure

> Goal: array structure ถูกต้อง

1. `export default [ ... ]` — array ของ config objects, ลำดับสำคัญ (ทับกันทีหลัง)
2. ใช้ `defineConfig()` จาก `eslint/config` สำหรับ type safety
3. global ignores object: `{ ignores: [...] }` ที่ไม่มี `files` ทำหน้าที่เหมือน `.eslintignore`
4. base presets (`js.configs.recommended`, `ts.configs.recommended`) spread ก่อน custom objects

### 3. Plugins And Language Options

> Goal: register plugins และ parser ถูก

1. `plugins: { name: pluginObject }` — import plugin แล้วใส่ใน object, key = rule prefix
2. `languageOptions.parser` สำหรับ TS → ใช้ `typescript-eslint` (ไม่ใช่ parser เดี่ยว)
3. `languageOptions.globals` สำหรับ env globals — ใช้ `globals` package เช่น `globals.browser`, `globals.node`
4. scoped configs: `{ files: ['**/*.test.ts'], plugins: { ... }, rules: { ... } }` ต่อ concern

### 4. Rules And Ignores

> Goal: rules ครอบถูก scope

1. rules ใน object ที่มี `files` ครอบเฉพาะไฟล์นั้น — object ไม่มี `files` apply ทุกไฟล์
2. ignores หลัก: `dist/`, `node_modules/` (default), `coverage/`, generated files, `*.config.*` ถ้าไม่ต้อง lint
3. ใส่ config ที่ปิด rules (เช่น `eslint-config-prettier`) เป็นตัวสุดท้ายของ array
4. ตรวจ effective config ต่อไฟล์ด้วย `bunx eslint --print-config <file>`

### 5. Verify

> Goal: flat config ทำงานจริง

1. รัน `bunx eslint .` → lint ทุกไฟล์ที่ตั้งใจ ไม่มี config error
2. รัน `bunx eslint --print-config <file>` → เช็ค rules/plugins ที่ resolve จริง
3. เช็คไฟล์ที่ควร ignore ไม่ถูก lint
4. ถ้า config error → `/resolve-errors` max 3 รอบ แล้ว report

## Rules

### 1. Structure

- flat config เท่านั้นสำหรับ ESLint 9+/10 — ห้ามสร้าง `.eslintrc*` ใหม่
- ลำดับ array = precedence — preset ก่อน, overrides ทีหลัง, disables สุดท้าย
- ใช้ `defineConfig` เมื่อเป็น `.ts`

### 2. Scope

- ignores ใน flat config เท่านั้น — ไม่ใช่ `.eslintignore`
- plugins register per config object — rule prefix ต้องตรง key

## Expected Outcome

- `eslint.config.js/ts` ถูกต้อง: presets, plugins, scoped rules, ignores
- `eslint .` และ `--print-config` แสดง effective config ตรงตั้งใจ
