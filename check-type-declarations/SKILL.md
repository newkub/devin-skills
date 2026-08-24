---
name: check-type-declarations
description: ค้นหาและวิเคราะห์ d.ts files ทั้งใน project และ node_modules
---

## Goal

ค้นหาและวิเคราะห์ d.ts declaration files เพื่อเข้าใจ types ที่มีอยู่และสิ่งที่สามารถทำได้

## Scope

ครอบคลุมการค้นหา d.ts files ใน project source, node_modules dependencies, และ global type definitions

## Execute

### 1. Find DTS Files In Project

> Goal: ค้นหา `.d.ts` files ใน project
> Goal: รู้ internal d.ts files ทั้งหมด

1. ใช้ `fd` หรือ `find` เพื่อค้นหาไฟล์ `.d.ts` ใน project
2. ค้นหาใน `src/`, `types/`, `@types/` directories
3. รวบรวม path ของทุก d.ts files
4. แยกประเภท: internal types และ external types

### 2. Find DTS Files In Node Modules

> Goal: ค้นหา `.d.ts` files ใน dependencies
> Goal: รู้ external d.ts files ทั้งหมด

1. ค้นหาใน `node_modules/@types/` สำหรับ DefinitelyTyped
2. ค้นหาใน `node_modules/package-name/dist/*.d.ts`
3. ค้นหาใน `node_modules/package-name/*.d.ts`
4. รวบรวม d.ts files จาก dependencies ที่ติดตั้ง

### 3. Analyze Internal Types

> Goal: วิเคราะห์ d.ts files ใน project
> Goal: เข้าใจ custom types และ exports

1. อ่าน d.ts files ใน project
2. ระบุ interfaces, types, enums ที่สำคัญ
3. ตรวจสอบ exports และ re-exports
4. สรุป types ที่ custom สำหรับ project

### 4. Analyze External Types

> Goal: วิเคราะห์ d.ts files จาก dependencies
> Goal: เข้าใจ APIs จาก dependencies

1. อ่าน d.ts files จาก dependencies
2. ระบุ functions, classes, interfaces ที่ใช้ได้
3. ตรวจสอบ type exports และ default exports
4. สรุป APIs ที่พร้อมใช้งาน

### 5. Document Findings

> Goal: สร้าง summary ของ types
> Goal: มีรายงาน types ทั้งหมด พร้อม recommendations

1. สร้าง summary ของ types ทั้งหมด
2. จัดกลุ่มตาม functionality
3. ระบุ types ที่ยังไม่ได้ใช้
4. แนะนำ types ที่ควรใช้เพิ่มเติม

## Rules

### 1. File Discovery

- ใช้ `fd -e d.ts .` สำหรับค้นหาใน project
- ใช้ `fd -e d.ts node_modules` สำหรับ dependencies
- รวมทั้ง internal และ external types
- ตรวจสอบ `@types` packages แยกต่างหาก

### 2. Type Analysis

- ระบุ interfaces, types, enums, functions
- ตรวจสอบ generics และ type parameters
- ดู JSDoc comments สำหรับ documentation
- ตรวจสอบ export types และ default exports

### 3. Dependency Types

- ตรวจสอบว่า package มี d.ts built-in หรือต้องติดตั้ง @types
- ตรวจสอบ version compatibility
- ดู API signatures ที่เปลี่ยนไป
- ตรวจสอบ deprecated APIs

### 4. Internal Types

- ตรวจสอบว่า types ถูก export อย่างถูกต้อง
- ใช้ `export type` สำหรับ type-only exports
- หลีกเลี่ยง circular type references
- Document types ที่ซับซ้อน

### 5. Documentation

- สร้าง summary ของ types ที่มีอยู่
- จัดกลุ่มตาม modules หรือ functionality
- ระบุ types ที่ยังไม่ได้ใช้
- แนะนำ types ที่ควรใช้เพิ่มเติม

### 6. Common Mistakes

- ไม่ค้นหาใน `node_modules`
- ไม่ตรวจสอบ `@types` packages
- ไม่อ่าน JSDoc comments
- ไม่ระบุ types ที่ยังไม่ได้ใช้
- ค้นหาเฉพาะใน `src/` โดยไม่ดู `node_modules`
- ไม่ตรวจสอบ version compatibility
- ไม่ document types ที่ค้นพบ
- ใช้ types โดยไม่เข้าใจ API

## Expected Outcome

- รายการ d.ts files ทั้งหมดใน project
- รายการ d.ts files จาก dependencies
- สรุป types ที่ custom สำหรับ project
- สรุป APIs ที่พร้อมใช้งานจาก dependencies
- แนะนำ types ที่ควรใช้เพิ่มเติม

## Examples

### Find DTS Files

```bash
# ค้นหาใน project
fd -e d.ts . --exclude node_modules

# ค้นหาใน node_modules
fd -e d.ts node_modules

# ค้นหา @types packages
fd -e d.ts node_modules/@types
```

### Analyze Type

```typescript
// อ่าน d.ts file
import type { SomeInterface } from 'some-package'

// ดู type definition
interface SomeInterface {
  property: string
  method(): void
}
```

## Guide

### Tools

- `fd` - Fast file search
- `ripgrep` - Search within d.ts files
- `tsc --showConfig` - Show TypeScript config
- `tsc --listFiles` - List all files TypeScript includes
- `tsc --listEmittedFiles` - List emitted declaration files

### References

- [TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
