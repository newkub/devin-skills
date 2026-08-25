---
name: read-related-skills
description: อ่านและสรุป skills ที่เกี่ยวข้องแบบ recursive ทุกระดับ
argument-hint: "[skill-name]"
---

## Goal

อ่านและสรุป skills ที่เกี่ยวข้องทั้งหมดแบบ recursive เพื่อทำความเข้าใจ dependencies และสิ่งที่ต้องทำ

## Scope

ครอบคลุมการอ่าน skill ปัจจุบันและ skills ที่ถูกอ้างอิงภายในนั้นแบบ recursive

## Execute

### 1. Read Current Skill
> Goal: Read Current Skill

อ่าน skill ปัจจุบันที่กำลังทำงาน

1. อ่าน skill file ปัจจุบัน
2. ระบุ skills ที่ถูกอ้างอิงใน skill นี้จาก patterns เช่น `skill-name`

### 2. Build Dependency Graph
> Goal: Build Dependency Graph

สร้าง dependency graph ของ skills ทั้งหมด

1. สแกนหา references ของ skills ใน skill ปัจจุบัน
2. สแกนหา references ของ skills ใน skills ที่พบ (recursive)
3. สร้าง dependency graph แบบ tree structure

### 3. Read All Related Skills
> Goal: Read All Related Skills

อ่าน skills ทั้งหมดใน dependency graph

1. อ่าน skills ตามลำดับจาก root ไปยัง leaf nodes
2. เก็บข้อมูล: title, description, instructions, examples
3. ใช้ `read_file` tool สำหรับอ่าน skill files

### 4. Summarize Tasks
> Goal: Summarize Tasks

สรุป tasks ที่ต้องทำจากทุก skill

1. รวบรวม instructions จากทุก skill
2. รวบรวม guidelines ที่ต้องปฏิบัติ
3. สรุป key points ทั้งหมด
4. จัดลำดับความสำคัญของ tasks ตาม dependency graph

### 5. Generate Summary
> Goal: Generate Summary

สร้าง summary ที่อ่านง่าย

1. แสดง dependency graph แบบ tree structure
2. แสดง tasks ที่ต้องทำตามลำดับ
3. แสดง guidelines ที่ต้องปฏิบัติ
4. ใช้ `/report-table` สำหรับจัดรูปแบบ output

## Rules

### 1. Dependency Resolution

แก้ไข dependencies ของ skills อย่างถูกต้อง

- อ่าน skills ตามลำดับ topological sort
- อ่าน parent skills ก่อน child skills
- หลีกเลี่ยง circular dependencies

### 2. Skill Parsing

แยกวิเคราะห์ skills อย่างถูกต้อง

- แยก frontmatter, description, instructions, examples
- ระบุ skill references จาก patterns เช่น `skill-name`
- ระบุ skill references จาก `related` ใน frontmatter

### 3. Summary Format

จัดรูปแบบ summary ให้อ่านง่าย

- ใช้ tree structure สำหรับ dependency graph
- ใช้ numbered list สำหรับ tasks
- ใช้ bullet points สำหรับ guidelines

## Expected Outcome

- Dependency graph ที่ครบถ้วนของ skills ที่เกี่ยวข้อง
- Summary ของ tasks ที่ต้องทำตามลำดับ
- Summary ของ guidelines ที่ต้องปฏิบัติ
- เข้าใจ dependencies ของ skills ทั้งหมด
