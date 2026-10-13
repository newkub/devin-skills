---
name: improve-cache
description: หา cache improvements — staleness, invalidation, key design, correctness — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-backend
  - improve-data
  - optimize-cache
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "cache improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-backend + review-data-validation` (cache correctness scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "cache layer ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-backend` (cache scope) — invalidation ครบทุก write path, TTL สมเหตุสมผล, stale-while-revalidate, cache key ครอบคลุมทุก input ที่กระทบ output, stampede/penetration guards
- `review-data-validation` (cache scope) — ข้อมูลจาก cache ตรงกับ source of truth, no torn reads, version/etag ถูกต้อง
- cache hit rate ต่ำ/perf → `/optimize-cache`; data integrity นอก cache → `/improve-data`; database layer → `/improve-database`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-backend + review-data-validation` (cache scope) — user แก้ข้อมูลแล้วยังเห็นค่าเก่า, cache key ขาด input, invalidation หลุด write path
3. รวบรวม prioritized list พร้อม severity และ evidence — wrong/stale data ที่ user เห็น = Critical

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. เพิ่ม test ยืนยัน invalidation: write → read ต้องได้ข้อมูลใหม่เสมอ
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- correctness ก่อน performance — cache ที่ให้ข้อมูลผิด ห้ามแลกกับ hit rate
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized cache improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม invalidation tests
