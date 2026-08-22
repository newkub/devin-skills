---
name: write-how-to
description: เขียน how-to guides และ tutorials อย่างมีประสิทธิภาพ
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
  - after
---

## Goal

เขียน how-to guides และ tutorials อย่างมีประสิทธิภาพ ด้วยโครงสร้างที่ชัดเจนและเนื้อหาที่เข้าใจง่าย

## Scope

ใช้สำหรับเขียน how-to guides และ tutorials ทั้งใน global_workflows และ workspace

## Execute

### 1. Define Purpose
> Goal: Define Purpose

ทำ `write-content-explicit` เพื่อกำหนดวัตถุประสงค์และ audience ของ how-to guide

1. ระบุ audience และ skill level ของผู้อ่าน
2. กำหนด objective ที่ชัดเจนสำหรับ guide
3. ระบุ prerequisites ที่จำเป็นก่อนเริ่ม
4. ตั้งความคาดหวังสำหรับผลลัพธ์

### 2. Structure Content
> Goal: Structure Content

จัดโครงสร้าง content ตาม logical flow ที่เข้าใจง่าย

1. เริ่มด้วย introduction ที่อธิบาย context
2. แบ่ง content เป็น sections ตาม logical flow
3. ใช้ headings และ subheadings ที่ชัดเจน
4. เพิ่ม table of contents สำหรับ long guides

### 3. Write Steps
> Goal: Write Steps

เขียน steps ด้วยคำสั่งที่ชัดเจนและเข้าใจง่าย

1. เขียนแต่ละขั้นตอนด้วยคำสั่งที่ชัดเจน
2. ใช้ numbered list สำหรับ sequential steps
3. เพิ่ม code examples และ snippets ที่จำเป็น
4. อธิบาย reasoning หลังจากแต่ละขั้นตอน

### 4. Add Examples
> Goal: Add Examples

เพิ่ม examples และ visual aids เพื่อช่วยให้เข้าใจ content ได้ดีขึ้น

1. ให้ use cases จริงและ practical examples
2. เพิ่ม screenshots หรือ diagrams สำหรับ visual aids
3. แสดง before/after comparisons เมื่อเป็นไปได้
4. ให้ multiple approaches สำหรับ problems ที่ซับซ้อน

### 5. Include Troubleshooting
> Goal: Include Troubleshooting

เพิ่ม troubleshooting และ resources สำหรับการแก้ปัญหา

1. ระบุ common errors และ solutions
2. เพิ่ม FAQ section สำหรับ questions ที่พบบ่อย
3. ให้ resources สำหรับการเรียนรู้เพิ่มเติม
4. เพิ่ม links ไปยัง related documentation

### 6. Review And Refine
> Goal: Review And Refine

ทดสอบและปรับปรุง content จนกว่าจะเสร็จสมบูรณ์

1. ทดสอบ steps ด้วยตนเอง
2. ขอ feedback จาก peers หรือ target audience
3. ตรวจสอบ clarity และ completeness
4. อัพเดท content ตาม feedback ที่ได้รับ
5. รัน `/update-reference` สำหรับไฟล์ที่เพิ่ม

## Rules

### 1. Content Structure

จัดโครงสร้าง content ให้มี logical flow และเข้าใจง่าย

- เริ่มด้วย overview ที่อธิบาย what, why, how
- ใช้ logical flow จาก simple ไปยัง complex
- แต่ละ section ต้องมี single purpose
- ใช้ consistent terminology ทั้ง guide

### 2. Writing Style

เขียนด้วย style ที่กระชับ และเข้าใจง่าย

- ใช้ active voice และ imperative mood
- เขียนกระชับ ตรงประเด็น หลีกเลี่ยง fluff
- ใช้ simple language ที่เข้าใจง่าย
- หลีกเลี่ยง jargon ที่ไม่จำเป็น

### 3. Code Examples

ให้ code examples ที่ complete และเข้าใจง่าย

- Code ต้อง complete และ runnable
- เพิ่ม comments สำหรับ complex logic
- ใช้ consistent formatting และ style
- อัพเดท examples ตาม API changes

### 4. Visual Aids

ใช้ visual aids เพื่อช่วยให้เข้าใจ content ได้ดีขึ้น

- ใช้ diagrams สำหรับ abstract concepts
- เพิ่ม screenshots สำหรับ UI workflows
- ใช้ tables สำหรับ comparisons
- Highlight important information ด้วย callouts

### 5. Accessibility

รักษา accessibility standards สำหรับทุกผู้ใช้

- ใช้ descriptive alt text สำหรับ images
- ใช้ sufficient contrast สำหรับ text
- ใช้ semantic headings สำหรับ screen readers
- ให้ keyboard navigation สำหรับ interactive elements

## Expected Outcome

- How-to guide ที่มีโครงสร้างชัดเจน
- Content เข้าใจง่ายและ actionable
- Examples ที่ relevant และ practical
- Troubleshooting ที่ครอบคลุม common issues
- Guide ที่ testable และ maintainable
