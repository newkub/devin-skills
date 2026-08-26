---
name: convert-to
description: แปลงข้อมูลหรือสิ่งใดๆ ไปยังรูปแบบเป้าหมายตาม context ทั่วไป
---

## Goal

แปลง input หรือสิ่งใดๆ ไปยังรูปแบบ/สิ่งของเป้าหมายตาม context โดยเลือก skill ย่อยที่เหมาะสม

## Scope

ใช้เมื่อ user บอกว่าให้ "convert to ..." แต่ยังไม่ชัดว่าต้องการแปลงไปรูปแบบใด หรือต้องการให้เลือกรูปแบบอัตโนมัติ

## Execute

### 1. Detect Target

> Goal: ระบุเป้าหมายของการ convert

1. อ่าน user request และ context
2. ระบุเป้าหมายจากคำสั่ง เช่น `convert to markdown`, `convert to project`, `convert to mcp`
3. ถ้าไม่ระบุ → วิเคราะห์ input และ use case เพื่อเดาเป้าหมาย
4. ถาม user ถ้าเป้าหมายไม่ชัด

### 2. Select Converter

> Goal: เลือก skill ย่อยที่เหมาะสม

1. ถ้าเป้าหมายเป็น `markdown` → ทำ `/convert-to-markdown`
2. ถ้าเป้าหมายเป็น `html` → ทำ `/convert-to-html`
3. ถ้าเป้าหมายเป็น `json` → ทำ `/convert-to-json`
4. ถ้าเป้าหมายเป็น `project` → ทำ `/convert-to-project`
5. ถ้าเป้าหมายเป็น `product` → ทำ `/convert-to-product`
6. ถ้าเป้าหมายเป็น `docs` → ทำ `/convert-to-docs`
7. ถ้าเป้าหมายเป็น `mcp` → ทำ `/convert-to-mcp`
8. ถ้าไม่ตรงกับ skill ย่อยทีมี → report ให้ user เลือก

### 3. Pass Context

> Goal: ส่ง context ไปยัง converter ทีเลือก

1. ส่ง input ทั้งหมดให้ skill ย่อย
2. ส่ง constraints, audience, และ expected output
3. ถ้ามี file path → ส่งไปด้วย
4. ติดตามผลลัพธ์จาก skill ย่อย

### 4. Report

> Goal: สรุปผลการ convert

1. ระบุ skill ย่อยทีใช้
2. สรุปผลลัพธ์หรือ output path
3. ถ้ามีหลายเป้าหมายที่อาจรองรับ → แนะนำทางเลือก
4. ทำ `/suggest-next-action`

## Rules

### 1. Context First

- ไม่เดาเป้าหมายถ้า context ไม่ชัด
- ถาม user ถ้ามีหลายความหมาย
- ใช้ keywords จาก request เพื่อเลือก skill ย่อย

### 2. Delegate To Specific Skills

- `convert-to` ไม่ทำงาน convert เอง นอกจากกรณีทั่วไปจริงๆ
- ส่งงานไปยัง `convert-to-<target>` ทีมีอยู่
- ถ้าไม่มี skill ย่อย → report แทนที่จะทำเอง

### 3. Safety

- ไม่ overwrite ไฟล์เดิมโดยไม่ถาม
- ถ้าต้องการ output เป็นไฟล์ → ใช้ `create-files-in-temp` หรือ path ที user ระบุ
- ไม่แปลงข้อมูล sensitive โดยไม่มีการป้องกัน

## Expected Outcome

- เป้าหมายการ convert ถูกระบุ
- skill ย่อยทีเหมาะสมถูกเลือกและ execute
- ผลลัพธ์ถูกสรุปและส่งมอบ
- ไม่มีการ convert ผิดเป้าหมาย
