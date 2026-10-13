---
name: improve-collaboration
description: หา real-time collaboration improvements — CRDT/OT, presence, conflicts — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-realtime
  - improve-events
  - improve-data-validation
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "collaboration improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-frontend + review-backend` (sync scope) + `review-data-validation` (conflict scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "multi-user editing/collaboration ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-frontend` (collab scope) — optimistic update, remote cursor/selection UI, offline edit queue
- `review-backend` (collab scope) — CRDT/OT engine choice, merge semantics, document history, permission model ต่อ op
- `review-data-validation` (conflict scope) — op schema validation, causality checks, tombstone/merge correctness
- transport (WebSocket/SSE reconnect, heartbeat) → `/improve-realtime`; messaging semantics ทั่วไป → `/improve-events`; authz → `/improve-rbac`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-frontend + review-backend + review-data-validation` (collab scope) — last-write-wins ที่ควร merge, op หาย, presence leak
3. รวบรวม prioritized list พร้อม severity และ evidence — data loss จาก conflict resolution ผิดเป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ทุก conflict-resolution fix ต้องมี concurrent-edit test (2+ actor simult) — ห้ามพิสูจน์ด้วย single-user test
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้ามเปลี่ยน CRDT↔OT engine โดยไม่มี deep-impact analysis (`/deep-impact`)
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized collaboration improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม concurrent-edit tests
