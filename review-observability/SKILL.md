---
name: review-observability
description: "Review observability: metrics, tracing, logging, alerting, dashboards, SLO/SLI, APM, incidents"
argument-hint: "[scope]"
related:
  - review-stability
  - review-security
  - review-delivery
  - report
  - suggest-next-action
  - run-review
  - use-subagents
---

## Goal

Review observability ครอบคลุมทุก dimension ของ system observability พร้อม aggregate findings และ review score

## Scope

observability review สำหรับ: metrics collection, distributed tracing, structured logging, alerting, dashboards, SLO/SLI/SLA, APM integration, incident response readiness

ไม่รวม stability review (ใช้ `/review-stability`) และ security review (ใช้ `/review-security`)

## Execute

### 1. Prepare

> Goal: เข้าใจ observability setup ใน codebase

ทำตาม `subagents/observability-reviewer/prepare.md`

### 2. Metrics

> Goal: ครอบคลุมทุก metrics dimension

ทำตาม `subagents/observability-reviewer/metrics.md`

### 3. Tracing

> Goal: ครอบคลุมทุก tracing dimension

ทำตาม `subagents/observability-reviewer/tracing.md`

### 4. Logging

> Goal: ครอบคลุมทุก logging dimension

ทำตาม `subagents/observability-reviewer/logging.md`

### 5. Alerting

> Goal: ครอบคลุมทุก alerting dimension

ทำตาม `subagents/observability-reviewer/alerting.md`

### 6. Dashboards

> Goal: ครอบคลุมทุก dashboard dimension

ทำตาม `subagents/observability-reviewer/dashboards.md`

### 7. SLO/SLI

> Goal: ครอบคลุมทุก SLO/SLI dimension

ทำตาม `subagents/observability-reviewer/slo-sli.md`

### 8. APM

> Goal: ครอบคลุมทุก APM dimension

ทำตาม `subagents/observability-reviewer/apm.md`

### 9. Incident Response And Alert Quality

> Goal: ครอบคลุม incident response + alerts actionable พร้อม error budgets

ทำตาม `subagents/observability-reviewer/incident-response.md` แล้วตรวจ:

1. SLO/SLI + error budgets ต่อ service — budget burn-rate alerts
2. alert fatigue — ratio actionable:total alerts, runbook link ทุก alert
3. alert ownership — ทุก alert มี owner, escalation path, dedup/grouping

### 10. Validate Score And Report

> Goal: findings ถูก validate และรายงานเป็นตาราง

ทำตาม `subagents/observability-reviewer/scoring.md`

### Subskills
| `metrics` — golden signals, cardinality, business metrics | `subskills/check-metrics/SKILL.md` |
| `logging`, `logs` — structured logs, context, redaction | `subskills/check-logging/SKILL.md` |
| `alerting`, `alerts`, `incident` — actionable alerts + runbooks | `subskills/check-alerting/SKILL.md` |
| `slos`, `report-slos` — SLO/SLI table + error budget | `subskills/report-slos/SKILL.md` |
| Setup alerting from zero — missing coverage (user confirm) | `subskills/setup-alerts/SKILL.md` |

> Goal: dispatch งาน improve ไปยัง subskill ที่ตรง topic

- observability findings (logging, metrics, tracing, alerts, SLO) → `subskills/improve-observability/SKILL.md`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี metrics collection → ข้าม Section 2
- ถ้า project ไม่มี distributed tracing → ข้าม Section 3
- ถ้า project ไม่มี logging → ข้าม Section 4
- ถ้า project ไม่มี alerting → ข้าม Section 5
- ถ้า project ไม่มี dashboards → ข้าม Section 6
- ถ้า project ไม่มี SLO/SLI → ข้าม Section 7
- ถ้า project ไม่มี APM → ข้าม Section 8
- ถ้า project ไม่มี incident response process → ข้าม incident-response checks ใน Section 9

### 2. Severity Classification

- Critical: secrets in logs, no alerting on critical path, no SLO for critical service, APM agent down, no runbook, no on-call, missing trace propagation, broken dashboard
- High: missing RED/USE metrics, missing trace correlation, missing request ID, alert fatigue, missing drill-down, missing error budget, missing custom instrumentation, outdated runbook
- Medium: inconsistent metric naming, suboptimal sampling, missing log search, missing dashboard documentation, missing SLO reporting
- Low: cosmetic, documentation gap, minor naming

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number (observability)
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ metric, span, log, alert, dashboard, SLO ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review (observability)
- ไม่ซ้ำกับ `/review-stability` — ใช้ workflow นั้นสำหรับ crash และ error handling
- ไม่ซ้ำกับ `/review-delivery` Section 8 — ใช้ workflow นี้สำหรับ observability เชิงลึก

### 5. Health Score

- ตาม `../shared/review-rules.md` — Health Score (score ตาม `subagents/observability-reviewer/scoring.md`)

### 6. Formatting

- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis (observability)
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report`
## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. logging: structured + request context (trace_id), error paths log ครบ, redact secrets/PII
2. metrics: golden signals (RED/USE), business metrics, controlled cardinality
3. tracing: spans ครบ critical paths, context propagation, error sampling
4. alerts: actionable + symptom-based + runbook owner — ห้าม noise
5. verify: trigger test error → log/metric/trace/alert ปรากฏ
## References

- [Full-dimension checklist](subagents/observability-reviewer/checklist.md)
- [Metrics](subagents/observability-reviewer/metrics.md)
- [Tracing](subagents/observability-reviewer/tracing.md)
- [Logging](subagents/observability-reviewer/logging.md)
- [Alerting](subagents/observability-reviewer/alerting.md)
- [Dashboards](subagents/observability-reviewer/dashboards.md)
- [SLO/SLI](subagents/observability-reviewer/slo-sli.md)
- [APM](subagents/observability-reviewer/apm.md)
- [Incident response](subagents/observability-reviewer/incident-response.md)
- [Scoring](subagents/observability-reviewer/scoring.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /use-subagents ถ้าจำเป็น

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก observability section
- รายงาน recommended actions พร้อม priority (observability)
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
