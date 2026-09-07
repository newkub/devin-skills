---
name: git-commit-no-verify
description: Commit ด้วย --no-verify เมื่อต้อง bypass pre-commit hooks
argument-hint: "[scope]"
related:
  - git-commit
  - git-commit-selected-files
  - git-commit-and-push
  - run-check
  - run-verify
  - resolve-errors
  - refactor-commit
---

## Goal

Commit ไฟล์ที่มีการเปลี่ยนแปลงโดยข้าม pre-commit hooks ด้วย `git commit --no-verify`

## Scope

ใช้เมื่อ pre-commit hooks ล้มเหลว ช้า หรือขัดขวาง commit ที่ตั้งใจ โดยต้องได้รับ confirmation จากผู้ใช้ก่อนเสมอ

## Execute

### 1. Check Status

> Goal: ตรวจสอบไฟล์ที่จะ commit

1. รัน `git status --short`
2. รัน `git diff --cached --name-only` เพื่อดูไฟล์ staged
3. ถ้ายังไม่มี staged files → หยุดและแจ้งให้ stage ก่อน

### 2. Verify Reason

> Goal: ยืนยันว่าต้องใช้ `--no-verify` จริง

1. ถาม user ว่าทำไมต้อง bypass hooks
2. ถ้า bypass เพราะ pre-commit ล้มเหลว → บันทึกสาเหตุไว้สำหรับแก้ไขภายหลัง
3. ถ้า user ไม่ยืนยัน → ใช้ `/git-commit` แทน

### 3. Review Staged Diff

> Goal: ตรวจสอบความถูกต้องก่อน commit

1. รัน `git diff --cached --stat`
2. ถ้ามีไฟล์ไม่เกี่ยวข้อง → แยกออกก่อน
3. ตรวจสอบ message ร่าง

### 4. Execute Commit

> Goal: commit โดยข้าม hooks

1. ถ้ามี message จาก user รัน `git commit --no-verify -m "<message>"`
2. ถ้าไม่มี message → รัน `git commit --no-verify` แล้วแก้ไขใน editor
3. ตรวจสอบ exit code

### 5. Post-Commit

> Goal: ตรวจสอบและวางแผนแก้ hooks

1. รัน `git log --oneline -3`
2. รัน `git status --short`
3. ถ้า bypass เพราะ hook ล้มเหลว → สร้าง TODO ให้แก้ `/run-check` หรือ `/run-verify` ภายหลัง

## Rules

### 1. No Automatic Add

- ไม่ใช้ `git add .` ใน skill นี้
- commit เฉพาะไฟล์ที่ถูก stage แล้ว

### 2. User Confirmation

- ถาม user ก่อนใช้ `--no-verify`
- อธิบาย risk: hook จะไม่ทำงาน commit อาจพาไฟล์ที่ไม่ผ่าน check เข้า repo

### 3. Message Format

- ใช้ conventional commits เหมือน `/git-commit`
- subject ไม่เกิน 72 ตัวอักษร
- ใช้ภาษาอังกฤษ

### 4. Post-Commit Discipline

- ถ้า hook ล้มเหลว ต้องมีแผนแก้ไข
- ใช้ `/run-check` หรือ `/run-verify` ทีหลังเพื่อตรวจสอบ
- ห้ามใช้ `--no-verify` เพื่อซ่อน error ที่ต้องแก้

- ใช้ `/git-commit` เมื่อ hooks ทำงานได้ปกติ
- ใช้ `/git-commit-selected-files` เมื่อต้องการ commit เฉพาะไฟล์
- ใช้ `/git-commit-and-push` เมื่อต้องการ push พร้อมกัน
- ใช้ `/run-check` หรือ `/run-verify` ก่อน `--no-verify` ถ้าเป็นไปได้
- ใช้ `/resolve-errors` เมื่อ hook ล้มเหลวและต้องแก้ root cause
- ใช้ `/refactor-commit` ถ้า history ต้องปรับ

## Expected Outcome

- ไฟล์ staged ถูก commit โดยไม่รัน pre-commit hooks
- ผู้ใช้ยืนยันการ bypass
- มี message ตาม conventional commits
- มี plan สำหรับตรวจสอบหรือแก้ hooks ภายหลัง
- working directory สะอาดสำหรับไฟล์ที่ตั้งใจ commit
