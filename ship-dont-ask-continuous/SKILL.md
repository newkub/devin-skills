---
name: ship-dont-ask-continuous
description: Ship workspace โดยไม่ถาม วนปรับปรุงจนดีพอ หยุดก่อน over-engineer
related:
  - ship
  - loop-continuous
  - run-check
  - deep-validate
  - git-commit
  - resolve-errors
  - dont-over-engineer
  - report-progress
  - suggest-next-action
---

## Goal

ส่งมอบ workspace โดยไม่ถาม confirmation โดยวนปรับปรุงซ้ำจนถึงจุดที "ดีพอ" แล้วค่อย ship โดยหยุดก่อนทีจะ over-engineer

## Scope

ใช้เมื่องานใกล้พร้อม ship แต่อาจต้องแก้ไขหรือปรับปรุงหลายรอบ โดยไม่ถาม user ในแต่ละรอบ และไม่ push/release โดยอัตโนมัติ

## Execute

### 1. Pre-Flight Check

> Goal: ยืนยันว่าพร้อมเข้า loop

1. ตรวจสอบว่าไม่มี uncommitted changes ที่ไม่พร้อม
2. ตรวจสอบว่าไม่มี destructive action ที่รอดำเนินการ
3. ตรวจสอบ `AGENTS.md` อัปเดตและถูกต้อง
4. ถ้า `AGENTS.md` ไม่พร้อม ให้ทำ `/update-agents-md` แล้ว `/follow-agents-md`

### 2. Establish Baseline

> Goal: รู้จุดเริ่มต้นก่อนวนปรับปรุง

1. รัน `/run-check` เพื่อเก็บ baseline lint, typecheck, scan
2. รัน `/deep-validate` เพื่อเก็บ baseline validation
3. บันทึกผล, error count, warning count, และ metrics สำคัญ
4. ถ้า baseline ผ่านทั้งหมด ให้ข้ามไป step 6 แล้ว ship

### 3. Define Good Enough Criteria

> Goal: กำหนดเส้นชัยทีวัดผลได้

1. ระบุ criteria สำหรับ ship: `/run-check` ผ่าน, `/deep-validate` ผ่าน, ไม่มี TODO/MOCK/placeholder
2. ระบุ over-engineering indicators: ไฟล์/dependency เพิ่มโดยไม่จำเป็น, abstraction เกินไป, scope creep
3. ตั้งค่า max iterations หรือ budget เพื่อป้องกัน infinite loop
4. ถ้า criteria ไม่ชัด ให้ทำ `/ask-me` ก่อน

### 4. Iterate Ship-Improve Loop

> Goal: วนปรับปรุงและ verify จนถึงจุดทีดีพอ

1. ทำ `/resolve-errors` เพื่อแก้ไข errors ทีพบในรอบก่อน
2. ทำ `/improve` เพื่อปรับปรุงสิ่งเดียวที impact สูงสุดในรอบนี้
3. รัน `/run-check` อีกครั้ง
4. รัน `/deep-validate` อีกครั้ง
5. บันทึก delta ระหว่างรอบ
6. ถ้าผลลัพธ์เท่าเดิม หรือดีขึ้นไม่ถึง threshold ให้หยุด loop
7. ถ้าจะดีขึ้นได้ต้องใช้ทรัพยากร/ความซับซ้อนมากกว่าประโยชน์ ให้หยุด loop
8. ถ้าการปรับปรุงถัดไปเสี่ยง over-engineer ให้หยุด loop
9. ถ้ายังไม่ถึง max iterations และยังมี improvement ทีชัดเจน ให้ทำต่อ

### 5. Decide Continue Or Stop

> Goal: ตัดสินใจว่าหยุดหรือทำต่อ

1. ถ้า criteria ทั้งหมดผ่าน และไม่มี improvement ทีมีนัยสำคัญ ให้หยุด
2. ถ้ายังไม่ผ่าน criteria แต่ improvement ลดลงจนไม่คุ้ม cost ให้หยุดและ report
3. ถ้าพบวิธีทีดีกว่าที impact สูง ให้ทำต่อในรอบถัดไป
4. ถ้าคิดไม่ออกว่าจะดีขึ้นอย่างไร ให้ทำ `/suggest-next-action` หรือ `/ask-me`

### 6. Final Ship

> Goal: ส่งมอบโดยไม่ถาม

1. ทำ `/ship` ตาม `AGENTS.md` workflow
2. ไม่ถามผู้ใช้ก่อน ship
3. ไม่ push หรือ release โดยอัตโนมัติ
4. ถ้า ship ไม่ผ่าน → report และ stop

### 7. Report

> Goal: สรุปผล

1. ทำ `/report-table` สรุป status, จำนวนรอบ, commits, checks
2. แสดง before/after metrics
3. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป

## Rules

### 1. No Confirmation Prompt

- ห้ามใช้ `ask_user_question` เพื่อขอคำยืนยันก่อน ship
- ห้ามเรียก `/ask-me`, `/ask-project-requirement`, `/understand-me` ใน flow นี้
- ห้ามเรียก `/follow-your-suggestion` เพื่อขอคำยืนยัน

### 2. Stop Conditions

- หยุดเมื่องานดีพอตาม criteria ทีกำหนด
- หยุดเมื่องานไม่สามารถดีขึ้นได้อีกโดยไม่เพิ่ม cost หรือ risk
- หยุดเมื่องานถัดไปมี impact น้อยกว่าต้นทุน
- ถ้าถึง max iterations ให้หยุดและ report

### 3. Over-Engineering Guardrails

- ห้ามสร้าง abstraction, layer, dependency ใหม่ถ้าไม่จำเป็นจริงๆ
- ห้าม optimize ส่วนทีไม่ใช่ bottleneck หรือไม่มี evidence
- ห้ามเพิ่ม features หรือ config นอก scope ปัจจุบัน
- ถ้ามีข้อสงสัย ให้ทำ `/dont-over-engineer` หรือ `/loop-continuous`

### 4. AGENTS.md First

- ทำ `/update-agents-md` และ `/follow-agents-md` ก่อน ship ทุกครั้ง
- ทำตาม `AGENTS.md` workflow

### 5. No Push/Release

- `/ship-dont-ask-continuous` ไม่ push หรือ release อัตโนมัติ
- ถ้าต้องการ push ให้ใช้ `git push` หรือ `/git-push` หลัง ship

### 6. Measurement And Evidence

- ทุกรอบต้องมีข้อมูลเปรียบเทียบ before/after
- ใช้ตัวเลข, test result, lint score, หรือ metrics จริง ไม่ใช้ความรู้สึก
- บันทึกสิ่งทีทดลองแล้วไม่ได้ผลเพื่อไม่วนซ้ำ

## Expected Outcome

- Workspace ผ่าน `/run-check` และ `/deep-validate`
- งานถูกปรับปรุงซ้ำจนถึงจุดทีดีพอ
- ไม่เกิด over-engineering หรือ scope creep
- Commit สำเร็จโดยไม่ถาม
- ไม่มี push/release โดยไม่ได้รับคำสั่งชัดเจน
- Report ครบถ้วนพร้อมจำนวนรอบและ metrics
