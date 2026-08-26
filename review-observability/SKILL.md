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
6. ทำ `/update-review-cli-and-run` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
7. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
8. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด

### 2. Metrics Review

Review metrics collection ครอบคลุม counter, gauge, histogram, summary, naming, labels — ดู `references/metrics.md`

> Goal: ครอบคลุมทุก metrics dimension

1. ตรวจสอบ metric types: counter, gauge, histogram, summary usage correctness
2. ตรวจสอบ metric naming: namespace, subsystem, name convention, units, snake_case
3. ตรวจสอบ labels: cardinality, high-cardinality label avoidance, label naming, default labels
4. ตรวจสอบ RED metrics: Rate, Errors, Duration สำหรับทุก service
5. ตรวจสอบ USE metrics: Utilization, Saturation, Errors สำหรับ resources
6. ตรวจสอบ business metrics: conversion, active users, revenue, custom KPIs
7. ตรวจสอบ metric exposure: `/metrics` endpoint, scrape config, push vs pull
8. Critical: missing critical metrics, high-cardinality label causing memory explosion, metric name collision
9. High: missing RED/USE metrics, inconsistent naming, missing business metrics, missing labels

### 3. Distributed Tracing Review

Review distributed tracing ครอบคลุม trace context, span propagation, sampling, instrumentation — ดู `references/tracing.md`

> Goal: ครอบคลุมทุก tracing dimension

1. ตรวจสอบ trace context propagation: W3C TraceContext, B3 propagation, baggage
2. ตรวจสอบ span creation: span naming, span attributes, span events, span links
3. ตรวจสอบ span propagation ข้าม service boundaries: HTTP headers, message queue metadata, database context
4. ตรวจสอบ sampling strategy: head-based, tail-based, rate-based, adaptive sampling
5. ตรวจสอบ instrumentation: auto-instrumentation, manual instrumentation, library instrumentation
6. ตรวจสอบ trace correlation: trace ID in logs, trace ID in metrics, trace ID in error reports
7. ตรวจสอบ trace backend: Jaeger, Zipkin, Datadog, Tempo, Honeycomb integration
8. Critical: missing trace context propagation, broken span chain, no trace correlation with logs
9. High: missing instrumentation on critical path, inconsistent span naming, missing sampling strategy

### 4. Structured Logging Review

Review structured logging ครอบคลุม log levels, format, context, correlation, retention — ดู `references/logging.md`

> Goal: ครอบคลุมทุก logging dimension

1. ตรวจสอบ log levels: debug, info, warn, error, fatal usage correctness, level filtering
2. ตรวจสอบ log format: JSON structured logging, timestamp format, field naming, consistency
3. ตรวจสอบ log context: request ID, user ID, tenant ID, trace ID, span ID correlation
4. ตรวจสอบ log content: no sensitive data (PII, secrets, tokens), PII scrubbing, field redaction
5. ตรวจสอบ log retention: retention policy, log rotation, archive strategy, hot/cold storage
6. ตรวจสอบ log aggregation: centralized logging, log shipping, index strategy
7. ตรวจสอบ log search: searchable fields, query capability, log exploration tooling
8. Critical: secrets in logs, PII exposure, no structured logging, no log correlation, silent failure
9. High: missing request ID, inconsistent format, missing log level, no centralized logging

### 5. Alerting Review

Review alerting ครอบคลุม alert rules, thresholds, routing, escalation, noise reduction — ดู `references/alerting.md`

> Goal: ครอบคลุมทุก alerting dimension

1. ตรวจสอบ alert rules: coverage, critical path alerts, SLO-based alerts, anomaly detection
2. ตรวจสอบ alert thresholds: static vs dynamic, burn rate, multi-window, multi-burn-rate
3. ตรวจสอบ alert routing: severity-based routing, team ownership, on-call schedule
4. ตรวจสอบ alert escalation: escalation policy, fallback responder, escalation timeout
5. ตรวจสอบ alert noise reduction: deduplication, grouping, silencing, maintenance window
6. ตรวจสอบ alert content: runbook link, context, severity, impact, actionable information
7. ตรวจสอบ alert testing: synthetic alert, alert simulation, alert drill
8. Critical: no alerting on critical path, alert storm, missing escalation, no runbook
9. High: missing SLO alert, alert fatigue, missing alert routing, no alert testing

### 6. Dashboards Review

Review dashboards ครอบคลุม coverage, layout, drill-down, freshness, access — ดู `references/dashboards.md`

> Goal: ครอบคลุมทุก dashboard dimension

1. ตรวจสอบ dashboard coverage: service overview, RED dashboard, USE dashboard, business dashboard, incident dashboard
2. ตรวจสอบ dashboard layout: logical grouping, time range, refresh interval, panel sizing
3. ตรวจสอบ dashboard drill-down: log drill-down, trace drill-down, metric drill-down, correlated views
4. ตรวจสอบ dashboard freshness: real-time vs cached, data staleness, refresh strategy
5. ตรวจสอบ dashboard access: role-based access, team ownership, public vs private
6. ตรวจสอบ dashboard documentation: panel description, query explanation, link to runbook
7. Critical: missing critical service dashboard, broken dashboard, no incident dashboard
8. High: missing drill-down, stale data, missing documentation, no team ownership

### 7. SLO And SLI Review

Review SLO/SLI/SLA ครอบคลุม definition, measurement, error budget, reporting — ดู `references/slo-sli.md`

> Goal: ครอบคลุมทุก SLO/SLI dimension

1. ตรวจสอบ SLI definition: indicator selection, measurement method, valid events, total events
2. ตรวจสอบ SLO definition: target percentage, window (rolling, calendar), user journey mapping
3. ตรวจสอบ error budget: budget calculation, budget burn rate, budget policy, budget enforcement
4. ตรวจสอบ SLA definition: external commitment, penalty clause, internal SLO vs external SLA gap
5. ตรวจสอบ SLO reporting: report cadence, report audience, report content, trend tracking
6. ตรวจสอบ SLO review: regular review cycle, SLO adjustment, user feedback integration
7. Critical: no SLO defined for critical service, SLO not measured, error budget exceeded without action
8. High: missing error budget policy, inconsistent SLI, no SLO reporting, no SLO review cycle

### 8. APM Integration Review

Review APM integration ครอบคลุม agent setup, auto-instrumentation, custom instrumentation, performance overhead — ดู `references/apm.md`

> Goal: ครอบคลุมทุก APM dimension

1. ตรวจสอบ APM agent setup: agent version, agent config, agent startup, agent health
2. ตรวจสอบ auto-instrumentation: HTTP, database, cache, message queue, framework coverage
3. ตรวจสอบ custom instrumentation: business transaction, custom span, custom metric
4. ตรวจสอบ performance overhead: agent overhead, sampling rate, memory usage, CPU usage
5. ตรวจสอบ APM data retention: retention period, data sampling, data storage cost
6. ตรวจสอบ APM alerting: error rate alert, latency alert, throughput alert, anomaly alert
7. Critical: APM agent not running, missing auto-instrumentation on critical path, APM overhead causing production issue
8. High: missing custom instrumentation, high overhead, missing APM alerting, no data retention policy

### 9. Incident Response Readiness Review

Review incident response readiness ครอบคลุม runbook, on-call, postmortem, chaos engineering — ดู `references/incident-response.md`

> Goal: ครอบคลุมทุก incident response dimension

1. ตรวจสอบ runbook: coverage, accuracy, step-by-step, link from alerts, regular update
2. ตรวจสอบ on-call setup: on-call schedule, primary/secondary, handoff process, on-call tooling
3. ตรวจสอบ incident declaration: severity level, declaration criteria, communication channel
4. ตรวจสอบ incident communication: status page, stakeholder update, customer communication
5. ตรวจสอบ postmortem: blameless postmortem, root cause analysis, action item tracking, postmortem template
6. ตรวจสอบ chaos engineering: chaos experiment, game day, fault injection, resilience testing
7. Critical: no runbook for critical alert, no on-call, no incident declaration process, no postmortem process
8. High: outdated runbook, missing chaos engineering, no action item tracking, no status page

### 10. Validate, Score And Report

ตรวจสอบ findings และรายงานผล

> Goal: findings ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score ตาม `references/scoring.md`
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

- คำนวณ review score เป็น percentage (0-100) — ดูสูตรใน `references/scoring.md`
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
