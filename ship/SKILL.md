---
name: ship
description: Ship code ตาม AGENTS.md โดย /update-agents-md หรือ /follow-agents-md พร้อมใช้ subagents
argument-hint: "[issue-number-or-title]"
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
  - follow-devin-global-subagents
  - consider-use-subagents
  - report
  - suggest-next-action
---

## Goal

Ship code จาก `dev` ไป `main` ตาม `AGENTS.md` โดย `/update-agents-md` หรือ `/follow-agents-md`

## Scope

- ใช้บน `dev` branch
- `main` ห้ามแก้ไขโดยตรง
- ไม่ force push
- รองรับ subagents สำหรับงานที่มีหลายด้าน

## Execute

### 1. Prepare

> Goal: อัปเดตและทำตาม `AGENTS.md`

1. ทำ `/update-agents-md` เพื่ออัปเดต `AGENTS.md` พร้อม ship workflow
2. ทำ `/follow-agents-md` เพื่อดำเนินการตาม `AGENTS.md`
3. ถ้ามีหลาย workflows/skills ที่ independent → ทำ `/consider-use-subagents` หรือ `/follow-devin-global-subagents` เพื่อใช้ subagents
4. ถ้าพบข้อขัดแย้งหรือต้องการ trade-off → ทำ `/ask-me`

### 2. Report

> Goal: รายงานผลและ next action

1. ทำ `/report-progress`
2. ทำ `/report` สรุป status, PR, version
3. ทำ `/suggest-next-action`

## Rules

- ทำงานบน `dev` branch
- `main` ห้ามแก้ไขโดยตรง
- ไม่ force push
- ไม่ commit ถ้ายังไม่ผ่าน validation
- ต้อง user ยืนยันก่อน release

## Expected Outcome

- `AGENTS.md` อัปเดตและทำตามครบถ้วน
- `dev` ผ่าน verify บน local และ CI/CD
- PR `dev → main` ถูกสร้าง รีวิว และ merge
- Patch release สำเร็จ (ถ้ามี)
- กลับมาอยู่บน `dev` พร้อมทำงานต่อ
