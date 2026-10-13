---
name: improve-offline
description: หา offline/PWA improvements — service worker, offline sync, install — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-web
  - optimize-cache
  - improve-realtime
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "offline/PWA improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-frontend + review-performance` (offline scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "offline-first/PWA ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-frontend` (offline scope) — service worker lifecycle/update flow, offline UI affordance, background sync queue, conflict when back online, install prompt/manifest
- `review-performance` (offline scope) — cache strategies (stale-while-revalidate ฯลฯ), precache size budget, versioned cache cleanup
- HTTP/cache header tuning → `/optimize-cache`; realtime reconnect/transport → `/improve-realtime`; general web → `/improve-web`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-frontend + review-performance` (offline scope) — SW ที่ไม่ cleanup version เก่า, sync queue ที่ทำข้อมูลหายเมื่อ restart
3. รวบรวม prioritized list พร้อม severity และ evidence — user data หายเพราะ offline queue ไม่ durable เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ทุก offline fix ต้องมี offline-mode test (network cut ระหว่าง flow จริง ไม่ใช่ mock อย่างเดียว) — ใช้ `/test-website` หรือ `/use-agent-browser`
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม cache Secrets/authorization headers — offline path ต้องไม่มี credential leak
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized offline/PWA improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม offline-mode tests
