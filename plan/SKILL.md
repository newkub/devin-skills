---
name: plan
description: alias → /deep-analyze-and-plan (analyze + plan — วิเคราะห์ลึกแล้ววางแผน implementation-ready)
argument-hint: "[scope]"
related:
  - deep-analyze-and-plan
  - deep-plan
---

## Goal

Alias ของ `/deep-analyze-and-plan` — วิเคราะห์ปัญหา/context อย่างลึกซึ้งแล้ววางแผน implementation-ready ในขั้นตอนเดียว

## Scope

ใช้เมื่อ user เรียก `/plan` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `deep-analyze-and-plan` (`/deep-plan` ก็เป็น alias ของ `/deep-analyze-and-plan` เช่นกัน)

## Execute

ทำ `/deep-analyze-and-plan` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/deep-analyze-and-plan` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `deep-analyze-and-plan/SKILL.md` เสมอ

## Expected Outcome

- `/deep-analyze-and-plan` ถูก execute ครบทุก step จนได้ implementation-ready plan
