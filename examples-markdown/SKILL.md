---
name: examples-markdown
description: สร้าง markdown templates สำหรับ documentation ครอบคลุมตาม sidebar ของ update-docs
related:
  - update-docs
  - update-readme-md
  - update-features-md
  - report-table
  - validate
  - run-format
---

## Goal

สร้าง markdown templates สำหรับ documentation site ครอบคลุมทุกหมวดตาม sidebar ของ `/update-docs`

## Scope

ใช้ `/examples-markdown` เมื่อต้องสร้างหรือปรับปรุง markdown pages สำหรับ VitePress หรือ documentation ทั่วไป

## Execute

### 1. Select Template

> Goal: เลือก template ตามหมวดทีต้องการ

1. ระบุหมวดของ page ตาม sidebar ของ `/update-docs`
2. เลือก template จาก `templates/` directory
3. ถ้าไม่มี template ทีตรง → ใช้ `content.md` เป็น base

### 2. Copy and Fill

> Goal: สร้าง markdown page จาก template

1. คัดลอก template ไปยัง target path ใน `docs/`
2. แทนที่ `{{ ... }}` placeholders ด้วยข้อมูลจริง
3. ลบ placeholders ทียังไม่ใช้ออก
4. ใช้ภาษาเดียวกันในทั้งหน้า

### 3. Add Content

> Goal: เติมเนื้อหาจริง

1. อ่าน source code หรือ README เพื่อดึงข้อมูลจริง
2. ใช้ตาราง markdown สำหรับ features, APIs, references
3. ใส่ links ภายใน project
4. เพิ่ม code blocks ถ้าจำเป็น

### 4. Validate

> Goal: ตรวจสอบคุณภาพ markdown

1. ทำ `/validate` เพื่อตรวจ frontmatter, links, heading structure
2. ตรวจไม่มี TODO/MOCK/placeholder ทีไม่จำเป็น
3. ทำ `/run-format` ถ้ามี formatter

### 5. Update Sidebar

> Goal: เชื่อมต่อกับ VitePress config

1. อัปเดต `docs/.vitepress/config.ts` ถ้ามีหน้าใหม่
2. ใช้ relative path เริ่มต้นด้วย `/`
3. ใช้ `collapsed: true` ถ้าหมวดมี > 5 หน้า

## Rules

### 1. Markdown Only

- เขียนด้วย markdown ธรรมดา
- ห้ามใช้ HTML หรือ Vue components ซับซ้อน
- ยกเว้น `:::` ของ VitePress เมื่อจำเป็น

### 2. Frontmatter

- ทุก markdown ต้องมี `title` และ `description`
- `description` ไม่เกิน 120 ตัวอักษร
- `title` ใช้ Title Case

### 3. Placeholders

- ใช้ `{{ ... }}` สำหรับข้อมูลทีต้องเติม
- ระบุชัดเจนว่าแต่ละ placeholder คืออะไร
- ลบ placeholder ทั้งหมดก่อน ship

### 4. Coverage

- templates ต้องครอบคลุมทุกหมวดใน sidebar ของ `/update-docs`
- ได้แก่: project, getting-started, development, references, roadmap, content, api-reference, changelog

## Expected Outcome

- มี markdown templates ครบทุกหมวด
- ทุก template มี frontmatter, structure, และ placeholders ชัดเจน
- ใช้ copy-paste แล้วแก้ไขได้ทันที
- รองรับ VitePress และ documentation ทั่วไป
- ไม่มี broken references หรือ placeholder ค้าง
