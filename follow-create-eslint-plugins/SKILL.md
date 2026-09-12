---
name: follow-create-eslint-plugins
description: สร้าง custom ESLint plugins ด้วย JavaScript/TypeScript
argument-hint: "[scope]"
related:
  - follow-create-sdk
  - follow-my-tech-stack
  - review-dependencies
  - follow-tool-eslint
  - ship
  - report
  - run-lint
  - run-format
---
## Goal

สร้าง custom ESLint plugins ด้วย JavaScript/TypeScript เพื่อเพิ่ม rules ที่เฉพาะทางสำหรับโปรเจกต์

## Scope

ใช้สำหรับสร้าง custom ESLint plugins ด้วย JavaScript/TypeScript ครอบคลุม plugin entry, custom rules, metadata, testing และ flat config

- Latest: `eslint@10.10.0` / `typescript-eslint@8.70.0` (verified 2026-09-12)

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-dependencies` เพื่อ review tech stack, dependencies, และ library design (create eslint plugins)
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป (create eslint plugins)

### 2. Setup

> Goal: เตรียม project directory และ dependencies สำหรับ plugin

1. สร้าง project directory สำหรับ plugin
2. สร้าง `package.json` ด้วย npm package name เป็น `eslint-plugin-*`
3. ติดตั้ง dependencies ที่จำเป็น

### 3. Create Plugin Entry

> Goal: สร้าง entry file ที่ export plugin object พร้อม properties ครบถ้วน

1. สร้าง entry file ที่ export plugin object
2. กำหนด properties: meta, configs, rules, processors
3. Export สำหรับ ESM หรือ CommonJS — ดู [references/flat-config-basics.md](references/flat-config-basics.md)

### 4. Create Custom Rules

> Goal: สร้าง rule files และ implement rule logic ด้วย meta และ create function

1. สร้าง rule files ใน rules directory
2. กำหนด rule structure ด้วย meta object — ดู [references/rule-structure-meta.md](references/rule-structure-meta.md)
3. Implement create function สำหรับ rule logic — ดู [references/rule-structure-context.md](references/rule-structure-context.md)

### 5. Configure Rule Metadata

> Goal: กำหนด type, docs, fixable และ schema ของ rule ให้ครบถ้วน

1. กำหนด type: problem, suggestion, หรือ layout
2. เพิ่ม docs สำหรับ documentation
3. กำหนด fixable ถ้า rule สามารถ auto-fix ได้
4. กำหนด schema ถ้า rule มี options — ดู [references/rule-structure-meta.md](references/rule-structure-meta.md)

### 6. Test Plugin

> Goal: ตรวจสอบว่า rules ทำงานถูกต้องผ่าน test files

1. สร้าง test files สำหรับ rules ด้วย `RuleTester` จาก `eslint` (`new RuleTester()` แล้ว `ruleTester.run('rule-name', rule, { valid, invalid })`)
2. valid cases ห้ามมี `errors`/`output` (ESLint 10 stricter — test จะ fail); invalid cases ใช้ `messageId` และ assertion options `requireMessage`/`requireLocation`/`requireData` ตามต้องการ
3. รัน tests ด้วย test runner (`vitest`, `bun:test` หรือ node test runner)
4. ตรวจสอบว่า rules ทำงานถูกต้อง

### 7. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Package Name

- ใช้ naming convention `eslint-plugin-*`
- Namespace ใน config คือชื่อ package โดยตัด `eslint-plugin-` prefix ออก
- ตัวอย่าง: `eslint-plugin-example` → namespace `example`

### 2. Plugin Structure

- Export object ที่มี properties: meta, configs, rules, processors — ดู [references/flat-config-basics.md](references/flat-config-basics.md)
- Meta: information เกี่ยวกับ plugin
- Configs: named configurations
- Rules: custom rule definitions
- Processors: named processors สำหรับ preprocess code

### 3. Rule Structure

- meta object ที่มี type, docs, messages, fixable, hasSuggestions, schema — ดู [references/rule-structure-meta.md](references/rule-structure-meta.md)
- type: problem (error/confusing behavior), suggestion (better way), layout (whitespace/formatting)
- fixable: "code" หรือ "whitespace" ถ้า rule สามารถ auto-fix ได้
- hasSuggestions: true ถ้า rule สามารถให้ suggestions ได้
- schema: options schema ถ้า rule มี options

### 4. Rule Implementation

- Export function ที่รับ context object — ดู [references/rule-structure-context.md](references/rule-structure-context.md)
- ใช้ context.report() เพื่อรายงาน violations
- ใช้ context.sourceCode สำหรับ access source code (ESLint 10 ลบ deprecated `context.getSourceCode()` และ deprecated `context`/`SourceCode` members ออกแล้ว)
- fixer methods ต้องส่ง `text` เป็น string เสมอ (ESLint 10)
- ใช้ AST traversal สำหรับ analyze code

### 5. Configuration

- ESLint 10 รองรับ flat config เท่านั้น (legacy `.eslintrc` format ถูกลบออกแล้ว) และต้องการ Node.js >= 20.19 (ไม่รองรับ v21, v23)
- ใช้ plugins key ใน flat config format — ดู [references/flat-config-basics.md](references/flat-config-basics.md) และ [references/flat-config-advanced.md](references/flat-config-advanced.md)
- Import plugin และ assign namespace
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
