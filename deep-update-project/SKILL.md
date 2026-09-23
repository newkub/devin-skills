---
name: deep-update-project
description: alias → /update-project (อัปเดต root project จาก git log แล้ว sync docs/config/rules/tooling)
argument-hint: "[scope]"
related:
  - update-project
---

## Goal

Alias ของ `/update-project` — อัปเดต root project ตาม git log แล้ว sync project docs/config/rules/tooling

## Scope

ใช้เมื่อ user เรียก `/deep-update-project` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `update-project`

## Execute

ทำ `/update-project` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/update-project` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `update-project/SKILL.md` เสมอ

## Expected Outcome

- `/update-project` ถูก execute ครบทุก step
