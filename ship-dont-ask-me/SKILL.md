---
name: ship-dont-ask-me
description: Ship code ตาม /ship ภายใต้ dont-ask-me mode โดยไม่ถามผู้ใช้จนกว่าจบ session
argument-hint: "[@issue-number-or-title]"
related:
  - ship
  - dont-ask-me
  - follow-your-suggestion
  - loop-until-complete
  - continue
  - ship-to-staging
  - ship-to-production
  - run-verify
  - deep-validate
  - resolve-cicd
  - report-progress
  - suggest-next-action
  - follow-enter-dot
---

## Goal

Ship code ตาม flow ของ `/ship` ครบทุกขั้นตอนภายใต้ `/dont-ask-me` mode — ห้าม `/ask-me`, `ask_user_question` และ confirmation prompt ทุกรูปแบบจนจบ session โดยแทนทุกจุดทีต้องถามด้วย `/follow-your-suggestion` และ safe default ทีเลือกได้เอง ทำงานค่อยเป็นค่อยไปทีละ step ห้ามข้าม และวนด้วย `/loop-until-complete` จน ship สำเร็จ

## Scope

- ใช้เมื่อผู้ใช้ระบุ `/ship-dont-ask-me`, `ship` พร้อม `dont-ask-me`, หรือเมื่อ `/follow-enter-dot` ตรวจพบว่า session นี้เคยใช้ `/ship-dont-ask-me` แล้ว
- การเรียกใช้ครั้งแรกเปิด `dont-ask-me` mode ให้ session ทันที — มีผลกับทุก `/ask-me` ใน `global_rules.md` และ skills ทีเกี่ยวข้อง
- ครอบคลุม ship lifecycle เดียวกับ `/ship`: prepare → branch → validate → staging → merge → production → report
- action ทีเป็นอันตรายหรือย้อนกลับไม่ได้ → เลือก safe path แล้ว report แทนการถามยืนยัน

## Execute

### 1. Activate Dont-Ask-Me Mode

> Goal: เปิดโหมดไม่ถามก่อนเริ่ม ship

1. ทำ `/dont-ask-me` เพื่อเปิด session mode — ทุก `/ask-me`, `ask_user_question`, `pick-bestest` และ confirmation gate ใน flow นี้ถูกแทนด้วย `/follow-your-suggestion` + safe default
2. บันทึกว่า session นี้ใช้ `ship-dont-ask-me` แล้ว เพื่อให้ `/follow-enter-dot` เลือก action นี้ใน trigger `.` ถัดไป

### 2. Run Ship Flow

> Goal: ทำตาม `/ship` ครบทุก step โดยไม่ถาม

1. ทำตาม `/ship` ทีละ section ตามลำดับ: `Prepare` → `Branch Hygiene` → `Validate` → `Stage` → `Merge And Production` → `Report` — ห้ามข้าม step
2. ทุกจุดที `/ship` ระบุ "ทำ `/ask-me`", "user ยืนยัน" หรือ "user confirm" → ตัดสินใจเองผ่าน `/follow-your-suggestion` ด้วย safe default ทีสอดคล้อง `AGENTS.md` และ conventions
3. ทำงาน incremental: แก้ไขและ verify ทีละจุดเล็กๆ ไม่รวมหลาย change เสี่ยงในรอบเดียว
4. บันทึกทุกการตัดสินใจทีแทนการถามไว้ใน report เพื่อให้ traceable

### 3. Handle Gates Without Asking

> Goal: ผ่าน confirmation gates ด้วย safe default

1. ถ้าเจอข้อขัดแย้งหรือ trade-off (ship step `Prepare` #4) → เลือกทางเลือกที risk ต่ำสุดและ reversible แล้วดำเนินการต่อ
2. ถ้าเจอ breaking change (ship rule `User Confirmation`) → หยุดก่อน merge, report รายละเอียดและเหตุผล แล้วรอ user แทนการ deploy ต่อ
3. ถ้า release ต้องยืนยัน → ทำ `/run-release --dry-run` รายงานผล แล้วเลือก safe default (ถ้าไม่มี default ทีปลอดภัยให้ข้าม release และ report)
4. ถ้า production deploy เสี่ยงสูงและไม่มี safe default → หยุดที staging ทีผ่านแล้ว report สถานะ ไม่ deploy ต่อเอง

### 4. Loop Until Complete

> Goal: วนจน ship สำเร็จหรือถึงจุดทีดีพอ

1. ทำ `/loop-until-complete` สำหรับ validation, staging retry และ CI resolution — ไม่หยุดกลางทางเพื่อถาม
2. ถ้า validation หรือ staging ไม่ผ่าน → แก้ทีละจุดด้วย `/resolve-errors` หรือ `/resolve-cicd` แล้ววนต่อตาม retry limit ของ `/ship`
3. ถ้าถึง max retries หรือเจอ blocker ทีแก้เองไม่ได้ → หยุดและ report สิ่งทีค้าง สาเหตุ และขั้นตอนทีต้องทำต่อ

### 5. Report

> Goal: สรุปผล ship และสถานะ mode

1. ทำ `/report-progress` และ `/report` สรุป status, PR, version เหมือน `/ship`
2. ระบุ decisions ทั้งหมดทีแทนการถาม และ default ทีเลือก
3. ระบุว่า `dont-ask-me` mode ยัง active ต่อใน session
4. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไปโดยไม่ถาม

## Rules

### 1. Ship Plus Dont-Ask-Me

- ทำตาม `/ship` เต็มรูปแบบภายใต้ `/dont-ask-me` mode — ห้ามลดขั้นตอน validation หรือ safety gate
- ทุก reference ถึง `/ask-me` ใน flow นี้และใน `global_rules.md` ถูกแทนด้วย `/follow-your-suggestion` จนจบ session

### 2. No Prompt Discipline

- ห้ามใช้ `ask_user_question`, ห้ามแสดง prompt ให้เลือก, ห้ามเรียก `/ask-me`, `/ask-again`, `/pick-bestest`
- ห้ามเรียก `/follow-your-suggestion` เพื่อขอคำยืนยัน — ใช้เพื่อ apply ข้อเสนอเท่านั้น

### 3. Safe Stepwise Execution

- ทำงานค่อยเป็นค่อยไปทีละ step ตามลำดับ — ห้ามข้าม step ที `/ship` กำหนด
- แก้ไข incremental และ verify ก่อนไปต่อทุกรอบ
- action ทีย้อนกลับไม่ได้ (production deploy, release, destructive ops) → เลือก safe default; ถ้าไม่มีทางเลือกทีปลอดภัย → หยุดและ report ไม่ถาม

### 4. Session Integration

- หลังใช้ `/ship-dont-ask-me` ใน session → `/follow-enter-dot` ต้องเลือก `/ship-dont-ask-me` แทน `/ship` เมื่อ state พร้อม ship
- ผู้ใช้ยกเลิก mode ได้ด้วยคำสั่งชัดเจน เช่น "กลับมาถาม", "cancel dont-ask-me"

## Expected Outcome

- Ship ครบ lifecycle ตาม `/ship` โดยไม่มี prompt ถามผู้ใช้เลย
- ทุก confirmation gate ถูกแทนด้วย safe default ที traceable ใน report
- งานวนจนสมบูรณ์ด้วย `/loop-until-complete` โดยไม่ข้าม step
- `dont-ask-me` mode คง active สำหรับงานถัดไปใน session
