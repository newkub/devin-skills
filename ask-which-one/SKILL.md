---
name: ask-which-one
description: ถาม user ให้เลือกอันเดียวจาก list ตัวเลือกแบบทั่วไป
argument-hint: "[question] [options...]"
related:
  - ask-me
  - sumarize-your-understand
  - report-numbered-bullet
---

## Goal

ถาม user ให้เลือกอันเดียวจาก list ตัวเลือกเมื่อมีหลายทางเลือกและต้องการคำตอบเพียงหนึ่งอย่าง

## Scope

ใช้เมื่อมี options หลายอัน ไม่จำกัด context เช่น เลือก skill, เลือก architecture, เลือก stack, เลือก priority หรือเลือก next action

## Execute

### 1. Prepare Options

> Goal: จัดเตรียมตัวเลือกให้ชัดเจน

1. รับ question ที่ต้องการถามและ list ของ options
2. ตรวจสอบว่า options ไม่ซ้ำกัน
3. ถ้ามีมากกว่า 10 ตัวเลือก → จัดกลุ่มหรือกรองก่อนถาม
4. ถ้า options ไม่ชัด → ทำ `/sumarize-your-understand` ก่อน

### 2. Ask User

> Goal: ถาม user เลือกอันเดียว

1. แสดง question พร้อมตัวเลือกแบบ numbered list
2. ใช้ `/ask-me` หรือ `ask_user_question` ให้ user เลือก
3. ตัวเลือกสุดท้ายเป็น `Other` เสมอ สำหรับคำตอบนอก list
4. ไม่เริ่มทำงานต่อจนกว่า user จะตอบ

### 3. Process Answer

> Goal: ใช้คำตอบของ user

1. ตรวจสอบคำตอบว่าตรงกับตัวเลือกไหน
2. ถ้าเลือก `Other` → รอ user ระบุคำตอบเพิ่ม
3. ถ้า user ตอบว่า "ทุกอัน" หรือ "all" → ถามยืนยันก่อนว่าต้องการทำทุกอันหรือไม่
4. บันทึกคำตอบและดำเนินการตามทางเลือกทีเลือก

## Rules

### 1. Single Choice

- ถามให้เลือกอันเดียวเท่านั้น
- ถ้าต้องการเลือกหลายอัน → ใช้ `/ask-me` หรือสร้าง skill เฉพาะ
- อธิบายเหตุผลสั้นๆ ของแต่ละ option ถ้าจำเป็น

### 2. Clear Options

- แต่ละ option ต้องมีชื่อที่แตกต่างและเข้าใจได้
- เรียงลำดับตาม priority, alphabet, หรือความเหมาะสม
- ไม่ใส่ตัวเลือกทีกำกวม

### 3. General Purpose

- ใช้ได้กับทุก context ไม่ผูกกับ skill creation
- สามารถเรียกจาก skills อื่น เช่น `/follow-create-cli`, `/improve`, `/report-plan`
- คืนค่าเป็น option ที user เลือก

### 4. References

- ถ้า options เป็น skill → ใช้ `/<skill-name>`
- ถ้า options เป็น URL/path → ใช้ backticks
- ถ้าต้องอธิบายเพิ่ม → ใช้ `/report-numbered-bullet`

## Expected Outcome

- User เลือกอันเดียวจาก list ตัวเลือก
- คำตอบถูกบันทึกและส่งต่อให้ step ถัดไป
- ถ้าเลือก `Other` หรือ `All` มีการถามยืนยันก่อน
- ไม่ทำงานต่อจนกว่า user จะตอบ
