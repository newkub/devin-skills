---
name: watch-build
description: Watch build status และ fix build errors จนกว่าจะผ่าน
argument-hint: "[file-or-directory]"
related:
  - check-bottlenecks
---

## Goal

Watch build status อย่างต่อเนื่อง ตรวจจับ build errors และ fix จนกว่าจะผ่าน โดยไม่รวมการรัน `vite build --watch` เป็นเวลานาน (เป็นหน้าที่ของ `/run-watch-build`)

## Scope

ใช้เมื่อต้องการ monitor build ของ project ครั้งเดียวจนกว่าจะผ่าน ครอบคลุม Vite, Rollup, Webpack, esbuild, Bun และ build tool อื่นๆ

ไม่ครอบคลุม: การรัน build watch mode อย่างต่อเนื่องขณะพัฒนา — ใช้ `/run-watch-build` แทน

## Execute

### 1. Detect Build Tool

> Goal: รู้ว่า project ใช้ build tool ใด

1. ตรวจสอบ `package.json` field `scripts.build`
2. ถ้าไม่มี → ตรวจสอบ dependencies: `vite`, `rollup`, `webpack`, `esbuild`, `tsdown`, `bunup`
3. ถ้าเป็น Vite → ใช้ `vite build`
4. ถ้าเป็น Rollup → ใช้ `rollup -c`
5. ถ้าเป็น Webpack → ใช้ `webpack --mode production`
6. ถ้าเป็น Bun → ใช้ `bun run build`
7. ถ้าไม่พบ build tool → ทำ `/ask-me`

### 2. Run Build

> Goal: รัน build ครั้งแรกเพื่อเก็บ errors

1. รัน build command ที่ตรวจพบ
2. เก็บ output ทั้งหมด: error type, file path, line, message, stack trace
3. นับจำนวน errors ทั้งหมด
4. ถ้าไม่มี error → build ผ่าน → ไปขั้นตอน 5
5. ตรวจสอบ artifacts ที่สร้างใน `dist/` หรือ `build/`

### 3. Fix Build Errors

> Goal: แก้ build errors ทีละไฟล์จนหมด

1. จัดกลุ่ม errors ตามประเภท: import error, syntax error, config error, dependency error
2. เรียงตาม priority: config error ก่อน, แล้ว import error, แล้ว syntax error
3. ทำ `/resolve-errors` กับ errors ที่พบ
4. วิเคราะห์ root cause: missing import, wrong path, missing dependency, config ผิด, syntax ผิด
5. แก้ไข code น้อยที่สุดตาม root cause
6. ถ้า error มาจาก dependency ขาด → ทำ `/run-install` เพื่อติดตั้ง

### 4. Re-run Until Pass

> Goal: วนรัน build จนกว่าจะผ่าน

1. รัน build ใหม่หลังแก้ไข
2. ถ้ายังมี error → กลับไปขั้นตอน 3
3. ใช้ `/loop-until-complete` จนกว่า build ผ่าน
4. วนซ้ำสูงสุด `5` รอบ ถ้าเกิน → stop และ report
5. หลัง build ผ่าน → ตรวจสอบ artifacts ใน `dist/` หรือ `build/`

### 5. Report Result

> Goal: สรุปผลให้ user ทราบ

1. ถ้าผ่าน → report จำนวน errors ที่แก้, จำนวนรอบ, files ที่แก้, artifacts ที่สร้าง
2. ถ้ายังไม่ผ่าน → report remaining errors, สาเหตุ, และ next step
3. ใช้ table สำหรับสรุปผลลัพธ์

## Rules

### 1. Scope Boundary

- ทำเฉพาะ watch และ fix จนกว่าจะผ่าน
- ห้ามรัน build watch mode แบบต่อเนื่อง — ใช้ `/run-watch-build` สำหรับสิ่งนั้น
- ห้ามเปลี่ยน build config เพื่อหลีกเลี่ยง errors โดยไม่จำเป็น

### 2. Error Handling

- แก้ที่ root cause ไม่ใช่ workaround
- ถ้า error มาจาก dependency ขาด → ทำ `/run-install`
- ถ้า error มาจาก config → ทำ `/review-delivery`
- ถ้า error มาจาก import path → ตรวจสอบ `tsconfig.json` paths และ barrel exports

### 3. Priority

- config error ก่อน เพราะส่งผลต่อ build ทั้งหมด
- import error ก่อน syntax error
- file ที่ import โดยอื่นก่อน เพื่อลด cascade

### 4. Safety

- ห้าม commit code ที่ build ไม่ผ่าน
- ทำ `/run-check` หลังแก้ไขเสร็จ
- หยุดทันทีเมื่อ user กด `Ctrl+C`
- ตรวจสอบ artifacts หลัง build ผ่าน

### 5. Circuit Breaker

- ถ้า error เดิมเกิดซ้ำ ≥ `3` ครั้งหลังแก้ไข → stop และ report ว่า fix ไม่ได้ผล
- ถ้า fix สร้าง error ใหม่ → stop หลัง `3` รอบ
- บันทึก error fingerprint (file + line + error type) เพื่อตรวจจับ recurring errors

### 6. Rollback Safety

- ก่อนแก้ไข code ให้สร้าง checkpoint ด้วย `git stash`
- ถ้า fix สร้าง build error ใหม่ → `git stash pop` เพื่อคืนค่า
- สำรอง artifacts ก่อน re-build ถ้าจำเป็น

### 7. Artifact Validation

- ตรวจสอบ `dist/` หรือ `build/` ไม่ใช่ empty
- ตรวจสอบ artifact size > `0` bytes
- ถ้า artifacts ผิดปกติ → report และ stop

### 8. Resource Checks

- ตรวจสอบ disk space > `1GB` ก่อน build
- ถ้า disk space ไม่พอ → stop และ report
- ถ้า build OOM → stop และ report "out of memory"

### 9. Per-Round Timeout

- `perRoundTimeout` = `120` วินาที สำหรับแต่ละรอบ build
- ถ้า build ใช้เวลา > `120` วินาที → stop และ report

## Expected Outcome

- Build ผ่านโดยไม่มี error
- Build errors ถูกแก้ที่ root cause ไม่ใช่ workaround
- Artifacts ถูกสร้างใน `dist/` หรือ `build/`
- ผลลัพธ์ report ครบ: จำนวน errors ที่แก้, จำนวนรอบ, files ที่แก้, artifacts
- ไม่มี TODO/MOCK/placeholder
- `SKILL.md` ไม่เกิน 250 บรรทัด
