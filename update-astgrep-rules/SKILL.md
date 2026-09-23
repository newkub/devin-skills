---
name: update-astgrep-rules
description: alias → /update-project-rules (อัปเดต ast-grep rules ใน rules/ และ sgconfig.yml)
argument-hint: "[rule-or-pattern]"
related:
  - update-project-rules
---

## Goal

Alias ของ `/update-project-rules` — อัปเดต ast-grep rules ใน `rules/` และ `sgconfig.yml` ตาม conventions ของ project

## Scope

ใช้เมื่อ user เรียก `/update-astgrep-rules` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `update-project-rules`

## Execute

ทำ `/update-project-rules` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/update-project-rules` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `update-project-rules/SKILL.md` เสมอ

## Expected Outcome

- `/update-project-rules` ถูก execute ครบทุก step
