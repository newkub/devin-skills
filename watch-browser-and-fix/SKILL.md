---
name: watch-browser-and-fix
description: alias → /watch-browser-fix (เปิด browser แล้ว capture แก้ errors)
argument-hint: "[url|report]"
related:
  - watch-browser-fix
  - watch-browser
---

## Goal

Alias ของ `/watch-browser-fix` — เปิด browser ผ่าน `agent-browser` capture แก้ไข console/page errors และ confirm web server

## Scope

ใช้เมื่อ user เรียก `/watch-browser-and-fix` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `watch-browser-fix`

## Execute

ทำ `/watch-browser-fix` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/watch-browser-fix` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `watch-browser-fix/SKILL.md` เสมอ

## Expected Outcome

- `/watch-browser-fix` ถูก execute ครบทุก step จน errors ถูกแก้และ server ทำงานได้
