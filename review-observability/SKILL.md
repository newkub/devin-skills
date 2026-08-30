---
name: review-observability
description: Review observability: metrics, tracing, logging, alerting, dashboards, SLO/SLI, APM, incidents
related:
  - review-stability
  - review-security
  - review-delivery
  - report-table
  - suggest-next-action
---

## Goal

Review observability ครอบคลุมทุก dimension ของ system observability พร้อม aggregate findings และ review score

## Scope

observability review สำหรับ: metrics collection, distributed tracing, structured logging, alerting, dashboards, SLO/SLI/SLA, APM integration, incident response readiness

ไม่รวม stability review (ใช้ `/review-stability`) และ security review (ใช้ `/review-security`)

## Execute

### 1. Prepare

> Goal: เข้าใจ observability setup ใน codebase

ทำตาม `references/prepare.md`

### 2. Metrics

> Goal: ครอบคลุมทุก metrics dimension

ทำตาม `references/metrics.md`

### 3. Tracing

> Goal: ครอบคลุมทุก tracing dimension

ทำตาม `references/tracing.md`

### 4. Logging

> Goal: ครอบคลุมทุก logging dimension

ทำตาม `references/logging.md`

### 5. Alerting

> Goal: ครอบคลุมทุก alerting dimension

ทำตาม `references/alerting.md`

### 6. Dashboards

> Goal: ครอบคลุมทุก dashboard dimension

ทำตาม `references/dashboards.md`

### 7. SLO/SLI

> Goal: ครอบคลุมทุก SLO/SLI dimension

ทำตาม `references/slo-sli.md`

### 8. APM

> Goal: ครอบคลุมทุก APM dimension

ทำตาม `references/apm.md`

### 9. Incident Response

> Goal: ครอบคลุมทุก incident response dimension

ทำตาม `references/incident-response.md`

### 10. Validate Score And Report

> Goal: findings ถูก validate และรายงานเป็นตาราง

ทำตาม `references/scoring.md`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี metrics collection → ข้าม Section 2
- ถ้า project ไม่มี distributed tracing → ข้าม Section 3
- ถ้า project ไม่มี logging → ข้าม Section 4
- ถ้า project ไม่มี alerting → ข้าม Section 5
- ถ้า project ไม่มี dashboards → ข้าม Section 6
- ถ้า project ไม่มี SLO/SLI → ข้าม Section 7
- ถ้า project ไม่มี APM → ข้าม Section 8
- ถ้า project ไม่มี incident response process → ข้าม Section 9

### 2. Severity Classification

- Critical: secrets in logs, no alerting on critical path, no SLO for critical service, APM agent down, no runbook, no on-call, missing trace propagation, broken dashboard
- High: missing RED/USE metrics, missing trace correlation, missing request ID, alert fatigue, missing drill-down, missing error budget, missing custom instrumentation, outdated runbook
- Medium: inconsistent metric naming, suboptimal sampling, missing log search, missing dashboard documentation, missing SLO reporting
- Low: cosmetic, documentation gap, minor naming

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ metric, span, log, alert, dashboard, SLO ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่ซ้ำกับ `/review-stability` — ใช้ workflow นั้นสำหรับ crash และ error handling
- ไม่ซ้ำกับ `/review-delivery` Section 8 — ใช้ workflow นี้สำหรับ observability เชิงลึก

### 5. Health Score

- คำนวณ review score เป็น percentage (0-100) — ดูสูตรใน `references/scoring.md`
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score

### 6. Formatting

- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก observability section
- รายงาน recommended actions พร้อม priority
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
