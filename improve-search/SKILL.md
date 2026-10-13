---
name: improve-search
description: หา search improvements — relevance, ranking, retrieval quality, query UX — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-database
  - optimize-queries
  - improve-uxui
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "search improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-backend + review-frontend + review-performance` (search scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "search/retrieval ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-backend` (search scope) — index design, analyzer/tokenizer, stemming, synonym handling, retrieval recall
- `review-frontend` — query UX, autocomplete/suggest, faceting/filter, zero-result states
- `review-performance` (search scope) — ranking latency, pagination ของ result set, N+1 ใน enrich stage
- ranking quality มี metric ชัด → baseline ผ่าน `/optimize-queries` ก่อน; full-text query perf เป็น SQL → `/improve-database`; agent/RAG retrieval → `/improve-ai`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-backend + review-frontend + review-performance` (search scope)
3. รวบรวม prioritized list พร้อม severity และ evidence — relevance ที่ตก silent (query ล้มเหลวแบบ user ไม่รู้) เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. relevance/ranking fix ต้องมี query fixture set (golden queries) เทียบก่อน/หลัง — ห้ามจูนแบบไม่มี eval
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- เปลี่ยน ranking analyzer/index = schema-level change — ต้องมี rebuild/rollback path
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized search improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม golden-query eval
