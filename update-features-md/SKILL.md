---
name: update-features-md
description: วิเคราะห์ features ที่มีอยู่ใน project และเขียน FEATURES.md ที่ root ของ workspace
argument-hint: "[scope]"
related:
  - analyze-project
  - use-scripts
  - report-table
  - update-docs
---

## Goal

วิเคราะห์ features ที่มีอยู่ใน project และสร้าง `FEATURES.md` ที่ root ของ workspace พร้อมตาราง features

## Scope

- วิเคราะห์ routes, modules, database schemas, API endpoints
- ระบุ existing features พร้อม name, description, module, domain, status
- เขียน `FEATURES.md` ที่ root ของ workspace (monorepo ให้สร้างทุก workspace)
- แสดง existing features สั้นๆ ในแชทเป็นตาราง

## Execute

### 1. Analyze Project Structure

> Goal: ระบุ workspace และ tech stack ที่ต้องวิเคราะห์

1. ทำ `/analyze-project` เพื่อวิเคราะห์ project structure
2. ระบุ workspace ที่ต้องวิเคราะห์ (monorepo ให้ระบุทุก workspace)
3. บันทึก tech stack และ dependencies

### 2. Identify Features

> Goal: ระบุ features จากทุก source

1. อ่าน routes directory เพื่อระบุ pages และ user-facing features
2. อ่าน modules directory เพื่อระบุ business logic features
3. อ่าน database schema files เพื่อระบุ tables และ relationships
4. อ่าน server handlers และ API routes เพื่อระบุ endpoints
5. จัดกลุ่ม features ตาม domain และระบุ name, description, module
6. ถ้า monorepo เกิน 10 workspaces ให้ใช้ `/use-scripts`

### 3. Write FEATURES.md

> Goal: สร้าง `FEATURES.md` ที่ root ของ workspace

1. สร้าง/อัปเดท `FEATURES.md` ที่ root ของ workspace ด้วยตาราง markdown:
   - `| Feature | Description | Module | Domain | Status |`
2. กลุ่ม features ตาม domain ด้วย heading `## <domain>`
3. เขียนรายละเอียดสั้นใต้แต่ละ feature ด้วย bullet
4. monorepo ให้สร้าง `FEATURES.md` ที่ root ของทุก workspace ที่มี features
5. ไม่ต้องสร้าง `.devin/features/` หรือ `docs/project/features.md`

### 4. Report In Chat

> Goal: สรุปผลลัพธ์ให้ user

1. แสดงตาราง existing features ในแชทตาม `/report-table`
2. ระบุ path `FEATURES.md` ที่สร้างและ action ถัดไป

## Rules

### 1. Feature Identification

- ระบุ feature จาก: routes, modules, schemas, API endpoints
- แต่ละ feature ต้องมี name, description, module, domain, status
- monorepo วิเคราะห์ทุก workspace

### 2. File Location

- สร้าง `FEATURES.md` ที่ root ของ workspace เท่านั้น
- ไม่สร้าง `docs/project/features.md`
- ไม่สร้างไฟล์ใน `.devin/features/`
- ไม่ delegate ให้ `/update-docs`

### 3. Markdown Only

- ไม่ใช้ HTML หรือ interactive UX
- ตารางใช้ markdown table
- รายละเอียด feature ใช้ heading และ bullet

## Expected Outcome

- `FEATURES.md` ที่ root ของ workspace มีตาราง existing features ครบถ้วน
- ตาราง existing features แสดงในแชท
- Features ครอบคลุม routes, modules, schemas, API endpoints
