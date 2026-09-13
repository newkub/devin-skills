---
name: follow-debugging
description: Alias for deep-debug — merged into the canonical skill
argument-hint: "[scope]"
related:
  - deep-debug
---

## Goal

Skill นี้ถูก merge เข้ากับ `/deep-debug` แล้ว — ใช้ `/deep-debug` เป็น canonical skill

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill

## Execute

1. ทำ `/deep-debug` ตามขอบเขตและ workflow เดิมทั้งหมด


## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ผลลัพธ์เหมือน `/deep-debug`
