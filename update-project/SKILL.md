---
name: update-project
description: อัปเดต root project โดยเช็ค git log ล่าสุดและ restore ข้อมูลจาก commits
---

## Goal

อัปเดต root project โดยเช็ค git log ล่าสุดของทุก workspace และ restore ข้อมูลที่เกี่ยวข้องมาอัปเดต root docs

## Scope

ใช้หลัง ship ทุก workspace เสร็จ — เช็ค git log ล่าสุดของแต่ละ workspace และนำข้อมูลมาอัปเดต root `AGENTS.md`, `README.md` และ docs อื่นๆ ไม่แก้ไข workspace code

## Execute

### 1. Check Latest Git Log

> Goal: เช็ค git log ล่าสุดของทุก workspace

1. ทำ `/check-monorepo` เพื่อยืนยัน monorepo status
2. ทำ `/analyze-all-workspace` เพื่อระบุทุก workspace
3. สำหรับแต่ละ workspace:
   - รัน `git log --oneline -5` เพื่อดู commit ล่าสุด
   - รัน `git diff HEAD~1 --stat` เพื่อดูไฟล์ที่เปลี่ยน
   - บันทึก commit hash, message และ changed files
4. รวมข้อมูลจากทุก workspace เป็น summary

### 2. Restore Changed Info

> Goal: restore ข้อมูลที่เปลี่ยนแปลงมาอัปเดต root

1. วิเคราะห์ changed files จาก git log ของทุก workspace
2. ระบุข้อมูลที่ต้อง restore มาที่ root:
   - Architecture changes → อัปเดต `### Architecture` ใน `AGENTS.md`
   - Skills changes → อัปเดต `### Skills` ใน `AGENTS.md`
   - Workspaces changes → อัปเดต `### Workspaces` ใน `AGENTS.md`
   - Features changes → อัปเดต `README.md` features table
3. ถ้า workspace เพิ่ม/ลบ dependency → อัปเดต root mapping

### 3. Update Root Docs

> Goal: root docs สะท้อนการเปลี่ยนแปลงของทุก workspace

1. ทำ `/update-agents-md` เพื่ออัปเดต root `AGENTS.md`
2. ทำ `/update-readme` เพื่ออัปเดต root `README.md`
3. ทำ `/update-usage` เพื่ออัปเดต `usage.kdl` CLI spec ถ้ามี
4. ทำ `/update-features` เพื่อสร้าง/อัปเดต `FEATURES.md` ที่ root ของทุก workspace
5. ตรวจว่า root docs ครบถ้วนและถูกต้อง

### 4. Update Project Skills

> Goal: project skills ใน `.devin/skills/` เป็นปัจจุบัน

1. ทำ `/update-project-skills` เพื่อสร้างหรืออัปเดต skills ใน `.devin/skills/`
2. ตรวจว่า skills ที่สร้างผ่าน `/validate`
3. ยืนยันว่า project `AGENTS.md` อ้างถึง skills ใหม่ครบถ้วน

### 5. Validate And Report

> Goal: root project ผ่าน validation

1. ทำ `/validate` เพื่อตรวจ root structure และ references
2. ทำ `/report` สรุป:
   - workspace commits ที่ตรวจพบ
   - ข้อมูลที่ restore มา
   - root docs ที่อัปเดต
   - project skills ที่สร้างหรืออัปเดต

## Rules

### 1. Git Log First

- ตรวจ `git log` ของทุก workspace ก่อนเสมอ
- ใช้ `git log --oneline -5` และ `git diff HEAD~1 --stat` เป็นหลัก
- บันทึก commit hash และ changed files ก่อนอัปเดต

### 2. Root Only

- แก้ไขเฉพาะ root docs (`AGENTS.md`, `README.md`)
- ไม่แก้ไข workspace code หรือ workspace docs
- ถ้า workspace docs ต้องแก้ → ใช้ `/ship` ใน workspace นั้น

### 3. No Commit

- `update-project` ไม่ commit การเปลี่ยนแปลง
- ถ้าใช้ standalone → ทำ `/git-commit` หลัง `/update-project`
- ถ้าใช้ใน monorepo → เรียก `/ship` แต่ละ workspace แล้วทำ `/git-commit` ที่ root หลัง `/update-project`

## Expected Outcome

- git log ของทุก workspace ถูกตรวจและบันทึก
- ข้อมูลที่เปลี่ยนแปลงถูก restore มาอัปเดต root docs
- root `AGENTS.md` และ `README.md` อัปเดต
- project skills ใน `.devin/skills/` อัปเดตผ่าน `/update-project-skills`
- root project ผ่าน `/validate`
- รายงานสรุป workspace commits, root updates และ project skills ครบถ้วน
