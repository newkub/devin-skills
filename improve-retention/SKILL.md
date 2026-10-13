---
name: improve-retention
description: หา data retention improvements — policy, archival, TTL, purge jobs — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-privacy
  - improve-compliance
  - improve-database
  - optimize-storage
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "data retention improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-compliance + review-database` (retention scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "retention/archival ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-compliance` (retention scope) — retention schedule ต่อ data class, legal hold, proof-of-deletion, cross-jurisdiction rules
- `review-database` (retention scope) — archival/partition strategy, purge job correctness, FK/orphan handling เมื่อลบตามรอบ, cold-tier access
- right to erasure/DSAR execution → `/improve-privacy`; policy ปลายทาง → `/improve-compliance`; DB size/cost อย่างเดียว → `/optimize-storage`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-compliance + review-database` (retention scope) — data เกินกำหนดเก็บโดยไม่มี purge, backup เก่ากว่า policy
3. รวบรวม prioritized list พร้อม severity และ evidence — เก็บ PII เกินกำหนด retention period เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ทุก purge/archive job ต้องมี dry-run + rollback path ก่อน apply — ห้าม destructive delete ข้าม dry-run
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm — แต่ destructive deletion ต้องผ่าน dry-run ก่อนเสมอ
- ห้ามลบข้อมูลที่ถูก legal hold แม้เลย retention date
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized retention improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม purge jobs ที่มี dry-run/rollback
