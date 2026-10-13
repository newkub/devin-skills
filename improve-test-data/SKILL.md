---
name: improve-test-data
description: หา test data improvements — fixtures, factories, seeds, isolation — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-tests
  - improve-database
  - check-test-correctness
  - test-unit
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "test data improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-test` (fixture/seed scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "fixtures/seeds/test data ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-test` (data scope) — builder/factory แทน fixture dump, data ที่ test สร้างเองจบในตัวเอง (per-test isolation), ไม่มี production data จริง/ secrets ใน fixtures, deterministic seeds, DB snapshot vs transaction rollback strategy
- assertion/mock ถูกต้อง → `/check-test-correctness`; coverage น้อย → `/improve-tests`; schema ของ seed table → `/improve-database`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-test` (fixture/seed scope) — fixture ใช้ร่วมกันแล้ว test แตะกัน, seed ไม่ reproducible
3. รวบรวม prioritized list พร้อม severity และ evidence — production data เล็ดเข้า fixture เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-test`)
2. ใช้ factory lib ตาม ecosystem ของ test runner (เลือกผ่าน `/follow-tool-vitest`/`/follow-test`) — ห้าม copy-paste object literal ซ้ำข้ามไฟล์
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-test`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม fixture เก็บ secrets/PII — ตรวจผ่าน `/check-secrets` หลังแก้
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized test-data improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม isolated deterministic fixtures
