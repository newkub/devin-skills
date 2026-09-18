---
name: review-iac
description: Alias for deep-review-iac - merged into the canonical skill
argument-hint: "[scope]"
related:
  - deep-review
---

## Goal

Skill นี้ถูก merge เข้ากับ `/deep-review` แล้ว — ใช้ `/deep-review iac` เป็น canonical

## Execute

1. ทำ `/deep-review iac` ตามขอบเขตและ workflow เดิมทั้งหมด

## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ผลลัพธ์เหมือน `/deep-review iac`
