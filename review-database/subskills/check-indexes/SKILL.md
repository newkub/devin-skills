---
name: review-database-check-indexes
description: Check index coverage — missing/unused indexes, query patterns, N+1 signals
argument-hint: "[schema-or-scope]"
related:
  - review-database
  - run-drizzle-studio
  - report
---

## Goal

Run the indexes/queries dimension of `/review-database` แบบ focused — indexes ตรง query patterns จริง ไม่ขาดไม่เกิน

## Scope

- ใช้เมื่อ `/review-database` dispatch มาที่ `indexes`/`queries` หรือเรียก standalone
- ครอบคลุม: missing indexes, unused/duplicate indexes, composite ordering, covering, query patterns (N+1, offset pagination, `SELECT *`)

## Execute

### 1. Index Coverage

> Goal: ทุก hot query มี index รองรับ — parent Execute §3

ทำตาม `../../subagents/database-reviewer/checklist.md` (index/query section)

1. missing — WHERE/JOIN/ORDER BY columns ที่ไม่มี index (เทียบ query log/code จริง)
2. unused/duplicate — indexes ที่ไม่มี query ใช้, overlapping composite indexes
3. composite ordering — column order ตาม selectivity + query pattern
4. partial/covering — opportunities บน filtered queries (`deleted_at`, status)

### 2. Query Pattern Signals

> Goal: patterns ที่ทำ index ไม่ทำงาน

1. functions บน indexed column ใน WHERE, leading-wildcard LIKE, implicit casts
2. N+1 signals — loops ที่ query per item, missing eager loads
3. offset pagination บนตารางใหญ่, queries ขาด `LIMIT`

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Table/Index`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — index changes ผ่าน migrations; apply → `../optimize-queries/SKILL.md`
- ทุก finding มี evidence: migration/schema line + query call site หรือ query-log entry
- missing index บน hot path = High; unused index = Low-Medium

## Expected Outcome

- Index gaps + unused index list พร้อม evidence
- Query-pattern issues ที่ทำ index ใช้ไม่ได้ flagged แยก
