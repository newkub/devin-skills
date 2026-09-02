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
  - use-subagents
  - report
  - suggest-next-action
---

## Goal

Ship code ตาม `AGENTS.md` โดย `/update-agents-md` หรือ `/follow-agents-md`

## Scope

- ใช้กับ project ทีมี `AGENTS.md`
- รองรับ subagents สำหรับงานทีมีหลายด้าน
- ไม่ข้าม validation หรือ workflow ที AGENTS.md กำหนด

## Execute

### 1. Prepare

> Goal: อัปเดตและทำตาม `AGENTS.md`

1. ทำ `/update-agents-md` เพื่ออัปเดต `AGENTS.md` พร้อม ship workflow
2. ทำ `/follow-agents-md` เพื่อดำเนินการตาม `AGENTS.md`
3. ถ้ามีหลาย workflows/skills ที independent → ทำ `/use-subagents` หรือ `/follow-devin-global-subagents` เพื่อใช้ subagents
4. ถ้าพบข้อขัดแย้งหรือต้องการ trade-off → ทำ `/ask-me`

### 2. Report

> Goal: รายงานผลและ next action

1. ทำ `/report-progress`
2. ทำ `/report` สรุป status, PR, version
3. ทำ `/suggest-next-action`

## Rules

- ทำตาม `AGENTS.md` ของ project นั้นๆ
- ไม่ commit ถ้ายังไม่ผ่าน validation
- ต้อง user ยืนยันก่อน release
- ไม่ bypass checks หรือ validation

## Expected Outcome

- `AGENTS.md` อัปเดตและทำตามครบถ้วน
- code ผ่าน verify บน local และ CI/CD
- PR ถูกสร้าง รีวิว และ merge ตาม workflow
- release สำเร็จ (ถ้ามี)
- พร้อมทำงานต่อบน workspace เดิม
