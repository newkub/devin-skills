---
name: optimize-network
description: หา network optimization ใน scope — payload size, caching headers, HTTP/2, preload, waterfalls — รวม findings แล้วแก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - optimize-perf
  - optimize-bundle
  - improve-web
  - deep-review
  - deep-review-then-fix
  - follow-tool-lighthouse
  - follow-tool-unlighthouse
  - run-profiler
  - report-before-after
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "network optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-performance` เฉพาะ network layer เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "network ควร optimize อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-performance` (network scope) — payload sizes, cache headers (Cache-Control/ETag), HTTP/2+/compression, request waterfalls, connection reuse, preload/prefetch, API response weight
- bundle/asset content size → `/optimize-bundle`; server-side latency → `/optimize-perf`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-performance` scope network — missing compression, no cache headers บน static assets, waterfall requests, oversized API payloads, missing preconnect/preload
3. รวบรวม prioritized list พร้อม severity และ evidence — ใช้ `/follow-tool-lighthouse`/`/follow-tool-unlighthouse` network audits เป็น baseline

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. วัด baseline ก่อนแก้เสมอ — transfer size, request count, waterfall timing จาก Lighthouse/network panel
2. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-performance`) — แก้ทีละจุด impact มาก→น้อย
3. วัดซ้ำแล้ว `/report-before-after` — ถ้าไม่ดีขึ้น → revert
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-performance` (network scope)
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- optimize ≠ เปลี่ยน API contract — response shape ต้อง compatible; cache strategy ต้องไม่ serve stale data ที่ sensitive
- Cache headers ต้องถูกต่อ content type — immutable สำหรับ hashed assets เท่านั้น
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized network optimization list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม before/after network metrics
