---
name: deep-plan
description: Alias for plan — merged into the canonical skill
argument-hint: "[scope]"
related:
  - plan
---

## Goal

Skill นี้ถูก merge เข้ากับ `/plan` แล้ว — ใช้ `/plan` เป็น canonical skill

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill

## Execute

1. ทำ `/plan` ตามขอบเขตและ workflow เดิมทั้งหมด


## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ผลลัพธ์เหมือน `/plan`
