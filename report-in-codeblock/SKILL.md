---
name: report-in-codeblock
description: ตอบในแชทเป็น code block สำหรับ commands, code snippets, config, logs
argument-hint: "[scope]"
related:
  - report
  - report-in-table
---

## Goal

ตอบในแชทเป็น code block เพื่อเน้น commands, code snippets, config, logs หรือ output ทีต้อง copy-paste ได้

## Scope

ใช้เมื่อข้อมูลเหมาะกับ code block มากกวาตารางหรือ numbered list เช่น:
- commands หรือ scripts
- code snippets
- config files
- error logs
- diff output

## Execute

### 1. Select Code Block Type

> Goal: เลือก language/annotation ทีเหมาะสม

1. ถ้าเป็น shell command → ใช้ `bash` หรือ `powershell`
2. ถ้าเป็น code snippet → ใช้ language ทีตรง เช่น `typescript`, `rust`, `python`
3. ถ้าเป็น config → ใช้ `json`, `toml`, `yaml`, `kdl`
4. ถ้าเป็น log → ใช้ `text`
5. ถ้าเป็น diff → ใช้ `diff`

### 2. Add Context Header

> Goal: บอกว่า code block นี้คืออะไร

1. ก่อน code block ใส่ heading หรือสั้น ๆ บอกว่าเป็นส่วนไหน
2. ถ้ามีหลาย block ให้แยกเป็นส่วน ๆ พร้อม `###` หรือ short description

### 3. Format Content

> Goal: ทำให้ code block อ่านและ copy ได้ง่าย

1. ไม่ใส่ line numbers ภายใน code block
2. ใช้เครื่องหมาย ``` เปิดและปิด
3. ระบุ language หลัง ```
4. ถ้ามีหลาย block ให้แยกเป็นส่วน ๆ พร้อมสั้น ๆ ข้างบน
5. ถ้ามีคำอธิบายเพิ่มเติม ใส่นอก code block

### 4. Validate

> Goal: ตรวจคุณภาพก่อนส่ง

1. ตรวจ syntax ถูกต้องตาม language ทีระบุ
2. ตรวจว่า code block อ่านง่ายบนทุก device
3. ถ้ามี commands ให้ระบุ dry run ก่อน execute

## Rules

- ใช้ code block เมื่องานเหมาะกับ copy-paste หรือ syntax highlighting
- ถ้าต้องการรายงานหลาย columns ให้ใช้ `/report` หรือ `/report-in-table`
- ถ้าต้องการรายงานหลาย code blocks คู่กับ table ให้ใช้ `/report-in-table`
- ระบุ language หลังเครื่องหมาย ```
- ไม่ใช้ bold markers ภายใน code block
- ถ้ามีหลาย block ให้ใช้ `###` หรือสั้น ๆ แยก
- ตอบในแชทเท่านั้น

## Expected Outcome

- Code block ทีระบุ language ถูกต้อง
- เนื้อหาอ่านง่ายและ copy ได้
- สั้น ๆ ชัดเจน ไม่ยาวเกินจำเป็น
