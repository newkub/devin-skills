---
name: git-commit-at-devin-skills-global
description: Commit ทุกไฟล์ที่มีการเปลี่ยนแปลงใน global devin skills ตามมาตรฐาน conventional commits
argument-hint: "[target]"
related:
  - git-commit
  - git-commit-and-push
  - git-commit-selected-files
  - follow-git-flow
  - resolve-errors
  - follow-best-practice
  - update-agents-md
---

## Goal

Commit ทุกไฟล์ที่มีการเปลี่ยนแปลงใน global devin skills directory ตามมาตรฐาน conventional commits

## Scope

ใช้สำหรับ commit changes ใน `C:\Users\Veerapong\AppData\Roaming\devin\skills` เท่านั้น

## Execute

### 1. Navigate To Global Devin Skills

> Goal: Navigate To Global Devin Skills

เปลี่ยน directory ไปยัง global devin skills

1. เปลี่ยน directory ไปยัง `C:\Users\Veerapong\AppData\Roaming\devin\skills`
2. ตรวจสอบว่าอยู่ใน directory ที่ถูกต้องด้วย `pwd`

### 2. Check Git Status

> Goal: Check Git Status

ตรวจสอบสถานะของ repository

1. รัน `git status --porcelain` เพื่อดูไฟล์ที่มีการแก้ไขทั้งหมด
2. ตรวจสอบว่าอยู่ใน repository ที่ถูกต้อง

### 3. Update AGENTS.md

> Goal: Update AGENTS.md

อัปเดต `AGENTS.md` ให้สะท้อน skills ปัจจุบันก่อน commit

1. ทำ `/update-agents-md` เพื่อสร้าง/อัปเดต `AGENTS.md`
2. ตรวจสอบ diff ของ `AGENTS.md` ว่าถูกต้อง
3. ถ้ามีการเปลี่ยนแปลง → รวมเข้ากับ commit ถัดไป

### 4. Stage All Changes

> Goal: Stage All Changes

Stage ทุกไฟล์ที่มีการเปลี่ยนแปลง

1. รัน `git add .` เพื่อ stage ทุกไฟล์
2. ตรวจสอบด้วย `git diff --cached` ว่าไฟล์ที่ stage ถูกต้อง

### 5. Determine Commit Type

> Goal: Determine Commit Type

เลือก conventional commit type ที่เหมาะสม

1. ดู Rules ส่วน Commit Types
2. เลือก type ตามการเปลี่ยนแปลง:
   - feat: เพิ่ม skill ใหม่
   - fix: แก้ไข skill
   - docs: แก้ไขเอกสารหรือคำอธิบาย
   - refactor: refactor skill
   - chore: ปรับปรุง configuration หรือ structure

### 6. Write Commit Message

> Goal: Write Commit Message

เขียน commit message ตาม conventional commits format

1. ดู Rules ส่วน Commit Message Format และ Body
2. ใช้รูปแบบ `<type>: <subject>`
3. subject สั้นกระชับไม่เกิน 72 ตัวอักษร
4. ใช้ imperative mood (เช่น add ไม่ใช่ added)
5. ใช้ภาษาอังกฤษหรือไทยให้สม่ำเสมอ

### 7. Execute Commit

> Goal: Execute Commit

ดำเนินการ commit

1. รัน `git commit -m "<message>"` หรือ `git commit`
2. ตรวจสอบผลลัพธ์จาก git commit
3. ถ้ามี error: แก้ไขแล้วลองอีกครั้ง

### 8. Verify Commits

> Goal: Verify Commits

ตรวจสอบความถูกต้องของ commits

1. รัน `git log --oneline -5` เพื่อดู commits ล่าสุด
2. ตรวจสอบว่า commit messages สอดคล้องกับ conventional commits
3. ตรวจสอบว่าไม่มีไฟล์ที่ยังไม่ commit เหลืออยู่
4. รัน `git status` เพื่อยืนยันว่า working directory สะอาด

## Rules

### Commit Message Format

ใช้รูปแบบ conventional commits

- ใช้รูปแบบ `<type>: <subject>`
- subject ไม่ต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่หรือจบด้วยจุด
- สั้นกระชับไม่เกิน 72 ตัวอักษร
- ใช้ imperative mood (เช่น add ไม่ใช่ added)
- ใช้ภาษาอังกฤษหรือไทยให้สม่ำเสมอ

### Commit Types

เลือก type ที่เหมาะสมกับการเปลี่ยนแปลง

- feat: เพิ่ม skill ใหม่
- fix: แก้ไข skill
- docs: แก้ไขเอกสารหรือคำอธิบาย
- refactor: refactor skill
- chore: ปรับปรุง configuration หรือ structure

### Body

อธิบายเหตุผลและ context เพิ่มเติม

- อธิบายเหตุผลและ context
- แยกจาก subject ด้วยบรรทัดว่าง
- ใช้ bullet points สำหรับหลายรายการ

- ใช้ /git-commit ถ้าจำเป็น
- ใช้ /git-commit-and-push ถ้าจำเป็น
- ใช้ /git-commit-selected-files ถ้าจำเป็น
- ใช้ /follow-git-flow ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น

## Expected Outcome

- `AGENTS.md` ถูกอัปเดตก่อน commit
- Commit messages ที่สอดคล้องกับ conventional commits
- Git history ที่อ่านง่ายและติดตามง่าย
- ทุกไฟล์ที่มีการเปลี่ยนแปลงใน global devin skills ถูก commit
- Working directory สะอาด