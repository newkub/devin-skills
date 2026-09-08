---
name: follow-enter-dot
description: จัดการ trigger "." โดยตรวจ state แล้วเลือก continue, suggest, ship, ship-dont-ask-me, idea-features หรือ ask-me
argument-hint: "[scope]"
related:
  - continue
  - idea-features
  - follow-your-suggestion
  - ship
  - ship-dont-ask-me
  - dont-ask-me
  - ask-me
  - suggest-next-action
  - report-progress
  - report
  - save-to-todo-md
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
4. ตรวจสอบว่า session นี้เคยใช้ `/ship-dont-ask-me` หรือ `/dont-ask-me` หรือไม่ — ถ้าเคย ให้คง `dont-ask-me` mode ไว้ในการตัดสินใจทุกขั้นตอนถัดไป (แทน `/ask-me` ด้วย `/follow-your-suggestion` + safe default)
5. ทำ `/report-progress` เพื่อสรุปสถานะปัจจุบัน

### 2. Determine Next Action

> Goal: เลือก action ทีเหมาะสม

1. ถ้ามีงานค้างหรือ todos ยังไม่เสร็จ → ทำ `/continue`
2. ถ้างานพร้อม ship และ validation ผ่าน → ทำ `/ship` แล้วตามด้วย `/suggest-next-action`; แต่ถ้า session นี้เคยใช้ `/ship-dont-ask-me` → ทำตาม `/ship-dont-ask-me` แทน `/ship`
3. ถ้าต้องการแนะนำทิศทางหรือขั้นตอนถัดไป → ทำ `/suggest-next-action` หรือ `/follow-your-suggestion`
4. ถ้า context บ่งบอกว่าต้องการไอเดีย features หรือกำลัง brainstorm (เช่นข้อความก่อนหน้าพูดถึง "ไอเดีย", "features", "ฟีเจอร", หรือ user ถามคำถามเปิดกว้างเกี่ยวกับฟีเจอร) → ทำ `/idea-features`
5. ถ้า context ไม่ชัดหรือต้องการคำตอบจาก user → ทำ `/ask-me`; แต่ถ้า session อยู่ใน `dont-ask-me` mode → ทำ `/follow-your-suggestion` ด้วย safe default แทน
6. ถ้า user บ่งบอกเจตนาเฉพาะ (เช่น ship, continue, ask) → ทำตามที user ต้องการ

### 3. Execute Action

> Goal: ดำเนินการตามทีเลือก

1. `/continue` — ทำงานค้างให้เสร็จ
2. `/ship` — ส่งมอบงานทีเสร็จแล้ว จากนั้นทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป
3. `/ship-dont-ask-me` — ship ภายใต้ `dont-ask-me` mode โดยไม่ถาม เมื่อ session เคยใช้ `/ship-dont-ask-me` แล้ว
4. `/suggest-next-action` — แนะนำขั้นตอนถัดไป
5. `/idea-features` — สร้างไอเดียฟีเจอรในแชท ถ้า context เกี่ยวกับไอเดีย
6. `/follow-your-suggestion` — ทำตามข้อเสนอทีเคยวิเคราะห์ไว้
7. `/ask-me` — ถาม user เมื่อ context ไม่พอ (ยกเว้นใน `dont-ask-me` mode ให้ใช้ `/follow-your-suggestion` แทน)
8. ถ้า action ที่เลือกทำไม่ได้ (blocked, ขาด dependencies, หรือเสี่ยงเกินไป) → ทำ `/save-to-todo-md` บันทึกงานค้างไว้ก่อน แล้วข้ามไป action ถัดไป

### 4. Report

> Goal: สรุป action ทีทำ

1. รายงาน action ทีเลือก
2. รายงาน state ทีทำให้เลือก action นั้น
3. ถ้า ship แล้ว → รายงานสรุปผล
4. ถ้า continue → รายงานขั้นตอนถัดไปทีทำ

## Rules

- `.` เป็น trigger ไม่ใช่คำสั่่งเต็มรูปแบบ
- ต้องตรวจ state ก่อนตัดสินใจเสมอ
- ถ้างานยังไม่เสร็จ → ทำ `/continue` ก่อน `/ship`
- ถ้าต้อง ship → ต้องผ่าน validation ก่อน
- ถ้า session เคยใช้ `/ship-dont-ask-me` → ต้องทำตาม `/ship-dont-ask-me` แทน `/ship` และคง `dont-ask-me` mode (แทน `/ask-me` ด้วย `/follow-your-suggestion`)
- ถ้า context ไม่ชัด → ทำ `/ask-me` (ยกเว้นใน `dont-ask-me` mode)
- ไม่ทำการเปลี่ยนแปลงทีเสี่ยงโดยไม่มี user confirmation (ยกเว้นใน `dont-ask-me` mode ให้เลือก safe default แล้ว report)
- อะไรที่ยังทำไม่ได้ → ทำ `/save-to-todo-md` ไว้ก่อน แล้วค่อยข้าม ห้ามทิ้งงานค้างโดยไม่บันทึก

## Expected Outcome

- User ได้รับ action ทีถูกต้องตาม state
- งานค้างถูก continue จนครบ
- งานพร้อมถูก ship ตามมาตรฐาน แล้วตามด้วย `/suggest-next-action` หรือ ship ด้วย `/ship-dont-ask-me` เมื่อ session เคยใช้
- ไอเดีย features ถูกสร้างด้วย `/idea-features` เมื่อ context บ่งบอก
- Context ไม่ชัดถูกถามก่อนลงมือ หรือตัดสินใจด้วย safe default เมื่ออยู่ใน `dont-ask-me` mode
- งานที่ยังทำไม่ได้ถูกบันทึกลง `/save-to-todo-md` ก่อนข้าม ไม่หายไปเฉยๆ
