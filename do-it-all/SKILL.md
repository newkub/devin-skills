---
name: do-it-all
description: ทำงานให้ครบทุกขั้นตอนตั้งแต่ plan จนถึง ship โดยไม่หยุดคั่น
related:
  - enhance-prompt
  - report-plan
  - continue
  - run-verify-on-local
  - ship
---

## Goal

Execute the full pipeline สำหรับ task ที user มอบหมาย: วางแผน, ดำเนินการ, ตรวจสอบ, commit, ship โดยไม่หยุดคั่นระหว่างกลาง

## Scope

- ใช้เมื่อ user บอก "do it all", "ทำให้หมด", หรือต้องการ hand off task ทั้งหมด
- รองรับงานเดียวหรืองานทีมี subtasks
- ไม่ใช้สำหรับงานทีต้องการ user confirm ทุกขั้นตอน

## Execute

### 1. Understand And Plan

> Goal: เข้าใจ task และวางแผน

1. ทำ `/enhance-prompt` เพื่อแยก task เป็นข้อๆ ทีละ responsibility
2. ทำ `/report-plan` เพื่อรายงานแผนก่อนลงมือ
3. อ่าน `AGENTS.md`, `TODO.md`, `TASKS.md` ถ้ามี
4. ถ้า scope ไม่ชัด → ทำ `/ask-me` ก่อน

### 2. Execute

> Goal: ดำเนินการตามแผน

1. ทำ `/continue` หรือ `/follow-plan` เพื่อทำงานตามลำดับ
2. ถ้ามี subtasks อิสระหลายด้าน → ทำ `/follow-devin-global-subagents`
3. ถ้าต้องสร้าง app/library → ใช้ `follow-create-*` ตามประเภท
4. ถ้าเจอ error → ทำ `/resolve-errors` จนกว่าจะผ่าน
5. ถ้าต้องหยุดถามผู้ใช้ก่อนทำ action เสี่ยง → ทำ `/ask-me`

### 3. Verify

> Goal: ตรวจสอบความถูกต้อง

1. ทำ `/run-verify-on-local` หรือ `/run-check` สำหรับ lint, typecheck, scan
2. ทำ `/run-test-all` ถ้ามี tests
3. ถ้ามีการแก้ skill หรือ rules → ทำ `/deep-validate`
4. ถ้าไม่ผ่าน → กลับไป Step 2 แก้ไข (สูงสุด 3 รอบ)

### 4. Ship

> Goal: ส่งมอบงาน

1. ถ้า repo มี changes → ทำ `/git-commit`
2. ถ้าต้อง push → ทำ `/git-push` หรือ `/ship`
3. ถ้าไม่แน่ใจว่าควร push → ทำ `/ask-me`
4. ถ้าไม่มี git หรือไม่ต้องการ commit → ข้าม

### 5. Report

> Goal: สรุปผล

1. ทำ `/report-table` แสดง: No, Task, Status, Evidence, Notes
2. สรุปสิ่งทีเปลี่ยน, ผลตรวจสอบ, และ next actions
3. ทำ `/suggest-next-action`

## Rules

### 1. Autonomy

- ดำเนินการโดยไม่ถาม user ใน step ทีความเสี่ยงต่ำ
- ถาม user เฉพาะเมื่อ:
  - action เสี่ยงสูง (ลบ, overwrite, deploy, push)
  - scope ไม่ชัด
  - มีหลายทางเลือกทีต่างกันมาก

### 2. Safety

- สำรองไฟล์สำคัญก่อนแก้ไข
- ทำ dry run ก่อน destructive action
- ไม่ commit secrets หรือ sensitive data
- ไม่ push ถ้า user ไม่ได้ขอ

### 3. Verification

- ไม่ ship ถ้า verify ไม่ผ่าน
- ถ้า verify ไม่ผ่านหลัง 3 รอบ → stop และ report
- รายงานผลตรวจสอบทุกครั้ง

### 4. Scope

- ไม่ขยาย scope เกิน prompt โดยไม่ถาม
- ถ้า task ใหญ่มาก → ทำ `/plan` หรือ `/deep-plan` ก่อน
- ถ้ามีงานค้าง → สรุปสิ่งทีเสร็จและค้าง

## Expected Outcome

- Task เสร็จสมบูรณ์ตาม prompt
- ผ่าน lint/typecheck/tests ถ้ามี
- มี commit/ship ถ้าเหมาะสม
- รายงานสรุปครบถ้วนพร้อม next action
