---
name: review-by-data
description: Review จากมุมมอง data — analytics, tracking, pipelines, quality, dashboards
argument-hint: "[sub-role]"
related:
  - roleplay-stakeholder
  - review-by-stakeholder
  - review-by-product
  - review-by-engineer
  - review-database
  - review-observability
  - improve-observability
  - improve-database
  - report-table
  - suggest-next-action
  - scan-codebase
  - ask-me
---

## Goal

Review project จากมุมมอง data — หา tracking gaps, data quality issues, pipeline risks และ dashboard ที่ผิด

## Scope

ใช้เมื่อต้องประเมิน data strategy, analytics, pipelines หรือ metrics — ไม่แก้ code โดยตรง

ถ้ามาจาก `/roleplay-stakeholder` ให้ใช้ `sub-role` ที่ dispatcher ส่งมา

## Execute

### 1. Identify Persona

> Goal: รู้ persona ทีจะ review

1. ถ้ามี `sub-role` ให้ใช้ (data-analyst, data-engineer, financial-analyst)
2. ถ้าไม่มี → แสดง Persona Table แล้ว `/ask-me`
3. ถ้าไม่ชัด → ใช้ default `data-analyst`

### 2. Scan And Understand

> Goal: เข้าใจ data flow

1. ทำ `/scan-codebase` หา analytics events, schemas, dashboards
2. อ่าน data docs, metrics definitions ถ้ามี
3. ระบุ data sources, pipelines และ consumers

### 3. Roleplay Review

> Goal: หา data findings

1. ใช้ lens จาก Persona Table
2. หา evidence จาก code, config, docs
3. จัด findings ตาม severity

### 4. Report

> Goal: สรุป data findings

1. ทำ `/report-table` พร้อม metric และ impact
2. ระบุ top issues
3. ทำ `/suggest-next-action`

## Persona Table

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 1 | `data-analyst` | data quality, event tracking, metrics, dashboards |
| 2 | `data-engineer` | data pipelines, ETL, schema, data infrastructure |
| 3 | `financial-analyst` | pricing, burn, unit economics, financial impact |

## Rules

- ไม่แก้ code ระหว่าง review
- ทุก finding ต้องมี data/code evidence
- ถ้า role ไม่ชัด → ถามก่อน

- ใช้ /review-by-product ถ้าจำเป็น
- ใช้ /review-by-engineer ถ้าจำเป็น

## Expected Outcome

- รายงาน data findings
- Top issues พร้อม recommendation
- Severity ชัดเจน
- Next actions ผ่าน `/suggest-next-action`
