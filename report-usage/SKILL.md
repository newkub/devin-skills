---
name: report-usage
description: Report usage statistics and patterns of APIs, functions, or skills
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
  - report-table
  - report-file-structure
  - report-ansi
  - report-codeblock
  - analyze-project
  - check-unused-files
  - check-unused-deps
  - suggest-next-action
---

## Goal

สร้างรายงาน usage statistics ของ APIs, functions, skills หรือ dependencies ใน project

## Scope

ใช้สำหรับวิเคราะห์ frequency, consumers, top callers และ patterns ของ usage ไม่แก้ไข source code

## Execute

### 1. Identify Targets

ระบุสิ่งทีต้องวัด usage

> Goal: scope ของ report ชัดเจน

1. ถาม user หรือ detect จาก request
2. ระบุ API endpoints, functions, classes, skills หรือ dependencies
3. ค้นหา targets ด้วย `grep` หรือ `glob`

### 2. Collect Usage Data

รวบรวมข้อมูลการใช้งาน

> Goal: มี metrics ครบ

1. นับจำนวน call sites/imports
2. ระบุ files/workspaces ทีใช้
3. หา version หรือ signature ถ้าเป็น API
4. จัดกลุ่มตาม consumer

### 3. Report Usage

สร้างรายงาน

> Goal: usage patterns เข้าใจง่าย

1. ทำ `/report-table` สำหรับ top consumers, frequency, versions
2. ทำ `/report-file-structure` สำหรับ caller tree
3. ทำ `/report-ansi` สำหรับ status/progress
4. สรุป unused, overused, deprecated usages

## Rules

### 1. Read Only

- ไม่แก้ไข code
- ไม่เรียก APIs ภายนอกโดยไม่ได้รับอนุญาต
- ไม่ expose sensitive data

### 2. Evidence Based

- ทุก metric ต้องมา from source files
- ระบุ file path และ line number
- ระบุวิธีนับอย่างชัดเจน

### 3. Actionable

- ระบุ unused, deprecated, overused usages
- แนะนำ next action

## Expected Outcome

- usage table พร้อม frequency และ consumers
- unused/deprecated usages
- summary และ next actions
