---
name: optimize-build
description: ปรับปรุง build configuration และลดขนาด output เพื่อให้ build เร็วและเล็กลง
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ปรับปรุง build configuration และลดขนาด output เพื่อให้ build เร็วขึ้นและ output เล็กลง

## Scope

ใช้กับ project ที่มี build tool ใน `package.json` หรือ config file หนึ่ง (`bunup.config.ts`, `tsdown.config.ts`, `vite.config.ts`, `tauri.conf.json`) โดยไม่แก้ไข source logic หรือ public API

## Execute

### 1. Analyze Project And Baseline

ระบุ project type และ build tool พร้อมบันทึก baseline

> Goal: รู้ build tool และมี baseline สำหรับเปรียบเทียบ

1. ทำ `/analyze-project` เพื่อระบุ project type, package manager, build tool
2. ตรวจหา build config ที่ตรงกับ project (`bunup.config.ts`, `tsdown.config.ts`, `vite.config.ts`, `tauri.conf.json`)
3. รัน build แบบ baseline แล้วบันทึก build time และ output size
4. ถ้าไม่พบ build config หรือ build script → stop และ report

### 2. Review Build Configuration

อ่านและประเมิน build config ปัจจุบัน

> Goal: หาจุดที่ปรับปรุง config ได้

1. อ่าน build config file ที่พบ
2. ตรวจสอบ output format, target, minify, sourcemap, external
3. บันทึกค่าที่อาจ over/under-configure

### 3. Optimize Dependencies

ลด bundle size จาก dependencies ที่ไม่จำเป็น

> Goal: ลบ dependencies ไม่ใช้งานและปรับ import strategy

1. ทำ `/check-unused-deps` เพื่อหา dependencies ที่ไม่ได้ใช้
2. ทำ `/follow-import-export` เพื่อตรวจสอบ barrel files และ import paths
3. ถ้า project มี dependencies มากกว่า 10 ไฟล์ ให้ใช้ `/use-scripts` สำหรับ batch analysis
4. ตั้งค่า `sideEffects: false` ใน `package.json` ถ้าเหมาะสม

### 4. Optimize Imports And Code Splitting

ลด dead code และใช้ dynamic imports ถ้าได้

> Goal: ลด dead code และ split bundle อย่างมีประสิทธิภาพ

1. ใช้ `/scan-codebase` เพื่อหา unused files, dead code, หรือ unused exports
2. ตรวจสอบโอกาสใช้ dynamic `import()` สำหรับ code splitting
3. ลบหรือ refactor imports ที่ยกมาทั้ง module ทั้งๆ ที่ใช้บางส่วน

### 5. Optimize Assets

ลดขนาด assets ถ้ามี

> Goal: ลดขนาด assets โดยไม่ทำลาย functionality

1. ตรวจหา assets ขนาดใหญ่ใน `src/` หรือ `public/`
2. ลบ assets ที่ไม่ได้ใช้
3. ใช้ compression หรือ convert format ถ้าจำเป็น

### 6. Apply Build Optimizations

แก้ไข build config ตาม findings

> Goal: build config ถูกตั้งค่าให้ output ขนาดเล็กและเร็วขึ้น

1. เปิด `minify` สำหรับ production
2. ปิด `sourcemap` สำหรับ production ถ้าไม่จำเป็นต้อง debug
3. ตั้งค่า `target` ให้ตรงกับ runtime ที่รองรับ
4. ระบุ `external` สำหรับ dependencies ที่ไม่ควร bundle
5. ตั้งค่า tree-shaking ตาม build tool (`sideEffects`, `esbuild.treeShaking`, etc.)

### 7. Clean And Rebuild

ลบ artifacts เก่าแล้ว build ใหม่เพื่อตรวจสอบ

> Goal: ยืนยันว่า optimization ยังสร้าง output ถูกต้อง

1. ทำ `/run-clean` เพื่อลบ build artifacts และ cache เก่า
2. รัน build command ตาม package manifest
3. บันทึก build time และ output size ใหม่
4. เปรียบเทียบกับ baseline

### 8. Verify And Report

ตรวจสอบ output และสรุปผล

> Goal: รายงานผลลัพธ์และ next action ที่ชัดเจน

1. ตรวจสอบว่า build artifacts ถูกสร้างและทำงานได้
2. รัน `/report-format-table` เพื่อแสดง before/after metrics (build time, output size, bundle count)
3. รัน `/report-format-terminal` เพื่อสรุปการปรับปรุง
4. ถ้า output size หรือ build time ไม่ดีขึ้น → ระบุสาเหตุและแนะนำ next step

## Rules

### 1. Measure Before And After

- บันทึก build time และ output size baseline ก่อน optimize
- บันทึกค่าหลัง optimize เพื่อเปรียบเทียบ
- หยุดเมื่อไม่มีการปรับปรุงที่ significant

### 2. Preserve Functionality

- ไม่ลบ source code หรือ config ที่จำเป็น
- ไม่ลบ dependencies ที่ยังถูกใช้งาน
- ตรวจสอบว่า output ยังทำงานได้หลัง optimize

### 3. Conditional Steps

- ขั้นตอน Optimize Assets ทำเฉพาะเมื่อ project มี assets
- ขั้นตอน barrel files ทำเฉพาะเมื่อ project มี barrel exports
- การตั้งค่า `external` ทำเฉพาะเมื่อ project มี dependencies ที่ไม่ควร bundle
- ถ้า project มี file operations มากกว่า 10 ไฟล์ ให้ใช้ `/use-scripts`

### 4. Build Tool Specifics

- `bunup`: ตั้งค่า `minify`, `sourcemap`, `external` ใน `bunup.config.ts`
- `tsdown`: ตั้งค่า `minify`, `sourcemap`, `external` ใน `tsdown.config.ts`
- `vite`: ตั้งค่า `build.minify`, `build.sourcemap`, `build.rollupOptions.external` ใน `vite.config.ts`
- `tauri`: ตั้งค่า `bundle` options ใน `tauri.conf.json`

## Expected Outcome

- Build time ลดลงหรือคงที่
- Output size ลดลงหรือคงที่
- ไม่มี unused dependencies หรือ dead code ที่พบ
- Build ยังสร้าง output ถูกต้อง
- มี before/after metrics เปรียบเทียบ

## Example Template

```markdown
---
title: Optimize Build
description: ปรับปรุง build configuration และลดขนาด output
auto_execution_mode: 3
related:
  - /analyze-project
  - /check-unused-deps
  - /run-clean
  - /report-format-table
---

## Goal

ปรับปรุง build configuration และลดขนาด output

## Scope

ใช้กับ project ที่มี build tool ใน package.json หรือ config file

## Execute

### 1. Analyze Project

ระบุ project type และ build tool

> Goal: รู้ build tool ก่อน optimize

1. ทำ `/analyze-project`
2. บันทึก build time และ output size baseline

### 2. Optimize Dependencies

ลด bundle size จาก dependencies

> Goal: ลบสิ่งที่ไม่จำเป็น

1. ทำ `/check-unused-deps`
2. ทำ `/follow-import-export`

### 3. Rebuild And Verify

ลบ artifacts เก่าแล้ว build ใหม่

> Goal: ยืนยัน optimization

1. ทำ `/run-clean`
2. รัน build command
3. เปรียบเทียบกับ baseline

## Rules

### 1. Safety

- ไม่ลบ dependencies ที่จำเป็น
- ไม่ลบ source code

## Expected Outcome

- Build time ลดลง
- Output size ลดลง
- Build ยังทำงานได้
```
