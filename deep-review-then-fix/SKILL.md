---
name: deep-review-then-fix
description: Alias for review-then-fix - merged into canonical skill
argument-hint: "[scope]"
related:
  - review-then-fix
---

## Goal

Skill นี้ถูก merge เข้ากับ `/review-then-fix` แล้ว — ใช้ `/review-then-fix` เป็น canonical skill

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill

## Execute

1. ทำ `/review-then-fix` ตามขอบเขตและ workflow เดิมทั้งหมด

## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ผลลัพธ์เหมือน `/review-then-fix`
