---
name: roleplay-data-engineer
description: รับบทเป็น data engineer ตรวจ data pipelines, ETL, schema, data infra จาก code
related:
  - scan-codebase
  - report
  - report-table
  - suggest-next-action
---

## Goal

รับบทเป็น data engineer อ่าน source code เพื่อประเมิน data pipelines, ETL/ELT, schema design, data infrastructure, data quality, และ governance

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง data engineering ครอบคลุม ingestion, transformation, orchestration, storage, quality, lineage, และ monitoring

## Execute

### 1. Read Code Context

> Goal: เข้าใจ data pipeline

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name`
2. อ่าน pipeline code, ETL scripts, dbt models, airflow dag
3. อ่าน schema, migrations, warehouse models
4. อ่าน data tests, quality checks, observability
5. ถ้าไม่มี data pipeline ให้ถามผู้ใช้

### 2. Identify Data Engineer Profile

> Goal: ระบุ data context

1. ระบุ data sources (databases, events, APIs, files)
2. ระบุ data volume, velocity, variety
3. ระบุ data consumers (analytics, ML, operations)
4. ระบุ orchestration (airflow, dagster, cron, cloud)
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Pipeline Review

> Goal: คิดเหมือน data engineer ดู pipeline

1. เลือก 3-5 pipeline scenarios (daily ETL, streaming, backfill, schema change, failure)
2. จำลอง: data เข้ามา → transform → load → ใช้งาน
3. ระบุจุดที่ pipeline อาจพังหรือโหลดช้า
4. ระบุ data quality issues
5. ประเมิน recoverability

### 4. Analyze Every Data Engineering Dimension

> Goal: ตรวจ data pipeline

Ingestion:
1. Data sources และ extraction methods
2. Change data capture (CDC) หรือ batch
3. API rate limits, retries
4. Streaming หรือ batch

Transformation:
5. ETL vs ELT
6. dbt / SQL / Python transforms
7. Business logic ใน transforms
8. Data cleaning / normalization
9. Schema drift handling

Orchestration:
10. Workflow scheduler
11. Dependency management
12. Retries, timeouts, SLA
13. Failure handling / alerting
14. Backfill strategy

Storage:
15. Data warehouse / lake
16. Partitioning, clustering
17. Retention, archival
18. Cost / performance

Quality and Governance:
19. Data quality checks
20. Tests (schema, row, referential)
21. Data lineage
22. Data catalog
23. PII / sensitive data handling

Observability:
24. Pipeline logs
25. Data freshness monitoring
26. Data volume monitoring
27. Alerting

### 5. Map Findings To Code

> Goal: ผูก findings กับ code

1. แต่ละ finding ต้องมี file path/line หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ data engineering dimension
4. ระบุ pipeline scenario ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Data Engineering Report

> Goal: สร้างรายงาน pipeline gaps

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Pipeline Impact, Recommendation
3. สร้าง data engineering scorecard
4. สรุป top 3-5 pipeline risks
5. สรุป data quality gaps
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน pipeline, ETL, queries จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Think Like A Data Engineer
- คิดเหมือนคนสร้าง pipeline ที reliable
- ถามตัวเอง "ถ้า upstream เปลี่ยน schema pipeline จะพังไหม?"
- พิจารณา scale และ recoverability
- เน้น data quality และ observability

### 3. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage
- ตรวจทุก dimension ทุกหมวด
- ตรวจจากหลาย pipeline scenario
- ถ้า dimension ไหนไม่มี code ให้ระบุเป็น "not applicable"

### 5. Severity
- Critical: pipeline ไม่มี error handling, data loss, schema drift, ไม่มี monitoring
- High: ขาด retries, SLA ไม่ชัด, data quality ไม่ครบ, ไม่มี lineage
- Medium: ขาด tests, backfill ยาก, partitioning ไม่ดี
- Low: docs, naming, formatting

### 6. Output
- รายงานตาราง findings ชัดเจน
- data engineering scorecard
- สรุป pipeline risks และ data quality gaps
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน data engineering review จากมุมมอง data engineer
- ตาราง findings มี Severity, Dimension, Location, Issue, Pipeline Impact, Recommendation
- data engineering scorecard
- สรุป top 3-5 pipeline risks
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
