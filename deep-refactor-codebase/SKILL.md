---
name: deep-refactor-codebase
description: Alias for refactor — merged into canonical skill (codebase scope)
argument-hint: "[scope]"
related:
  - refactor
---

## Goal

Skill นี้ถูก merge เข้ากับ `/refactor` แล้ว — ใช้ `/refactor` เป็น canonical skill (codebase scope → `references/codebase-refactor.md`)

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill

## Execute

1. ทำ `/refactor` โดยเลือก codebase refactor scope ตาม `references/codebase-refactor.md`


## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ผลลัพธ์เหมือน `/refactor` codebase scope
