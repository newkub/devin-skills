---
name: ship
description: Ship workspace ที่เลือก โดยทำตาม AGENTS.md และอัปเดต skills ก่อน commit
related:
  - update-agents-md
  - follow-agents-md
  - update-devin-global-skills
  - update-all-devin-global-skills
  - git-commit
  - report
---

## Goal

Ship workspace ที่เลือกโดยทำตาม `AGENTS.md` และอัปเดต skills ด้วย `/update-devin-global-skills` ก่อน commit โดยไม่ push หรือ release

## Scope

ใช้เมื่องานใน workspace ที่เลือกเสร็จสมบูรณ์และต้องการ commit ครอบคลุมทั้ง code workspace ปกติและ skills repo ที่มี `.git` submodules ไม่รวม push หรือ release สำหรับหลาย workspace ให้เรียก `/ship` แต่ละ workspace ตามลำดับ dependency

## Execute

### 1. Update AGENTS.md

> Goal: `AGENTS.md` เป็นปัจจุบันก่อน ship

1. ถ้า `AGENTS.md` ไม่มีหรือไม่อัปเดต → ทำ `/update-agents-md`
2. ตรวจสอบว่า `AGENTS.md` มี sections ครบตาม `/follow-write-devin-skills`
3. ถ้า `AGENTS.md` ไม่พร้อมใช้ → stop และ report

### 2. Follow AGENTS.md

> Goal: ทำตาม workflows ที่ระบุใน `AGENTS.md`

1. ทำ `/follow-agents-md` เพื่ออ่าน `AGENTS.md`
2. ทำตาม `## Execute` ของ `AGENTS.md` ตามลำดับ
3. ถ้า `AGENTS.md` ไม่ระบุ workflow → ใช้ default: verify → commit → report

### 3. Update Skills

> Goal: อัปเดต skills ให้ผ่านมาตรฐานก่อน ship

1. ถ้า ship ทั้ง skills repo → ทำ `/update-all-devin-global-skills`
2. ถ้า ship skill เดี่ยว → ทำ `/update-devin-global-skills <skill-name>`
3. ถ้าไม่ใช่ skills repo → ข้าม

### 4. Verify

> Goal: ตรวจสอบความพร้อมก่อน commit

1. ทำ `/run-verify` ถ้า `AGENTS.md` หรือ workspace ระบุ
2. ทำ `/test-all` ถ้ามี test suites
3. ทำ `/validate` เพื่อ validate ผลลัพธ์
4. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry

### 5. Commit

> Goal: commit การเปลี่ยนแปลง

1. รัน `git submodule status` เพื่อดู submodules ทั้งหมด
2. ถ้ามี submodules ที่มี changes → commit ใน submodule ก่อน root
3. ทำ `/git-commit` ที่ root พร้อมระบุ submodule pointer updates ถ้ามี
4. ถ้าไม่มี changes → stop และ report

### 6. Report

> Goal: สรุปการ ship

1. ทำ `/report` พร้อม `/report-table`
2. สรุป commits ทั้ง root และ submodules (ถ้ามี)
3. ทำ `/suggest-next-action` เพื่อแนะนำขั้นต่อไป

## Rules

### 1. AGENTS.md First

- `/update-agents-md` ต้องทำก่อนทุกครั้งถ้า `AGENTS.md` ไม่อัปเดต
- `/follow-agents-md` ต้องทำหลัง `AGENTS.md` อัปเดต
- ห้าม duplicate เนื้อหาที่มีอยู่ใน `AGENTS.md`

### 2. No Push Or Release

- `ship` ไม่ทำ push หรือ release
- ถ้า user ต้องการ push → รัน `git push` ด้วย `exec` หลัง `/ship`
- ถ้า user ต้องการ release → ทำ `/run-release` หลัง `/ship`
- ไม่ถาม user ว่าจะ push/release หรือไม่

### 3. Update Skills Before Ship

- ทำ `/update-all-devin-global-skills` สำหรับ skills repo
- ทำ `/update-devin-global-skills` สำหรับ skill เดี่ยว
- ถ้าไม่ใช่ skills repo → ข้าม

### 4. Submodule First

- commit ใน submodule ก่อนเสมอ แล้วจึง update root pointer
- ห้าม commit root pointer โดยที่ submodule ยังไม่ commit
- บันทึก submodule commit hash ก่อน update root
- ถ้าไม่มี submodules → commit ที่ root โดยตรง

### 5. Sub-Workflow Discipline

- ทุก command ต้องอ่าน `SKILL.md` จริงก่อนทำ
- ทำตาม `## Execute` ของแต่ละ skill จนครบ
- ก่อน mark `completed` ต้อง verify `## Expected Outcome` ของ sub-workflow นั้น

## Expected Outcome

- `AGENTS.md` อัปเดตและถูกต้อง
- Workflows ที่ระบุใน `AGENTS.md` ถูก execute ครบ
- Code ผ่าน `/run-verify`, `/test-all` และ `/validate`
- ทุก submodule ที่มี changes ถูก commit ก่อน root
- Root pointer ชี้ไปยัง commit ล่าสุดของ submodules (ถ้ามี)
- Root commit สำเร็จ
- รายงาน submodule commits และ root commit ครบถ้วน
- ถ้ามี release → ตรวจสอบด้วย `/watch-release`
- ถ้า requirements ไม่ชัด → ถามด้วย `/ask-project-requirement` ก่อน ship
