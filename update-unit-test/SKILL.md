---
name: update-unit-test
description: Alias for update-tests - merged into canonical skill
argument-hint: "[scope]"
related:
  - update-tests
---

## Goal

Skill นี้ถูก merge เข้า `/update-tests` แล้ว — ใช้ `/update-tests` เป็น canonical skill สำหรับเขียน/อัปเดต tests ทุก layer

## Scope

ใช้สำหรับ caller เก่าที่เรียก alias นี้ — forward ไป canonical skill เท่านั้น

## Execute

1. ทำ `/update-tests` ทั้งหมด

## Rules

- ไม่ duplicate workflow ใน alias — ไป canonical skill เท่านั้น
- คง backward compatibility ผ่าน alias

## Expected Outcome

- ทำงานผ่าน `/update-tests`