---
name: watch-browser-and-fix
description: Alias for watch-browser-fix — merged into the canonical skill
argument-hint: "[url]"
related:
  - watch-browser-fix
  - watch-browser
---

## Goal

Skill นี้ถูก merge เข้ากับ `/watch-browser-fix` แล้ว — ใช้ `/watch-browser-fix` เป็น canonical skill

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill

## Execute

1. ทำ `/watch-browser-fix` ตามขอบเขตและ workflow เดิมทั้งหมด

## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ผลลัพธ์เหมือน `/watch-browser-fix`
