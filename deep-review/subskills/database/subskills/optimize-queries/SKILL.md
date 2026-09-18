---
name: review-database-optimize-queries
description: Apply query findings — indexes, N+1, pagination — วัดผล before/after เสมอ
argument-hint: "[schema-or-scope]"
related:
  - review-database
  - review-performance
  - follow-lib-drizzle
  - run-drizzle-studio
  - run-test
  - report-before-after
---

## Goal

แก้ query findings จาก `/review-database` จริง — เพิ่ม/ลบ indexes, แก้ N+1, แก้ pagination และ query shapes — วัดผล before/after ด้วย `EXPLAIN` เสมอ

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้ — review/report-only โดย default
- ครอบคลุม: missing/unused indexes, N+1 queries, offset pagination บนตารางใหญ่, `SELECT *`, missing LIMIT
- migration issues → `subskills/fix-migrations/SKILL.md`; multi-domain fix → `/deep-review-then-fix`

## Execute

### 1. Baseline

> Goal: เก็บตัวเลข performance เดิม

1. รวม slow queries จาก findings + slow query log — บันทึก query text, table, frequency
2. `EXPLAIN`/`EXPLAIN ANALYZE` ต่อ slow query — บันทึก plan และ cost เดิม
3. วัด query count/request บน endpoints ที่ findings ชี้ — baseline N+1
4. ทำบน dev/staging เท่านั้น — ห้ามรันหนักบน production

### 2. Fix N+1

> Goal: query count ลดลงจริง

1. แก้ N+1 ด้วย eager loading, joins หรือ batch loading ตาม ORM pattern (`/follow-lib-drizzle` ถ้าใช้ Drizzle)
2. verify query count ลดจริงต่อ request — ไม่ใช่แค่ code ดูดีขึ้น
3. ระวัง eager load เกิน — ดึงเฉพาะ relations/columns ที่ใช้

### 3. Fix Indexes

> Goal: indexes ตรง query patterns จริง

1. เพิ่ม index ตาม WHERE/JOIN/ORDER BY ที่มี evidence — composite index เรียง column ตาม selectivity
2. ลบ unused indexes ที่ findings ชี้ — ทุก index มี write cost
3. ทุก index change ผ่าน migration files เท่านั้น — ห้ามแก้ DB ตรงๆ
4. partial/covering index เฉพาะเมื่อ evidence รองรับ — รายละเอียดดู official docs ของ DB

### 4. Fix Query Shapes

> Goal: queries ประหยัดและ scale ได้

1. เลือกเฉพาะ columns ที่ใช้ — ตัด `SELECT *`
2. แก้ offset pagination บนตารางใหญ่ → keyset/cursor pagination
3. เพิ่ม LIMIT บน queries ที่ขาด และทำ transactions ให้สั้น
4. เลี่ยง functions บน indexed column ใน WHERE — ทำ index ใช้ไม่ได้

### 5. Measure And Verify

> Goal: เร็วขึ้นตามตัวเลขและไม่มี regression

1. `EXPLAIN` ซ้ำ compare กับ baseline — seq scan → index scan, cost ลดลง
2. `/run-test` ผ่าน — results เหมือนเดิมทุก query ที่แก้
3. `/report-before-after` — plan, cost, query count ก่อน/หลัง; regression → revert จุดนั้น

## Rules

- baseline ก่อนเสมอ — ห้าม optimize โดยไม่มีตัวเลขเดิม
- ทุก index change ผ่าน migrations เท่านั้น
- preserve results — optimize ≠ เปลี่ยน output หรือ ordering
- แก้ทีละจุดเรียง impact มาก → น้อย — ห้ามแก้หลายจุดพร้อมกันถ้าแยกผลไม่ได้
- fix-verify loop สูงสุด 3 รอบต่อ finding → ถ้าไม่ผ่าน stop และ report

## Expected Outcome

- slow queries เร็วขึ้นตาม `EXPLAIN` before/after
- ไม่มี N+1 บน endpoints ที่แก้ — query count ลดจริง
- report before/after ครบทุก finding พร้อม migrations ที่เพิ่ม

