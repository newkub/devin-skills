---
name: improve-migration
description: หา migration improvements ใน scope — backward compat, data integrity, rollback, cutover — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-stability
  - improve-database
  - improve-techstack
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "migration plan improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-migration` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user มี migration (schema, framework, infra, dependency major bump, cutover) และถามว่า "ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-migration` — backward compatibility, data integrity, rollback, cutover, dependencies, framework, infrastructure, feature flags
- schema/query perf ของ DB โดยไม่ใช่ migration plan → `/improve-database`; dependency upgrade ทั่วไป → `/improve-techstack`; crash/recovery กว้าง → `/improve-stability`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ migration plan/changes ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-migration` — missing rollback path, no feature flag, breaking API/schema change, untested cutover, data-loss window
3. รวบรวม prioritized list พร้อม severity และ evidence — data-loss risks เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-migration`)
2. ทุก migration ต้องมี rollback strategy ที่ test ได้ — ห้าม two-way door เมื่อข้อมูลเสียหายถาวร
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-migration`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม accept migration plan ที่ไม่มี rollback หรือ cutover checklist
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized migration improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` — rollback + cutover ครบ
