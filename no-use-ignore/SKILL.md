---
name: no-use-ignore
description: ป้องกันการใช้ ignore comments/attributes และ ignore files ทุกประเภท แก้ปัญหาที่ source
---

## Goal

ป้องกันการใช้ ignore comments/attributes, ignore files, และ ignore config ทุกประเภท แก้ปัญหาที่ source แทนการ suppress

## Scope

ใช้สำหรับทุก workspace และทุกภาษา programming

## Execute

### 1. Identify Ignore Patterns

> Goal: Identify Ignore Patterns

ตรวจสอบ ignore patterns ใน codebase ทุกภาษาและทุกประเภท

1. ค้นหา `#[allow(...)]`, `#[expect(...)]` ใน Rust
2. ค้นหา `// eslint-disable`, `// biome-ignore`, `// @ts-ignore` ใน JS/TS
3. ค้นหา `# type: ignore`, `# noqa`, `# pylint: disable` ใน Python
4. ค้นหา `//nolint`, `//lint:ignore` ใน Go
5. ค้นหา `@SuppressWarnings` ใน Java
6. ค้นหา `#pragma warning` ใน C/C++
7. ค้นหา ignore files: `.eslintignore`, `.biomeignore`, `.prettierignore`, `.gitignore`
8. ค้นหา ignore sections ใน config files
9. ค้นหา ignore options ใน CLI commands

### 2. Analyze Root Cause

> Goal: Analyze Root Cause

วิเคราะห์สาเหตุที่ต้องใช้ ignore

1. ตรวจสอบว่าเป็น false positive หรือ real issue
2. ตรวจสอบว่า config ผิดหรือไม่
3. ตรวจสอบว่า code design ผิดหรือไม่
4. ตรวจสอบว่า dependencies ผิดหรือไม่

### 3. Fix at Source

> Goal: Fix at Source

แก้ปัญหาที่ source แทนการ suppress

1. แก้ code ให้ผ่าน lint rules
2. ปรับ config ให้เหมาะสมกับ codebase
3. ปรับ code design ให้ถูกต้อง
4. อัพเดท dependencies ให้เป็น version ที่ถูกต้อง
5. สร้าง custom rules ถ้าจำเป็นจริงๆ

### 4. Remove Ignores

> Goal: Remove Ignores

ลบ ignore comments/attributes, ignore files, และ ignore config ทั้งหมด

1. ลบ `#[allow(...)]`, `#[expect(...)]` ใน Rust
2. ลบ `// eslint-disable`, `// biome-ignore`, `// @ts-ignore` ใน JS/TS
3. ลบ `# type: ignore`, `# noqa`, `# pylint: disable` ใน Python
4. ลบ `//nolint`, `//lint:ignore` ใน Go
5. ลบ `@SuppressWarnings` ใน Java
6. ลบ `#pragma warning` ใน C/C++
7. ลบ ignore files: `.eslintignore`, `.biomeignore`, `.prettierignore`
8. ลบ ignore sections ใน config files
9. ลบ ignore options จาก CLI commands

### 5. Verify

> Goal: Verify

ตรวจสอบว่าไม่มี ignore patterns เหลืออยู่

1. รัน lint tools ทุกตัว
2. ตรวจสอบว่าไม่มี errors/warnings
3. รัน tests ทั้งหมด
4. ตรวจสอบว่า code ทำงานได้ปกติ

## Rules

### 1. Rust Lint Attributes

ห้ามใช้ lint attributes สำหรับ suppress warnings

- ห้ามใช้ `#[allow(...)]` สำหรับ suppress lint
- ห้ามใช้ `#[expect(...)]` สำหรับ expect lint
- ห้ามใช้ `#[warn(...)]` สำหรับ change lint level
- ห้ามใช้ `#[deny(...)]` สำหรับ deny lint
- ห้ามใช้ `#[forbid(...)]` สำหรับ forbid lint
- แก้ปัญหาที่ source แทนการ suppress

### 2. JavaScript/TypeScript Comments

ห้ามใช้ ignore comments สำหรับ lint tools

- ห้ามใช้ `// eslint-disable` / `/* eslint-disable */`
- ห้ามใช้ `// eslint-disable-next-line`
- ห้ามใช้ `// eslint-disable-line`
- ห้ามใช้ `// biome-ignore` / `biome-ignore-all`
- ห้ามใช้ `// @ts-ignore`
- ห้ามใช้ `// @ts-nocheck`
- ห้ามใช้ `// @ts-expect-error`
- แก้ปัญหาที่ source แทนการ suppress

### 3. Python Comments

ห้ามใช้ ignore comments สำหรับ lint tools

- ห้ามใช้ `# type: ignore`
- ห้ามใช้ `# noqa`
- ห้ามใช้ `# pylint: disable=...`
- ห้ามใช้ `# pylint: disable-next=...`
- แก้ปัญหาที่ source แทนการ suppress

### 4. Go Comments

ห้ามใช้ ignore comments สำหรับ lint tools

- ห้ามใช้ `//nolint`
- ห้ามใช้ `//nolint:xxx`
- ห้ามใช้ `//lint:ignore`
- แก้ปัญหาที่ source แทนการ suppress

### 5. Java Annotations

ห้ามใช้ annotations สำหรับ suppress warnings

- ห้ามใช้ `@SuppressWarnings("...")`
- แก้ปัญหาที่ source แทนการ suppress

### 6. C/C++ Pragmas

ห้ามใช้ pragmas สำหรับ suppress warnings

- ห้ามใช้ `#pragma warning`
- ห้ามใช้ `__attribute__((warning))`
- ห้ามใช้ `// clang-format off`
- แก้ปัญหาที่ source แทนการ suppress

### 7. Ignore Files

ห้ามใช้ ignore files สำหรับ lint tools

- ห้ามใช้ `.eslintignore`
- ห้ามใช้ `.biomeignore`
- ห้ามใช้ `.prettierignore`
- ห้ามใช้ `.stylelintignore`
- ห้ามใช้ `.pylintignore`
- ห้ามใช้ ignore sections ใน config files
- ห้ามใช้ ignore options ใน CLI commands
- ใช้ `ignore` ใน config เฉพาะ `node_modules`, `dist`, `build`, `.git`
- แก้ปัญหาที่ source แทนการ ignore

### 8. Alternative Solutions

ใช้วิธีอื่นแทนการ suppress

- ปรับ config ของ lint tools ให้เหมาะสม
- สร้าง custom rules สำหรับ edge cases
- refactor code ให้ผ่าน lint rules
- อัพเดท dependencies ให้เป็น version ที่ถูกต้อง
- แยก code ที่มีปัญหาออกเป็น module แยก
- ใช้ feature flags สำหรับ code ที่ยังไม่พร้อม

## Expected Outcome

- ไม่มี ignore comments/attributes ใน codebase
- ไม่มี ignore files สำหรับ lint tools
- ไม่มี ignore config sections สำหรับ lint tools
- ปัญหาทั้งหมดถูกแก้ที่ source
- lint tools ทำงานได้เต็มประสิทธิภาพ
- code quality ดีขึ้นอย่างยั่งยืน