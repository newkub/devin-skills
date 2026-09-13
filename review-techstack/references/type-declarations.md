---
name: type-declarations
description: ค้นหาและวิเคราะห์ d.ts files ใน project และ node_modules
---

## Goal

ค้นหาและวิเคราะห์ `.d.ts` declaration files เพื่อเข้าใจ types ที่มีอยู่และสิ่งที่ใช้ได้

## Scope

ครอบคลุมการค้นหา `.d.ts` files ใน project source, `node_modules` dependencies, และ global type definitions

## File Discovery

### 1. Find DTS Files In Project

1. ค้นหาไฟล์ `.d.ts` ใน `src/`, `types/`, `@types/` directories
2. ใช้ `fd -e d.ts . --exclude node_modules`
3. แยกประเภท: internal types และ external types

### 2. Find DTS Files In Node Modules

1. ค้นหาใน `node_modules/@types/` สำหรับ DefinitelyTyped
2. ค้นหาใน `node_modules/package-name/dist/*.d.ts`
3. ค้นหาใน `node_modules/package-name/*.d.ts`
4. ใช้ `fd -e d.ts node_modules`

## Analysis Checklist

### 3. Analyze Internal Types

1. ระบุ interfaces, types, enums ที่สำคัญ
2. ตรวจ exports และ re-exports ถูกต้อง
3. ตรวจ `export type` สำหรับ type-only exports
4. ตรวจ circular type references
5. สรุป types ที่ custom สำหรับ project

### 4. Analyze External Types

1. ระบุ functions, classes, interfaces ที่ใช้ได้
2. ตรวจ type exports และ default exports
3. ตรวจ version compatibility ของ type definitions
4. ตรวจ deprecated APIs
5. สรุป APIs ที่พร้อมใช้งาน

### 5. Common Issues

- ไม่ค้นหาใน `node_modules` — พลาด external types
- ไม่ตรวจสอบ `@types` packages
- ไม่อ่าน JSDoc comments
- ไม่ระบุ types ที่ยังไม่ได้ใช้
- ใช้ types โดยไม่เข้าใจ API
- ไม่ตรวจ version compatibility

## Review Criteria

- ทุก public API มี type declarations
- ใช้ `export type` สำหรับ type-only exports
- ไม่มี circular type references
- Document types ที่ซับซ้อนด้วย JSDoc
- ตรวจ `@types` packages สำหรับ dependencies ที่ไม่มี built-in types
- ระบุ types ที่ยังไม่ได้ใช้และแนะนำ types ที่ควรใช้เพิ่ม

## Severity Classification

- Critical: missing TypeScript declarations สำหรับ public API, broken type exports
- High: circular type references, missing `@types` สำหรับ critical dependencies
- Medium: missing JSDoc บน complex types, unused type exports
- Low: naming convention, minor type documentation gaps

## Tools

- `fd` — fast file search (`fd -e d.ts`)
- `ripgrep` — search within d.ts files
- `tsc --showConfig` — show TypeScript config
- `tsc --listFiles` — list all files TypeScript includes
- `tsc --listEmittedFiles` — list emitted declaration files

## Expected Outcome

- รายการ `.d.ts` files ทั้งหมดใน project และ dependencies
- สรุป types ที่ custom และ APIs ที่พร้อมใช้งาน
- ระบุ issues พร้อม severity
- แนะนำ types ที่ควรใช้เพิ่มเติม
