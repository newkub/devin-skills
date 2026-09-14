---
name: watch-browser-and-improve-uxui
description: Alias for watch-browser-improve-uxui — merged into the canonical skill
argument-hint: "[url]"
related:
  - watch-browser-improve-uxui
  - watch-browser
---

## Goal

Skill นี้ถูก merge เข้ากับ `/watch-browser-improve-uxui` แล้ว — ใช้ `/watch-browser-improve-uxui` เป็น canonical skill

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill

## Execute

1. ทำ `/watch-browser-improve-uxui` ตามขอบเขตและ workflow เดิมทั้งหมด

## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ผลลัพธ์เหมือน `/watch-browser-improve-uxui`
