---
name: suggest-me
description: ถามผู้ใช้เพื่อเข้าใจว่าอยากทำอะไรหรือได้ features อะไร โดยไม่สร้าง report files
argument-hint: "[topic]"
related:
  - ask-me
  - idea-features
  - understand-me
  - ask-project-requirement
  - follow-your-suggestion
  - realize-implementation
  - scan-codebase
---

## Goal

ถามผู้ใช้เพื่อเข้าใจความต้องการว่าอยากทำอะไรหรือได้ features อะไร โดยไม่ต้องสร้าง report files หรือเริ่ม implement ทันที

## Scope

- ใช้เมื่อผู้ใช้บอกว่าอยากทำอะไรหรืออยากได้ features อะไรแบบยังไม่ชัดเจน
- ถามคำถามเหมือนกับ `/idea-features` แต่ไม่ต้องสร้าง report files
- สรุปคำตอบใน chat เพื่อให้ user ยืนยันก่อนดำเนินการ
- สามารถส่งต่อไปยัง `/idea-features` หรือ `/realize-implementation` หลัง user ยืนยัน

## Execute

### 1. Analyze Project Context

> Goal: เข้าใจ project และ prompt

1. อ่าน prompt ล่าสุดและ context ที่มีอยู่
2. ทำ `/scan-codebase` หรือ `/analyze-project` เพื่อเข้าใจ project
3. ระบุว่าผู้ใช้ต้องการอะไร: feature ใหม่, ขยาย feature เดิม, หรืองานทั่วไป

### 2. Ask User With Multi-Step Questions

> Goal: เก็บความต้องการผู้ใช้

1. ใช้ `/ask-me` เพื่อถามคำถาม 1-4 ข้อต่อ step
2. ถ้า user บอก "อยากทำ..." → ถามว่าอยากทำอะไร, เป้าหมายคืออะไร, ใครใช้
3. ถ้า user บอก "อยากได้ features..." → ถาม features หลัก, ขอบเขต, ลำดับความสำคัญ
4. ถามต่อเนื่องจนกว่าจะเข้าใจครบถ้วน
5. ถ้า user ไม่แน่ใจ → ให้ตัวเลือกและคำแนะนำ

### 3. Summarize And Confirm

> Goal: สรุปความต้องการให้ user ยืนยัน

1. สรุปคำตอบทั้งหมดเป็น bullet points สั้นๆ
2. ระบุ feature/goal หลัก, scope, ลำดับความสำคัญ, constraints
3. ถาม user ยืนยันว่าถูกต้องหรือต้องการปรับแก้
4. ถ้า user ยืนยัน → ส่งต่อไปยัง `/idea-features` หรือ `/realize-implementation` ตาม context
5. ถ้า user ต้องการปรับ → ถามเพิ่มจนครบ

## Rules

### 1. No Report Files

- ไม่สร้าง report files ใน skill นี้
- ไม่บันทึก JSON, markdown, หรือไฟล์ report ใดๆ
- สรุปใน chat เท่านั้น

### 2. Like idea-features But Lighter

- ถามคำถามแบบเดียวกับ `/idea-features` แต่ไม่ต้อง generate feature ideas
- โฟกัสที่การเข้าใจความต้องการผู้ใช้
- ไม่ต้องเปรียบเทียบคู่แข่งหรือศึกษาแนวโน้มตลาด

### 3. Use ask-me Only

- ใช้ `ask_user_question` tool เท่านั้น ห้ามถามด้วยข้อความธรรมดาใน chat
- คำถามต้องมีตัวเลือกและคำแนะนำ
- รองรับ multi-step และ multi-select

### 4. Hand Off

- ถ้า user ต้องการไอเดีย features → ส่งต่อ `/idea-features`
- ถ้า user ต้องการ implement → ส่งต่อ `/realize-implementation`
- ถ้าต้องการ plan → ส่งต่อ `/create-plan-as-github-issue`

- ใช้ /understand-me ถ้าจำเป็น
- ใช้ /ask-project-requirement ถ้าจำเป็น
- ใช้ /follow-your-suggestion ถ้าจำเป็น

## Expected Outcome

- ผู้ใช้ตอบคำถามจนครบถ้วน
- Agent เข้าใจความต้องการและ scope
- สรุปใน chat พร้อมให้ user ยืนยัน
- ไม่มี report files ถูกสร้าง
- พร้อมส่งต่อไปยัง skill ที่เหมาะสม
