---
name: review-observability-check-metrics
description: Check metrics — golden signals, cardinality, naming, business metrics coverage
argument-hint: "[scope]"
related:
  - review-observability
  - report
---

## Goal

Run the metrics dimension of `/review-observability` แบบ focused — golden signals ครบ cardinality คุมได้

## Scope

- ใช้เมื่อ `/review-observability` dispatch มาที่ `metrics` หรือเรียก standalone
- ครอบคลุม: RED/USE coverage, metric naming, label cardinality, business metrics

## Execute

### 1. Metrics Checks

> Goal: metrics ตอบคำถาม incident ได้

ทำตาม `../../references/metrics.md`

1. golden signals — RED (rate/errors/duration) หรือ USE (utilization/saturation/errors) ครบ critical paths
2. cardinality — labels ที่ unbounded (user_id, session_id) ทำ metrics explode
3. naming/units — consistent conventions, units ใน suffix
4. business metrics — key flows (signup, checkout) มี instrumentation

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Metric/Path`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix` หรือ `../improve-observability/SKILL.md`
- ทุก finding มี evidence: instrumentation call site หรือ missing coverage point
- critical path ไม่มี metrics = High; naming inconsistency = Low

## Expected Outcome

- Metrics coverage findings ต่อ critical path
- Cardinality risks flagged พร้อม label names
