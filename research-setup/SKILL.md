---
name: research-setup
description: alias → /deep-research setup (research setup/config/CI ของ tool/service จากหลายแหล่ง)
argument-hint: "[tool-or-service]"
related:
  - deep-research
---

## Goal

Alias ของ `/deep-research setup` — ค้นหาและสรุป setup, config, CI/CD และ boilerplate โดย cross-check หลายแหล่ง

## Scope

ใช้เมื่อ user เรียก `/research-setup` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `deep-research/workflows/setup/` — integrations/plugins/extensions → `/research-setup-integrations`

## Execute

ทำ `/deep-research setup` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/deep-research setup` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `deep-research/workflows/setup/SKILL.md` เสมอ

## Expected Outcome

- `/deep-research setup` ถูก execute ครบทุก step
