---
name: improve-onboarding
description: หา improvements ของ onboarding — first-run flows, activation, empty states — รวม findings แล้วแก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
  - improve-uxui
---

## Goal

ตอบคำถาม "onboarding improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-uxui + review-frontend + review-business` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "onboarding ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-uxui` — first-run UX, activation friction, empty states
- `review-frontend` — onboarding components, gating, progress state
- `review-business` — activation metrics, drop-off points

## Execute

### 1. Review

1. รับ `<scope>` จาก argument หรือ conversation context — ไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-uxui + review-frontend + review-business` — activation friction, empty states, progress tracking, time-to-value

### 2. Present Findings

1. ทำ `/report` แสดง onboarding improvements: No., Finding, Severity, Fix Skill

### 3. Fix All Findings

1. ทำ `/deep-review-then-fix` แก้ทุก finding ตาม Domain Map
2. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-uxui + review-frontend + review-business`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized onboarding improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`