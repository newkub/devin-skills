---
name: ship-code
description: Ship workspace ที่เลือก โดย commit ทำตาม AGENTS.md ไม่มี push หรือ release
---

## Goal

Ship workspace ที่เลือก โดยอัปเดต `AGENTS.md` ทำตาม workflows ตรวจสอบด้วย `/run-verify` แล้ว commit

## Scope

ใช้เมื่องานใน workspace ที่เลือกเสร็จสมบูรณ์และต้องการ commit เท่านั้น ไม่รวม push หรือ release สำหรับหลาย workspace ให้เรียก `/ship-code` แต่ละ workspace ตามลำดับ dependency

## Execute

### 1. Update AGENTS.md

> Goal: `AGENTS.md` เป็นปัจจุบันก่อน ship

1. ทำ `/update-agents-md` เพื่ออัปเดต `AGENTS.md`
2. ตรวจสอบว่า `AGENTS.md` ถูกต้องและครบถ้วน
3. ถ้า `AGENTS.md` ไม่พร้อมใช้ → stop และ report

### 2. Follow AGENTS.md

> Goal: ทำตาม workflows ใน `AGENTS.md`

1. ทำ `/follow-agents-md` เพื่อ execute workflows/skills ที่ระบุ
2. ถ้าพบ error ให้ทำ `/resolve-errors` แล้วทำ `/follow-agents-md` ซ้ำจนกว่าจะผ่าน
3. ยืนยันว่า `## Expected Outcome` ของแต่ละ sub-workflow บรรลุแล้ว

### 3. Verify

> Goal: ตรวจสอบความพร้อมก่อน commit

1. ทำ `/run-verify` เพื่อรัน scan, lint, typecheck, test และ build
2. ทำ `/validate` เพื่อ validate ผลลัพธ์
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` แล้วกลับไปทำ Step 2-3 จนกว่าจะผ่าน

### 4. Commit

> Goal: commit การเปลี่ยนแปลง

1. ทำ `/git-commit` เพื่อ commit การเปลี่ยนแปลงทั้งหมด
2. ถ้า commit ไม่สำเร็จ → ทำ `/resolve-errors` แล้ว retry (max 3)

### 5. Report

> Goal: รายงานผล ship

1. ทำ `/report` พร้อม `/report-table` สรุปสิ่งที่ทำ
2. ทำ `/suggest-next-action` เพื่อแนะนำขั้นต่อไป

## Rules

### 1. AGENTS.md First

- `/update-agents-md` ต้องทำก่อนเสมอ
- `/follow-agents-md` ต้องทำหลัง `AGENTS.md` อัปเดต
- ห้าม duplicate รายละเอียดที่มีอยู่ใน `AGENTS.md`

### 2. No Push Or Release

- `ship-code` ไม่ทำ push หรือ release
- ถ้า user ต้องการ push → รัน `git push` ด้วย `exec` หลัง `/ship-code`
- ถ้า user ต้องการ release → ทำ `/run-release` หลัง `/ship-code`
- ไม่ถาม user ว่าจะ push/release หรือไม่

### 3. Use Run-Verify

- ใช้ `/run-verify` เพื่อตรวจสอบครบทั้ง scan, lint, typecheck, test และ build
- ถ้า workspace ไม่มี verify script → ทำ `/follow-tasks` ก่อน

### 4. Sub-Workflow Discipline

- ทุก command ต้องอ่าน `SKILL.md` จริงก่อนทำ
- ทำตาม `## Execute` ของแต่ละ skill จนครบ
- ก่อน mark `completed` ต้อง verify `## Expected Outcome` ของ sub-workflow นั้น

## Expected Outcome

- `AGENTS.md` อัปเดตและถูกต้อง
- Workflows ที่ระบุใน `AGENTS.md` ถูก execute ครบ
- Code ผ่าน `/run-verify` และ `/validate`
- Commit สำเร็จ
- รายงานผลลัพธ์ครบถ้วน
