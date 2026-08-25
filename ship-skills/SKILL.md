---
name: ship-skills
description: Ship skills ที่มี .git โดย review, update docs, commit submodules และ root pointer
---

## Goal

Ship skills ที่มี `.git` (submodules) โดย review ทุก skill, อัปเดต docs, commit ใน submodule ก่อน แล้ว update root pointer

## Scope

ใช้เมื่อ skills repo มี submodules (skills ที่มี `.git`) — ตรวจ อัปเดต docs และ commit ทั้ง submodule และ root ไม่รวม push หรือ release

## Execute

### 1. Review All Skills

> Goal: ทุก skill ผ่าน review ก่อน ship

1. ทำ `/review-devin-global-skills` เพื่อ review ทุก skill package
2. ถ้ามี findings ที่ต้องแก้ → ทำ `/update-all-devin-global-skills` ก่อน
3. ยืนยันว่าทุก skill ผ่าน `/validate`

### 2. Update Docs

> Goal: `AGENTS.md` และ `README.md` เป็นปัจจุบัน

1. ทำ `/update-agents-md` เพื่ออัปเดต `AGENTS.md`
2. ทำ `/update-readme` เพื่ออัปเดต `README.md`
3. ตรวจว่า docs ถูกต้องและครบถ้วน

### 3. Identify Submodules

> Goal: ระบุ skills ที่มี `.git` ทั้งหมด

1. ทำ `git submodule status` เพื่อดู submodules ทั้งหมด
2. ตรวจ `git status` ในแต่ละ submodule เพื่อหาการเปลี่ยนแปลง
3. จัดรายการ submodules ที่มี changes ต้อง commit

### 4. Commit Submodules

> Goal: commit ในแต่ละ submodule ที่มี changes

1. สำหรับแต่ละ submodule ที่มี changes:
   - `cd` เข้า submodule directory
   - ตรวจ `git status` และ `git diff`
   - ทำ `/git-commit` ใน submodule
2. ถ้า commit ไม่สำเร็จ → ทำ `/resolve-errors` แล้ว retry (max 3)
3. บันทึก commit hash ของแต่ละ submodule

### 5. Update Root Pointer

> Goal: root repo ชี้ไปยัง commit ล่าสุดของ submodules

1. กลับมาที่ root repo
2. ตรวจ `git status` — ควรเห็น submodule pointers เปลี่ยน
3. ทำ `/git-commit` ที่ root พร้อมระบุ submodule pointer updates
4. ถ้า root มี changes อื่น (docs, skills) → commit รวมในครั้งเดียว

### 6. Validate And Report

> Goal: ยืนยันการ ship สมบูรณ์

1. ทำ `/validate` เพื่อตรวจ references และ structure
2. ทำ `git submodule status` เพื่อยืนยัน pointers ถูกต้อง
3. ทำ `/report` สรุป submodule commits และ root commit

## Rules

### 1. Submodule First

- commit ใน submodule ก่อนเสมอ แล้วจึง update root pointer
- ห้าม commit root pointer โดยที่ submodule ยังไม่ commit
- บันทึก submodule commit hash ก่อน update root

### 2. No Push Or Release

- `ship-skills` ไม่ทำ push หรือ release
- ถ้า user ต้องการ push → รัน `git push` ด้วย `exec` หลัง `/ship-skills`
- ไม่ถาม user ว่าจะ push/release หรือไม่

### 3. Review Before Ship

- ทำ `/review-devin-global-skills` ก่อนเสมอ
- ถ้า findings มี Critical หรือ High → แก้ก่อน ship
- ทำ `/update-agents-md` และ `/update-readme` ก่อน commit

## Expected Outcome

- ทุก skill ผ่าน `/review-devin-global-skills` และ `/validate`
- `AGENTS.md` และ `README.md` อัปเดต
- ทุก submodule ที่มี changes ถูก commit
- Root pointer ชี้ไปยัง commit ล่าสุดของ submodules
- Root commit สำเร็จ
- รายงาน submodule commits และ root commit ครบถ้วน
