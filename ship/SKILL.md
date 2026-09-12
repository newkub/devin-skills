---
name: ship
description: Ship code ผ่าน AGENTS.md workflow — entry point เดียว ไม่มี logic เอง
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
---

## Goal

Ship code ผ่าน `AGENTS.md` ของ project — skill นี้เป็น entry point เท่านั้น ไม่มี ship logic เอง; workflow ทั้งหมด (branch, validate, staging, CI gate, merge, production, rollback) อยู่ใน `### 8. Ship` ของ `/update-agents-md` (merged from: ship, ship-to-staging, ship-to-production)

## Scope

- ใช้กับ project ที่มี `AGENTS.md` (สร้าง/อัปเดตผ่าน `/update-agents-md` ก่อนเสมอ)
- ทุก ship action ทำผ่าน workflow ใน `AGENTS.md` ตาม `/follow-agents-md`

## Execute

### 1. Update AGENTS.md

> Goal: `AGENTS.md` สดและมี ship workflow ครบ

1. ทำ `/update-agents-md` — สร้าง/อัปเดต `AGENTS.md` ของ project พร้อม `### 8. Ship` workflow (รวม `/review-then-fix` เป็น canonical fix pass ก่อน ship)

### 2. Follow AGENTS.md

> Goal: ทำงานตาม `AGENTS.md` เท่านั้น

1. ทำ `/follow-agents-md` — execute ship workflow ที่ `AGENTS.md` กำหนด ตั้งแต่ branch hygiene จนถึง production + rollback

## Rules

### 1. AGENTS.md First

- ห้ามข้าม `/update-agents-md` — `AGENTS.md` ต้อง fresh ก่อน ship เสมอ
- ห้าม hardcode ship steps ใน skill นี้ — workflow อยู่ใน `update-agents-md`/`AGENTS.md` เท่านั้น

### 2. User Confirmation

- merge, production deploy, release → ต้องมี user confirm เสมอ (ตาม workflow ใน `AGENTS.md`)

## Expected Outcome

- `AGENTS.md` สดและครบ — ship workflow execute ผ่าน `/follow-agents-md`
- code ผ่าน verify ทั้ง local และ staging, production healthy พร้อม rollback path
