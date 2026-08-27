---
name: review-observability
description: Review observability ครอบคลุม metrics, tracing, logging, alerting, SLO/SLI, APM, dashboards
---

## Goal

Review observability ครอบคลุมทุก dimension ของ system observability พร้อม aggregate findings และ review score

## Scope

observability review สำหรับ: metrics collection, distributed tracing, structured logging, alerting, dashboards, SLO/SLI/SLA, OpenTelemetry, APM integration, incident response readiness

ไม่รวม stability review (ใช้ `/review-stability`) และ security review (ใช้ `/review-security`)

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ observability setup ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ observability setup, logging, monitoring, tracing
2. ระบุ metrics library (Prometheus, StatsD, OpenTelemetry Metrics), tracing library (OpenTelemetry, Jaeger, Zipkin, Datadog), logging library (pino, winston, structlog)
3. ระบุ APM tool (Datadog, New Relic, Sentry, AppSignal, Honeycomb), alerting platform (PagerDuty, Opsgenie, Slack)
4. ระบุ dashboard tool (Grafana, Datadog dashboards, Kibana), SLO/SLI definitions
5. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
6. ทำ `/update-review-codebase-cli-and-run` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
7. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
8. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด

### 2. Metrics Review

> Goal: ครอบคลุมทุก metrics dimension

Review metrics collection (types, naming, labels, RED/USE, business, exposure) and severity thresholds. See [references/metrics.md](references/metrics.md).

### 3. Distributed Tracing Review

> Goal: ครอบคลุมทุก tracing dimension

Review trace context propagation, span creation, cross-service propagation, sampling, instrumentation, correlation, and backend integration. See [references/tracing.md](references/tracing.md).

### 4. Structured Logging Review

> Goal: ครอบคลุมทุก logging dimension

Review log levels, format, context, content, retention, aggregation, search, and severity thresholds. See [references/logging.md](references/logging.md).

### 5. Alerting Review

> Goal: ครอบคลุมทุก alerting dimension

Review alert rules, thresholds, routing, escalation, noise reduction, content, and testing. See [references/alerting.md](references/alerting.md).

### 6. Dashboards Review

> Goal: ครอบคลุมทุก dashboard dimension

Review dashboard coverage, layout, drill-down, freshness, access, documentation, and severity thresholds. See [references/dashboards.md](references/dashboards.md).

### 7. SLO And SLI Review

> Goal: ครอบคลุมทุก SLO/SLI dimension

Review SLI/SLO/SLA definition, error budget, reporting, review cycle, and severity thresholds. See [references/slo-sli.md](references/slo-sli.md).

### 8. APM Integration Review

> Goal: ครอบคลุมทุก APM dimension

Review APM agent setup, auto-instrumentation, custom instrumentation, overhead, retention, alerting, and severity thresholds. See [references/apm.md](references/apm.md).

### 9. Incident Response Readiness Review

> Goal: ครอบคลุมทุก incident response dimension

Review runbook, on-call, incident declaration, communication, postmortem, chaos engineering, and severity thresholds. See [references/incident-response.md](references/incident-response.md).

### 10. Validate, Score And Report

ตรวจสอบ findings และรายงานผล

> Goal: findings ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score ตาม [references/scoring.md](references/scoring.md)
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

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

- คำนวณ review score เป็น percentage (0-100) — ดูสูตรใน [references/scoring.md](references/scoring.md)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก observability section
- รายงาน recommended actions พร้อม priority
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
