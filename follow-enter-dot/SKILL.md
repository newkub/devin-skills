---
name: follow-enter-dot
description: จัดการเมื่อ user ส่ง "." โดยตรวจ state แล้วทำ continue, suggest, ship, idea-features หรือ ask-me
related:
  - continue
  - idea-features
  - follow-your-suggestion
  - ship-verify-cicd
  - ask-me
  - suggest-next-action
  - report-before
---

## Goal

จัดการ trigger `.` จาก user โดยตรวจสอบ state ปัจจุบัน แล้วเลือก action ทีเหมาะสม: ทำงานต่อ, แนะนำขั้นตอนถัดไป, ship งาน, สร้างไอเดีย features หรือถาม user

## Scope

ใช้เมื่อ user ส่งข้อความทีมีเฉพาะ `.` หรือใช้ `.` เป็น trigger ให้ทำงานถัดไปตาม state ปัจจุบัน

## Execute

### 1. Read Current State

> Goal: รู้ state ปัจจุบันก่อนตัดสินใจ

1. ตรวจสอบ todo list ปัจจุบัน (ถ้ามี)
2. ตรวจสอบ open files, recent changes, git status
3. ตรวจสอบข้อความล่าสุดของ user และ context
4. ทำ `/report-before` เพื่อสรุปสถานะปัจจุบัน

### 2. Determine Next Action

> Goal: เลือก action ทีเหมาะสม

1. ถ้ามีงานค้างหรือ todos ยังไม่เสร็จ → ทำ `/continue`
2. ถ้างานพร้อม ship และ validation ผ่าน → ทำ `/ship-verify-cicd`
3. ถ้าต้องการแนะนำทิศทางหรือขั้นตอนถัดไป → ทำ `/suggest-next-action` หรือ `/follow-your-suggestion`
4. ถ้า context บ่งบอกว่าต้องการไอเดีย features หรือกำลัง brainstorm (เช่นข้อความก่อนหน้าพูดถึง "ไอเดีย", "features", "ฟีเจอร", หรือ user ถามคำถามเปิดกว้างเกี่ยวกับฟีเจอร) → ทำ `/idea-features`
5. ถ้า context ไม่ชัดหรือต้องการคำตอบจาก user → ทำ `/ask-me`
6. ถ้า user บ่งบอกเจตนาเฉพาะ (เช่น ship, continue, ask) → ทำตามที user ต้องการ

### 3. Execute Action

> Goal: ดำเนินการตามทีเลือก

1. `/continue` — ทำงานค้างให้เสร็จ
2. `/ship-verify-cicd` — ส่งมอบงานทีเสร็จแล้ว
3. `/suggest-next-action` — แนะนำขั้นตอนถัดไป
4. `/idea-features` — สร้างไอเดียฟีเจอรในแชท ถ้า context เกี่ยวกับไอเดีย
5. `/follow-your-suggestion` — ทำตามข้อเสนอทีเคยวิเคราะห์ไว้
6. `/ask-me` — ถาม user เมื่อ context ไม่พอ

### 4. Report

> Goal: สรุป action ทีทำ

1. รายงาน action ทีเลือก
2. รายงาน state ทีทำให้เลือก action นั้น
3. ถ้า ship แล้ว → รายงานสรุปผล
4. ถ้า continue → รายงานขั้นตอนถัดไปทีทำ

## Rules

- `.` เป็น trigger ไม่ใช่คำสั่่งเต็มรูปแบบ
- ต้องตรวจ state ก่อนตัดสินใจเสมอ
- ถ้างานยังไม่เสร็จ → ทำ `/continue` ก่อน `/ship-verify-cicd`
- ถ้าต้อง ship → ต้องผ่าน validation ก่อน
- ถ้า context ไม่ชัด → ทำ `/ask-me`
- ไม่ทำการเปลี่ยนแปลงทีเสี่ยงโดยไม่มี user confirmation

## Expected Outcome

- User ได้รับ action ทีถูกต้องตาม state
- งานค้างถูก continue จนครบ
- งานพร้อมถูก ship ตามมาตรฐาน
- ไอเดีย features ถูกสร้างด้วย `/idea-features` เมื่อ context บ่งบอก
- Context ไม่ชัดถูกถามก่อนลงมือ

