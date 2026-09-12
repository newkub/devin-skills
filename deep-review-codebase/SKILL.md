---
name: deep-review-codebase
description: Alias for deep-review - renamed canonical skill
argument-hint: "[scope]"
related:
  - deep-review
---

## Goal

Skill นี้ rename เป็น `/deep-review` แล้ว — forward ไป canonical skill เท่านั้น

## Scope

ใช้สำหรับ caller เก่าที่เรียก alias นี้

## Execute

1. ทำ `/deep-review` ทั้งหมด

## Rules

- ไม่ duplicate workflow ใน alias
- คง backward compatibility ผ่าน alias

## Expected Outcome

- ทำงานผ่าน `/deep-review`