---
name: follow-flat-folders
description: แปลงไฟล์ใน nested directories ให้เป็น flat structure ภายใน scope เดียว พร้อมอัปเดท references
---

## Goal

แปลงไฟล์ที่กระจายอยู่ใน nested directories ให้รวมอยู่ใน directory เดียว (flat structure) โดยเก็บความหมายของ path ไว้ใน filename พร้อมอัปเดท imports, exports, barrel, และ references

## Scope

ใช้เมื่อต้องลดความลึกของ directory tree เพื่อ simplify imports, ลด path alias, หรือเตรียม structure สำหรับ migration ทำงานภายใน directory ที่ระบุเท่านั้น และไม่กระทบ hidden/system/build directories

## Execute

### 1. Analyze Scope And Constraints

> Goal: รู้ขอบเขตและข้อจำกัดก่อนแปลง

1. ระบุ target directory ที่ต้องการ flatten
2. ระบุ exclusion patterns: `node_modules`, `.git`, `dist`, `.output`, `target`, `build`, `coverage`, hidden files
3. ตรวจสอบ `package.json`, `tsconfig.json`, `Cargo.toml` หรือ config อื่นๆ เพื่อดู path alias และ build pipeline
4. ทำ `/scan-codebase` เพื่อรายการไฟล์ทั้งหมดใน scope
5. ระบุว่ามี long paths หรือ filename ซ้ำหรือไม่

### 2. Generate Flat Mapping

> Goal: มี mapping ไฟล์เก่าเป็น flat name ทั้งหมด

1. สร้าง mapping จาก `old/path/file.ext` เป็น `flat-name.ext`
2. ใช้ kebab-case และเติมชื่อ parent directories เพื่อความ unique เช่น `domain-user-service.ts`
3. ถ้าเกิด name conflict → เพิ่ม prefix หรือ suffix ตาม parent จนถึงระดับที unique
4. เก็บ mapping ใน temporary JSON/CSV หรือในหน่วยความจำเพื่อ dry run

### 3. Validate And Confirm Mapping

> Goal: mapping ผ่าน validation และได้รับ user confirmation

1. ตรวจสอบว่า flat names ไม่ซ้ำ ไม่เกิน length limit ของ filesystem
2. ตรวจสอบว่าไม่ overwrite ไฟล์ที่มีอยู่
3. แสดง mapping ตัวอย่างให้ user ด้วย `/report-table`
4. ถ้ามีการลบ/ย้ายจำนวนมาก ให้ขอ user confirmation ด้วย `/ask_user_question` ก่อนดำเนื่อนการจริง
5. ถ้า user ไม่ยินยัน → stop และ report

### 4. Move Files And Update References

> Goal: ไฟล์อยู่ flat directory และ references ถูกต้อง

1. ย้ายไฟล์ตาม mapping ด้วย `git mv` ถ้าอยู่ใน git repo หรือ `Move-Item`/`mv` ถ้าไม่ใช่
2. แก้ไข relative imports (`../`, `./`) ในไฟล์ที่ย้าย
3. อัปเดท barrel exports (`index.ts`, `mod.ts`, `lib.rs`) ถ้ามี
4. อัปเดท `package.json` `exports`, `types`, `main` ถ้าจำเป็น
5. อัปเดท README, เอกสาร, และ comments ที่อ้างอิง path เก่า

### 5. Verify

> Goal: ไม่มี broken references และ build/test ผ่าน

1. ทำ `/validate` เพื่อตรวจสอบ broken references
2. รัน build / test / lint ตาม project
3. ทำ `/report-table` แสดง before/after path mapping
4. ถ้ามี error → แก้และ re-verify (max 3 ครั้ง → stop/report)

## Rules

### 1. Safety

- ทำ dry run ก่อนทุกครั้ง
- ขอ user confirmation ก่อน move/remove/overwrite
- ไม่ overwrite ไฟล์ที่มีอยู่โดยเด็ดขาด
- ไม่ลบ source ต้นฉบับจนกว่า verify ผ่าน

### 2. Exclusions

- ข้าม `node_modules`, `.git`, `dist`, `.output`, `target`, `build`, `coverage`, `tmp`, `temp`, `.cache`
- ข้าม hidden files/folders ยกเว้น explicit include
- ข้าม assets ที่ไม่ใช่ code (images, fonts, binaries) ยกเว้นได้รับระบุ

### 3. Naming

- ใช้ kebab-case สำหรับ flat filename
- เก็บ parent context ใน filename เพื่อ uniqueness
- ไม่เปลี่ยน extension
- ถ้ามี index files ให้ rename เป็น `dirname-index.ext` แทน

### 4. Reference Updates

- อัปเดท relative imports ทั้งหมดหลังย้าย
- อัปเดท path aliases ใน config ถ้าจำเป็น
- อัปเดท barrel exports และ `package.json` exports
- ไม่ลืม README, เอกสาร, และ test files

## Expected Outcome

- ไฟล์ทั้งหมดใน scope อยู่ใน flat directory ชื่อเดียว
- ชื่อไฟล์ unique เป็น kebab-case ไม่เกิน filesystem limits
- imports, exports, barrel, และ `package.json` อัปเดทถูกต้อง
- ไม่มี broken references
- build / test / lint ผ่าน
- รายงาน before/after mapping table ครบถ้วน
