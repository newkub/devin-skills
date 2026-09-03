---
name: ship
description: Ship code ตาม AGENTS.md โดยอัปเดต AGENTS.md, ทำตาม workflow, และใช้ subagents ถ้าจำเป็น
argument-hint: "[@issue-number-or-title]"
allowed-tools:
  - read
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
  - git-commit-and-push-features-branch
  - resolve-cicd
  - create-github-pr
  - merge-github-pr
  - deep-review-pr
  - run-release
  - follow-devin-global-subagents
  - use-subagents
  - report
  - report-progress
  - suggest-next-action
---

## Goal

Ship code ตาม `AGENTS.md` ของ project โดยอัปเดตเอกสารให้เป้นปัจจุบัน ดำเนินการตาม workflow ทีกำหนด และส่งมอบงานจนผ่าน CI/CD

## Scope

- ใช้กับ project ทีมี `AGENTS.md`
- รองรับ subagents สำหรับงานทีมีหลายด้านหรือหลาย workspace
- ไม่ข้าม validation หรือ workflow ที `AGENTS.md` กำหนด
- ไม่แก้ไข source code นอก scope ที `AGENTS.md` ระบุ

## Execute

### 1. Prepare

> Goal: ให้ `AGENTS.md` เป้นปัจจุบัน และเข้าใจ workflow

1. ทำ `/update-agents-md` เพื่ออัปเดต `AGENTS.md` ให้สะท้อน project ปัจจุบัน
2. ทำ `/follow-agents-md` เพื่อดำเนินการตาม `AGENTS.md`
3. ถ้ามีหลาย workflow/skill ทีอิสระกัน → ทำ `/use-subagents` หรือ `/follow-devin-global-subagents`
4. ถ้าพบข้อขัดแย้งหรือต้องการ trade-off → ทำ `/ask-me`

### 2. Validate And Ship

> Goal: ส่งมอบ code ตาม project conventions

1. ทำ `/deep-validate` เพื่อตรวจสอบความถูกต้องก่อน ship
2. ทำ `/git-commit-and-push-features-branch` ถ้ามี changes ทีผ่าน validation
3. ทำ `/create-github-pr` ไปยัง production branch ตาม project conventions
4. ทำ `/deep-review-pr` เพื่อ review PR พร้อม comment แต่ละ finding ลงใน PR
5. ถ้า deep-review ไม่ผ่าน → แก้ code แล้วกลับไปทำ `/git-commit-and-push-features-branch` ซ้ำ
6. ถาม user ก่อน merge
7. ถ้า user ตกลง → ทำ `/merge-github-pr`
8. ทำ `/resolve-cicd` บน production branch หลัง merge
9. ลบ feature branch ที merge แล้ว ด้วย `git branch -d <feature-branch>`
10. `git switch main` หรือ production branch ตาม project conventions
11. ถ้ามี release → ทำ `/run-release --dry-run` ก่อน จากนั้นทำ `/run-release` หลัง user ยืนยัน

### 3. Report

> Goal: สรุปผล และแนะนำ next action

1. ทำ `/report-progress`
2. ทำ `/report` สรุป status, PR, version
3. ทำ `/suggest-next-action`

## Rules

### 1. AGENTS.md First

- ทำตาม `AGENTS.md` ของ project นั้นๆ
- ถ้า `AGENTS.md` ไม่ชัดเจน → ทำ `/update-agents-md` ก่อน

### 2. Validation Gate

- ไม่ commit ถ้ายังไม่ผ่าน validation
- ไม่ push ถ้า local verify ยังไม่ผ่าน
- ไม่ merge ถ้า CI/CD ยังไม่ผ่าน

### 3. User Confirmation

- ต้อง user ยืนยันก่อน merge
- ต้อง user ยืนยันก่อน release
- ถ้ามี breaking change → ทำ `/ask-me` ก่อน ship

### 4. No Bypass

- ไม่ bypass checks หรือ validation
- ไม่ force-push โดยไม่จำเป็น
- ไม่ merge โดยไม่มี review/approval

## Expected Outcome

- `AGENTS.md` อัปเดตและทำตามครบถ้วน
- code ผ่าน verify บน local และ CI/CD
- PR ถูกสร้าง รีวิว และ merge ตาม workflow
- release สำเร็จ (ถ้ามี)
- พร้อมทำงานต่อบน workspace เดิม
