---
name: sumarize-your-understand
description: สรุปความเข้าใจของคำสั่งหรือ task ก่อนลงมือ และถาม user ยืนยัน
argument-hint: "[topic]"
related:
  - ask-me
  - report-plan
  - rethink
  - deep-thinking
  - deep-plan
  - report-scan-todo
  - report-file-structure
---

## Goal

สรุปความเข้าใจของ task หรือคำสั่งทีได้รับ แล้วถาม user ยืนยันก่อนเริ่มทำงาน

## Scope

ใช้เมื่อ prompt ยาว, มีหลายข้อ, หรือมีความเสี่ยงสูง — เพื่อลด misunderstanding ก่อนลงมือ

## Execute

### 1. Extract Key Points

> Goal: ดึงข้อมูลสำคัญจาก prompt

1. ระบุ goal หลักของ user
2. ระบุ scope และขอบเขต
3. ระบุ constraints หรือ requirements ทีชัดเจน
4. ระบุคำถามหรือข้อทียังไม่ชัด

### 2. Summarize Understanding

> Goal: สรุปความเข้าใจของตัวเอง

1. สรุปสั้นๆ เป็นภาษาไทย 3-5 บรรทัด
2. แยกเป็น bullet points ตามหัวข้อ
3. ระบุสิ่งทีจะทำ, สิ่งทีจะไม่ทำ, และสิ่งทีต้องถามเพิ่ม
4. ถ้ามี action หลายข้อ ให้เรียงลำดับ

### 3. Identify Gaps

> Goal: หาข้อมูลทียังขาด

1. ถ้ามีคำถามทีต้องตอบก่อน → ใช้ `/ask-me`
2. ถ้ามี ambiguity → ชี้ให้ชัดเจน
3. ถ้ามี trade-offs → ระบุ options ให้ user เลือก

### 4. Ask For Confirmation

> Goal: ขอ user ยืนยัน

1. ถามว่าความเข้าใจถูกต้องหรือไม่
2. ถามว่าต้องการให้เริ่มทำเลยหรือปรับแก้ก่อน
3. ถ้า prompt มีคำถาม ต้องถามก่อนจนกว่าจะครบ

## Rules

### 1. Answer In Prompt

- ถ้ามีคำถามต้องตอบ ให้ใช้ `/ask-me` เป็น prompt ไม่ใช่ตอบในแชท
- ไม่เริ่มทำงานจนกว่าจะได้คำตอบครบ

### 2. Be Concise

- สรุปกระชับ ไม่ซ้ำ prompt ทังหมด
- เน้นจุดทีสำคัญและจุดทีอาจเข้าใจผิด

### 3. No Action Before Confirmation

- ไม่ลงมือแก้ไขไฟล์หรือรัน command ก่อน user ยืนยัน
- ยกเว้น prompt ชัดเจนมากและเสี่ยงต่ำ

### 4. Use Reports

- ถ้าต้องการแสดง plan ละเอียด → ใช้ `/report-plan`
- ถ้าต้องการแสดง todo list → ใช้ `/report-scan-todo`
- ถ้าต้องการแสดง file structure → ใช้ `/report-file-structure`

## Expected Outcome

- สรุปความเข้าใจกระชับ
- คำถามทีต้องถาม user (ถ้ามี) ถูกถามผ่าน `/ask-me`
- User ยืนยันหรือแก้ไขความเข้าใจก่อนเริ่มงาน
