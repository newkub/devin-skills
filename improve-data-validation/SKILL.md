---
name: improve-data-validation
description: หา data validation improvements ใน scope — schemas, boundary checks, sanitization — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-data
  - improve-form
  - improve-api
  - deep-review
  - deep-review-then-fix
  - follow-tool-data-validation
  - follow-lib-zod
  - follow-lib-arktype
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "data validation improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-data-validation` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "validation ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-data-validation` — input/output validation coverage, schema contracts, boundary checks, sanitization, type-safety ของ validators, client/server parity (validation layer — เจ้าของพื้นที่นี้)
- data integrity ทั้งสาย (cross-service, pipelines, reports) → `/improve-data`; ORM/schema/migrations → `/improve-database`
- form field validation UX เจาะจง → `/improve-form`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-data-validation` — validation coverage ที่ boundaries (API payloads, forms, env, file uploads), schema drift, unsafe casts, missing sanitization
3. รวบรวม prioritized list พร้อม severity และ evidence — missing validation ที่ trust boundary เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-data-validation`)
2. เลือก schema validator ตาม project ผ่าน `/follow-tool-data-validation` (`/follow-lib-zod`, `/follow-lib-arktype` ฯลฯ) — ห้ามเขียน validator เองถ้ามี lib อยู่แล้ว
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-data-validation`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- Validate ที่ trust boundary เสมอ — ห้ามพึ่ง client-side validation ฝั่งเดียว
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized validation improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม validation ครบทุก trust boundary
