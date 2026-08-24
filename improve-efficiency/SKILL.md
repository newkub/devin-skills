---
name: improve-efficiency
description: ปรับปรุง build configuration, build time, output size, และ cost ของ project
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - improve-codebase
  - improve-database
  - improve-governance
  - improve-performance
  - run-check
  - suggest-next-action
  - validate
---

## Goal

ปรับปรุง build และ resource cost ของ project ให้ build เร็วขึ้น output เล็กลง และใช้เงิน/resource คุ้มค่า

## Scope

ใช้กับ project ที่มี build tool หรือ infrastructure ที่ต้องการปรับปรุง build time, output size, dependencies, และ cost

## Execute

### 1. Analyze Baseline
> Goal: รู้ build tool และมี baseline สำหรับเปรียบเทียบ
1. ทำ `/analyze-project` เพื่อระบุ project type, package manager, build tool
2. ตรวจหา build config (`bunup.config.ts`, `tsdown.config.ts`, `vite.config.ts`, `tauri.conf.json`)
3. บันทึก build time และ output size baseline
4. ถ้าไม่พบ build config → stop และ report

### 2. Optimize Build Configuration
> Goal: ให้ build เร็วขึ้น output เล็กลง
1. อ่าน build config ที่พบ
2. เปิด minify, ปิด sourcemap สำหรับ production ถ้าไม่จำเป็น
3. ตั้งค่า `target`, `external`, tree-shaking, `sideEffects: false` ถ้าเหมาะสม
4. ตรวจ output format, minify, sourcemap, external dependencies

### 3. Optimize Dependencies And Code Splitting
> Goal: ลด dead code และ bundle size
1. ทำ `/check-unused-deps` เพื่อหา dependencies ที่ไม่ใช้
2. ทำ `/follow-import-export` เพื่อตรวจ barrel files และ import paths
3. ใช้ `/scan-codebase` หา unused files, dead code, unused exports
4. ใช้ dynamic `import()` หรือ route-based lazy loading ถ้าเหมาะสม
5. ลบหรือ refactor imports ที่ยก module ทั้งหมดทั้งมา แต่ใช้บางส่วน

### 4. Optimize Assets And Build Artifacts
> Goal: ลดขนาด assets และ artifacts
1. ตรวจหา assets ขนาดใหญ่ใน `src/` หรือ `public/`
2. ลบ unused assets, ใช้ compression, convert format ถ้าจำเป็น
3. ทำ `/run-clean` เพื่อลบ artifacts และ cache เก่า
4. รัน build ใหม่และเปรียบเทียบกับ baseline

### 5. Optimize Cost
> Goal: ลด cost ของ infrastructure โดยไม่ทำลาย performance
1. ระบุ services ที่กิน cost สูง (compute, storage, bandwidth, logs)
2. ลด unnecessary resources, right-size instances, ใช้ spot/preemptible ถ้าเหมาะสม
3. ปิด environments/integrations ที่ไม่ใช้
4. ตรวจ logs retention, observability cost, data transfer
5. ใช้ `/follow-best-practice` หรือ `/learn-from-web` สำหรับ cloud stack

### 6. Verify And Report
> Goal: ยืนยันว่า build และ cost ดีขึ้น
1. ตรวจสอบว่า build artifacts ถูกสร้างและทำงานได้
2. ทำ `/report-table` เปรียบเทียบ before/after (build time, output size, cost)
3. รัน `/validate` และ `/run-check`
4. ถ้าไม่ผ่าน → `/resolve-errors` แล้ว retry (max 3)
5. สรุปผลด้วย `/report` และ `/suggest-next-action`

## Rules

### 1. Measure Before And After
- บันทึก build time, output size, cost baseline ก่อน optimize
- หยุดเมื่อไม่มีการปรับปรุงที่ significant

### 2. Preserve Functionality
- ไม่ลบ source code หรือ config ที่จำเป็น
- ไม่ลบ dependencies ที่ยังถูกใช้งาน
- ตรวจสอบว่า output ยังทำงานได้หลัง optimize

### 3. Conditional Steps
- ขั้นตอน assets ทำเฉพาะเมื่อ project มี assets
- ขั้นตอน barrel files ทำเฉพาะเมื่อ project มี barrel exports
- ถ้าไฟล์มากกว่า 10 ให้ใช้ `/use-scripts`

## Expected Outcome
- Build time ลดลงหรือคงที่
- Output size ลดลงหรือคงที่
- ไม่มี unused dependencies หรือ dead code
- Build ยังสร้าง output ถูกต้อง
- Cost ลดลงหรือใช้ resource คุ้มค่าขึ้น
- มี before/after metrics เปรียบเทียบ
