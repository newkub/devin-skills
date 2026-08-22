---
name: roleplay-devops-engineer
description: รับบทเป็น DevOps/SRE มอง code ว่า deploy ง่ายไหม monitor ได้ไหม rollback ได้ไหม observability พอไหม
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - CD
  - RTO
  - SLO
  - SRE
  - USE
  - deploy
  - line
  - liveness
---

## Goal

รับบทเป็น DevOps/SRE engineer อ่าน source code แล้วประเมินว่า deploy ง่ายไหม, monitor ได้ไหม, rollback ได้ไหม, มี observability พอไหม, และ incident response พร้อมไหม

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง DevOps/SRE ครอบคลุม deployment, CI/CD, monitoring, observability, incident response, และ infrastructure โดย AI รับบทเป็น DevOps ประเมินจากการอ่าน source code

## Execute

### 1. Read Code Context
> Goal: Read Code Context

1. ทำ `/scan-codebase` หรือใช้ `read_file`, `grep_search`, `find_by_name`, `list_dir` เพื่อหา infra/deploy code
2. อ่าน CI/CD configs, Dockerfile, deployment scripts, infrastructure as code
3. อ่าน monitoring, logging, alerting, health checks, metrics
4. อ่าน config management, environment variables, secrets management
5. ถ้าหา infra code ไม่เจอ ให้ถามผู้ใช้

### 2. Identify DevOps Profile
> Goal: Identify DevOps Profile

1. ระบุ DevOps role (DevOps engineer, SRE, platform engineer, infra engineer)
2. ระบุ infrastructure type (cloud, on-prem, hybrid, serverless, containerized)
3. ระบุ deployment frequency (daily, weekly, monthly, on-demand)
4. ระบุ SLA/SLO targets (uptime, response time, error rate)
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Operational Scenarios
> Goal: Simulate Operational Scenarios

Goal reminder: คิดเหมือน DevOps ที่ต้องรับผิดชอบระบบจริง ไม่ใช่ dev ที่สนแค่ code ทำงาน

1. เลือก 3-5 operational scenarios (deploy new version, rollback, incident response, scale up, config change)
2. จำลอง step-by-step: DevOps ทำอะไร, ใช้ tool อะไร, มี automation ไหม, มี safety net ไหม
3. ระบุจุดที่ต้อง manual intervention และ risk ที่เกิดขึ้น
4. ระบุจุดที่ไม่มี rollback path
5. ประเมิน MTTR (Mean Time To Recovery) โดยประมาณ

### 4. Analyze Every DevOps Dimension
> Goal: Analyze Every DevOps Dimension

Deployment:

1. Deploy process: automated ไหม, มี pipeline ไหม, มี manual steps ไหม, มี approval gates ไหม
2. Deployment strategy: blue-green, canary, rolling, หรือ big bang, มี zero-downtime ไหม
3. Rollback capability: rollback ได้ไหม, อัตโนมัติไหม, ใช้เวลานานไหม, มี data migration rollback ไหม
4. Build reproducibility: build ซ้ำได้ไหม, มี lock files ไหม, มี deterministic builds ไหม
5. Artifact management: มี versioned artifacts ไหม, มี registry ไหม, มี retention policy ไหม

CI/CD:

6. Pipeline quality: มี lint, test, build, scan ใน pipeline ไหม, มี caching ไหม
7. Pipeline speed: ใช้เวลานานไหม, มี parallel jobs ไหม, มี bottleneck ไหม
8. Pipeline reliability: flaky tests มีไหม, มี retry ไหม, มี failure notification ไหม
9. Branch strategy: มี branching strategy ชัดไหม, มี protection rules ไหม, มี required reviews ไหม
10. Environment parity: dev/staging/prod เหมือนกันไหม, มี drift ไหม, มี IaC ไหม

Monitoring and Observability:

11. Metrics: มี application metrics ไหม, มี business metrics ไหม, มี RED/USE metrics ไหม
12. Logging: มี structured logging ไหม, มี log levels ไหม, มี correlation IDs ไหม, มี log retention ไหม
13. Tracing: มี distributed tracing ไหม, มี span context ไหม, มี sampling ไหม
14. Alerting: มี alerts ไหม, มี alert rules ชัดไหม, มี alert fatigue ไหม, มี escalation policy ไหม
15. Dashboards: มี dashboards ไหม, มี real-time ไหม, มี historical ไหม, มี SLO dashboards ไหม
16. Health checks: มี health endpoints ไหม, มี readiness/liveness probes ไหม, มี dependency checks ไหม

Incident Response:

17. Runbooks: มี runbooks ไหม, อัปเดตไหม, มี automated runbooks ไหม
18. Incident detection: ใช้เวลานานในการ detect incident ไหม, มี proactive monitoring ไหม
19. Incident communication: มี status page ไหม, มี stakeholder notification ไหม, มี post-mortem ไหม
20. Blameless culture: มี post-mortem process ไหม, มี action items tracking ไหม

Infrastructure:

21. Infrastructure as Code: มี IaC ไหม, มี version control ไหม, มี drift detection ไหม
22. Secret management: secrets เก็บปลอดภัยไหม, มี rotation ไหม, มี audit ไหม, ไม่มี hardcoded secrets ไหม
23. Resource management: มี resource limits ไหม, มี cost monitoring ไหม, มี auto-scaling ไหม
24. Security posture: มี network security ไหม, มี access control ไหม, มี vulnerability scanning ไหม
25. Backup and recovery: มี backups ไหม, มี restore testing ไหม, มี RPO/RTO ชัดไหม

### 5. Map Findings To Code
> Goal: Map Findings To Code

1. แต่ละ finding ต้องมี file path และ line number หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ dimension ที่เกี่ยวข้อง (deployment, CI/CD, monitoring, incident, infrastructure)
4. ระบุ operational scenario ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate DevOps Review Report
> Goal: Generate DevOps Review Report

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Operational Impact, Recommendation
3. สร้าง operational readiness scorecard: 5 dimensions, score 1-5
4. สรุป top 3-5 operational risks ที่ต้องแก้ก่อน
5. สรุป top 3-5 automation opportunities
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution

- ไม่รัน dev server, test, build, browser, CLI, หรือ script จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow เป็น `/review-codebase` หรือ `/run-build`

### 2. Think Like A DevOps Engineer

- คิดเหมือน DevOps ที่ต้องรับผิดชอบระบบจริง ไม่ใช่ dev ที่สนแค่ code ทำงาน
- ถามตัวเอง "ถ้าเราเป็น DevOps จะทำยังไง?" ทุก scenario
- พิจารณา DevOps หลายระดับ (junior, senior, SRE lead)
- คิดถึง on-call experience และ 3am incidents
- คิดถึง scale, reliability, และ cost

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path/line number หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence
- แยกหน้าที่ระหว่าง "missing" และ "inadequate"

### 4. Coverage

- ตรวจทุก dimension ทุกหมวด (deployment, CI/CD, monitoring, incident, infrastructure)
- ตรวจจากหลาย DevOps perspective
- ถ้า dimension ไหนไม่มี code ให้ตรวจ ให้ระบุเป็น "not applicable" ไม่ใช่ข้าม
- เน้น operational risks ที่กระทบ uptime และ MTTR

### 5. Severity

- Critical: ไม่มี rollback, ไม่มี monitoring, ไม่มี backups, deploy แล้วล่มได้
- High: มีแต่ manual deploy, ไม่มี alerts, ไม่มี health checks, MTTR นาน
- Medium: มี automation บางส่วน, มี monitoring บางส่วน, ขาด observability
- Low: polish, ขาด dashboards, ขาด runbooks บางจุด

### 6. Integration

- ถ้า operational review ซับซ้อน ให้ทำ `/deep-thinking` ก่อนเริ่ม
- ถ้าต้องการทบทวนมุมมองก่อนสรุป ให้ทำ `/pondering`
- ถ้าต้องการ scan deployment จริง ให้ใช้ `/review-codebase`
- ถ้าต้องการ scan CI/CD จริง ให้ใช้ `/review-codebase`
- ถ้าต้องการ scan monitoring จริง ให้ใช้ `/review-codebase`
- ถ้าต้องการ build จริง ให้ใช้ `/run-build`

### 7. Output

- รายงานตาราง DevOps findings ชัดเจน จัดกลุ่มตาม dimension
- operational readiness scorecard 5 dimensions
- สรุป operational risks และ automation opportunities
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน DevOps review จากมุมมอง DevOps/SRE ที่จำลองจาก source code
- ตาราง findings มี Severity, Dimension, Location, Issue, Operational Impact, Recommendation
- operational readiness scorecard: 5 dimensions, score 1-5
- ครอบคลุม 25 dimensions ครบ 5 หมวด (deployment, CI/CD, monitoring, incident, infrastructure)
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
