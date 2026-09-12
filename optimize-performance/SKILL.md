---
name: optimize-performance
description: Alias for deep-review-then-fix - merged into canonical fix skill
argument-hint: "[scope]"
related:
  - deep-review-then-fix
---

## Goal

Skill นี้ถูก merge เข้า `/deep-review-then-fix` แล้ว — review-* เป็น report-only; fix ทั้งหมดทำผ่าน `/deep-review-then-fix` ที่อ่าน fix guides จาก `review-*/references/`

## Scope

ใช้สำหรับ caller เก่าที่เรียก alias นี้ — forward ไป canonical skill เท่านั้น

## Execute

1. ทำ `/deep-review-then-fix` ทั้งหมด พร้อม domain context ของ skill นี้

## Rules

- ไม่ duplicate workflow ใน alias — ไป canonical skill เท่านั้น
- คง backward compatibility ผ่าน alias

## Expected Outcome

- ทำงานผ่าน `/deep-review-then-fix`