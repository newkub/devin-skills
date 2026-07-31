---
name: review-data
description: Review data flow lineage, API-to-database mapping, API-to-client mapping, schema consistency, upstream/downstream impact
---

## Goal

Review data flow ครอบคลุม data lineage, mapping, schema consistency, transformation safety พร้อม health score

## Scope

data review สำหรับ: data flow lineage, API input/output schemas, database-to-API mapping, API-to-client mapping, transformation safety, schema consistency across layers, data pipeline, upstream/downstream impact, data caching, data freshness

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ data flow patterns ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ data flow structure
2. ระบุ data sources, data pipelines, caching layers, data transformation patterns ที่ใช้

### 2. Deep Analyze

> Goal: ครอบคลุมทุก data flow dimension พร้อม health score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ data flow patterns
2. ทำ `/update-codebase-health-cli` — `/update-codebase-health-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-codebase-health-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-health` เพื่อดึง metrics ล่าสุด

### 3. Data Flow And Mapping Review

> Goal: ครอบคลุม data flow, mapping, lineage

1. ตรวจสอบ data flow: API input → validation → service → database → response, data lineage tracking, data transformation chain
2. ตรวจสอบ database-to-API mapping: ORM mapping, serialization, field naming consistency (snake_case vs camelCase), type mapping, null handling in mapping
3. ตรวจสอบ API-to-client mapping: response shape, client-side transformation, type safety on client, data contract between API และ client
4. ตรวจสอบ transformation safety: type coercion risks, data loss in transformations, null propagation, default value handling, enum mapping, date/timezone conversion
5. ตรวจสอบ schema consistency: schema drift across layers, field name inconsistency, type inconsistency, optional/required mismatch

### 4. Data Pipeline And Caching Review

> Goal: ครอบคลุม data pipeline, caching, freshness

1. ตรวจสอบ data pipeline: data ingestion patterns, ETL safety, data backfill, batch vs streaming, pipeline error handling
2. ตรวจสอบ data caching: cache strategy (SWR, TTL, tag-based), cache invalidation, cache key design, cache stampede prevention, stale data risk
3. ตรวจสอบ data freshness: polling strategy, WebSocket updates, real-time data sync, stale-while-revalidate, background refresh
4. ตรวจสอบ upstream/downstream impact: breaking change propagation, consumer impact analysis, backward compatibility of data shape changes
5. Critical: data loss in transformation, schema mismatch causing runtime error, broken data pipeline, stale data ที่ก่อให้เกิด business error, cache stampede
6. High: inconsistent type mapping, missing cache invalidation, missing data contract, broken data lineage, unsafe timezone conversion

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ health score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-format-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี data pipeline → ข้าม Step 4 item 1
- ถ้า project ไม่มี caching → ข้าม Step 4 item 2
- ถ้า project ไม่มี real-time data → ข้าม Step 4 item 3

### 2. Severity Classification

- Critical: data loss in transformation, schema mismatch causing runtime error, broken data pipeline, stale data ที่ก่อให้เกิด business error, cache stampede
- High: inconsistent type mapping, missing cache invalidation, missing data contract, broken data lineage, unsafe timezone conversion
- Medium: suboptimal cache strategy, minor schema drift, inconsistent field naming, missing data freshness strategy
- Low: cosmetic, naming convention, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ data flow path, layer, หรือ transformation ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก data flow section
- Health score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
