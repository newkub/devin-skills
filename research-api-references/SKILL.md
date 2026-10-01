---
name: research-api-references
description: alias → /deep-research api-references (ค้นหา API references จากหลายแหล่ง)
argument-hint: "[api-or-library]"
related:
  - deep-research
---

## Goal

Alias ของ `/deep-research api-references` — ค้นหา API references ที่น่าเชื่อถือสรุปพร้อมแหล่งอ้างอิง

## Scope

ใช้เมื่อ user เรียก `/research-api-references` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `deep-research/workflows/api-references/`

## Execute

ทำ `/deep-research api-references` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/deep-research api-references` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `deep-research/workflows/api-references/SKILL.md` เสมอ

## Expected Outcome

- `/deep-research api-references` ถูก execute ครบทุก step
