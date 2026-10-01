---
name: research-dependencies
description: alias → /deep-research dependencies (research dependencies — analyze manifest, compare, fast/modern deps)
argument-hint: "[package or manifest]"
related:
  - deep-research
---

## Goal

Alias ของ `/deep-research dependencies` — research dependencies/libraries: analyze manifest, เปรียบเทียบ alternatives, หา fast/modern deps

## Scope

ใช้เมื่อ user เรียก `/research-dependencies` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `deep-research/workflows/dependencies/`

## Execute

ทำ `/deep-research dependencies` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/deep-research dependencies` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `deep-research/workflows/dependencies/SKILL.md` เสมอ

## Expected Outcome

- `/deep-research dependencies` ถูก execute ครบทุก step
