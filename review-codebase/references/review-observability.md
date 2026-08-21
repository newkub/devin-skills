---
name: review-observability
description: Review observability: metrics, logs, traces, alerts, dashboards, and SLOs
auto_execution_mode: 3
related:
  - /scan-codebase
  - /deep-validate
  - /validate
  - /report
  - /report-table
  - /suggest-next-action
  - /review-codebase
---

## Goal

Review observability ครอบคลุม metrics, logs, traces, alerts, dashboards, SLOs, และ incident response readiness พร้อม review score

## Scope

ใช้สำหรับ review observability setup — อยู่ภายใต้ `/review-codebase` เมื่อ review infrastructure ทั้งหมด — deployment, CI/CD, disaster recovery อยู่ใน `/review-codebase`

## Execute

### 1. Gather Context

รวบรวม context ก่อน review observability

> Goal: เข้าใจ observability stack และ requirements

1. ทำ `/scan-codebase` เพื่อหา observability config, SDK, exporters
2. ระบุ tools: `Prometheus`, `Grafana`, `OpenTelemetry`, `Datadog`, `Sentry`
3. ระบุ SLOs และ critical paths ที่ต้อง monitor

### 2. Metrics Review

ตรวจสอบ metrics

> Goal: metrics ครอบคลุม business และ technical signals

1. ตรวจสอบ business metrics: conversion, active users, error rate
2. ตรวจสอบ technical metrics: latency, throughput, resource usage
3. ตรวจสอบ metric labels, cardinality, naming conventions
4. ตรวจสอบ metric collection coverage บน critical paths

### 3. Logs Review

ตรวจสอบ logs

> Goal: logs ใช้ debug และ audit ได้

1. ตรวจสอบ log levels, structured logging, consistency
2. ตรวจสอบ sensitive data exposure (PII, secrets) ใน logs
3. ตรวจสอบ log retention, rotation, aggregation
4. ตรวจสอบ correlation IDs กับ traces

### 4. Traces and Alerts

ตรวจสอบ traces และ alerts

> Goal: สามารถ trace request และ alert ได้ทันเวลา

1. ตรวจสอบ distributed tracing: `W3C Trace Context`, span coverage
2. ตรวจสอบ alert rules: threshold, routing, alert fatigue
3. ตรวจสอบ dashboards: critical path, SLOs, error budget
4. ตรวจสอบ incident response runbooks, escalation paths

### 5. Validate and Report

> Goal: รายงาน observability findings

1. ทำ `/deep-validate`
2. ทำ `/validate`
3. ให้ severity, คำนวณ review score
4. ทำ `/report` พร้อม `/report-table`
5. ทำ `/suggest-next-action`

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
- ระบุ metric / log / trace ที่ขาด

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน observability findings
- Review score
- SLO/alert gap analysis
- Next actions
