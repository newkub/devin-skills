---
name: improve-pagination
description: หา pagination improvements — cursor/keyset, deep pagination, stable ordering — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-api
  - improve-database
  - optimize-queries
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "pagination improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-api + review-database` (pagination scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "list paging ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-api` (pagination scope) — cursor vs offset contract, page-size caps, stable ordering key, has-next semantics, total-count policy
- `review-database` (pagination scope) — keyset queries, ORDER BY determinism, index ที่รองรับ seek, OFFSET ที่โตตาม page
- query perf ลึก (N+1, EXPLAIN plans) → `/optimize-queries`; schema/index design → `/improve-database`; infinite scroll UI → `/improve-frontend`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-api + review-database` (pagination scope) — rows หาย/ซ้ำระหว่าง page, uncapped page_size, cursor encoding ปลอดภัยหรือไม่
3. รวบรวม prioritized list พร้อม severity และ evidence — data skipping (user ตกแถว) เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. เปลี่ยน pagination contract = API change — ทำ `/improve-api` versioning + client parity test ก่อน/หลัง
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้ามเปิด page_size ไม่จำกัด — มี cap ทุก endpoint
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized pagination improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม stable-ordering tests
