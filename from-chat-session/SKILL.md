---
name: from-chat-session
description: สรุป chat session เป็น action plan ด้วย table และ numbered list
argument-hint: "[summary-or-context]"
related:
  - report-todo
  - report-in-numbered
  - suggest-next-action
  - use-related-skills
  - follow-context-engineering
---

## Goal

อ่าน/สรุป chat session หรือ context ทีผ่านมา แล้วสร้าง action plan ในรูปแบบ `/report-todo`

## Scope

ใช้เมื่อต้องการตอบคำถาม/ขอ action plan จาก chat โดยไม่ต้องลงมือทำทันที หรือเมื่อ user ถามว่าควรทำอะไรต่อจากสถานะปัจจุบัน

## Execute

### 1. Extract Context

> Goal: เข้าใจสิ่งทีเกิดขึ้นใน chat

1. อ่าน context หรือ summary ที user ให้มา
2. ระบุสถานะปัจจุบัน: งานเสร็จ/ค้าง/blocked
3. ระบุ files/skills ทีเกี่ยวข้อง
4. ถ้า context ยาวหรือใกล้เต็ม → ทำ `/follow-context-engineering`

### 2. Identify Actions

> Goal: หา next actions ทีเหมาะสม

1. ทำ `/suggest-next-action` เพื่อหา actions ถัดไป
2. ทำ `/use-related-skills` เพื่อหา skills ทีควรใช้
3. แยก actions ออกเป็นข้อย่อย แต่ละข้อทำสิ่งเดียว
4. ถ้ามีคำถามยังไม่ชัด → ทำ `/ask-me`

### 3. Build Report-Todo

> Goal: นำเสนอ actions ในรูปแบบ report-todo

1. ทำ `/report-todo` ด้วยข้อมูล:
   - `No.` เรียงตาม priority
   - `Action` สั้น ชัดเจน
   - `Before` สถานะก่อนทำ
   - `After` สถานะหลังทำ
   - `Why` เหตุผลทีควรทำ
   - `File Change` ไฟล์ทีคาดว่าจะเปลี่ยน
   - `Risk` ความเสี่ยงหรือข้อควรระวัง
2. ด้านล่างตาราง ทำ `/report-in-numbered` สรุป steps ทังหมด

### 4. Validate And Ship

> Goal: ตรวจความครบถ้วน

1. ตรวจว่าทุก action มี before/after/why
2. ตรวจลำดับ priority
3. ทำ `/report-todo` เพื่อ final output

## Rules

1. ตอบเฉพาะเมื่อ user ถาม หรือเมื่อระบุชัดว่าไม่ต้องทำทันที
2. ทุก action ต้องมี single responsibility
3. ไม่เดาไฟล์ทีจะเปลี่ยน — ระบุเฉพาะทีพอจะรู้หรือระบุว่าไม่แน่ใจ
4. ด้านล่างตารางต้องมี `/report-in-numbered` สรุป
5. ใช้ backticks สำหรับ paths, skill names, commands
6. ห้ามใช้ bold markers

## Expected Outcome

- ตาราง action plan ครบคอลัมน์ No., Action, Before, After, Why, File Change, Risk
- สรุป numbered list ด้านล่าง
- ชี้ไปยัง skills/files ทีเกี่ยวข้อง
