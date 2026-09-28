---
name: review-database-report-slow-queries
description: สร้าง slow-query report — per-query table พร้อม plan, index rec, impact
argument-hint: "[schema-or-scope]"
related:
  - review-database
  - report
  - create-report-in-dot-devin
  - run-drizzle-studio
---

## Goal

แปลง query findings ของ `/review-database` เป็น slow-query report — per-query table พร้อม plan summary และ index recommendation

## Scope

- ใช้เมื่อ `/review-database` dispatch มาที่ `slow-queries`/`report` หรือเรียก standalone กับ slow query log/EXPLAIN output ที่มีอยู่
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Collect Slow Queries

> Goal: list จาก evidence จริง

1. sources: slow query log, APM spans, pg_stat_statements หรือ equivalent
2. normalize: query pattern (parameterized), table, calls/day, avg/p95 time
3. ไม่มี data → ใช้ code-scan N+1/missing-index findings แทน แล้ว tag `code-derived`

### 2. Build Query Table

> Goal: ตารางที่เห็น impact ทันที

1. `No.`, `Query Pattern`, `Table`, `Calls`, `Avg/p95`, `Plan`, `Index Rec`, `Severity`
2. `Plan` = seq scan / index scan / nested loop จาก `EXPLAIN`
3. `Index Rec` = column(s) ที่ควร index หรือ rewrite suggestion

### 3. Summarize

> Goal: top offenders + fix route

1. top-5 ตาม total time (calls × avg)
2. quick wins: index-only fixes vs needs-rewrite
3. fix route → `../optimize-queries/SKILL.md`; migrations → parent `## Fix`

## Rules

- ทุก row มี evidence — query log หรือ `EXPLAIN` output; `code-derived` tag เมื่อมาจาก static analysis
- ห้ามเดา plan — ไม่มี `EXPLAIN` ให้ระบุ `unknown`
- artifact อยู่ใน `.devin/` — query text อาจ leak schema/data shape

## Expected Outcome

- Slow-query table พร้อม plan + index recommendation ต่อ query
- Top offenders by total time + quick-win list
