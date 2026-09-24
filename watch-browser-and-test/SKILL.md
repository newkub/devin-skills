---
name: watch-browser-and-test
description: alias → /watch-browser-test (subagents roleplay user test ทุก route)
argument-hint: "[url|report]"
related:
  - watch-browser-test
  - watch-browser
---

## Goal

Alias ของ `/watch-browser-test` — watch หน้าเว็บผ่าน `agent-browser` confirm server แล้ว dispatch subagents แยก route ให้ roleplay user ทดลองใช้งานจริง พร้อมรวม report pass/fail

## Scope

ใช้เมื่อ user เรียก `/watch-browser-and-test` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `watch-browser-test`

## Execute

ทำ `/watch-browser-test` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/watch-browser-test` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `watch-browser-test/SKILL.md` เสมอ

## Expected Outcome

- `/watch-browser-test` ถูก execute ครบทุก step จนได้ report pass/fail ครบทุก route
