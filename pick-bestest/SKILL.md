---
name: pick-bestest
description: ถาม user เลือกอันดีทีสุดจาก list ตัวเลือก เลือกได้แค่อันเดียว
argument-hint: "[question] [options...]"
related:
  - ask-me
  - sumarize-your-understand
  - report-numbered-bullet
---

## Goal

ถาม user ให้เลือกตัวเลือกเดียวทีดีทีสุดจาก list เมื่อมีหลายทางเลือก

## Scope

ใช้เมื่อมี options หลายอันและต้องการคำตอบเพียงหนึ่งอัน เช่น เลือก skill, architecture, stack, priority, next action หรือทางเลือกทีดีทีสุด

## Execute

### 1. Prepare Options

> Goal: จัดเตรียมตัวเลือกให้ชัดเจน

1. รับ question ทีต้องการถามและ list ของ options
2. ตรวจสอบว่า options ไม่ซ้ำกัน
3. ถ้ามีมากกว่า 10 ตัวเลือก → จัดกลุ่มหรือกรองก่อนถาม
4. ถ้า options ไม่ชัด → ทำ `/sumarize-your-understand` ก่อน
5. ระบุ recommendation ถ้ามี โดยทำเครื่องหมาย `(recommended)` หรืออธิบายสั้นๆ

### 2. Ask User

> Goal: ถาม user เลือกอันเดียว

1. แสดง question พร้อมตัวเลือกแบบ numbered list
2. แต่ละ option อาจมีคำอธิบายสั้นๆ 1 บรรทัด
3. ใช้ `/ask-me` หรือ `ask_user_question` ให้ user เลือก **อันเดียว**
4. ตัวเลือกสุดท้ายเป็น `Other` เสมอ สำหรับคำตอบนอก list
5. ไม่เริ่มทำงานต่อจนกว่า user จะตอบ

### 3. Process Answer

> Goal: ใช้คำตอบของ user

1. ตรวจสอบคำตอบว่าตรงกับตัวเลือกไหน
2. ถ้า user เลือกมากกว่า 1 อัน → แจ้งว่าเลือกได้แค่อันเดียว แล้วขอให้เลือกใหม่
3. ถ้าเลือก `Other` → รอ user ระบุคำตอบเพิ่ม
4. ถ้า user ตอบว่า "ทุกอัน" หรือ "all" → ถามว่าต้องการอันไหนเป็นหลัก หรือขอให้เลือกหนึ่งอัน
5. บันทึกคำตอบและดำเนินการตามทางเลือกทีเลือก

## Rules

### 1. Single Choice Only

- ถามให้เลือก **อันเดียว** เท่านั้น
- ถ้าต้องการ multi select → ใช้ `/ask-me` หรือ skill อื่น
- ถ้า user ตอบหลายอัน → แจ้งและขอเลือกใหม่

### 2. Clear Options

- แต่ละ option ต้องมีชื่อทีแตกต่างและเข้าใจได้
- เรียงลำดับตาม priority, quality, หรือความเหมาะสม
- option ทีดีทีสุดควรอยู่บน หรือระบุ `(recommended)`
- ไม่ใส่ตัวเลือกทีกำกวม

### 3. General Purpose

- ใช้ได้กับทุก context ไม่ผูกกับ skill creation
- สามารถเรียกจาก skills อื่น เช่น `/follow-create-cli`, `/improve`, `/report-plan`
- คืนค่าเป็น option เดียวที user เลือก

### 4. References

- ถ้า options เป็น skill → ใช้ `/<skill-name>`
- ถ้า options เป็น URL/path → ใช้ backticks
- ถ้าต้องอธิบายเพิ่ม → ใช้ `/report-numbered-bullet`

## Expected Outcome

- User เลือกอันเดียวจาก list ตัวเลือก
- คำตอบถูกบันทึกและส่งต่อให้ step ถัดไป
- ถ้าเลือก `Other` มีการถามยืนยันก่อน
- ไม่ทำงานต่อจนกว่า user จะตอบ
