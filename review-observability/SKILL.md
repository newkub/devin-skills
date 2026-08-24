---
name: review-observability
description: Review observability, telemetry, and auditability: metrics, logs, traces, alerts, dashboards, SLOs
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - validate
  - suggest-next-action
---


## Goal

Review observability ครอบคลุม metrics, logs, traces, alerts, dashboards, SLOs, telemetry, auditability และ incident response readiness พร้อม review score

## Scope

ใช้สำหรับ review observability setup — อยู่ภายใต้ `/review-codebase` เมื่อ review infrastructure ทั้งหมด — deployment, CI/CD, disaster recovery อยู่ใน `/review-codebase`

## Execute

### 1. Gather Context

> Goal: เข้าใจ observability stack และ requirements

1. เรียก `/scan-codebase` เพื่อหา observability config, SDK, exporters
2. เรียก `/review-codebase` เพื่อรายละเอียดเพิ่มถ้ามี
3. ระบุ tools: `Prometheus`, `Grafana`, `OpenTelemetry`, `Datadog`, `Sentry`
4. ระบุ SLOs, SLIs และ critical paths ที่ต้อง monitor
5. ถ้าไม่พบ issues ที่เกี่ยวข้อง → หยุดและรายงาน

### 2. Metrics And Telemetry Review

> Goal: metrics และ telemetry ครอบคลุม business และ technical signals

1. ตรวจสอบ business metrics: conversion, active users, error rate
2. ตรวจสอบ technical metrics: latency, throughput, errors, resource usage
3. ตรวจสอบ telemetry collection: `OpenTelemetry`, `Prometheus`, `Datadog`
4. ตรวจสอบ metric labels, cardinality, naming conventions
5. ตรวจสอบ metric coverage บน critical paths

### 3. Logs Review

> Goal: logs ใช้ debug, audit และ correlation ได้

1. ตรวจสอบ log levels, structured logging, consistency
2. ตรวจสอบ correlation IDs และการเชื่อมกับ traces
3. ตรวจสอบ noise logs และ error logs ที่มี context ครบ
4. ตรวจสอบ sensitive data exposure (PII, secrets) ใน logs
5. ตรวจสอบ log retention, rotation, aggregation
6. ตรวจสอบ logging standards ตาม best practice

### 4. Traces Review

> Goal: สามารถ trace request ข้าม service ได้

1. ตรวจสอบ distributed tracing: `W3C Trace Context`, trace IDs, spans, baggage
2. ตรวจสอบ span coverage บน critical paths
3. ตรวจสอบ instrumentation สำหรับ critical paths
4. ตรวจสอบ failure propagation และบันทึกเป็น finding ถ้าพบ

### 5. Alerts, Dashboards And SLOs Review

> Goal: alert ทันเวลาและ dashboard สะท้อน SLOs

1. ตรวจสอบ alert rules: threshold, routing, alert fatigue
2. ตรวจสอบ dashboards: critical path, SLOs, error budget
3. ตรวจสอบ SLOs, SLIs และ error budget
4. ตรวจสอบ incident response runbooks, escalation paths
5. ตรวจสอบว่า alerts ครอบคลุม critical metrics และ critical paths

### 6. Auditability Review

> Goal: ตรวจสอบย้อนหลังได้และ audit logs ครบถ้วน

1. ระบุ events ที่ต้อง audit: user actions, data changes, security events
2. ตรวจสอบ audit logs มี timestamp, actor, action, result
3. ตรวจสอบ sensitive data logging และบันทึกเป็น finding ถ้าพบ

### 7. Validate And Report

> Goal: รายงาน observability findings

1. เรียก `/deep-validate`
2. เรียก `/validate`
3. ให้ severity, คำนวณ review score
4. เรียก `/report` พร้อม `/report-table`
5. เรียก `/suggest-next-action`

## Rules

### 1. Scope

- ไม่ review deployment / CI/CD — ใช้ `/review-codebase`
- ไม่ review debugging practices — ใช้ `/review-codebase`

### 2. Severity

- Critical: no monitoring on critical path, missing alert for critical metric, secrets in logs, no trace context propagation
- High: missing key metric, alert fatigue, no runbook, missing trace sampling
- Medium: inconsistent log format, missing log correlation, dashboard gap
- Low: minor metric naming, cosmetic dashboard improvement

### 3. Evidence

- ทุก finding ต้องมี config file หรือ dashboard link
- ระบุ metric / log / trace / audit event ที่ขาด

### 4. Review Independence

- เป็นการ review เท่านั้น ไม่แก้ไข code หรือ config โดยตรง
- ไม่เปลี่ยนแปลง environment หรือ production settings
- ทุก finding ต้องเป็น objective และมี evidence สนับสนุน

### 5. Formatting

- ห้ามใช้ bold markers
- ใช้ backticks สำหรับ `tools`, `commands`, `paths` และ skill references
- รายงานเป็นตารางด้วย `/report-table`
- ห้ามใช้ placeholder หรือ generic filler

## Expected Outcome

- รายงาน observability findings
- Review score
- SLO/alert gap analysis
- Auditability gap analysis
- Next actions

