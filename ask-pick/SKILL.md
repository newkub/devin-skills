---
name: ask-pick
description: ถาม user ให้เลือกจาก list ตัวเลือก รองรับทั้งเลือกอันเดียวหรือหลายอันตาม context
argument-hint: "[question] [options...]"
related:
  - ask-me
  - sumarize-your-understand
  - report-numbered-bullet
---

## Goal

ถาม user ให้เลือกตัวเลือกจาก list เมื่อมีหลายทางเลือก รองรับทั้ง single select และ multi select ตาม context

## Scope

ใช้เมื่อมี options หลายอัน ไม่จำกัด context เช่น เลือก skill, architecture, stack, priority, next action, หรือรายการทีต้องการทำ

## Execute

### 1. Prepare Options

> Goal: จัดเตรียมตัวเลือกให้ชัดเจน

1. รับ question ที่ต้องการถามและ list ของ options
2. ตรวจสอบว่า options ไม่ซ้ำกัน
3. ถ้ามีมากกว่า 10 ตัวเลือก → จัดกลุ่มหรือกรองก่อนถาม
4. ถ้า options ไม่ชัด → ทำ `/sumarize-your-understand` ก่อน
5. กำหนดโหมด: ต้องการให้ user เลือก **หนึ่งอัน** หรือ **หลายอัน** ตาม context

### 2. Ask User

> Goal: ถาม user เลือกตัวเลือก

1. แสดง question พร้อมตัวเลือกแบบ numbered list
2. ระบุว่าต้องการคำตอบแบบ `เลือกอันเดียว` หรือ `เลือกหลายอันได้`
3. ใช้ `/ask-me` หรือ `ask_user_question` ให้ user เลือก
4. ตัวเลือกสุดท้ายเป็น `Other` เสมอ สำหรับคำตอบนอก list
5. ไม่เริ่มทำงานต่อจนกว่า user จะตอบ

### 3. Process Answer

> Goal: ใช้คำตอบของ user

1. ตรวจสอบคำตอบว่าตรงกับตัวเลือกไหนบ้าง
2. ถ้าเลือก `Other` → รอ user ระบุคำตอบเพิ่ม
3. ถ้า user ตอบว่า "ทุกอัน" หรือ "all" → ถามยืนยันก่อนว่าต้องการทำทุกอันหรือไม่
4. ถ้าเลือกหลายอันในโหมด single → แจ้ง user และขอให้เลือกใหม่ หรือปรับเป็น multi select
5. บันทึกคำตอบและดำเนินการตามทางเลือกทีเลือก

## Rules

### 1. Single Or Multi

- ถ้า context ต้องการคำตอบเดียว → ถาม single select
- ถ้า context ต้องการหลายคำตอบ → เปิด multi select
- ระบุชัดเจนในคำถามว่าเลือกได้กี่อัน
- ถ้า user ตอบคลุมเครือ → ถามยืนยัน

### 2. Clear Options

- แต่ละ option ต้องมีชื่อทีแตกต่างและเข้าใจได้
- เรียงลำดับตาม priority, alphabet, หรือความเหมาะสม
- ไม่ใส่ตัวเลือกทีกำกวม

### 3. General Purpose

- ใช้ได้กับทุก context ไม่ผูกกับ skill creation
- สามารถเรียกจาก skills อื่น เช่น `/follow-create-cli`, `/improve`, `/report-plan`
- คืนค่าเป็น option หรือ list ของ options ที user เลือก

### 4. References

- ถ้า options เป็น skill → ใช้ `/<skill-name>`
- ถ้า options เป็น URL/path → ใช้ backticks
- ถ้าต้องอธิบายเพิ่ม → ใช้ `/report-numbered-bullet`

## Expected Outcome

- User เลือกตัวเลือกจาก list ตามโหมดทีกำหนด (single หรือ multi)
- คำตอบถูกบันทึกและส่งต่อให้ step ถัดไป
- ถ้าเลือก `Other` หรือ `All` มีการถามยืนยันก่อน
- ไม่ทำงานต่อจนกว่า user จะตอบ
