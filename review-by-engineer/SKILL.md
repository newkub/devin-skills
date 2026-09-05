---
name: review-by-engineer
description: Review จากมุมมอง engineer — architecture, maintainability, onboarding, docs, scalability
argument-hint: "[sub-role]"
related:
  - roleplay-stakeholder
  - review-by-product
  - review-by-qa
  - review-by-security
  - improve-architecture
  - report-table
  - suggest-next-action
  - scan-codebase
  - ask-me
---

## Goal

Review project จากมุมมอง engineering — หา tech debt, architecture risks, maintainability gaps และ developer experience issues

## Scope

ใช้เมื่อต้องประเมิน technical quality, architecture, onboarding หรือ scalability — ไม่แก้ code โดยตรง

ถ้ามาจาก `/roleplay-stakeholder` ให้ใช้ `sub-role` ที่ dispatcher ส่งมา

## Execute

### 1. Identify Persona

> Goal: รู้ persona ทีจะ review

1. ถ้ามี `sub-role` ให้ใช้ (new-developer, staff-engineer, performance-engineer, devops-engineer, data-engineer, solutions-engineer, open-source-contributor, technical-writer)
2. ถ้าไม่มี → แสดง Persona Table แล้ว `/ask-me`
3. ถ้าไม่ชัด → ใช้ default `staff-engineer`

### 2. Scan And Understand

> Goal: เข้าใจ technical context

1. ทำ `/scan-codebase` หา architecture, dependencies, tests
2. อ่าน `README.md`, `AGENTS.md`, `docs/` ถ้ามี
3. ระบุ modules และ critical paths

### 3. Roleplay Review

> Goal: หา engineering findings

1. ใช้ lens จาก Persona Table
2. หา evidence จาก code, config, tests
3. จัด findings ตาม severity

### 4. Report

> Goal: สรุป engineering findings

1. ทำ `/report-table` พร้อม file/line evidence
2. ระบุ top issues
3. ทำ `/suggest-next-action`

## Persona Table

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 1 | `new-developer` | onboarding, missing docs, confusing code, context gaps |
| 2 | `staff-engineer` | architecture, tech debt, scalability trade-offs |
| 3 | `performance-engineer` | latency, throughput, resource usage, cost |
| 4 | `devops-engineer` | deployability, monitoring, rollback, observability |
| 5 | `data-engineer` | data pipelines, ETL, schema, data infrastructure |
| 6 | `solutions-engineer` | integration, scalability, ROI for enterprise |
| 7 | `open-source-contributor` | CONTRIBUTING, PR flow, community, license |
| 8 | `technical-writer` | docs, examples, discoverability, clarity |

## Rules

- ไม่แก้ code ระหว่าง review
- ทุก finding ต้องมี code/config evidence
- ถ้า role ไม่ชัด → ถามก่อน

- ใช้ /review-by-product ถ้าจำเป็น
- ใช้ /review-by-qa ถ้าจำเป็น
- ใช้ /review-by-security ถ้าจำเป็น
- ใช้ /improve-architecture ถ้าจำเป็น

## Expected Outcome

- รายงาน findings ทาง engineering
- Top issues พร้อม recommendation
- Severity ชัดเจน
- Next actions ผ่าน `/suggest-next-action`
