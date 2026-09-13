---
name: update-ast-grep-rules
description: Alias for update-project-rules — merged into the canonical skill
argument-hint: "[rule-or-pattern]"
related:
  - update-project-rules
---

## Goal

Skill นี้ถูก merge เข้ากับ `/update-project-rules` แล้ว — ใช้ `/update-project-rules` เป็น canonical skill

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill

## Execute

1. ทำ `/update-project-rules` ตามขอบเขตและ workflow เดิมทั้งหมด


## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ผลลัพธ์เหมือน `/update-project-rules`
