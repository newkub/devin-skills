---
name: review-then-fix
description: alias → /deep-review-then-fix (review แล้ว apply fix ตาม context หลัง user confirm)
argument-hint: "[scope]"
related:
  - deep-review-then-fix
  - use-subagents
---

## Goal

Alias ของ `/deep-review-then-fix` — review แล้ว apply fix ตาม context หลัง user confirm

## Scope

ใช้เมื่อ user เรียก `/review-then-fix` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `deep-review-then-fix`

## Execute

ทำ `/deep-review-then-fix` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/deep-review-then-fix` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `deep-review-then-fix/SKILL.md` เสมอ
- ใช้ /use-subagents ถ้าจำเป็น

## Expected Outcome

- `/deep-review-then-fix` ถูก execute ครบทุก step
