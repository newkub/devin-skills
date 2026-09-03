---
name: simplify
description: ลดความซับซ้อนและทำให้ content, code, architecture, workflows หรือ skills กระชับ ตรงประเด็น
argument-hint: "<path-or-target>"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - find_file_by_name
  - exec
  - skill
  - run_subagent
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - review-quality
  - review-writing
  - enhance-prompt
  - follow-single-responsibility
  - check-dead-code
  - check-long-files
  - update-references
  - git-commit
  - report
---

## Goal

ลดความซับซ้อนและทำให้เป้าหมายกระชับขึ้น ไม่สูญเสียเนื้อหาหลัก

## Scope

ใช้กับ code, architecture, content/docs, workflows, หรือ `SKILL.md` ทีเขียนยาว ซ้ำซ้อน หรือไม่ตรงประเด็น

ดูเพิ่มเติม: /review-quality, /review-writing, /enhance-prompt, /follow-single-responsibility, /check-dead-code, /check-long-files

## Execute

### 1. Identify Target

> Goal: ระบุ Target
1. รับ `path-or-target` จาก argument
2. ถ้าไม่ระบุ → ถาม user
3. ตรวจว่าเป้าหมายเป้น code, doc, skill หรือ architecture

### 2. Analyze

> Goal: วิเคราะห์ Analyze
1. อ่านเป้าหมายโดยละเอียด
2. หาสิ่งทีซับซ้อนเกินไป:
   - code: functions ยาว, nested logic, duplication, abstractions เกินจำเป็น
   - content/skill: ประโยคยืดยาว, ซ้ำ, filler, คำอธิบายเกิน, คำสั่งหลาย action ในข้อเดียว
   - architecture: coupling สูง, responsibilities ซ้อนทับ
3. ถ้าไม่พบปัญหา → stop และ report

### 3. Simplify

> Goal: แก้ไขให้กระชับและชัดเจน

#### Code

1. แบ่ง functions ยาว → หลาย functions สั้น
2. ใช้ early return และลด nested logic
3. ลบ duplication และ hardcode ทีไม่จำเป็น
4. ปรับ naming ให้บอก intent ชัดเจน

#### Content และ SKILL.md

1. ลบ filler, adjectives เกิน, ประโยคคลุมเครือ
2. รวม bullets ทีซ้ำหรือเล็กน้อย
3. แปลง passive เป้น active voice
4. ข้อหนึ่งข้อต้องมี action เดียว, expected result ชัด
5. เก็บเฉพาะสิ่งทีเปลี่ยนผลลัพธ์
6. ไม่เกิน 250 บรรทัด ถ้าเกิน → แบ่งหรือตัดทอน

#### Architecture

1. แยก concerns ทีซ้อนทับ
2. ลด coupling ระหว่าง modules
3. รวม abstractions ทีใกล้เคียง

### 4. Validate

> Goal: ยื่นยัน Validate
1. ทำ `/run-check` ถ้าเป้นหมายเป้น code
2. ทำ `/check-broken-skills-references` ถ้าเป้นหมายเป้น skill
3. ทำ `git diff --check`
4. ตรวจว่าไม่สูญเสียเนื้อหาหลัก

### 5. Commit And Report

> Goal: รายงาน Commit And Report
1. ทำ `/git-commit` ถ้ามีการเปลี่ยนแปลง
2. รายงานสิ่งทีลบ, แก้, และสถานะ final

## Rules

- ใช้ minimal changes เสมอ
- ไม่เปลี่ยน public API หรือ expected behavior สำคัญ
- ถ้าต้องย้าย/ลบ file หรือ skill → ทำ `/update-references`
- ถ้าไม่แน่ใจว่าควรตัดทอนหรือไม่ → ถาม user ก่อน
- content สำคัญต้องอยู่ครบ

## Expected Outcome

- เป้าหมายสั้น กระชับ อ่านง่ายขึ้น
- ไม่มีสิ่งไม่จำเป็นเหลือ
- ผ่าน validation ทีเกี่ยวข้อง
- สถานะและ next action ชัดเจน
