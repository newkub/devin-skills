---
name: follow-create-eslint-plugins
description: สร้าง custom ESLint plugins ด้วย JavaScript/TypeScript
---

## Goal

สร้าง custom ESLint plugins ด้วย JavaScript/TypeScript เพื่อเพิ่ม rules ที่เฉพาะทางสำหรับโปรเจกต์

## Scope

ใช้ `follow-create-eslint-plugins` สำหรับ tasks และ workflows เฉพาะที่กำหนด

## Execute

### 1. Setup

> Goal: Setup

1. สร้าง project directory สำหรับ plugin
2. สร้าง `package.json` ด้วย npm package name เป็น `eslint-plugin-*`
3. ติดตั้ง dependencies ที่จำเป็น

### 2. Create Plugin Entry

> Goal: Create Plugin Entry

1. สร้าง entry file ที่ export plugin object
2. กำหนด properties: meta, configs, rules, processors
3. Export สำหรับ ESM หรือ CommonJS

### 3. Create Custom Rules

> Goal: Create Custom Rules

1. สร้าง rule files ใน rules directory
2. กำหนด rule structure ด้วย meta object
3. Implement create function สำหรับ rule logic

### 4. Configure Rule Metadata

> Goal: Configure Rule Metadata

1. กำหนด type: problem, suggestion, หรือ layout
2. เพิ่ม docs สำหรับ documentation
3. กำหนด fixable ถ้า rule สามารถ auto-fix ได้
4. กำหนด schema ถ้า rule มี options

### 5. Test Plugin

> Goal: Test Plugin

1. สร้าง test files สำหรับ rules
2. รัน tests ด้วย test runner
3. ตรวจสอบว่า rules ทำงานถูกต้อง

### Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship-code`
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

- meta object ที่มี type, docs, messages, fixable, hasSuggestions, schema
- type: problem (error/confusing behavior), suggestion (better way), layout (whitespace/formatting)
- fixable: "code" หรือ "whitespace" ถ้า rule สามารถ auto-fix ได้
- hasSuggestions: true ถ้า rule สามารถให้ suggestions ได้
- schema: options schema ถ้า rule มี options

### 4. Rule Implementation

- Export function ที่รับ context object
- ใช้ context.report() เพื่อรายงาน violations
- ใช้ context.sourceCode สำหรับ access source code
- ใช้ AST traversal สำหรับ analyze code

### 5. Configuration

- ใช้ plugins key ใน flat config format
- Import plugin และ assign namespace
- ใช้ rule format `namespace/rule-name` ใน rules object

## Expected Outcome

- Plugin package สร้างขึ้นด้วย naming convention ถูกต้อง
- Custom rules สร้างขึ้นด้วย structure ถูกต้อง
- Plugin สามารถ configure ใน ESLint config
- Rules ทำงานได้เมื่อรัน ESLint