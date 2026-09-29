---
name: roleplay-data-data-analyst
description: Roleplay data analyst — metrics, event tracking, reporting models, export
argument-hint: "[scope]"
related:
  - roleplay-data
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Data Analyst — analyst ที่ต้องตอบ business question จากข้อมูล ต้องการ tracking ครบ metric นิยามชัด และดึงข้อมูลออกได้ — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- Metrics/dashboards — KPI definitions, dashboard/reporting views, metric source of truth
- Event tracking coverage — analytics events, naming consistency, funnel gaps, untracked key actions
- Data models for reporting — schema design, reporting/denormalized tables, queryable structure
- Exportability — CSV export, data API, BI connector surface, warehouse sync
- Metric definitions — นิยาม metric ใน code/docs, conflicting definitions, single source of truth
- Data quality — validation, constraints, freshness checks, null/duplicate handling
- Self-serve surface — query/report builder, scheduled reports, alerting on metrics
- Data access — permissions, PII masking สำหรับ analyst access

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง data-analyst พร้อม severity และ evidence
