---
name: list-devin-global-skills
description: แสดงรายการ Devin global skills ทั้งหมดพร้อมคำอธิบาย
related:
  - report-table
  - search-skills
  - follow-skills-map
---

## Goal

แสดงรายการ skills ทั้งหมดใน `skills` directory

## Scope

ใช้สำหรับดู skills ที่มีอยู่ก่อนเลือกใช้ใน `AGENTS.md`

## Execute

### 1. List Skill Directories

> Goal: List Skill Directories

อ่านไดเรกทอรีทั้งหมดใน `skills` directory

1. อ่านไดเรกทอรีทั้งหมดใน `C:\Users\Veerapong\.codeium\windsurf\skills\`
2. กรองเฉพาะที่มีไฟล์ `SKILL.md` อยู่
3. อ่าน frontmatter ของแต่ละ `SKILL.md` เพื่อดู `title` และ `description`

### 2. Categorize Skills

> Goal: Categorize Skills

จัดกลุ่ม skills ตามประเภท

1. จัดกลุ่มตามประเภท: `Frontend`, `Build Tools`, `Testing`, `Database`, `Code Quality`, `Frameworks`, `Runtime`, `Tooling`, `Other`
2. แสดงจำนวน skills ในแต่ละกลุ่ม

### 3. Report Skills

> Goal: Report Skills

แสดงรายการ skills ทั้งหมด

1. แสดงเป็นตาราง: ชื่อ skill, description, กลุ่ม
2. ทำ `/report-table` สำหรับจัดรูปแบบ
3. ทำ `/follow-skills-map` เพื่อแสดง map ตาม task หรือ ecosystem ถ้า user ต้องการ

## Rules

- อ่านเฉพาะไดเรกทอรีที่มี `SKILL.md` ใน `skills` directory
- แสดงทุก skill ไม่กรองออก
- จัดกลุ่มตามประเภทของ skill
- ใช้ `/report-table` สำหรับ output
- ถ้าต้องการค้นหา skills จาก external registry ให้ใช้ `/search-skills`

## Expected Outcome

- รายการ skills ทั้งหมดพร้อม description
- จัดกลุ่มตามประเภท
- ข้อมูลสำหรับใช้ใน `AGENTS.md` `## Skills` section