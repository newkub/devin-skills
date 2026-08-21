---
name: check-git-diff
description: ตรวจสอบความแตกต่างของ git refs หรือ working tree ด้วย git diff
allowed-tools:
  - read
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - check-should-update
  - report-format-table
  - suggest-next-action
---

## Goal

ตรวจสอบความแตกต่างระหว่าง git refs, branches, หรือ working tree ด้วย `git diff` และสรุปผล

## Scope

ใช้เมื่อต้องเปรียบเทียบ code ใน git history หรือระหว่าง working tree กับ index ไม่แก้ไข source

## Execute

### 1. Identify Refs

ระบุ refs ที่ต้องเปรียบเทียบ

> Goal: รู้ว่าเปรียบเทียบอะไรกับอะไร

1. รับ target paths และ refs จาก user เช่น `HEAD`, `HEAD~1`, `<branch>`, `staged`, `unstaged`
2. ถ้าไม่ระบุ → ใช้ `HEAD` กับ `HEAD~1`
3. ถ้าไม่ชัด → `/ask-me`

### 2. Run Git Diff

รัน `git diff` ตามรูปแบบที่ต้องการ

> Goal: ได้ diff output ที่เหมาะสม

1. ถ้าเปรียบเทียบสอง refs → `git diff <from>..<to> -- <paths>`
2. ถ้าเฉพาะ working tree กับ index → `git diff -- <paths>`
3. ถ้า staged → `git diff --staged -- <paths>`
4. ถ้าต้องการสถิติ → `git diff --stat` หรือ `git diff --name-only`

### 3. Analyze Diff

วิเคราะห์ changes

> Goal: สรุปสิ่งที่เปลี่ยน

1. ดู `--stat` เพื่อรู้จำนวน file/insert/delete
2. อ่าน hunks ของแต่ละ file เพื่อหา nature of changes
3. ระบุไฟล์ที่มี breaking changes, new features, หรือ test impact

### 4. Report

สรุปผล

> Goal: ผู้ใช้เข้าใจ diff

1. สรุปจำนวน files, insertions, deletions
2. รายการไฟล์ที่เปลี่ยนแยกตามประเภท: added, modified, deleted
3. ถ้ามี critical changes → แนะนำ `/review-*` หรือ `/resolve-errors`
4. ทำ `/suggest-next-action`

## Rules

### 1. Read-Only

- ไม่ commit, ไม่ reset, ไม่แก้ไข source
- ใช้เฉพาะ `git diff`, `git diff --stat`, `git diff --name-only`

### 2. Scope

- ถ้า path หลายรายการให้รวมเป็น space-separated list
- ถ้า repo มี submodules → ระบุ `--submodule` ถ้าจำเป็น

### 3. Output

- ใช้ `/report-format-table` สำหรับสรุป stat
- ระบุ file paths เป็น relative จาก repo root

## Expected Outcome

- สรุป diff: files changed, insertions, deletions, ประเภทการเปลี่ยนแปลง
- ระบุ critical changes
- มี next action
