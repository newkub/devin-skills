---
name: watch-typecheck
description: Watch typecheck status และ fix type errors จนกว่าจะผ่าน
argument-hint: "[file-or-directory]"
related:
  - run-watch-typecheck
  - ask-me
  - resolve-errors
  - loop-until-complete
  - run-check
---

## Goal

Watch typecheck status อย่างต่อเนื่อง ตรวจจับ type errors และ fix จนกว่าจะผ่าน โดยไม่รวมการรัน `tsc --watch` เป็นเวลานาน (เป็นหน้าที่ของ `/run-watch-typecheck`)

## Scope

ใช้เมื่อต้องการ monitor typecheck ของ project ครั้งเดียวจนกว่าจะผ่าน ครอบคลุม TypeScript, Vue, Svelte และ project อื่นๆ ที่มี type checking

ไม่ครอบคลุม: การรัน watch mode อย่างต่อเนื่องขณะพัฒนา — ใช้ `/run-watch-typecheck` แทน

## Execute

### 1. Detect Typecheck Tool

> Goal: รู้ว่า project ใช้ typecheck tool ใด

1. ตรวจสอบ `package.json` field `scripts.typecheck` หรือ `scripts.type-check`
2. ถ้าไม่มี → ตรวจสอบ dependencies: `typescript`, `vue-tsc`, `svelte-check`
3. ถ้าเป็น TypeScript → ใช้ `tsc --noEmit`
4. ถ้าเป็น Vue → ใช้ `vue-tsc --noEmit`
5. ถ้าเป็น Svelte → ใช้ `svelte-check --tsconfig ./tsconfig.json`
6. ถ้าไม่พบ typecheck tool → ทำ `/ask-me`

### 2. Run Typecheck

> Goal: รัน typecheck ครั้งแรกเพื่อเก็บ errors

1. รัน typecheck command ที่ตรวจพบ
2. เก็บ output ทั้งหมด: file path, line, column, error code, message
3. นับจำนวน errors ทั้งหมด
4. ถ้าไม่มี error → typecheck ผ่าน → ไปขั้นตอน 5

### 3. Fix Type Errors

> Goal: แก้ type errors ทีละไฟล์จนหมด

1. จัดกลุ่ม errors ตาม file path
2. เรียงตาม priority: error ก่อน warning, file ที่มี error น้อยก่อน
3. ทำ `/resolve-errors` กับ errors ในแต่ละไฟล์
4. วิเคราะห์ root cause: missing type, incorrect type, missing import, circular dependency
5. แก้ไข code น้อยที่สุดตาม root cause
6. ห้ามใช้ `@ts-ignore` หรือ `@ts-expect-error` โดยไม่มีเหตุผล แก้ที่ source แทน

### 4. Re-run Until Pass

> Goal: วนรัน typecheck จนกว่าจะผ่าน

1. รัน typecheck ใหม่หลังแก้ไข
2. ถ้ายังมี error → กลับไปขั้นตอน 3
3. ใช้ `/loop-until-complete` จนกว่า typecheck ผ่าน
4. วนซ้ำสูงสุด `5` รอบ ถ้าเกิน → stop และ report

### 5. Report Result

> Goal: สรุปผลให้ user ทราบ

1. ถ้าผ่าน → report จำนวน errors ที่แก้, จำนวนรอบ, files ที่แก้
2. ถ้ายังไม่ผ่าน → report remaining errors, สาเหตุ, และ next step
3. ใช้ table สำหรับสรุปผลลัพธ์

## Rules

### 1. Scope Boundary

- ทำเฉพาะ watch และ fix จนกว่าจะผ่าน
- ห้ามรัน `tsc --watch` แบบต่อเนื่อง — ใช้ `/run-watch-typecheck` สำหรับสิ่งนั้น
- ห้ามเปลี่ยน `tsconfig.json` strictness settings เพื่อหลีกเลี่ยง errors

### 2. Error Handling

- แก้ที่ root cause ไม่ใช่ suppress
- ห้าม `@ts-ignore`, `@ts-expect-error` โดยไม่มีเหตุผล แก้ที่ source แทน
- ห้ามเปลี่ยน type เป็น `any` เพื่อหลีกเลี่ยง error
- ถ้า error มาจาก third-party types → ทำ `/ask-me` ก่อนแก้

### 3. Priority

- error ก่อน warning
- file ที่มี error น้อยก่อน เพื่อลด rework
- แก้ file ที่ import โดยอื่นก่อน เพื่อลด cascade

### 4. Safety

- ห้าม commit code ที่มี type errors
- ทำ `/run-check` หลังแก้ไขเสร็จ
- หยุดทันทีเมื่อ user กด `Ctrl+C`

### 5. Circuit Breaker

- ถ้า error เดิมเกิดซ้ำ ≥ `3` ครั้งหลังแก้ไข → stop และ report ว่า fix ไม่ได้ผล
- ถ้า fix สร้าง error ใหม่ใน file อื่น → stop หลัง `3` รอบ
- บันทึก error fingerprint (file + line + error code) เพื่อตรวจจับ recurring errors

### 6. Rollback Safety

- ก่อนแก้ไข code ให้สร้าง checkpoint ด้วย `git stash`
- ถ้า fix สร้าง type error ใหม่ใน file อื่น → `git stash pop` เพื่อคืนค่า
- ถ้า error count เพิ่มขึ้นหลังแก้ → พิจารณา revert และทำ `/ask-me`

### 7. Max Errors Threshold

- ถ้า errors > `100` → report "too many errors, manual intervention needed" และ stop
- ถ้า errors เพิ่มขึ้นหลังแก้ → หยุดและ report

### 8. Per-Round Timeout

- `perRoundTimeout` = `120` วินาที สำหรับแต่ละรอบ typecheck
- ถ้า typecheck ใช้เวลา > `120` วินาที → stop และ report

## Expected Outcome

- Typecheck ผ่านโดยไม่มี error
- Type errors ถูกแก้ที่ root cause ไม่ใช่ suppress
- ผลลัพธ์ report ครบ: จำนวน errors ที่แก้, จำนวนรอบ, files ที่แก้
- ไม่มี `@ts-ignore` หรือ `any` ที่หลีกเลี่ยง error
- ไม่มี TODO/MOCK/placeholder
- `SKILL.md` ไม่เกิน 250 บรรทัด
