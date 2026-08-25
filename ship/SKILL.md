---
name: ship
description: Ship workspace หรือ skills repo โดย commit ทำตาม AGENTS.md รองรับ submodules ไม่มี push หรือ release
---

## Goal

Ship workspace ที่เลือก หรือ skills repo ที่มี submodules โดยอัปเดต `AGENTS.md` ทำตาม workflows ตรวจสอบด้วย `/run-verify` แล้ว commit ทั้ง submodule และ root

## Scope

ใช้เมื่องานใน workspace ที่เลือกเสร็จสมบูรณ์และต้องการ commit ครอบคลุมทั้ง code workspace ปกติและ skills repo ที่มี `.git` submodules ไม่รวม push หรือ release สำหรับหลาย workspace ให้เรียก `/ship` แต่ละ workspace ตามลำดับ dependency

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

### 4. Identify Submodules

> Goal: ระบุ submodules ที่มี `.git` ทั้งหมดก่อน commit

1. รัน `git submodule status` เพื่อดู submodules ทั้งหมด
2. ถ้าไม่มี submodules → ข้ามไป Step 6 (Commit) โดย commit ที่ root โดยตรง
3. สำหรับแต่ละ submodule ตรวจ `git status` และ `git diff` เพื่อหาการเปลี่ยนแปลง
4. จัดรายการ submodules ที่มี changes ต้อง commit

### 5. Commit Submodules

> Goal: commit ในแต่ละ submodule ที่มี changes ก่อน root

1. สำหรับแต่ละ submodule ที่มี changes:
   - `cd` เข้า submodule directory
   - ตรวจ `git status` และ `git diff`
   - ทำ `/git-commit` ใน submodule
2. ถ้า commit ไม่สำเร็จ → ทำ `/resolve-errors` แล้ว retry (max 3)
3. บันทึก commit hash ของแต่ละ submodule

### 6. Commit Root

> Goal: commit การเปลี่ยนแปลงที่ root พร้อม update submodule pointers

1. กลับมาที่ root repo
2. ตรวจ `git status` — ถ้ามี submodules ควรเห็น submodule pointers เปลี่ยน
3. ทำ `/git-commit` ที่ root พร้อมระบุ submodule pointer updates ถ้ามี
4. ถ้า root มี changes อื่น (docs, skills, code) → commit รวมในครั้งเดียว
5. ถ้า commit ไม่สำเร็จ → ทำ `/resolve-errors` แล้ว retry (max 3)

### 7. Validate And Report

> Goal: ยืนยันการ ship สมบูรณ์

1. ทำ `/validate` เพื่อตรวจ references และ structure
2. ถ้ามี submodules → รัน `git submodule status` เพื่อยืนยัน pointers ถูกต้อง
3. ทำ `/report` พร้อม `/report-table` สรุป submodule commits (ถ้ามี) และ root commit
4. ทำ `/suggest-next-action` เพื่อแนะนำขั้นต่อไป

## Rules

### 1. AGENTS.md First

- `/update-agents-md` ต้องทำก่อนเสมอ
- `/follow-agents-md` ต้องทำหลัง `AGENTS.md` อัปเดต
- ห้าม duplicate รายละเอียดที่มีอยู่ใน `AGENTS.md`

### 2. No Push Or Release

- `ship` ไม่ทำ push หรือ release
- ถ้า user ต้องการ push → รัน `git push` ด้วย `exec` หลัง `/ship`
- ถ้า user ต้องการ release → ทำ `/run-release` หลัง `/ship`
- ไม่ถาม user ว่าจะ push/release หรือไม่

### 3. Use Run-Verify

- ใช้ `/run-verify` เพื่อตรวจสอบครบทั้ง scan, lint, typecheck, test และ build
- ถ้า workspace ไม่มี verify script → ทำ `/follow-tasks` ก่อน

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
- Code ผ่าน `/run-verify` และ `/validate`
- ทุก submodule ที่มี changes ถูก commit ก่อน root
- Root pointer ชี้ไปยัง commit ล่าสุดของ submodules (ถ้ามี)
- Root commit สำเร็จ
- รายงาน submodule commits และ root commit ครบถ้วน
