---
name: follow-create-eslint-plugin
description: สร้าง custom ESLint plugins ด้วย JavaScript/TypeScript
argument-hint: "[scope]"
related:
  - follow-create-sdk
  - deep-review
  - follow-tool-eslint
  - ship-to-dev-branch
  - report
  - run-lint
  - run-format
---
## Goal

สร้าง custom ESLint plugins ด้วย JavaScript/TypeScript เพื่อเพิ่ม rules ที่เฉพาะทางสำหรับโปรเจกต์

## Scope

ใช้สำหรับสร้าง custom ESLint plugins ด้วย JavaScript/TypeScript ครอบคลุม plugin entry, custom rules, metadata, testing และ flat config

- Packages: `eslint` (10.x — flat config only, Node >= 20.19, deprecated `context`/`SourceCode` members removed, fixer text ต้องเป็น string, RuleTester เข้มขึ้น), `typescript-eslint` — ยืนยันเวอร์ชันล่าสุดด้วย `/deep-research` + `/follow-best-practice` ทุกครั้ง (ไม่ pin ในไฟล์ — ตาม `/update-devin-global-skills`)

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/deep-research` + `/follow-best-practice` เพื่อยืนยันเวอร์ชันและ pattern ล่าสุด จากนั้นทำ `/deep-review` เพื่อสรุป tech stack
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป (create eslint plugins)

### 2. Setup

> Goal: เตรียม project directory และ dependencies สำหรับ plugin

1. สร้าง project directory สำหรับ plugin
2. สร้าง `package.json` ด้วย npm package name เป็น `eslint-plugin-*`
3. ติดตั้ง dependencies ที่จำเป็น

### 3. Create Plugin Entry

> Goal: สร้าง entry file ที่ export plugin object พร้อม properties ครบถ้วน

1. สร้าง entry file ที่ export plugin object
2. กำหนด properties: `meta` (`name`, `version`), `configs`, `rules`, `processors`
3. Export ESM (`export default plugin`) หรือ CommonJS (`module.exports = plugin`) — ถ้าต้องรองรับทั้ง flat config และ eslintrc ใช้ dual export: `plugin.configs["flat/recommended"]` (array ที่มี `plugins: { ns: plugin }`) + `plugin.configs.recommended` (eslintrc object `plugins: ["ns"]`)

### 4. Create Custom Rules

> Goal: สร้าง rule files และ implement rule logic ด้วย meta และ create function

1. สร้าง rule files ใน rules directory — rule export object ที่มี `meta` + `create(context)`
2. `create(context)` return visitor object — key เป็น node type/selector (เรียกตอน going down), `<type>:exit` (going up), หรือ code path events (`onCodePathStart`/`onCodePathEnd`)
3. ใช้ `context.options` (array ไม่รวม severity), `context.settings` (shared config), `context.sourceCode` (`getText`, `getFirstToken`/`getLastToken`/`getTokenBefore`/`getTokenAfter`, `getAncestors`, `getScope`, `getDeclaredVariables`, `isSpaceBetween`, comments APIs) — report ผ่าน `context.report()` หรือ `messageId`

### 5. Configure Rule Metadata

> Goal: กำหนด type, docs, fixable และ schema ของ rule ให้ครบถ้วน

1. กำหนด type: problem, suggestion, หรือ layout
2. เพิ่ม docs สำหรับ documentation
3. กำหนด fixable ถ้า rule สามารถ auto-fix ได้
4. กำหนด `schema` (JSON Schema array — validate `context.options` ตามตำแหน่ง) ถ้า rule มี options; `fixable`/`hasSuggestions` เป็น mandatory เมื่อ rule produce fix/suggestions — ถ้าไม่ระบุ ESLint throw error

### 6. Test Plugin

> Goal: ตรวจสอบว่า rules ทำงานถูกต้องผ่าน test files

1. สร้าง test files สำหรับ rules ด้วย `RuleTester` จาก `eslint` (`new RuleTester()` แล้ว `ruleTester.run('rule-name', rule, { valid, invalid })`)
2. valid cases ห้ามมี `errors`/`output` (ESLint 10 stricter — test จะ fail); invalid cases ใช้ `messageId` และ assertion options `requireMessage`/`requireLocation`/`requireData` ตามต้องการ
3. รัน tests ด้วย test runner (`vitest`, `bun:test` หรือ node test runner)
4. ตรวจสอบว่า rules ทำงานถูกต้อง

### 7. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship-to-dev-branch`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Package Name

- ใช้ naming convention `eslint-plugin-*`
- Namespace ใน config คือชื่อ package โดยตัด `eslint-plugin-` prefix ออก
- ตัวอย่าง: `eslint-plugin-example` → namespace `example`

### 2. Plugin Structure

- Export object ที่มี properties: meta, configs, rules, processors
- Meta: information เกี่ยวกับ plugin
- Configs: named configurations
- Rules: custom rule definitions
- Processors: named processors สำหรับ preprocess code

### 3. Rule Structure

- meta object ที่มี type, docs (`description`, `dialects`, `url`), messages (อ้างด้วย `messageId`, รองรับ `{{ placeholder }}`), fixable, hasSuggestions, schema
- type: problem (error/confusing behavior), suggestion (better way), layout (whitespace/formatting)
- fixable: "code" หรือ "whitespace" ถ้า rule สามารถ auto-fix ได้
- hasSuggestions: true ถ้า rule สามารถให้ suggestions ได้
- schema: options schema ถ้า rule มี options

### 4. Rule Implementation

- `create(context)` return visitor object — ใช้ `context.report()` เพื่อรายงาน violations
- ใช้ `context.sourceCode` สำหรับ access source code (ESLint 10 ลบ deprecated `context.getSourceCode()` และ deprecated `context`/`SourceCode` members ออกแล้ว)
- fixer: `insertTextBefore/After(node|range)`, `remove(Range)`, `replaceText(Range)` — `fix()` คืน fixing object, array หรือ generator; fixes เล็กที่สุด หนึ่ง fix ต่อ message ไม่เปลี่ยน runtime behavior (ESLint รัน rules ซ้ำสูงสุด 10 รอบ)
- fixer methods ต้องส่ง `text` เป็น string เสมอ (ESLint 10)
- ใช้ AST traversal สำหรับ analyze code

### 5. Configuration

- ESLint 10 รองรับ flat config เท่านั้น (legacy `.eslintrc` format ถูกลบออกแล้ว) และต้องการ Node.js >= 20.19 (ไม่รองรับ v21, v23)
- `eslint.config.js`/`mjs`/`cjs` export array ผ่าน `defineConfig` จาก `eslint/config`; config object มี `name`, `files`, `ignores`, `plugins`, `rules`, `languageOptions`, `settings` (shared ให้ทุก rule), `extends`
- ใน flat config `plugins` เป็น object ที่ map namespace → plugin object (ไม่ใช่ array เหมือน eslintrc) — define plugin inline ใน config ได้
- Import plugin และ assign namespace; ใช้ `extends` กับ `"ns/recommended"` หรือ `plugin.configs.recommended` ได้ (ต้อง declare `plugins` ก่อน)
- ใช้ rule format `namespace/rule-name` ใน rules object

- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /follow-tool-eslint ถ้าจำเป็น
- ใช้ /run-lint ถ้าจำเป็น
- ใช้ /run-format ถ้าจำเป็น

## Expected Outcome

- Plugin package สร้างขึ้นด้วย naming convention ถูกต้อง
- Custom rules สร้างขึ้นด้วย structure ถูกต้อง
- Plugin สามารถ configure ใน ESLint config
- Rules ทำงานได้เมื่อรัน ESLint
