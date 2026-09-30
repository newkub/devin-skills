---
name: follow-enter-dot
description: จัดการ trigger "." โดยตรวจ state แล้วเลือก continue, git commit/push, suggest, ship หรือ ask-me
argument-hint: "[scope]"
related:
  - continue
  - idea
  - idea-features
  - follow-your-suggestion
  - git-commit
  - git-push
  - git-commit-and-push
  - ship-to-dev-branch
  - dont-ask-me
  - ask-me
  - suggest-next-action
  - report-progress
  - report
  - save-to-todo-md

---

## Goal

จัดการ trigger `.` จาก user โดยตรวจสอบ state ปัจจุบัน แล้วเลือก action ทีเหมาะสม: ทำงานต่อ, commit/push งานที่เสร็จ, แนะนำขั้นตอนถัดไป, ship งาน, สร้างไอเดีย features หรือถาม user

## Scope

ใช้เมื่อ user ส่งข้อความทีมีเฉพาะ `.` หรือใช้ `.` เป็น trigger ให้ทำงานถัดไปตาม state ปัจจุบัน

## Execute

### 1. Read Current State

> Goal: รู้ state ปัจจุบันก่อนตัดสินใจ

1. ตรวจสอบ todo list ปัจจุบัน (ถ้ามี) — ถ้ามี `[scope]` argument ให้จำกัดการตรวจ state เฉพาะ scope นั้น
2. ตรวจสอบ open files, recent changes, git status
3. ตรวจสอบข้อความล่าสุดของ user และ context
4. ตรวจสอบว่า session นี้เคยใช้ `/ship-to-dev-branch` ใน `dont-ask-me` mode หรือ `/dont-ask-me` หรือไม่ — ถ้าเคย ให้คง `dont-ask-me` mode ไว้ในการตัดสินใจทุกขั้นตอนถัดไป (แทน `/ask-me` ด้วย `/follow-your-suggestion` + safe default)
5. ทำ `/report-progress` เพื่อสรุปสถานะปัจจุบัน

### 2. Determine Next Action

> Goal: เลือก action ทีเหมาะสม

เลือกตามลำดับข้อ 1-8 — ข้อแรกที่ match state ชนะ

1. ถ้ามีงานค้างหรือ todos ยังไม่เสร็จ → ทำ `/continue`
2. ถ้ามี uncommitted changes ที่งานเสร็จและ validation ผ่านแล้ว → ทำ `/git-commit-and-push` (commit + push + resolve CI/CD); ถ้าต้องการเฉพาะ commit ไม่ push → ทำ `/git-commit`
3. ถ้า committed แล้วแต่ยังมี unpushed commits → ทำ `/git-push`
4. ถ้างานพร้อม ship และ validation ผ่าน → ทำ `/ship-to-dev-branch` แล้วตามด้วย `/suggest-next-action`; แต่ถ้า session อยู่ใน `dont-ask-me` mode → ทำ `/ship-to-dev-branch` ใน `dont-ask-me` mode (Step 6 ของ `/ship-to-dev-branch`)
5. ถ้าต้องการแนะนำทิศทางหรือขั้นตอนถัดไป → ทำ `/suggest-next-action` หรือ `/follow-your-suggestion`
6. ถ้า context บ่งบอกว่าต้องการไอเดีย features หรือกำลัง brainstorm (เช่นข้อความก่อนหน้าพูดถึง "ไอเดีย", "features", "ฟีเจอร", หรือ user ถามคำถามเปิดกว้างเกี่ยวกับฟีเจอร) → ทำ `/idea-features`
7. ถ้า context ไม่ชัดหรือต้องการคำตอบจาก user → ทำ `/ask-me`; แต่ถ้า session อยู่ใน `dont-ask-me` mode → ทำ `/follow-your-suggestion` ด้วย safe default แทน
8. ถ้า user บ่งบอกเจตนาเฉพาะ (เช่น ship, continue, commit, push, ask) → ทำตามที user ต้องการ

### 3. Execute Action

> Goal: ดำเนินการตามทีเลือก

1. `/continue` — ทำงานค้างให้เสร็จ
2. `/git-commit-and-push` — commit + push งานที่เสร็จแล้วพร้อม resolve CI/CD
3. `/git-commit` — commit เฉพาะ changes (ไม่ push) เมื่อเหมาะสม
4. `/git-push` — push commits ที่ค้างอยู่
5. `/ship-to-dev-branch` — ส่งมอบงานทีเสร็จแล้ว จากนั้นทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป
6. `/ship-to-dev-branch` (dont-ask-me mode) — ship โดยไม่ถาม user เมื่อ session อยู่ใน `dont-ask-me` mode
7. `/suggest-next-action` — แนะนำขั้นตอนถัดไป
8. `/idea-features` — สร้างไอเดียฟีเจอรในแชท ถ้า context เกี่ยวกับไอเดีย
9. `/follow-your-suggestion` — ทำตามข้อเสนอทีเคยวิเคราะห์ไว้
10. `/ask-me` — ถาม user เมื่อ context ไม่พอ (ยกเว้นใน `dont-ask-me` mode ให้ใช้ `/follow-your-suggestion` แทน)
11. ถ้า action ที่เลือกทำไม่ได้ (blocked, ขาด dependencies, หรือเสี่ยงเกินไป) → ทำ `/save-to-todo-md` บันทึกงานค้างไว้ก่อน แล้วข้ามไป action ถัดไป

### 4. Report

> Goal: สรุป action ทีทำ

1. รายงาน action ทีเลือก
2. รายงาน state ทีทำให้เลือก action นั้น
3. ถ้า commit/push แล้ว → รายงาน commit hash และ remote state
4. ถ้า ship แล้ว → รายงานสรุปผล
5. ถ้า continue → รายงานขั้นตอนถัดไปทีทำ

## Rules

- `.` เป็น trigger ไม่ใช่คำสั่่งเต็มรูปแบบ
- ต้องตรวจ state ก่อนตัดสินใจเสมอ
- ถ้างานยังไม่เสร็จ → ทำ `/continue` ก่อน `/git-commit-and-push` หรือ `/ship-to-dev-branch`
- ถ้าต้อง commit/push หรือ ship → ต้องผ่าน validation ก่อน
- ห้าม commit/push changes ที่ยังไม่เสร็จหรือ validation ไม่ผ่าน
- ถ้า session อยู่ใน `dont-ask-me` mode → ต้องทำ `/ship-to-dev-branch` ใน `dont-ask-me` mode และคง mode ไว้ (แทน `/ask-me` ด้วย `/follow-your-suggestion`)
- ถ้า context ไม่ชัด → ทำ `/ask-me` (ยกเว้นใน `dont-ask-me` mode)
- ไม่ทำการเปลี่ยนแปลงทีเสี่ยงโดยไม่มี user confirmation (ยกเว้นใน `dont-ask-me` mode ให้เลือก safe default แล้ว report)
- อะไรที่ยังทำไม่ได้ → ทำ `/save-to-todo-md` ไว้ก่อน แล้วค่อยข้าม ห้ามทิ้งงานค้างโดยไม่บันทึก

## Expected Outcome

- User ได้รับ action ทีถูกต้องตาม state
- งานค้างถูก continue จนครบ
- งานที่เสร็จและ validation ผ่านถูก commit/push ผ่าน `/git-commit-and-push`, `/git-commit` หรือ `/git-push`
- งานพร้อมถูก ship ตามมาตรฐาน แล้วตามด้วย `/suggest-next-action` หรือ ship ใน `dont-ask-me` mode เมื่อ session อยู่ใน mode นั้น
- ไอเดีย features ถูกสร้างด้วย `/idea-features` เมื่อ context บ่งบอก
- Context ไม่ชัดถูกถามก่อนลงมือ หรือตัดสินใจด้วย safe default เมื่ออยู่ใน `dont-ask-me` mode
- งานที่ยังทำไม่ได้ถูกบันทึกลง `/save-to-todo-md` ก่อนข้าม ไม่หายไปเฉยๆ
