---
name: review-backend
description: Orchestrator backend review ครอบคลุม 7 sub-review workflows แบบ parallel
---

## Goal

Orchestrate backend review ครอบคลุม API, service, database, data flow, data fetching, data validation, integration ผ่าน 7 sub-review workflows แบบ parallel พร้อม validate findings และ review score

## Scope

ใช้สำหรับ backend review ทั้งหมด — เรียก sub-review workflows โดยตรง ไม่ทำ review เอง — ไม่รวม frontend, infrastructure, หรือ security reviews

## Execute

### 1. Prepare And Update Rules

> Goal: rules และ analyzers ครอบคลุมล่าสุด

- ทำ `/scan-codebase` เพื่อเข้าใจ backend structure และ stack
- ระบุ API framework, service patterns, database engine, data fetching library, validation library, integration points
- ทำ `/review-codebase-everything` เพื่ออัปเดต rules
- รัน `bunx ast-grep scan --inspect summary`
- ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 2. Run Backend Sub-Reviews

> Goal: ครอบคลุมทุก backend dimension แบบ parallel

ทำตาม references แต่ละ dimension:

- `api` → references/api.md
- `service` → references/service.md
- `database` → references/database.md
- `data-flow` → references/data-flow.md
- `data-fetching` → references/data-fetching.md
- `data-validation` → references/data-validation.md
- `integration` → references/integration.md

ข้าม sub-review ที่ไม่เกี่ยวข้องกับ project หรือพบ critical issues ให้หยุดทำ `/deep-validate` ก่อน

### 3. Validate And Report

> Goal: findings ถูก validate และรายงานเป็นตาราง

- ทำ `/deep-validate` เพื่อ validate findings
- จัดลำดับตาม severity: Critical → High → Medium → Low
- คำนวณ review score, dimension scores และ supplementary metrics ตาม references/scoring.md
- ทำ `/report` พร้อม `/report-table`
- ทำ `/suggest-next-action`

## Rules

1. Delegation
   - Orchestrator เรียก sub-review workflows โดยตรง
   - checklist ของแต่ละ dimension อยู่ใน `references/`
   - ข้าม dimension ที่ project ไม่มี
2. Skip Conditions
   - ข้าม API, service, database, data-flow, data-fetching, data-validation, integration ตามที่ project ไม่มี
3. Severity Classification
   - Critical: data loss, broken endpoint, unauthenticated endpoint, missing input validation, connection leak
   - High: missing rate limiting, N+1 query, missing DI, race condition
   - Medium: inconsistent naming, suboptimal schema
   - Low: cosmetic, documentation gap
4. Evidence-Based Findings
   - ทุก finding ต้องมี file path และ line number
5. Review Independence
   - ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
6. Formatting
   - ห้ามใช้ bold markers — ใช้ backticks
   - รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- Findings และ recommendations จาก 7 backend sub-review workflows
- Issues ที่พบถูก validate ตาม severity
- Review score ต่อ dimension และ overall ตาม references/scoring.md
- รายงานในแชทเป็นตาราง
- แนะนำ action ถัดไป
