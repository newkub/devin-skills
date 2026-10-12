---
name: improve-api
description: หา API improvements ใน scope — design, contracts, errors, versioning — รวม findings แล้วแก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-backend
  - improve-data-validation
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
  - test-api
  - test-contract
---

## Goal

ตอบคำถาม "API improve/optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-api` + `review-backend` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "API ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-api` — API design, contracts, error responses, versioning, docs
- `review-backend` — backend structure, handlers, middleware, service boundaries
- payload/request validation findings → `/improve-data-validation`; backend structure/service boundaries เจาะจง → `/improve-backend`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-api` + `review-backend`
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-api` + `review-backend`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง
- ใช้ /test-api และ /test-contract verify fixes (endpoints, consumer/provider compat)

## Expected Outcome

- Prioritized improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`
