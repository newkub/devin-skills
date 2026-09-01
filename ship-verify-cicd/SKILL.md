---
name: ship-verify-cicd
description: เรียก ship-code + verify แล้ว push ขึ้น CI/CD และ watch จนกระบวนการผ่าน
argument-hint: "[issue-number-or-title]"
allowed-tools:
  - read
  - write
  - edit
  - exec
  - skill
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - ship-code
  - ship-verify-local
  - run-verify
  - run-test-all
  - deep-review-codebase
  - deep-validate
  - resolve-errors
  - git-commit
  - git-push
  - setup-cicd
  - watch-cicd-and-resolve
  - ship-release
  - report
  - report-progress
  - suggest-next-action
  - ask-me
---

## Goal

Ship code ขึ้น CI/CD: เตรียม code, verify, commit, push, setup CI/CD, แล้ว watch จนกระบวนการผ่าน

## Scope

ใช้เมื่อต้องการ push `dev` ไปยัง remote และให้ CI/CD ผ่าน

## Execute

### 1. Ship Code And Verify

1. ทำ `/ship-code`
2. ถ้าไม่มี changes → stop และ report
3. ทำ `/run-verify`
4. ทำ `/run-test-all` ถ้ามี
5. ทำ `/deep-review-codebase` ถ้ามี `tools/review-codebase/` หรือ `AGENTS.md` ระบุ
6. ทำ `/deep-validate`
7. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 รอบ

### 2. Commit

1. ทำ `/git-commit`
2. ถ้าไม่มี changes → stop และ report

### 3. Setup CI/CD

1. ทำ `/setup-cicd` ถ้า CI/CD ยังไม่พร้อม
2. ตรวจสอบ workflow files ว่าถูกต้อง
3. ถ้าไม่มี remote → stop และ report

### 4. Push And Watch

1. ทำ `git status --porcelain`, `git branch --show-current`, `git remote -v`
2. ถ้าไม่อยู่ `dev` → `git switch dev` แล้ว `git pull origin dev`
3. ทำ `git push --dry-run -u origin dev` ก่อน push จริง
4. `git push -u origin dev` (ไม่ force)
5. ถ้า push ถูก reject → resolve/rebase แล้ว push ใหม
6. ทำ `/watch-cicd-and-resolve`
7. ถ้า fail → resolve แล้ว commit/push/re-watch สูงสุด 5 รอบ

### 5. Report And Decide Next Action

1. ทำ `/report-progress` เสมอหลัง CI ผ่าน
2. ถ้า user ต้องการ release ต่อ → แนะนำให้ทำ `/ship-release`
3. ทำ `/report` และ `/suggest-next-action`

## Rules

- ทำงานบน `dev` branch ไม่ใช้ version branch
- `main` ห้ามแก้ไขโดยตรง ไว้ merge เท่านั้น
- ไม่ใช้ `--force` หรือ `--force-with-lease`
- resolve errors ก่อนขั้นตอนถัดไปเสมอ
- ไม่ release โดยตรง ให้ใช้ `/ship-release`

## Expected Outcome

- `dev` ถูก push และ CI/CD ผ่าน
- ไม่มี TODO/MOCK/FAKE/STUB/placeholder เหลือก่อน verify
- รายงาน status, next action ครบถ้วน
