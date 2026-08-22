---
name: update-features
description: วิเคราะห์ features ที่มีอยู่ใน project และ delegate documentation ให้ /update-docs
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
  - nav
  - update-docs
---

## Goal

วิเคราะห์ features ที่มีอยู่ใน project และสร้าง documentation ให้ /update-docs เขียนลง docs/project/features.md

## Scope

- วิเคราะห์ routes, modules, database schemas, API endpoints
- ระบุ existing features พร้อม name, description, module
- ส่งต่อเนื้อหาให้ /update-docs โดยไม่เขียน docs ซ้ำในแต่ละ workspace
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

### 3. Prepare Documentation Data

> Goal: สร้างเนื้อหาสำหรับ /update-docs

1. สร้าง/อัปเดท `docs/project/features.md` ด้วยตาราง markdown:
   - `| Feature | Description | Module | Domain | Status |`
2. กลุ่ม features ตาม domain ด้วย heading `## <domain>`
3. เขียนรายละเอียดสั้นใต้แต่ละ feature ด้วย bullet
4. ไม่ต้องสร้าง `.devin/features/`

### 4. Delegate To update-docs

> Goal: /update-docs จัดการ sidebar, nav, และ references

1. ทำ `/update-docs` เพื่อตั้งค่า docs site, sidebar, frontmatter
2. ตรวจให้ `docs/project/features.md` อยู่ใน sidebar
3. อัปเดท `docs/roadmap/index.md` ลิงก์ไป features

### 5. Report In Chat

> Goal: สรุปผลลัพธ์ให้ user

1. แสดงตาราง existing features ในแชทตาม `/report-table`
2. ระบุ path `docs/project/features.md` และ action ถัดไป

## Rules

### 1. Feature Identification

- ระบุ feature จาก: routes, modules, schemas, API endpoints
- แต่ละ feature ต้องมี name, description, module, domain
- monorepo วิเคราะห์ทุก workspace

### 2. Documentation Delegation

- ใช้ `/update-docs` สำหรับ docs structure, sidebar, nav, references
- ไม่สร้าง docs/ ในแต่ละ workspace
- ไม่สร้างไฟล์ใน `.devin/features/`

### 3. Markdown Only

- ไม่ใช้ HTML หรือ interactive UX
- ตารางใช้ markdown table
- รายละเอียด feature ใช้ heading และ bullet

## Expected Outcome

- `docs/project/features.md` มีตาราง existing features ครบถ้วน
- Sidebar/nav อัปเดทผ่าน `/update-docs`
- ตาราง existing features แสดงในแชท
- Features ครอบคลุม routes, modules, schemas, API endpoints