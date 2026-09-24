---
name: watch-browser-and-improve-uxui
description: alias → /watch-browser-improve-uxui (improve UX/UI ทุก route ผ่าน subagents)
argument-hint: "[url|report]"
related:
  - watch-browser-improve-uxui
  - watch-browser
---

## Goal

Alias ของ `/watch-browser-improve-uxui` — watch หน้าเว็บผ่าน `agent-browser` confirm server แล้ว dispatch subagents แยก route เพื่อ improve UX/UI ตาม `/review-uxui` + responsive

## Scope

ใช้เมื่อ user เรียก `/watch-browser-and-improve-uxui` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `watch-browser-improve-uxui`

## Execute

ทำ `/watch-browser-improve-uxui` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/watch-browser-improve-uxui` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `watch-browser-improve-uxui/SKILL.md` เสมอ

## Expected Outcome

- `/watch-browser-improve-uxui` ถูก execute ครบทุก step จน UX/UI ถูกปรับปรุงทุก route
