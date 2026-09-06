---
name: optimize-search
description: Optimize search performance — indexes, query plans, facets และ relevance tuning
argument-hint: "[feature-or-table]"
related:
  - optimize-queries
  - follow-lib-postgres
  - review-database
  - check-bottlenecks
  - report-before-after
---

## Goal

Optimize search features — full-text search, filtering, facets — ให้เร็วและ relevant ด้วย indexes ที่ถูก, query plans ที่ดี และ ranking ที่ tune แล้ว

## Scope

- ครอบคลุม: SQL full-text (Postgres `tsvector`/`pg_trgm`), LIKE patterns, dedicated engines (Meilisearch, Typesense, Elasticsearch) ถ้า project ใช้
- ครอบคลุม: index coverage, query formulation, facet counts, result ranking, N+1 ใน search results
- Action-oriented: แก้ queries/indexes จริง — วัด latency ก่อน-หลัง

## Execute

### 1. Measure Search Latency

> Goal: วัด performance ของ search paths ปัจจุบัน

1. หา search queries ใน code — `LIKE`, `ILIKE`, `tsvector`, search engine calls
2. จับเวลา queries จริงด้วย representative data size
3. `EXPLAIN ANALYZE` ดู plans — seq scans บน text columns = red flag

### 2. Diagnose Slow Patterns

> Goal: หาสาเหตุที่ช้า

1. **`LIKE '%x%'`**: leading wildcard ข้าม B-tree index — ต้อง trigram (`pg_trgm` + GIN)
2. **Missing FTS index**: `to_tsvector` คำนวณทุก query — ต้อง generated column + GIN index
3. **Facet counts**: `COUNT(*)` ต่อ filter แยกกัน — รวมหรือ approximate
4. **Ranking**: `ts_rank` ที่คำนวณทุก row — จำกัดด้วย candidate filter ก่อน
5. **N+1**: search results แล้ว fetch relations ทีละอัน

### 3. Apply Optimizations

> Goal: แก้ตาม pattern

1. **Trigram indexes**: `CREATE INDEX ... USING gin (col gin_trgm_ops)` สำหรับ ILKE/contains
2. **FTS**: generated `tsvector` column + GIN index + `tsquery` แทน LIKE chains
3. **Composite indexes**: columns ที่ filter ร่วมกันบ่อย — ทำ `/check-migrations` สำหรับ index migrations
4. **Facets**: precompute หรือ `FILTER` clauses แทน queries แยก
5. **Ranking**: limit candidates ก่อน rank, precomputed rank columns สำหรับ static weights
6. **Engine upgrade**: ถ้า requirements เกิน SQL (typo tolerance, synonyms, geo) → เสนอ dedicated engine ผ่าน `/ask-me`

### 4. Verify

> Goal: ยืนยันเร็วขึ้นและผลยังถูก

1. `EXPLAIN ANALYZE` เทียบก่อน-หลัง — seq scan หายไป
2. ทดสอบ result correctness — ranking/relevance ไม่เสีย
3. `/report-before-after` แสดง latency delta ต่อ query pattern

## Rules

### 1. Measure First

- มี EXPLAIN plans ก่อน-หลัง — ไม่เดา index
- ทดสอบกับ data volume ที่ใกล้ production

### 2. Relevance Preserved

- Performance fixes ต้องไม่ทำ results แย่ลง — verify result quality
- ระบุ trade-off ถ้าเร็วขึ้นแต่ relevant น้อยลง

### 3. Migration Safe

- Indexes ผ่าน migration files — GIN indexes ใหญ่ใช้ `CONCURRENTLY`
- ทำ `/verify-migration-data` ถ้ามี data changes

## Expected Outcome

- Search latency ลดลงพร้อม query plan evidence
- Indexes ครอบคลุม patterns ที่ใช้จริง
- ผลลัพธ์คง relevance เดิมหรือดีขึ้น
