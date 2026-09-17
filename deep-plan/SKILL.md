---
name: deep-plan
description: Alias for deep-analyze-and-plan — merged into the canonical skill
argument-hint: "[scope]"
related:
  - deep-analyze-and-plan
  - deep-analyze
---

## Goal

Skill นี้ถูก merge เข้ากับ `/deep-analyze-and-plan` แล้ว — ใช้ `/deep-analyze-and-plan` เป็น canonical skill (ครอบคลุม planning ทั้งหมด: gather evidence → write plan → order → validate → report)

## Scope

Callers ที่เรียกชื่อ alias เดิมจะถูก forward ไปยัง `/deep-analyze-and-plan` เสมอ

## Execute

### 1. Forward To Canonical

> Goal: ส่งต่อไปยัง canonical skill

1. ทำ `/deep-analyze-and-plan` ด้วย arguments เดิม — planning context จาก review findings ครอบคลุมโดย `/deep-analyze` domain table ใน canonical skill

## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ได้ผลลัพธ์เดียวกับ `/deep-analyze-and-plan` — implementation-ready plan ในแชท
