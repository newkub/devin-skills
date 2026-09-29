---
name: review-observability-check-alerting
description: Check alerting — actionable alerts, symptom-based, fatigue, runbook coverage
argument-hint: "[scope]"
related:
  - review-observability
  - report
---

## Goal

Run the alerting + incident response dimension of `/review-observability` แบบ focused — ทุก alert actionable ไม่มี noise

## Scope

- ใช้เมื่อ `/review-observability` dispatch มาที่ `alerting`/`alerts`/`incident` หรือเรียก standalone
- ครอบคลุม: alert rules, thresholds, routing, runbooks, alert quality/fatigue

## Execute

### 1. Alerting Checks

> Goal: alerts ปลุกเฉพาะเรื่องที่ต้อง act

ทำตาม `../../subagents/observability-reviewer/alerting.md` + `../../subagents/observability-reviewer/incident-response.md`

1. actionable — ทุก alert มี action ที่ชัด; symptom-based (user impact) ไม่ใช่ cause-based เท่านั้น
2. thresholds — static thresholds ที่ flap, missing burn-rate alerts บน SLOs
3. routing/ownership — alert ไปถูก team, escalation path มี, on-call handoff
4. runbooks — alert มี runbook link, incident response steps documented
5. fatigue signals — alerts ที่ fire บ่อยโดยไม่มี action (flapping, known-noise)

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Alert/Rule`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`; สร้าง alerts จากศูนย์ → `../setup-alerts/SKILL.md`
- ทุก finding มี evidence: alert rule config + fire history ถ้ามี
- missing alert บน critical path = High; noisy alert = Medium

## Expected Outcome

- Alert findings แยก missing/noisy/misconfigured
- Runbook + escalation coverage status
