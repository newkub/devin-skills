---
name: improve-observability
description: Apply observability fixes จาก review-observability — logs, metrics, traces, alerts, dashboards
argument-hint: "[scope]"
related:
  - review-observability
  - improve-stability
  - follow-service-signoz
  - use-subagents
  - run-check
  - run-test
  - report
  - suggest-next-action
---

## Goal

แก้ observability gaps ที่ `/review-observability` พบ — missing logs/metrics/traces, alert ไม่ครบ, debug ยาก — ให้ระบบ observable พอที่จะ diagnose incidents ได้จริง

## Scope

ใช้หลัง `/review-observability` มี findings — apply instrumentation จริงไม่ใช่ report-only

- ถ้า stability issues → `/improve-stability`; ถ้าใช้ SigNoz → `/follow-service-signoz`
- ถ้า scope ใหญ่หลาย services → dispatch ผ่าน `/use-subagents`

## Execute

### 1. Collect Findings

> Goal: รู้ว่ามองไม่เห็นอะไร

1. ทำ `/review-observability` หรืออ่าน findings เดิม
2. จัดกลุ่ม: logging, metrics, tracing, alerting, debugging experience
3. ระบุ incidents ที่ผ่านมาที่ debug ยาก — เหล่านั้นคือ gaps จริง

### 2. Fix Logging

> Goal: logs ใช้งานได้จริง

1. structured logging (JSON) — levels ถูกต้อง, request context (trace_id, user_id) propagate
2. error paths ทุกจุด log — พร้อม context เพียงพอ diagnose
3. ห้าม log secrets/PII — redact ที่ logger boundary

### 3. Fix Metrics

> Goal: golden signals ครบ

1. per-service: latency, traffic, errors, saturation (RED/USE) — ตาม stack conventions
2. business metrics ที่สำคัญ — queue depth, job success rate, external dep health
3. metrics naming/labels consistent — cardinality ไม่ explode

### 4. Fix Tracing

> Goal: request trace ข้าม services ได้

1. distributed tracing — spans ครบ critical paths, context propagate ข้าม boundaries
2. span attributes ที่มีค่า (user.id, error details) ไม่ใช่แค่ชื่อ
3. sampling strategy ที่เหมาะ — errors ต้องไม่ถูก drop

### 5. Fix Alerting

> Goal: alert มีความหมาย ไม่ noise

1. alerts ต่อ actionable conditions เท่านั้น — symptom-based (user impact) ไม่ใช่ cause-based
2. thresholds จาก baselines จริง — ไม่เดา
3. alert ทุกตัวมี runbook hint/owner — ไม่มี orphan alerts

### 6. Verify

> Goal: observable จริง

1. trigger test error → log/metric/trace/alert ปรากฏครบ
2. `/run-test` + `/run-check` ผ่าน — instrumentation ไม่ break app
3. hot path instrumentation overhead ต่ำ (sampling ถ้าจำเป็น)

### 7. Report

> Goal: ส่งมอบ

1. ทำ `/report` — signals added, alerts configured, debug scenarios now possible
2. ทำ `/suggest-next-action`

## Rules

### 1. Signal Over Noise

- ทุก log/metric/alert ต้องตอบคำถามจริง — ห้าม instrument มั่ว
- alert ต้อง actionable — ถ้าไม่มีใครทำอะไรกับมัน อย่าสร้าง

### 2. Context Propagation

- request_id/trace_id ต้องตาม request ข้ามทุก boundary — ไม่งั้น logs ไร้ประโยชน์
- เชื่อม logs↔traces↔metrics ด้วย shared identifiers

### 3. Privacy And Cost

- ห้าม log secrets, tokens, PII — redact ที่ source
- cardinality/volume ต้องคุม — observability ห้ามทำ bill พุ่ง

## Expected Outcome

- logs structured + contextual, metrics ครบ golden signals
- tracing ข้าม services ทำงานจริง
- alerts actionable พร้อม thresholds จาก evidence
- test incident ผ่าน end-to-end observability ได้จริง
