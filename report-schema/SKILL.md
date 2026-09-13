---
name: report-schema
description: Alias for report-database-schema — merged into the canonical skill
argument-hint: "[path]"
related:
  - report-database-schema
---

## Goal

Skill นี้ถูก merge เข้ากับ `/report-database-schema` แล้ว — ใช้ `/report-database-schema` เป็น canonical skill

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill

## Execute

1. ทำ `/report-database-schema` ตามขอบเขตและ workflow เดิมทั้งหมด


## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ผลลัพธ์เหมือน `/report-database-schema`
