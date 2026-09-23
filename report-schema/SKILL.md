---
name: report-schema
description: alias → /report-database-schema (รายงาน database schema + ER diagram)
argument-hint: "[path]"
related:
  - report-database-schema
---

## Goal

Alias ของ `/report-database-schema` — รายงาน database schema, tables, columns, indexes, relations และ ER diagram

## Scope

ใช้เมื่อ user เรียก `/report-schema` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `report-database-schema`

## Execute

ทำ `/report-database-schema` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/report-database-schema` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `report-database-schema/SKILL.md` เสมอ

## Expected Outcome

- `/report-database-schema` ถูก execute ครบทุก step
