---
name: improve-api-deprecation
description: หา API deprecation improvements — sunset headers, migration guides, timelines — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-api
  - improve-migration
  - improve-docs
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "API deprecation improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-api + review-docs` (deprecation scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "endpoint/feature เก่าควร improve การ retire ยังไง" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-api` (deprecation scope) — `Deprecation`/`Sunset` headers, deprecation policy (lead time, versioning window), usage telemetry ก่อน retire, breaking-change gating
- `review-docs` (deprecation scope) — migration guides ต่อ endpoint, changelog entries, changelog/announcement completeness
- code-level data migration → `/improve-migration`; API design/greenfield versioning → `/improve-api`; internal dead code → `/improve-code-quality`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-api + review-docs` (deprecation scope) — endpoint เก่าไม่มี marker, ไม่มี traffic data ก่อนตัด, migration guide หาย
3. รวบรวม prioritized list พร้อม severity และ evidence — เตรียม retire โดยไม่มี telemetry ผู้ใช้จริง เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ทุก retirement ต้องผ่าน usage check (`/check-git-logs`, telemetry, consumer list) ก่อน — ห้าม retire แบบเดา
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm — แต่ actual sunset date ต้องมี communication plan ครบก่อน
- ห้ามลบ endpoint ที่ยังมี unknown consumers โดยไม่มี warning window
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized API-deprecation improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม headers + migration guides ครบ
