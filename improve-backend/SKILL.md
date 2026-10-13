---
name: improve-backend
description: หา backend improvements ใน scope — services, handlers, middleware, data flow, boundaries — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-api
  - improve-database
  - improve-data-validation
  - deep-review
  - deep-review-then-fix
  - follow-architecture
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "backend improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-backend` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "backend ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-backend` — handler structure, middleware chain, service boundaries, business logic placement, data flow, data fetching patterns
- API surface/contracts → `/improve-api`; DB layer → `/improve-database`; payload validation → `/improve-data-validation`
- email delivery pipeline → `/improve-email`; upload handling → `/improve-uploads`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-backend` — god handlers, business logic ใน routes, missing middleware, service coupling, N+1 data fetching
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-backend`)
2. Boundary/layer restructuring → อ้าง `/follow-architecture` pattern ของ project; ห้ามเปลี่ยน public API contract โดยไม่ผ่าน `/improve-api` scope
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-backend`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- Structure fixes ต้อง preserve behavior — refactor ภายในไม่เปลี่ยน external contract
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized backend improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` โดย preserve API contract
