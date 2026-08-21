---
name: use-markdown
description: ใช้ Markdown formatting และ structure ที่เป็นมาตรฐานสำหรับเขียนเอกสาร
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ใช้ Markdown formatting และ structure ที่เป็นมาตรฐานเมื่อเขียนไฟล์ .md

## Scope

ใช้สำหรับเขียนเอกสารด้วย Markdown ทุกประเภท รวมถึง:
- เอกสารโปรเจกต์และ documentation
- README และ guides
- Blog posts และ articles
- Technical documentation

## Execute

### 1. Apply Formatting Rules

ทำตาม formatting rules ด้านล่างนี้

- Headings เป็น Title Case (EN)
- รายการเป็นภาษาไทย
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `workflow-name`
- ใช้ bullet points (-) ชิดซ้ายใน Rules

### 2. Structure Document

จัดโครงสร้างเอกสารตามมาตรฐาน

- ใช้ headings ที่เป็น Title Case (EN)
- ใช้ bullet points สำหรับรายการภาษาไทย
- จัดเนื้อหาเป็น sections ที่ชัดเจน
- ใช้ table สำหรับข้อมูลที่เปรียบเทียบได้

### 3. Use Extended Syntax

ใช้ extended syntax เมื่อจำเป็น

- ใช้ code blocks สำหรับ code examples
- ใช้ diagrams สำหรับ flow หรือ architecture
- ใช้ admonitions สำหรับ notes และ warnings
- ใช้ tabs สำหรับ content หลายรูปแบบ

### 4. Add Heading Descriptions

เพิ่ม description ให้แต่ละ heading

- แต่ละ heading ต้องมี description อธิบาย
- Description กระชับและชัดเจน
- ใช้ภาษาไทยสำหรับ description

### 5. Validate Content

ตรวจสอบคุณภาพเอกสาร

- ตรวจสอบว่าไฟล์ไม่เกิน 250 บรรทัด
- ตรวจสอบว่าใช้คำศัพท์สม่ำเสมอ
- ตรวจสอบว่า headings เป็น Title Case (EN)
- ตรวจสอบว่ารายการเป็นภาษาไทย

## Rules

### Structure And Formatting

- ไฟล์ไม่เกิน 250 บรรทัด
- Headings เป็น Title Case (EN)
- รายการเป็นภาษาไทย
- ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `workflow-name`
- ใช้ bullet points (-) ชิดซ้ายใน Rules

### Content Quality

- เขียนเป็นภาษาไทยสำหรับ `key-concepts/`, `principles/`, `workflows/`
- Examples ต้องสั้นกระชับ
- Terminal commands ใส่ใน code block
- Architecture ใส่ใน code block
- ใช้คำศัพท์สม่ำเสมอ

### File Organization

- ใช้ `kebab-case` เสมอ
- ชื่อไฟล์ต้องสอดคล้องกับเนื้อหา
- ใช้ชื่อสื่อความหมายโดยตรง ไม่ใช้ prefix ชื่อ skill
- แต่ละไฟล์ต้องไม่เกิน 200 บรรทัด

## Expected Outcome

- เอกสาร Markdown ที่มีคุณภาพและเป็นมาตรฐาน
- Formatting ที่สม่ำเสมอทั่วทั้ง workspace
- เอกสารที่อ่านง่ายและ maintainable
- การใช้ extended syntax ที่เหมาะสม
