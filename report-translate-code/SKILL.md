---
name: report-translate-code
description: แปล function และ code เป็นประโยคที่เข้าใจง่าย
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
---

## Goal

แปล code และ functions เป็นประโยคภาษาไทยที่เข้าใจง่าย พร้อมอธิบาย input/output และ logic

## Scope

ใช้สำหรับอธิบาย code ให้ผู้ที่ไม่ใช่ developer เข้าใจการทำงานของ functions

## Execute

### 1. Code Analysis
> Goal: Code Analysis

วิเคราะห์ code ที่ต้องการแปล:

1. อ่านไฟล์และตรวจสอบโครงสร้าง
2. ระบุ input/output ของแต่ละ function
3. จำแนกประเภทของ operations
4. สรุป functionality หลักและความสัมพันธ์ระหว่าง functions

### 2. Translation Process
> Goal: Translation Process

แปล code เป็นประโยคที่เข้าใจง่าย:

1. แปล function names เป็นภาษาไทยโดยรักษาความหมาย
2. อธิบาย input parameters และ return values
3. อธิบาย process ภายใน function
4. ให้ตัวอย่างการใช้งานและ edge cases ถ้ามี

### 3. Format Output
> Goal: Format Output

จัดรูปแบบผลลัพธ์:

1. เขียนประโยคสรุป functionality หนึ่งบรรทัด
2. แสดง input/output เป็น bullet points
3. แสดง code block เดิมคู่กับคำอธิบาย

## Rules

### 1. Translation Style

- แปลเป็นภาษาไทยที่เข้าใจง่าย ไม่ใช้ศัพท์เทคนิคเกินจำเป็น
- รักษาความหมายเดิมของ code
- ไม่แปล code, commands, หรือ configuration
- รักษา formatting ของ code blocks

### 2. Output Format

- ประโยคสรุปขึ้นต้นด้วย "ฟังก์ชัน..." หรือ "เมธอด..."
- input/output แสดงเป็น bullet points
- ใช้ code block สำหรับตัวอย่าง code

## Expected Outcome

- Code ถูกแปลเป็นประโยคภาษาไทยที่เข้าใจง่าย
- Input/output และ logic อธิบายชัดเจน
- ผู้ที่ไม่ใช่ developer เข้าใจการทำงานของ code
