---
name: improve-usage-md
description: หา improvements ของ USAGE.md — docs promise เทียบของจริง, examples run ได้ — แก้ทันที
argument-hint: "[scope]"
related:
  - design-usage-with-me-first
  - improve
  - update-usage-md
  - report-usage
  - deep-review-codebase
  - deep-review-codebase-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "USAGE.md / usage surface ควร improve อะไร" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review-codebase` dimension `usage` เป็น prioritized list แล้วส่งไป `/deep-review-codebase-then-fix` แก้ทันที (thin entry — ไม่ทำ review เอง ไม่แก้ไขโดยตรงใน skill นี้)

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "usage docs ควร improve อะไร"

- `usage` dimension coverage — usage surface parity (`USAGE.md`/README promise ตรงกับที่ API/CLI/web ทำได้จริง), discoverability ของ commands/API, onboarding friction, broken/outdated examples, public surface ที่ยังไม่มี example เลย
- เขียน/เขียนไฟล์ใหม่ทั้งฉบับ → `/update-usage-md`; สรุปรายการ surface ที่ใช้จริง → `/report-usage`; รัน example verify → `/deep-test usage`
- finding ที่ต้องออกแบบ structure/wording/example ใหม่ก่อนเขียน (ยังไม่ได้คุยกับ user) → `/design-usage-with-me-first` ในแชท แล้วส่ง `/update-usage-md`
- เกณฑ์ boundary เต็ม: `improve/references/scope-map.md` (SSOT)

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review-codebase` กับ scope นั้น (dimension `usage`)
3. รวม findings เป็น prioritized list พร้อม severity และ evidence — P0: example ที่ run แล้วพัง, docs promise ที่ทำจริงไม่ได้

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-codebase-then-fix` (domain `usage` ใน Domain Map)
2. Parity fix (docs promise ไม่ตรงของจริง) → verify ด้วย `/deep-test usage` หลังแก้; เนื้อหาขาด/เก่าทั้งส่วน → `/update-usage-md`
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review-codebase` dimension `usage`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง
- ห้ามเขียน docs จาก assumption — ทุก example ต้อง run ได้จริงบน stack ของ project

## Expected Outcome

- Prioritized usage-md improvement list จาก `/deep-review-codebase`
- ไม่มี confirm gate — แก้ทุก finding ทันทีผ่าน `/deep-review-codebase-then-fix`
- ทุก example ใน `USAGE.md` ผ่าน `/deep-test usage` — docs promise เท่ากับของจริง
