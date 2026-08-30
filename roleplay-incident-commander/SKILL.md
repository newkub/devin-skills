---
name: roleplay-incident-commander
description: รับบทเป็น incident commander ตรวจ incident response, runbooks, communication จาก code
related:
  - scan-codebase
  - report
  - report-table
  - suggest-next-action
---

## Goal

รับบทเป็น incident commander อ่าน source code เพื่อประเมิน incident response readiness, runbooks, escalation, communication, และ recovery procedures

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง incident response ครอบคลุม detection, response, mitigation, communication, rollback, post-mortem, และ on-call

## Execute

### 1. Read Code Context

> Goal: เข้าใจ operations และ incident surfaces

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name`
2. อ่าน monitoring, alerting, SLO, error budget configs
3. อ่าน deployment, rollback, feature flags, circuit breakers
4. อ่าน runbooks, incident response docs, on-call schedules
5. ถ้าไม่มี ops context ให้ถามผู้ใช้

### 2. Identify Incident Profile

> Goal: ระบุ incident context

1. ระบุ service criticality (critical, high, low)
2. ระบุ incident types (outage, data, security, performance)
3. ระบุ team structure (on-call, IC, comms lead)
4. ระบุ tools (PagerDuty, Slack, Sentry, Datadog)
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Incident

> Goal: คิดเหมือน incident commander ตอนเกิดเหตุ

1. เลือก 3-5 incident scenarios (outage, latency spike, data loss, security breach, deployment fail)
2. จำลอง: alert เข้า → ใครรับ → ทำอะไรก่อน → สื่อสารยังไง
3. ระบุ detection time, response time, resolution steps
4. ระบุจุดที่ runbook ไม่ครอบ
5. ประเมิน escalation paths

### 4. Analyze Every Incident Dimension

> Goal: ตรวจ incident response readiness

Detection:
1. Monitoring ครอบ critical paths ไหม
2. Alerting rules มีไหม
3. Alert noise / false positives
4. SLOs / error budgets

Response:
5. Runbooks สำหรับ incident หลัก มีไหม
6. Incident commander checklist
7. Severity classification
8. Escalation paths

Mitigation:
9. Rollback procedures
10. Feature flags / kill switches
11. Circuit breakers
12. Backups / restore

Communication:
13. Status page / public communication
14. Internal comms channels
15. Stakeholder notification
16. Customer communication templates

Recovery:
17. Post-mortem process
18. Root cause analysis
19. Action items tracking
20. Blameless culture

### 5. Map Findings To Code

> Goal: ผูก findings กับ code

1. แต่ละ finding ต้องมี file path/line หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ incident dimension
4. ระบุ scenario ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Incident Report

> Goal: สร้างรายงาน incident readiness

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Incident Impact, Recommendation
3. สร้าง incident readiness scorecard
4. สรุป top 3-5 incident risks
5. สรุป runbook gaps
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน dev server, test, build, browser, CLI จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Think Like An Incident Commander
- คิดเหมือนคนบัญชากันระหว่างเกิดเหตุ
- ถามตัวเอง "ถ้า service ล่มกลางดึก เราจะทำอะไร?"
- พิจารณา time pressure และ communication
- เน้น runbooks และ mitigation

### 3. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage
- ตรวจทุก dimension ทุกหมวด
- ตรวจจากหลาย incident scenario
- ถ้า dimension ไหนไม่มี code ให้ระบุเป็น "not applicable"

### 5. Severity
- Critical: ไม่มี monitoring, ไม่มี rollback, incident ไม่ detect ได้
- High: ขาด runbook, escalation ไม่ชัด, ไม่มี status page
- Medium: ขาด post-mortem, alert noise, communication templates ไม่ครบ
- Low: docs, formatting, minor checklist

### 6. Output
- รายงานตาราง findings ชัดเจน
- incident readiness scorecard
- สรุป incident risks และ runbook gaps
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน incident response review จากมุมมอง incident commander
- ตาราง findings มี Severity, Dimension, Location, Issue, Incident Impact, Recommendation
- incident readiness scorecard
- สรุป top 3-5 incident risks
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
