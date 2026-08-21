---
name: run-build
description: รัน build process อย่างเป็นระบบเพื่อสร้าง production-ready artifacts
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - optimize-build
  - report-ansi
  - run-clean
  - report-table
  - run-typecheck
---

## Goal

รัน build process อย่างเป็นระบบเพื่อสร้าง production-ready artifacts

## Scope

ใช้กับ project ที่มี build script ใน package manifest โดย optimize build configuration ก่อน build

## Execute

### 1. Optimize Build

> Goal: ปรับปรุง build configuration และลดขนาด output ก่อน build
> Goal: build config และ dependencies พร้อมสำหรับ build ที่เร็วและเล็ก

1. ทำ `/optimize-build` เพื่อปรับปรุง build configuration, dependencies, imports และ assets
2. ถ้า `/optimize-build` ล้มเหลว → stop และ report

### 2. Typecheck

> Goal: ตรวจสอบ TypeScript types ก่อน build
> Goal: ไม่ให้ build fail จาก type errors

1. ทำ `/run-typecheck` เพื่อตรวจสอบ TypeScript types
2. ถ้ามี type errors → ทำ `/resolve-errors` แล้ว retry ตั้งแต่ `/run-typecheck` (max 3 → stop)

### 3. Install Dependencies

> Goal: ติดตั้ง dependencies ที่จำเป็น
> Goal: dependencies พร้อมสำหรับ build

1. รัน `bun install`
2. ตรวจสอบว่า dependencies ติดตั้งครบถ้วน

### 4. Clean Build Artifacts

> Goal: ลบ artifacts เก่าเพื่อ build ใหม่
> Goal: build ไม่มี artifacts หรือ cache เก่าปะปน

1. ทำ `/run-clean` เพื่อลบ build artifacts และ cache เก่า

### 5. Execute Build

> Goal: รัน build command ตาม package manifest
> Goal: build สำเร็จหรือได้ error ที่ชัดเจน

1. รัน `bun run build` หรือ build script ที่กำหนด
2. บันทึกเวลาที่ใช้
3. จับ output และ error แยกกัน

### 6. Verify Output

> Goal: ตรวจสอบ build artifacts
> Goal: output ถูกต้องและพร้อมใช้

1. ตรวจสอบว่า build artifacts ถูกสร้าง
2. ตรวจสอบ file size และจำนวน output files ที่เหมาะสม

### 7. Report

> Goal: สรุปผล build
> Goal: ผู้ใช้รู้ผลลัพธ์และ next action

1. รัน `/report-table` เพื่อแสดง build metrics (time, size, files)
2. รัน `/report-ansi` เพื่อแสดงสรุปผลลัพธ์

## Rules

### 1. Build Order

- Optimize: ทำ `/optimize-build` ก่อนเริ่ม
- Typecheck: ทำ `/run-typecheck` ก่อน build
- Install: ติดตั้ง dependencies
- Clean: ทำ `/run-clean` เพื่อลบ artifacts เก่า
- Build: รัน build command
- Verify: ตรวจสอบ output

### 2. Error Handling

- Typecheck ล้มเหลว: ทำ `/resolve-errors` ก่อน build
- Build ล้มเหลว: ทำ `/resolve-errors` เพื่อแก้ไข
- Warning: บันทึกและพิจารณาแก้ไข

### 3. Reporting

- ใช้ `/report-table` สำหรับ metrics
- ใช้ `/report-ansi` สำหรับสรุปข้อความ
- ไม่รายงานซ้ำซ้อน

## Expected Outcome

- Build สำเร็จไม่มี errors
- Typecheck ผ่านทั้งหมด
- Build artifacts ถูกต้อง
- Output size และ build time ถูกปรับปรุง

## Example Template

```markdown
---
title: Run Build
description: รัน build process สำหรับ production-ready artifacts
auto_execution_mode: 3
related:
  - /optimize-build
  - /run-typecheck
  - /run-clean
  - /resolve-errors
---

## Goal

รัน build process สำหรับ production-ready artifacts

## Scope

ใช้กับ project ที่มี build script

## Execute

### 1. Optimize Build
> Goal: build config พร้อม

1. ทำ `/optimize-build`

### 2. Typecheck
> Goal: ไม่มี type errors

1. ทำ `/run-typecheck`
2. ถ้ามี errors → ทำ `/resolve-errors`

### 3. Build
> Goal: build สำเร็จ

1. ทำ `/run-clean`
2. รัน build command

### 4. Report
> Goal: สรุปผล

1. ทำ `/report-table`
2. ทำ `/report-ansi`

## Rules

### 1. Order

- Optimize ก่อน build

## Expected Outcome

- Build สำเร็จ
```
