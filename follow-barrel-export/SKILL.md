---
name: follow-barrel-export
description: แนวทางการสร้างและจัดการ barrel exports สำหรับ module public API
triggers:
- user
- model
allowed-tools:
- read
- edit
- write
- grep
- glob
- exec
- ask_user_question
related:
- follow-code-quality
---

## Goal

สร้างและจัดการ barrel exports (`index.ts`) เพื่อรวบรวม public API ของ module ให้เข้าถึงได้จากจุดเดียว

## Scope

ใช้สำหรับทุก workspace เมื่อสร้าง แก้ไข หรือ review barrel export files (`index.ts`, `index.tsx`, `__init__.py` หรือไฟล์ index ตาม convention ของภาษา)

## Execute

### 1. Analyze Module Structure

วิเคราะห์โครงสร้าง module ก่อนสร้าง barrel export

1. ระบุ files ทั้งหมดใน module ที่มี exports
2. แยก public API จาก internal implementation
3. ตรวจสอบว่ามี barrel export อยู่แล้วหรือไม่
4. ระบุ consumers ที่ import จาก module นี้

### 2. Create Or Update Barrel File

สร้างหรืออัปเดต barrel export file

1. สร้าง `index.ts` ที่ root ของ module (ถ้ายังไม่มี)
2. Export เฉพาะ public API ที่ consumers ต้องการใช้
3. ใช้ named exports สำหรับ explicit API surface
4. ใช้ `export type` สำหรับ type-only exports
5. ซ่อน internal symbols ที่ไม่ต้องเป็น public API
6. จัดเรียง exports ตาม source file ตามตัวอักษร

### 3. Choose Export Strategy

เลือก export strategy ตาม context

1. **Named exports** — ใช้เป็นหลัก กระชับ เข้าใจง่าย ตรวจสอบได้ว่า export อะไรบ้าง
2. **`export *`** — ใช้เฉพาะ schema files, type definition files, หรือเมื่อทุก export เป็น public API
3. **Mixed** — ใช้ `export *` สำหรับกลุ่มหนึ่ง และ named exports สำหรับอีกกลุ่ม เมื่อต้องการซ่อนบางส่วน

### 4. Update Imports

อัปเดต imports ใน consumers ให้ใช้ barrel export

1. เปลี่ยน deep imports เป็น barrel imports
2. ใช้ import alias ที่ตั้งค่าไว้แทน relative paths ที่ซับซ้อน
3. จัดเรียง imports ตามลำดับ: `external` → `internal` → `relative`
4. ตรวจสอบว่าไม่มี deep imports ที่ข้าม module boundary

### 5. Verify

ตรวจสอบ barrel export ทำงานถูกต้อง

1. รัน `run-typecheck` เพื่อตรวจสอบ type safety
2. รัน `run-lint` เพื่อตรวจสอบ code quality
3. ทำ `/check-circular-dependencies` เพื่อตรวจสอบ circular dependencies
4. ตรวจสอบว่าไม่มี unused exports โดยใช้ `run-check` หรือ `knip`
5. ตรวจสอบว่า tree-shaking ยังทำงานได้ (ไม่มี side effects ใน barrel file)

## Rules

### 1. Barrel File Content

- Barrel file มีเฉพาะ re-exports ไม่มี logic, ไม่มี side effects
- ไม่ import และ re-export ในบรรทัดเดียวกัน ใช้ `export ... from` เท่านั้น
- แยก `export type` จาก `export` ธรรมดาเพื่อ clarity
- ไม่ export default จาก barrel file ใช้ named exports เท่านั้น

### 2. Export Granularity

- Export เฉพาะสิ่งที่ consumers ต้องการจริง
- ซ่อน implementation details และ internal helpers
- ถ้า module มี sub-modules ให้สร้าง barrel file ระดับกลาง
- หลีกเลี่ยง barrel file ที่ export ทุกอย่างแบบไม่เลือก

### 3. Circular Dependency Prevention

- ไม่สร้าง barrel file ที่ import จากกันและกันระหว่าง sibling modules
- ถ้าเกิด circular dependency ให้แยก shared types ออกเป็นไฟล์ต่างหาก
- ใช้ `/check-circular-dependencies` เมื่อสงสัย
- พิจารณาใช้ type-only imports สำหรับ types ที่ใช้ข้าม module

### 4. Performance

- หลีกเลี่ยง `export *` จาก module ที่มี exports จำนวนมาก เพราะกระทบ tree-shaking
- ใช้ named exports เมื่อต้องการ granular control
- ตรวจสอบ bundle size หลังเปลี่ยน barrel export strategy
- พิจารณา dynamic imports สำหรับ large modules

### 5. Consistency

- ใช้รูปแบบ barrel export สม่ำเสมอทั่วทั้ง project
- จัดเรียง exports ตามตัวอักษรของ source file
- ใช้ naming conventions สม่ำเสมอ
- ทำ `/improve-consistency` เพื่อตรวจสอบ

## Expected Outcome

- Barrel export files ที่รวบรวม public API ของ module
- Import paths ที่สะอาดและสั้นลง
- Public API surface ที่ชัดเจนและควบคุมได้
- ไม่มี circular dependencies จาก barrel exports
- Tree-shaking ทำงานได้อย่างมีประสิทธิภาพ
- Internal implementation ถูกซ่อนจาก consumers
