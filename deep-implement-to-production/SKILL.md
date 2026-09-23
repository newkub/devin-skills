---
name: deep-implement-to-production
description: alias → /implement-to-production (implement ให้ครบจน production-ready)
argument-hint: "[scope]"
related:
  - implement-to-production
---

## Goal

Alias ของ `/implement-to-production` — implement ให้ครบจนพร้อม production

## Scope

ใช้เมื่อ user เรียก `/deep-implement-to-production` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `implement-to-production`

## Execute

ทำ `/implement-to-production` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/implement-to-production` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `implement-to-production/SKILL.md` เสมอ

## Expected Outcome

- `/implement-to-production` ถูก execute ครบทุก step
