---
name: follow-lib-drizzle-optimize-queries
description: optimize Drizzle queries — indexes, relations, select/where performance
argument-hint: "[table-or-query]"
related:
  - follow-lib-drizzle
  - check-bottlenecks
  - run-bench
  - scan-codebase
  - report-before-after
---

## Goal

ปรับปรุง performance ของ Drizzle queries — indexes, relations, select/where patterns — โดยวัดผลก่อนและหลัง ไม่เปลี่ยน output

## Scope

- ใช้เมื่อ queries ช้า, N+1, missing indexes หรือ select เกินจำเป็น
- ครอบคลุม: index design, relational query tuning, select/where optimization, batching
- ต้องวัด baseline ก่อนเสมอ — optimize ที่ไม่มีตัวเลขคือ guessing

## Execute

### 1. Baseline And Profile

> Goal: ระบุ bottleneck จริงด้วยตัวเลข ไม่เดา

1. ทำ `/run-bench` หรือจับเวลา query ที่ช้า — เก็บ baseline (latency, row count, query count)
2. ใช้ `EXPLAIN ANALYZE` บน SQL ที่ generate (ดึง SQL จริงด้วย `.toSQL()`)
3. ทำ `/scan-codebase` หา call sites ที่รัน query ใน loop (N+1 candidates)
4. ทำ `/check-bottlenecks` ถ้าต้องวิเคราะห์ wider scope

### 2. Add Indexes

> Goal: index ครอบคลุม query patterns จริง

1. เพิ่ม `index()`/`uniqueIndex()` ใน schema บน columns ที่ filter (`where`), join, order by บ่อย
2. Composite index: เรียง column ตาม selectivity และ query pattern (equality ก่อน range)
3. Partial index (`index().where(...)`) เมื่อ query filter ค่าเดิมซ้ำๆ
4. Generate migration ผ่าน `subskills/migrate-schema/SKILL.md` — index ใหม่ต้องผ่าน migration เสมอ

### 3. Optimize Select And Where

> Goal: select เฉพาะที่ใช้, where ที่ index รับได้

1. ระบุ columns ชัดเจนใน `db.select({...})` แทน `select()` ทั้งตาราง — ลด bytes + enable covering index
2. เขียน `where` ให้ SARGable — หลีกเลี่ยง function ครอบ column (`lower(col)` ฯลฯ) เว้นแต่มี expression index
3. ใช้ `inArray`/`between`/`and`/`or` จาก `drizzle-orm` ให้ตรง index ที่มี
4. ใช้ `limit`+`offset` หรือ keyset pagination — offset ใหญ่ = scan สูญเปล่า

### 4. Fix Relations And N+1

> Goal: ลด N+1 ด้วย relational query หรือ join ที่เหมาะสม

1. ใช้ `db.query.<table>.findMany({ with: {...} })` แทน loop query ทีละ row
2. ระวัง `with` ที่ nested ลึก — แต่ละ level คือ query แยก; ถ้าใหญ่ให้แยกเป็น join query เดียว
3. ใช้ `columns: {...}` ใน relational query เพื่อจำกัด fields ของ parent และ child
4. Batch reads ด้วย `inArray` เมื่อต้อง fetch หลาย ids — ดู [../../references/api/queries.md](../../references/api/queries.md)

### 5. Measure Again

> Goal: compare กับ baseline และตัดสินใจ

1. วัดซ้ำจุดเดิมด้วย workload เดิม — report ตัวเลขก่อน/หลังด้วย `/report-before-after`
2. `EXPLAIN ANALYZE` ซ้ำ — ยืนยันว่า index ถูกใช้ (Index Scan แทน Seq Scan)
3. ถ้าไม่ดีขึ้นหรือ regression → revert จุดนั้นแล้ว report; ผ่าน → `/suggest-next-action`

## Rules

- Baseline ก่อนเสมอ — ห้าม optimize โดยไม่มีตัวเลขเปรียบเทียบ
- แก้ทีละจุดเรียง impact มาก → น้อย (index/query shape ก่อน micro-tuning)
- Preserve behavior — optimize ห้ามเปลี่ยน output ของ query
- Index ทุกตัวมี write cost — อย่าเพิ่ม index ที่ไม่มี query ใช้
- ถ้าไม่แน่ใจ index syntax → ดู official docs

## Expected Outcome

- Queries ช้าถูกระบุด้วย baseline และ `EXPLAIN ANALYZE`
- Indexes ครอบคลุม query patterns จริง ผ่าน migration
- N+1 ถูกแก้ด้วย relational query/batching
- ตัวเลขหลังแก้ดีกว่า baseline — report พร้อม evidence
