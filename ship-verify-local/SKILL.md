---
name: ship-verify-local
description: เรียก ship-code แล้ว optimize และ verify บน local แล้ว commit โดยไม่ push
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
  - ship-code
  - run-dev
  - test-usage
  - watch-browser-and-fix
  - optimize-codebase
  - deep-optimize
  - run-verify
  - run-test-all
  - deep-review-codebase
  - deep-validate
  - resolve-errors
  - git-commit
  - report
  - report-progress
  - open-devin-in-web
  - suggest-next-action
  - ask-me
---

## Goal

Ship code ใน local: เตรียม code, optimize, verify แล้ว commit โดยไม่ push ไป remote

## Scope

ใช้เมื่อต้องการ verify งานบน local ก่อน push/CI/CD

## Execute

### 1. Ship Code

1. ทำ `/ship-code`
2. ถ้าไม่มี changes → stop และ report

### 2. Run Dev And Test Usage

> Goal: รัน dev server และทดสอบการใช้งานจริง

1. ทำ `/run-dev` เพื่อรัน dev server
2. ทำ `/test-usage` เพื่อทดสอบ flow สำคัญ
3. ถ้าพบปัญหา → ทำ `/watch-browser-and-fix` หรือ `/resolve-errors` ก่อน optimize

### 3. Optimize

1. ทำ `/optimize-codebase` เพื่อหา quick wins
2. ถ้าพบปัญหาใหญ่ → ถาม user ก่อนทำ `/deep-optimize`
3. ถ้า optimize เปลี่ยน behavior สำคัญ → ถาม user ก่อน

### 4. Verify

1. ทำ `/run-verify`
2. ทำ `/run-test-all` ถ้ามี
3. ทำ `/deep-review-codebase` ถ้ามี `tools/review-codebase/` หรือ `AGENTS.md` ระบุ
4. ทำ `/deep-validate`
5. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 รอบ

### 5. Commit

1. ทำ `/git-commit`
2. ถ้าไม่มี changes → stop และ report

### 6. Report

1. ทำ `/report-progress` พร้อม progress, completed, pending, next actions
2. ถ้า user ต้องการดู graph ของ skills ทีใช้ → ทำ `/open-devin-in-web`
3. ถ้า user ต้องการ push → แนะนำ `/ship-verify-cicd`
4. ถ้าไม่ → ทำ `/suggest-next-action`

## Rules

- ทำงานบน `dev` branch
- `main` ห้ามแก้ไขโดยตรง
- ไม่ push ในขั้นตอนนี้
- resolve errors ก่อนขั้นตอนถัดไป
- ถ้า optimization มีผลกระทบสูง ให้ถามก่อน

## Expected Outcome

- Code พร้อมสำหรับ push
- ผ่าน verify บน local
- ถูก commit บน `dev`
- รายงาน status และ next action ชัดเจน
