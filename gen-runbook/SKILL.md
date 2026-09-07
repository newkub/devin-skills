---
name: gen-runbook
description: สร้าง operational runbook จาก system knowledge จริง — alerts, playbooks และ recovery steps
argument-hint: "[service-or-incident-type]"
related:
  - learn-codebase
  - create-report-in-dot-devin
  - review-observability
  - review-stability
  - report-architecture-diagram
  - report-table
---

## Goal

สร้าง operational runbook จาก codebase และ config จริง — เอกสารที่ oncall/ops ใช้ตอนระบบมีปัญหา: symptoms, diagnosis steps, mitigations, escalation

## Scope

- ครอบคลุม: service overview, dependencies, common failure modes, diagnosis procedures, mitigation/rollback steps, escalation contacts
- สร้างจาก: architecture, deploy config, monitoring setup, past incidents (ถ้ามี), code structure
- Output: runbook doc ใน `.devin/` หรือ `docs/` — ไม่แก้ code

## Execute

### 1. Map The System

> Goal: เข้าใจระบบที่จะเขียน runbook

1. ทำ `/learn-codebase` หรือ `/scan-codebase` — services, dependencies, data stores
2. ทำ `/report-architecture-diagram` ถ้าต้องการ visual overview
3. ระบุ deploy targets, environments, external dependencies

### 2. Identify Failure Modes

> Goal: รวบรวมวิธีที่ระบบพังได้

1. จาก `/review-stability` findings — error handling, resilience gaps
2. External dependencies: DB down, API limits, queue backlog, cert expiry, DNS issues
3. App-level: memory leaks, deadlocks, bad deploys, config errors
4. จัดกลุ่มเป็น incident types: `outage`, `degraded`, `data-issue`, `security`

### 3. Write Runbook Structure

> Goal: สร้าง runbook ที่ใช้ตอน panic ได้จริง

```markdown
# Runbook: <service>

## Quick Reference
- Dashboard: <url>, Logs: <where>, Deploy: <how>
- Escalation: <who/channel>

## Service Overview
- What it does, critical paths, SLA

## Dependencies
- <dep> — ถ้าตาย: <symptom + mitigation>

## Incident Playbooks

### <Incident Type>: <symptom>
**Detect**: <alert/signal>
**Diagnose**: <steps ตรวจหาสาเหตุ — logs, metrics, queries>
**Mitigate**: <ขั้นตอนแก้ — restart, rollback, failover>
**Rollback**: <ถ้าแก้ไม่ได้>
**Escalate**: <เมื่อไหร่และใคร>

## Common Operations
- Deploy, rollback, scale, secrets rotation

## Post-Incident
- Postmortem template, action items tracking
```

4. เติม commands จริงที่ copy-run ได้ — ไม่ใช่ "check the logs" ลอยๆ

### 4. Validate Against Reality

> Goal: runbook ต้องทำตามได้จริง

1. ทุก command/path/query ต้อง verify ว่ามีจริงใน repo/config
2. ระบุ placeholders ชัดเจนสำหรับสิ่งที่ user ต้องเติม (contacts, URLs ที่ไม่มีใน code)
3. ตรวจว่า mitigation steps ไม่ destructive โดยไม่เตือน

### 5. Report

> Goal: ส่งมอบ runbook พร้อม gaps

1. บันทึกด้วย `/create-report-in-dot-devin` หรือ `docs/runbook-<service>.md`
2. ใช้ `/report-table` สรุป: sections ที่ครบ vs ที่ต้อง user เติม
3. แนะนำ `/review-observability` ถ้า diagnosis steps ขาด signals ที่ต้องมี

## Rules

### 1. Runnable Steps

- ทุก diagnosis/mitigation step ต้องทำได้จริง — commands ที่ verify แล้ว
- ห้ามเขียน generic advice — runbook คือ executable doc

### 2. Evidence-Based

- failure modes จาก code/config/findings จริง — ไม่เดา incident types
- ระบุ `[TODO: ...]` สำหรับข้อมูลที่ไม่มีใน repo (contacts, external dashboards)

### 3. Safety First

- mitigation steps ที่ destructive (rollback, restart, failover) ต้องมี warnings และ confirm points
- escalation paths ชัดเจน — runbook ไม่ใช่ทำเองทุกอย่าง

## Expected Outcome

- Runbook ที่ oncall ใช้ได้จริงตอน incident
- Playbooks ต่อ failure mode พร้อม runnable steps
- Gaps ที่ต้องเติม (contacts, dashboards) ระบุชัดเจน
