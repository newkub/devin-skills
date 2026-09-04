---
name: deep-review
description: Dispatch งาน review ลึกตาม context ไปยัง deep-review-* หรือ review-* workflows ทีเหมาะสม
argument-hint: "[context] [target-or-path]"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - find_file_by_name
  - exec
  - ask_user_question
  - todo_write
  - skill
  - run_subagent
triggers:
  - user
  - model
related:
  - deep-thinking
  - pondering
  - deep-plan
  - deep-analyze
  - update-review-cli
  - deep-review-pr
  - deep-report
  - deep-validate
  - suggest-next-action
  - ask-me
---

## Goal

Dispatch review ลึกตาม context ของงาน ไปยัง workflow ทีถูกต้อง โดยไม่ซ้ำซ้อนกับ update-review-cli

## Scope

ใช้เมื่อ user ต้องการ `/deep-review` แต่ไม่ระบุ context หรือ context ไม่ใช่ codebase เท่านั้น `deep-review` จะเลือก sub-workflow ทีเหมาะสม

ดูเพิ่มเติม: /deep-plan, /ask-me

## Execute

### 1. Identify Context

> Goal: ระบุ Context
1. รับ `context` และ `target` จาก argument
2. ถ้าไม่ระบุ context → ถาม user หรือวิเคราะห์จาก target
3. อ่าน `AGENTS.md` ถ้ามี

### 2. Dispatch By Context

> Goal: Dispatch By Context
1. ถ้า context เป็น codebase, project, repo หรือ directory → ทำ `/update-review-cli`
2. ถ้า context เป็น PR, pull request, branch diff → ทำ `/deep-review-pr`
3. ถ้า context เป็น issue, bug, feature → ทำ `/deep-analyze` แล้วแนะนำ `/review-*` ทีเหมาะสม
4. ถ้า context เป็น docs, README, content → ทำ `/review-docs`
5. ถ้า context เป็น security incident → ทำ `/review-security`
6. ถ้า context ไม่ชัด → ทำ `/deep-thinking` และ `/pondering` ก่อน แล้วค่อย dispatch

### 3. Follow Up

> Goal: Follow Up
1. ทำ `/deep-validate` เพื่อตรวจสอบ findings สำคัญ
2. ทำ `/deep-report` ถ้าต้องการ report รวม
3. ทำ `/suggest-next-action`

## Rules

- `deep-review` ไม่ทำ review เองโดยตรง แต่ dispatch ไปยัง sub-workflow
- ไม่เรียก `/update-review-cli` ถ้า context ไม่ใช่ codebase
- ถ้า user ต้องการ review ทั่วไป ให้ถาม scope ก่อน
- หลีกเลี่ยงการทำซ้ำซ้อนระหว่าง deep-review-* ต่าง ๆ

## Expected Outcome

- Review ถูกส่งไปยัง workflow ทีเหมาะสม
- ไม่มี duplicate workflow
- User ได้ next action ที่ถูกต้อง
