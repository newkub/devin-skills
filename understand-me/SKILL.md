---
name: understand-me
description: คิดถามผู้ใช้เพื่อเข้าใจ preferences และ style การทำงาน
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

สร้างความเข้าใจเกี่ยวกับผู้ใช้เพื่อปรับปรุงประสบการณ์การทำงานร่วมกัน

## Scope

ใช้สำหรับสัมภาษณ์ผู้ใช้เพื่อเก็บข้อมูล preferences, coding style, และ habits

ใช้ `ask_user_question` tool จาก Windsurf system prompt เท่านั้น สำหรับการถามคำถาม และใช้ `create_memory` tool สำหรับบันทึกคำตอบ

## Execute

### 1. Prepare Questions

เตรียมคำถามสำหรับสัมภาษณ์

1. ออกแบบคำถามครอบคลุมทุกด้านของการทำงาน
2. จัดกลุ่มคำถามตาม `categories` (`coding style`, `preferences`, `habits`)
3. กำหนด `priority` ของคำถาม (`critical`, `important`, `nice-to-have`)
4. เตรียม `follow-up questions` สำหรับคำตอบที่น่าสนใจ

### 2. Conduct Interview

ดำเนินการสัมภาษณ์ผู้ใช้โดยใช้ `ask_user_question` tool

1. เริ่มด้วยคำถาม `general` เพื่อสร้าง `context`
2. ถามคำถามตาม `priority` ที่กำหนด ทีละคำถามผ่าน `ask_user_question` tool
3. ใช้ `follow-up questions` ผ่าน `ask_user_question` tool เพื่อลึกซึ้งขึ้น
4. วิเคราะห์คำตอบจาก `ask_user_question` response

### 3. Analyze Responses

1. จัดกลุ่มคำตอบตาม patterns
2. ระบุ contradictions หรือ inconsistencies
3. วิเคราะห์ implicit preferences จากคำตอบ
4. สรุป key insights ที่พบ

### 4. Save To Memory

บันทึกข้อมูลลงใน `memory system`

1. บันทึกข้อมูลลงใน `memory system` ด้วย `create_memory` tool
2. จัดหมวดหมู่ข้อมูลตาม `type`
3. เพิ่ม `tags` สำหรับ `easy retrieval`
4. อัปเดท `existing memories` หากมีข้อมูลใหม่

### 5. Update Context

อัปเดท `context` ตามข้อมูลที่ได้

1. อัปเดท `user preferences` ใน `context`
2. ปรับปรุง `workflow choices` ตาม `preferences`
3. เปลี่ยน `communication style` ตามความชอบ
4. ตรวจสอบว่าข้อมูลถูกนำไปใช้จริง

## Rules

### 1. Question Categories

คำถามควรครอบคลุมทุกด้านของการทำงาน

- `Coding style` (`indentation`, `naming`, `patterns`)
- `Preferences` (`tools`, `frameworks`, `languages`)
- `Habits` (`workflow`, `debugging`, `testing`)
- `Communication` (`verbosity`, `language`, `format`)
- `Goals` (`short-term`, `long-term`, `priorities`)

### 2. Question Design

ออกแบบคำถามให้มีประสิทธิภาพ

- เป็น `open-ended` เพื่อให้คำตอบละเอียด
- ไม่ใช่ `leading questions`
- มี `context` ชัดเจน
- ไม่ซ้ำซ้อน
- สั้นกระชับแต่ชัดเจน

### 3. Interview Techniques

ใช้เทคนิคการสัมภาษณ์ที่เหมาะสม

- ใช้ `active listening`
- ถาม `clarifying questions`
- สังเกต `patterns` ในคำตอบ
- ไม่ `interrupt` ขณะผู้ใช้กำลังตอบ
- สรุปกลับเพื่อยืนยันความเข้าใจ

### 4. Memory Management

จัดการ `memories` อย่างมีประสิทธิภาพ

- ใช้ `create_memory` tool สำหรับบันทึก
- กำหนด `tags` ที่เหมาะสม
- อัปเดท `existing memories` แทนสร้างใหม่
- ลบ `memories` ที่ไม่เกี่ยวข้อง
- ใช้ `CorpusNames` ที่ถูกต้อง

### 5. Context Application

นำข้อมูลไปใช้ในการทำงานจริง

- ปรับ `communication style` ตาม `preferences`
- เลือก `tools` ตามความชอบ
- ทำตาม `workflows` ที่ผู้ใช้ชอบ
- ใช้ภาษาที่ผู้ใช้ต้องการ
- ปรับ `verbosity` ตาม `style`

## Expected Outcome

- เข้าใจ `preferences` ของผู้ใช้ครบถ้วน
- มีข้อมูลที่บันทึกใน `memory system`
- การทำงานปรับตาม `style` ของผู้ใช้
- `Communication style` ตรงกับความต้องการ
- ลดการถามซ้ำคำถามเดิม
