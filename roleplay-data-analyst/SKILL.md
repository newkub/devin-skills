---
name: roleplay-data-analyst
description: รับบทเป็น data analyst ตรวจ data quality, event tracking, metrics, dashboards จาก code
related:
  - scan-codebase
  - report
  - report-table
  - suggest-next-action
---

## Goal

รับบทเป็น data analyst อ่าน source code เพื่อประเมิน data quality, event tracking, metrics definitions, dashboards, และ analytics pipeline ว่าถูกต้องและเชื่อถือได้หรือไม่

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง data analyst ครอบคลุม tracking, data model, metrics, reporting, data quality, privacy และ ETL/ELT pipelines

## Execute

### 1. Read Code Context

> Goal: เข้าใจ data flows

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name` เพื่อหา analytics code
2. อ่าน database schema, migrations, models, views
3. อ่าน event tracking calls, analytics SDK, metrics collection
4. อ่าน dashboards, reports, exports, ETL scripts
5. ถ้าหา analytics code ไม่เจอ ให้ถามผู้ใช้

### 2. Identify Analyst Profile

> Goal: ระบุ data context

1. ระบุ analyst focus (product, growth, operations, financial)
2. ระบุ data sources (events, DB, warehouse, third-party)
3. ระบุ key metrics and North Star
4. ระบุ privacy/sensitivity level
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Analysis Scenarios

> Goal: คิดเหมือน analyst ตอบคำถามธุรกิจ

1. เลือก 3-5 business questions (conversion, retention, revenue, active users, churn)
2. จำลอง: จะ query อะไร ใช้ table/field ไหน มี data ไหม
3. ระบุจุดที่ data ไม่พอ หรือ query ยาก
4. ระบุจุดที่ metrics อาจผิดจาก tracking หรือ transformation

### 4. Analyze Every Data Dimension

> Goal: ตรวจ data stack

Data Model:
1. Schema สะท้อน business concept ไหม
2. Primary/foreign keys, joins ถูกต้องไหม
3. Data types, nullability, defaults เหมาะสมไหม
4. Slowly changing dimensions จัดการไหม

Tracking and Events:
5. Event taxonomy มีไหม สม่ำเสมอไหม
6. Tracking calls อยู่จุดที่ถูกต้องหรือไม่
7. Identifiers / session / user stitching ถูกต้องไหม
8. Missing events หรือ duplicate events

Metrics and Reporting:
9. Metrics definitions ชัดเจนไหม
10. Dashboards มีไหม อัปเดตไหม
11. Funnels, retention, cohorts คำนวณถูกไหม
12. Aggregation level ถูกต้องไหม

Data Quality:
13. Validation rules มีไหม
14. Outliers / bad data detection
15. Freshness / staleness monitoring
16. ETL / pipeline error handling

Privacy and Governance:
17. PII / sensitive data ใน analytics
18. Consent / opt-out มีผลกับ data ไหม
19. Data retention / deletion
20. Access control ของ dashboards

### 5. Map Findings To Code

> Goal: ผูก findings กับ code

1. แต่ละ finding ต้องมี file path/line หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ data dimension ที่เกี่ยวข้อง
4. ระบุ business question ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Data Analysis Report

> Goal: สร้างรายงาน data gaps

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Analysis Impact, Recommendation
3. สร้าง data quality scorecard
4. สรุป top 3-5 data issues
5. สรุป metrics ที่ต้อง fix ก่อน
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน queries, ETL, dashboards จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Think Like A Data Analyst
- คิดเหมือนคนต้องการตอบคำถามธุรกิจด้วย data
- ถามตัวเอง "ถ้าต้องวัด metric นี้ จะหา data ได้จากไหน?"
- พิจารณา data quality ก่อน insight
- เน้น reproducibility และ trust

### 3. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage
- ตรวจทุก dimension ทุกหมวด
- ตรวจจากหลาย business question
- ถ้า dimension ไหนไม่มี code ให้ระบุเป็น "not applicable"

### 5. Severity
- Critical: metrics ผิด, data ขาด, tracking ไม่ทำงาน, decisions ผิดพลาดได้
- High: data quality ต่ำ, schema ไม่รองรับ question, dashboards ล้าหลัง
- Medium: missing events บางจุด, definitions ไม่ชัด
- Low: docs, naming, formatting

### 6. Output
- รายงานตาราง findings ชัดเจน
- data quality scorecard
- สรุป top data issues และ metrics ที่ต้อง fix
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน data analysis review จากมุมมอง data analyst
- ตาราง findings มี Severity, Dimension, Location, Issue, Analysis Impact, Recommendation
- data quality scorecard
- สรุป top 3-5 data issues
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
