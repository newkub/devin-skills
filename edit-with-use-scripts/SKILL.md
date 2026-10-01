---
name: edit-with-use-scripts
description: alias → /use-scripts (แก้ไขไฟล์ผ่าน scripts — reproducible, dry-run + backup + confirm)
argument-hint: "[target]"
related:
  - use-scripts
---

## Goal

Alias ของ `/use-scripts` — แก้ไขหลายไฟล์ผ่าน scripts ที่ reproducible ตรวจสอบได้ (dry-run default, backup, validate, confirm ก่อน execute)

## Scope

ใช้เมื่อ user เรียก `/edit-with-use-scripts` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `use-scripts/SKILL.md` (`### Edit Files Via Scripts`)

## Execute

ทำ `/use-scripts` เต็ม workflow — section `### Edit Files Via Scripts`

## Rules

- ห้าม duplicate workflow ของ `/use-scripts` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `use-scripts/SKILL.md` เสมอ

## Expected Outcome

- `/use-scripts` ถูก execute ครบทุก step — ไฟล์ถูกแก้ผ่าน scripts ที่ reproducible พร้อม dry-run, backup และ audit trail
