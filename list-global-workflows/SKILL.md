---
name: list-global-workflows
description: แสดงรายการ global workflows ทั้งหมดพร้อมคำอธิบาย
---

## Goal

แสดงรายการ global workflows ทั้งหมดใน `global_workflows` directory

## Scope

ใช้สำหรับดู workflows ที่มีอยู่ก่อนเลือกใช้ใน `AGENTS.md`

## Execute

### 1. List Workflow Files

อ่านไฟล์ทั้งหมดใน `global_workflows` directory

1. อ่านไฟล์ทั้งหมดใน `C:\Users\Veerapong\.codeium\windsurf\global_workflows\`
2. กรองเฉพาะไฟล์ `.md`
3. อ่าน frontmatter ของแต่ละไฟล์เพื่อดู `title` และ `description`

### 2. Categorize Workflows

จัดกลุ่ม workflows ตามประเภท

1. จัดกลุ่มตาม prefix: `follow-`, `run-`, `test-`, `improve-`, `check-`, `create-`, `update-`, `deploy-`, `use-`, อื่นๆ
2. แสดงจำนวน workflows ในแต่ละกลุ่ม

### 3. Report Workflows

แสดงรายการ workflows ทั้งหมด

1. แสดงเป็นตาราง: ชื่อ workflow, description, กลุ่ม
2. ทำ `/report-format-table` สำหรับจัดรูปแบบ

## Rules

- อ่านเฉพาะไฟล์ `.md` ใน `global_workflows` directory
- แสดงทุก workflow ไม่กรองออก
- จัดกลุ่มตาม prefix ของชื่อไฟล์
- ใช้ `/report-format-table` สำหรับ output

## Expected Outcome

- รายการ global workflows ทั้งหมดพร้อม description
- จัดกลุ่มตามประเภท
- ข้อมูลสำหรับใช้ใน `AGENTS.md` `## Workflows` section
