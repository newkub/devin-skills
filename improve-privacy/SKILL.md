---
name: improve-privacy
description: หา improvements ของ privacy — consent, data retention, PII handling — รวม findings แล้วแก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
  - improve-security
---

## Goal

ตอบคำถาม "privacy improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-security + review-compliance` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "privacy ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-security` — PII exposure, access control, data minimization
- `review-compliance` — consent flows, retention policies, GDPR/LGPD surface

## Execute

### 1. Review

1. รับ `<scope>` จาก argument หรือ conversation context — ไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-security + review-compliance` — PII leaks, missing consent gates, retention gaps, third-party sharing

### 2. Present Findings

1. ทำ `/report` แสดง privacy improvements: No., Finding, Severity, Fix Skill

### 3. Fix All Findings

1. ทำ `/deep-review-then-fix` แก้ทุก finding ตาม Domain Map
2. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-security + review-compliance`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized privacy improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`