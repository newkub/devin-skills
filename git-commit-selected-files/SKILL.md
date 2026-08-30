---
name: git-commit-selected-files
description: Commit selected files from working tree with conventional commits
argument-hint: "[file-pattern-or-path]"
related:
  - git-commit
  - git-commit-and-push
  - git-push
  - refactor-commit
  - deep-validate
  - fix
  - refactor
---

## Goal

Commit only selected files, without using `git add .`

## Scope

- ใช้เมื่อต้องการ commit เฉพาะบางไฟล์จาก working directory
- ไม่ stage ทุกไฟล์โดยอัตโนมัติ
- รองรับการเลือกด้วย pattern หรือ user confirmation

## Execute

### 1. List Changed Files

> Goal: รู้ว่ามีไฟล์อะไรเปลี่ยนแปลงบ้าง

1. รัน `git status --short` เพื่อดู modified, staged, untracked
2. รัน `git diff --name-only` สำหรับ modified
3. จัดกลุ่มไฟล์ตาม category: skills, docs, config, scripts
4. ระบุ pre-existing/unrelated files ทีไม่ควร commit

### 2. Select Files To Commit

> Goal: เลือกเฉพาะไฟล์ทีต้องการ commit

1. ถ้า user ระบุ argument (pattern/path) → ใช้ pattern กรอง
2. ถ้าไม่ระบุ → แสดง list ให้ user เลือกด้วย `ask_user_question`
3. รองรับ multi-select
4. ข้าม untracked ทีไม่เกี่ยวข้องเว้นแต่ user เลือก

### 3. Stage Selected Files

> Goal: เตรียมไฟล์ทีเลือกสำหรับ commit

1. รัน `git add <file1> <file2> ...` เฉพาะไฟล์ทีเลือก
2. ไม่ใช้ `git add .` หรือ `git add -A`
3. ตรวจสอบด้วย `git diff --cached --name-only`

### 4. Determine Commit Type

> Goal: เลือก conventional commit type

1. ดู Rules ส่วน Commit Types
2. เลือกตามการเปลี่ยนแปลง:
   - `feat` สำหรับ skill ใหม่
   - `fix` สำหรับการแก้ไข
   - `docs` สำหรับเอกสาร
   - `refactor` สำหรับ refactor
   - `chore` สำหรับ config/structure
   - `test` สำหรับ test

### 5. Write Commit Message

> Goal: เขียน commit message

1. ใช้รูปแบบ `<type>(<scope>): <subject>`
2. subject ไม่เกิน 72 ตัวอักษร
3. ระบุ scope จาก directory/ประเภทของไฟล์
4. ถ้ามีหลายไฟล์จากหลาย scope → ใช้ `,` คั่น หรือ commit แยก

### 6. Execute Commit

> Goal: commit ไฟล์ทีเลือก

1. รัน `git commit -m "<message>"`
2. ตรวจสอบ exit code
3. ถ้ามี error → แก้ไขและลองอีกครั้ง

### 7. Verify

> Goal: ยืนยันว่า commit ถูกต้อง

1. รัน `git log --oneline -3`
2. รัน `git status --short` เพื่อดูไฟล์ทียังไม่ถูก commit
3. ตรวจสอบว่าไม่มีไฟล์ทีไม่เกี่ยวข้องถูก stage

## Rules

### 1. No Add All

- ห้ามใช้ `git add .` หรือ `git add -A`
- ต้อง stage ทีละไฟล์ตามทีเลือก
- ถ้าไม่แน่ใจ → ถาม user

### 2. User Confirmation

- ถ้าไม่มี argument ให้ถามก่อน stage
- แสดงรายการไฟล์ก่อน commit
- ให้ user ยืนยัน message

### 3. Scope Clarity

- หนึ่ง commit ควรอยู่ใน scope เดียวกัน
- ถ้ามีหลาย scope แยก commit
- ระบุ scope ใน message

### 4. Conventional Commits

- ใช้ type ให้ถูกต้อง
- subject ใช้ imperative mood
- ไม่ต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่ ไม่จบด้วยจุด

- ใช้ /git-commit ถ้าจำเป็น
- ใช้ /git-commit-and-push ถ้าจำเป็น
- ใช้ /git-push ถ้าจำเป็น
- ใช้ /refactor-commit ถ้าจำเป็น
- ใช้ /deep-validate ถ้าจำเป็น

## Expected Outcome

- เฉพาะไฟล์ทีเลือกถูก commit
- ไฟล์ทีไม่เกี่ยวข้องยังคงอยู่ใน working directory
- Commit message ชัดเจนตาม conventional commits
- รายงานไฟล์ที commit และไฟล์ทีเหลืออยู่
