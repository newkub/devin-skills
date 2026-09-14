---
name: watch-browser-and-test
description: Alias for watch-browser-test — merged into the canonical skill
argument-hint: "[url|report]"
related:
  - watch-browser-test
  - watch-browser
---

## Goal

Skill นี้ถูก merge เข้ากับ `/watch-browser-test` แล้ว — ใช้ `/watch-browser-test` เป็น canonical skill

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill

## Execute

1. ทำ `/watch-browser-test` ตามขอบเขตและ workflow เดิมทั้งหมด

## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ผลลัพธ์เหมือน `/watch-browser-test`
