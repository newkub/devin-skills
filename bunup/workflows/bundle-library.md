---
title: Bundle Library with Bunup
description: ใช้ Bunup เพื่อ bundle TypeScript library
auto_execution_mode: 3
---

## Goal

Bundle TypeScript library ด้วย Bunup ให้พร้อมใช้งาน

## Scope

ใช้สำหรับ TypeScript projects ที่ต้องการ bundle library

## Execute

### 1. Prepare

1. ตรวจสอบว่ามี `package.json` อยู่ใน project
2. ตรวจสอบว่ามี source files ใน `src/` หรือ directory ที่กำหนด
3. ตรวจสอบ entry points ใน `package.json` (main, module, types)

### 2. Install Bunup

1. ติดตั้ง Bunup: `bun add -D bunup`
2. หรือติดตั้ง CLI: `bun add -D @bunup/cli`

### 3. Configure Bunup

1. สร้างไฟล์ `bunup.config.ts` ถ้าต้องการ custom configuration
2. หรือใช้ zero-config mode (auto-detect entry points)

### 4. Bundle Library

1. รันคำสั่ง bundle: `bunup build`
2. ตรวจสอบ output ใน `dist/` directory
3. ตรวจสอบ TypeScript declarations ถ้ามี

### 5. Verify

1. ตรวจสอบว่า bundle files ถูกสร้างขึ้น
2. ตรวจสอบว่า TypeScript declarations ถูกสร้างขึ้น
3. ทดสอบ import library จาก output

## Rules

### Configuration

- ใช้ zero-config mode เมื่อเป็นไปได้
- กำหนด entry points ใน `package.json` ถ้าไม่ใช้ auto-detect
- ใช้ `bunup.config.ts` สำหรับ advanced configuration

### Output

- Default output directory: `dist/`
- Bundle formats: ESM, CJS (auto-detected)
- TypeScript declarations: `.d.ts` files

### Best Practices

- ใช้ `exports` field ใน `package.json` สำหรับ modern package exports
- กำหนด `types` field สำหรับ TypeScript declarations
- ใช้ workspaces สำหรับ monorepos

## Expected Outcome

- Library ถูก bundle เป็น ESM และ CJS formats
- TypeScript declarations ถูกสร้างขึ้น
- Output files อยู่ใน `dist/` directory
- Library พร้อมใช้งานและ publish
