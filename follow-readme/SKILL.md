---
name: follow-readme
description: สร้างหรือปรับปรุง README ตามตัวอย่างและมาตรฐานโปรเจกต์
---

## Goal

สร้างหรือปรับปรุง README ของโปรเจกต์ให้ครบถ้วน เข้าใจง่าย และเป็นมาตรฐาน

## Scope

ใช้เมื่อต้องสร้างหรือปรับปรุง README โดยอ้างอิงตัวอย่างจาก `references/`

## Execute

### 1. Read Sample README

> Goal: อ่านตัวอย่าง README เพื่อเข้าใจโครงสร้างมาตรฐาน

1. อ่าน [references/sample-readme-overview.md](references/sample-readme-overview.md) เพื่อดูโครงสร้าง README ภาพรวม
2. อ่าน [references/sample-readme-workflows.md](references/sample-readme-workflows.md) สำหรับส่วน workflows
3. อ่าน [references/sample-readme-contribution.md](references/sample-readme-contribution.md) สำหรับส่วน contribution
4. อ่าน [references/sample-readme-releases.md](references/sample-readme-releases.md) สำหรับส่วน releases

### 2. Adapt To Project

> Goal: ปรับโครงสร้างให้เหมาะกับโปรเจกต์เป้าหมาย

1. ระบุ sections ที่จำเป็นสำหรับโปรเจกต์
2. ปรับเนื้อหาให้ตรงกับชื่อ คำอธิบาย และ features ของโปรเจกต์
3. ถ้าโปรเจกต์มี workflows → อ้างอิง [references/global-workflows-overview.md](references/global-workflows-overview.md)

### 3. Validate Sections

> Goal: ตรวจสอบว่าครบทุก section ที่จำเป็น

1. ตรวจสอบว่ามี overview, installation, usage, และ license
2. ตรวจสอบความถูกต้องของ links และ paths
3. ทำ `/review-readme` เพื่อตรวจสอบคุณภาพ

## Rules

### 1. Content Standard

- ใช้ backticks สำหรับ `commands`, `paths`, `tools`
- ไม่เกิน 250 บรรทัดต่อไฟล์
- ไม่มี TODO/MOCK/placeholder

### 2. Safety

- ถ้ามีการ overwrite README เดิม → ต้องมี dry run และ user confirmation ก่อน
- ไม่ทำลาย references หรือ existing content

## Expected Outcome

- README ครบถ้วนตามโครงสร้างมาตรฐาน
- เนื้อหาตรงกับโปรเจกต์เป้าหมาย
- Links และ paths ถูกต้อง
