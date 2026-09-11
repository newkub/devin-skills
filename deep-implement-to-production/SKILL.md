---
name: deep-implement-to-production
description: Alias for implement-to-production — merged into the canonical skill
argument-hint: "[scope]"
related:
  - implement-to-production
---

## Goal

Skill นี้ถูก merge เข้ากับ `/implement-to-production` แล้ว — ใช้ `/implement-to-production` เป็น canonical skill

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill

## Execute

1. ทำ `/implement-to-production` ตามขอบเขตและ workflow เดิมทั้งหมด


## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ผลลัพธ์เหมือน `/implement-to-production`
