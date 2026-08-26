---
name: convert-to-markdown
description: แปลงข้อมูล, code, หรือ text ไปยัง Markdown format
---

## Goal

แปลง input (code, data, text, notes) ไปยัง Markdown format ทีอ่านง่ายและนำไปใช้ได้

## Scope

ใช้สำหรับแปลง code comments, logs, tables, json, csv หรือข้อความธรรมดาเป็น markdown

## Execute

### 1. Analyze Input

> Goal: ระบุ input type

1. ระบุ input: `text`, `code`, `json`, `csv`, `notes`, `html`
2. ระบุ audience และ purpose ของ output
3. ถ้า input ไม่ชัด → ถาม user

### 2. Convert To Markdown

> Goal: แปลงเป็น markdown

1. หัวข้อ: ใช้ `#` `##` `###` ตามลำดับ
2. Code block: ใช้ ` ```<lang>` สำหรับ code
3. ตาราง: ใช้ `| col1 | col2 |` กับ `|---|---|`
4. List: ใช้ `-` หรือ `1.`
5. ถ้า input เป็น json/csv → แปลงเป็นตารางหรือ list ตามความเหมาะสม

### 3. Format And Refine

> Goal: ทำให้อ่านง่าย

1. ใช้ backticks สำหรับชื่อตัวแปร, commands, paths
2. ใช้ bold/italic น้อย เน้นกระชับ
3. ระบุ `## Goal`, `## Scope`, `## Execute` ถ้าเป็น document
4. ตรวจ headings ไม่ขาดตอน

### 4. Output

> Goal: ส่งมอบผลลัพธ์

1. ถ้าต้องการไฟล์ → ใช้ `create-files-in-temp` หรือ `write` ตาม path ที user ระบุ
2. ถ้าต้องการแสดงใน chat → ใช้ `report` หรือ `report-table`
3. ตรวจสอบ markdown syntax ก่อนส่ง

## Rules

### 1. Readability

- ใช้ภาษาทีกระชับ
- หัวข้อสื่อความหมาย
- ไม่ nested ลึกเกิน 4 ระดับ

### 2. Code Friendly

- code block ระบุ language
- ไม่ escape โดยไม่จำเป็น
- ใช้ inline code สำหรับ identifiers

### 3. Tables

- ใช้ตารางเฉพาะข้อมูลทีเปรียบเทียบได้
- หัวตารางชัดเจน
- ไม่มากกว่า 8 คอลัมน์ถ้าไม่จำเป็น

## Expected Outcome

- Markdown ที structure ชัดเจน
- code, tables, lists ถูกต้อง
- พร้อมใช้งานใน docs หรือ chat
