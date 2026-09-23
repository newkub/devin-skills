---
name: follow-debugging
description: alias → /deep-debug (debug ตามขั้นตอน — reproduce → fix → prevent recurrence)
argument-hint: "[scope]"
related:
  - deep-debug
---

## Goal

Alias ของ `/deep-debug` — debug ตามขั้นตอนจนหา root cause แก้ไข และป้องกันปัญหาซ้ำ

## Scope

ใช้เมื่อ user เรียก `/follow-debugging` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `deep-debug`

## Execute

ทำ `/deep-debug` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/deep-debug` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `deep-debug/SKILL.md` เสมอ

## Expected Outcome

- `/deep-debug` ถูก execute ครบทุก step
