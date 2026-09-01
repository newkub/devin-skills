---
name: ship-code
description: จัดเตรียมและแก้ไข code ก่อนขั้นตอน verify โดยไม่รัน test/build
argument-hint: "[issue-number-or-title]"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - find_file_by_name
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
  - update-project
  - realize-implementation
  - deep-review-codebase
  - follow-git-flow
---

## Goal

เตรียม workspace และแก้ไข code ให้พร้อมสำหรับ verify โดยไม่รัน test, build หรือ CI

## Scope

ใช้เป้นขั้นตอนเริ่มต้นของ ship flow ก่อนทีจะไป `/ship-verify-local` หรือ `/ship-verify-cicd`

## Execute

### 1. Prepare

1. ทำ `/update-agents-md` ถ้า `AGENTS.md` ไม่อัปเดต
2. ทำ `/follow-agents-md`
3. ทำ `/update-project` ถ้าจำเป็น
4. ตรวจ `git status --short` และ `git branch --show-current`

### 2. Realize Implementation

1. ทำ `/realize-implementation` ถ้าตรวจพบ TODO, MOCK, FAKE, STUB, placeholder หรือ unfinished features
2. แก้ไข code ตาม requirements ทีค้าง
3. ถ้ามีงานเสร็จสมบูรณ์ → stop และ report
4. ถ้า fail → stop และ report

### 3. Review Codebase

1. ทำ `/deep-review-codebase` เพื่อ review code ก่อน verify
2. ถ้าพบ findings → แก้ไขก่อนขั้นตอนถัดไป
3. ถ้าไม่มี findings หรือแก้หมดแล้ว → ไป Finalize

### 4. Finalize Code

1. ตรวจ `git status --short`
2. ถ้าไม่มี changes → stop และ report
3. ถ้ามี changes → รอไปให้ `/ship-verify-local` หรือ `/ship-verify-cicd` ทำ verify และ commit

## Rules

- ไม่รัน `run-verify`, `run-test`, `run-build`, `watch-cicd` โดยตรง
- สามารถเรียก `/deep-review-codebase` เพื่อ review ก่อน verify ได้
- ไม่ `git push`
- ไม่ commit ถ้ายังไม่ verified
- `main` ห้ามแก้ไขโดยตรง
- ทำงานบน `dev` branch

## Expected Outcome

- Workspace พร้อมสำหรับ verify
- ไม่มี TODO/MOCK/FAKE/STUB/placeholder เหลือก่อน verify
- Code ถูกแก้ไขตาม requirements
- ไม่มี side effects จาก test/build/CI
