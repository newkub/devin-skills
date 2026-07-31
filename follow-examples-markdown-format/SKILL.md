---
name: follow-examples-markdown-format
description: ตัวอย่างการใช้งาน Markdown Format สำหรับ Workflows
---

## Goal

ตัวอย่างการใช้งาน Markdown Format สำหรับจัดรูปแบบเนื้อหาใน workflows

## Scope

ใช้สำหรับอ้างอิงเมื่อต้องจัดรูปแบบ Markdown ใน workflow files

## Execute

### 1. Basic Formatting

จัดรูปแบบข้อความพื้นฐาน

> Goal: รู้วิธี format ข้อความใน Markdown

1. ใช้ `_text_` สำหรับ italic, `text` สำหรับ bold
2. ใช้ `~~text~~` สำหรับ strikethrough
3. ใช้ `> text` สำหรับ blockquote
4. ใช้ `[text](url)` สำหรับ links
5. ใช้ `![alt](url)` สำหรับ images
6. ใช้ `---` สำหรับ horizontal rule

### 2. Lists

สร้างรายการใน Markdown

> Goal: รู้วิธีสร้าง lists ต่างประเภท

1. ใช้ `- [x]` และ `- [ ]` สำหรับ task lists
2. ใช้ `-` หรือ `*` สำหรับ unordered lists
3. ใช้ `1.` สำหรับ ordered lists

### 3. Code And Structures

แสดงโค้ดและโครงสร้างต่างๆ

> Goal: รู้วิธีแสดง code blocks, tables, และ diagrams

1. ใช้ ` ```lang ` สำหรับ code blocks
2. ใช้ `| col | col |` สำหรับ tables
3. ใช้ ` ```text ` สำหรับ file structures และ diagrams

### 4. Before And After

เปรียบเทียบโค้ดก่อนและหลังการเปลี่ยนแปลง

> Goal: รู้วิธีแสดง before/after comparison

1. ใช้ `Before` และ `After` headers
2. วาง code block ใต้แต่ละ header

## Rules

- ใช้ fenced code blocks พร้อม language tag
- ใช้ backticks สำหรับ inline code
- ใช้ `---` สำหรับแบ่ง sections เมื่อจำเป็น

## Expected Outcome

- Markdown content จัดรูปแบบถูกต้องตามมาตรฐาน
- Code blocks มี language tag
- Tables และ lists ใช้ syntax ถูกต้อง
