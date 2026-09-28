---
name: review-observability-setup-alerts
description: Setup alerting จากศูนย์ — symptom-based alerts, routing, runbooks, SLO burn-rate
argument-hint: "[service-or-scope]"
related:
  - review-observability
  - check-reference
  - report-before-after
  - ask-me
---

## Goal

สร้าง alerting จากศูนย์ตาม findings ของ `/review-observability` — เมื่อ service ไม่มี alerts เลยหรือ coverage ขาดทั้ง critical path

## Scope

- ใช้เมื่อ findings คือ "ไม่มี alerting" ไม่ใช่ "alerts ผิด" — tuning ของเดิมทำใน `../improve-observability/SKILL.md`
- ครอบคลุม: alert rules, thresholds, routing/escalation, runbook links, SLO burn-rate alerts

## Execute

### 1. Inventory Signals

> Goal: รู้ว่ามี signal อะไรให้ alert ได้

1. list metrics/logs/traces ที่มีอยู่ (จาก `../../references/metrics.md` inventory ของ parent)
2. critical user journeys ที่ต้อง cover — availability, error rate, latency
3. ถ้า signals ไม่มี → escalate ไป `../improve-observability/SKILL.md` (instrument ก่อน)

### 2. Create Alerts

> Goal: alert set minimal ที่ cover critical paths

1. symptom-based alerts ก่อน — user-facing impact (error rate >x%, p95 >y, availability <z)
2. burn-rate alerts บน SLOs ถ้ามี (fast/slow burn windows)
3. routing — alert ไปถูก team/channel, escalation path, severity mapping (page vs ticket)
4. runbook link ทุก actionable alert — สร้าง stub runbook ถ้าไม่มี

### 3. Verify

> Goal: alerts fire ได้จริง

1. trigger test condition (dry-run/simulated) — alert ส่งถึง destination จริง
2. ไม่มี duplicate/overlapping rules ที่ fire พร้อมกัน
3. `/report-before-after` — alert coverage ก่อน/หลัง

## Rules

- minimal set ก่อน — ห้ามสร้าง alerts ทุก metric (noise ฆ่า alerting)
- ทุก alert ต้องมี owner + action documented
- threshold เริ่มต้นหลวมกว่าที่คิด — tighten หลังมี data จริง
- user confirm ก่อน page-worthy alerts (on-call impact)

## Expected Outcome

- Critical paths มี symptom-based alerts ครบ
- Routing + runbooks + escalation ครบทุก alert
