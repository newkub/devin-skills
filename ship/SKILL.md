---
name: ship
description: Ship code from dev to main แบบครบวงจร เตรียม code, verify, push, watch CI/CD, PR, merge, release
argument-hint: "[issue-number-or-title]"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - exec
  - skill
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - update-agents-md
  - follow-agents-md
  - realize-implementation
  - update-review-cli-and-fix
  - update-test-and-fix
  - run-dev
  - test-usage
  - watch-browser-and-fix
  - deep-optimize
  - run-verify
  - run-test-all
  - run-test-coverage
  - deep-validate
  - resolve-errors
  - git-commit
  - git-push
  - setup-cicd
  - resolve-cicd
  - create-github-pr
  - deep-review-pr
  - unified-review-and-merge-pr
  - run-release
  - test-release
  - setup-release
  - follow-git-flow
  - report
  - report-progress
  - view-repo
  - open-devin-in-web
  - suggest-next-action
  - ask-me
---

## Goal

Ship code จาก `dev` ไป `main` แบบครบวงจร: เตรียม code, verify บน local, push + watch CI/CD, สร้าง PR, review, merge, release patch แล้วกลับมาอยู่บน `dev`

## Scope

- ใช้บน `dev` branch ตลอด
- `main` ห้ามแก้ไขโดยตรง ไว้ merge เท่านั้น
- รองรับทั้ง quick local verify, CI/CD verify, และ release
- ไม่ force push
- หยุดและ report ถ้าไม่มี changes หรือ fail

## Execute

### 1. Prepare

1. ทำ `/update-agents-md` ถ้า `AGENTS.md` ไม่อัปเดต
2. ทำ `/follow-agents-md`
3. ทำ `/update-project` ถ้าจำเป็น
4. `git branch --show-current` และ `git status --short`
5. ถ้าไม่อยู่ `dev` → `git switch dev` แล้ว `git pull origin dev`
6. ทำ `/realize-implementation` เพื่อลบ TODO/MOCK/FAKE/STUB/placeholder

### 2. Local Verify

1. ทำ `/run-dev` ถ้าจำเป็น
2. ทำ `/test-usage` เพื่อทดสอบ flow สำคัญ
3. ถ้าพบปัญหา → ทำ `/watch-browser-and-fix` หรือ `/resolve-errors`
4. ทำ `/deep-optimize` ถ้าต้องการหา quick wins
5. ทำ `/run-verify`
6. ทำ `/run-test-all` ถ้ามี
7. ทำ `/run-test-coverage` เพื่อ setup coverage 100% และ run จนกว่าจะ 100%
8. ทำ `/update-review-cli-and-fix` ถ้ามี `tools/review-codebase/` หรือ `AGENTS.md` ระบุให้อัปเดต/รัน review CLI
9. ถ้ามี test failures หรือ coverage gaps ทีต้องแก้ → ทำ `/update-test-and-fix` แล้วรัน `/run-test-all` กับ `/run-test-coverage` ใหม่อีกครั้ง
10. ทำ `/deep-validate`
11. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 รอบ

### 3. Commit

1. ทำ `/git-commit`
2. ถ้าไม่มี changes → stop และ report

### 4. CI/CD Verify

1. ทำ `/setup-cicd` ถ้า CI/CD ยังไม่พร้อม
2. `git status --porcelain`, `git branch --show-current`, `git remote -v`
3. ทำ `git push --dry-run -u origin dev`
4. ทำ `git push -u origin dev` โดยไม่ force
5. ทำ `/resolve-cicd`
6. ถ้า fail → resolve, commit, push, re-watch สูงสุด 5 รอบ

### 5. Release

1. ทำ `/view-repo` ถ้าต้องการดู health ก่อน ship
2. ทำ `/create-github-pr --head dev --base main --fill` แล้วจด `PR_NUMBER`
3. ทำ `/deep-review-pr <PR_NUMBER>`
4. ถาม user ก่อน merge
5. ถ้า user ตกลง → ทำ `/unified-review-and-merge-pr <PR_NUMBER>`
6. ทำ `/resolve-cicd` บน `main` ก่อน release
7. ทำ `/test-release` ถ้ามี setup
8. ทำ `/run-release --dry-run` ก่อน release จริง
9. ถ้า dry-run ผ่านและ user ยืนยัน → ทำ `/run-release`
10. `git switch dev` แล้ว `git pull origin dev`

### 6. Report

1. ทำ `/report-progress` พร้อม progress, completed, pending, next actions
2. ทำ `/report` พร้อม PR, release version, branch
3. ทำ `/suggest-next-action`

## Rules

- ทำงานบน `dev` branch
- `main` ห้ามแก้ไขโดยตรง
- ไม่ force push
- ไม่ commit ถ้ายังไม่ verified
- resolve errors ก่อนขั้นตอนถัดไป
- ต้อง user ยืนยันก่อน merge และ release
- ถ้าผลกระทบสูง ถาม user ก่อน

## Expected Outcome

- `dev` ถูก verify บน local และผ่าน CI/CD
- PR `dev → main` ถูกสร้าง รีวิว และ merge
- Patch release สำเร็จ
- กลับมาอยู่บน `dev` พร้อมทำงานต่อ
- รายงาน status, version, next action ชัดเจน
