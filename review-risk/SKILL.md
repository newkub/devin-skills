---
name: review-risk
description: Review project, plan, or implementation risks ครอบคลุม probability, impact, mitigation
argument-hint: "[target]"
related:
  - review-plan
  - review-migration
  - review-deploy
  - review-security
  - review-compliance
  - deep-plan
  - prioritize
  - report-table
  - suggest-next-action
  - scan-codebase
---

## Goal

Review project, plan, or implementation risks เพื่อระบุความเสี่ยงทั้งหมด ประเมิน probability และ impact ตรวจสอบ mitigation และ rollback แล้วสรุป risk score พร้อม prioritized action items

## Scope

ใช้ก่อน execute plan, migration, deploy, หรือตรวจสอบ project ใดๆ:

- ตรวจ risks ใน `.devin/plan/`, `AGENTS.md`, chat plan, หรือ code/workspace
- ครอบคลุม risk categories: technical, schedule, security, compliance, business, operational, financial
- รองรับ target: `plan`, `project`, `deploy`, `migration`, หรือ default เป็น current workspace
- ส่งต่อให้ `review-plan`, `review-migration`, `review-deploy`, `review-security`, `review-compliance` เมื่อ target ชัดเจน

## Execute

### 1. Prepare Context

> Goal: เข้าใจ review target และ project context

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure
2. ระบุ target จาก argument หรือ context: `plan`, `project`, `deploy`, `migration`, หรือ `workspace`
3. ถ้า target เป็น `plan` → อ่าน `.devin/plan/`, chat plan, หรือ `AGENTS.md`
4. ถ้า target เป็น `deploy` → ทำ `/review-deploy` หรือ `/run-preview` ก่อน
5. ถ้า target เป็น `migration` → ทำ `/review-migration` ก่อน
6. ถ้า project มี `AGENTS.md` ให้อ่านและทำตาม
7. ถ้าไม่พบ target หรือ context → stop และ report

### 2. Identify Technical Risks

> Goal: ระบุ technical risks

1. ตรวจ tech stack maturity, unproven libraries, breaking changes
2. ตรวจ integration points, dependencies, และ circular dependencies
3. ตรวจ scalability, performance bottlenecks, และ data migration risks
4. ตรวจ tech debt, legacy code, และ maintenance burden
5. ดูรายละเอียดใน [references/risk-categories.md](references/risk-categories.md)

### 3. Identify Schedule And Resource Risks

> Goal: ระบุ schedule และ resource risks

1. ตรวจ timeline realism, effort estimates, และ buffer
2. ตรวจ critical path, dependencies, และ bottlenecks
3. ตรวจ resource availability: team, environment, tools
4. ตรวจ scope creep และ undefined acceptance criteria
5. ดูรายละเอียดใน [references/risk-categories.md](references/risk-categories.md)

### 4. Identify Security And Compliance Risks

> Goal: ระบุ security และ compliance risks

1. ตรวจ vulnerabilities, secrets exposure, auth/authz gaps
2. ตรวจ supply chain risks, dependencies vulnerabilities
3. ตรวจ compliance: GDPR, CCPA, PDPA, HIPAA, SOC2, PCI-DSS
4. ตรวจ data privacy, encryption, audit trails
5. ถ้าจำเป็น → ทำ `/review-security` หรือ `/review-compliance` เพื่อรายละเอียด

### 5. Identify Business And Operational Risks

> Goal: ระบุ business และ operational risks

1. ตรวจ business value, user adoption, และ revenue impact
2. ตรวจ operational readiness: monitoring, alerting, on-call
3. ตรวจ deployment, rollback, และ incident response readiness
4. ตรวจ vendor lock-in, cost overrun, และ financial impact
5. ดูรายละเอียดใน [references/risk-categories.md](references/risk-categories.md)

### 6. Assess Probability, Impact, Severity

> Goal: ประเมินแต่ละ risk ด้วยตัวเลขและระดับ

1. กำหนด probability: `high`, `medium`, `low`
2. กำหนด impact: `high`, `medium`, `low`
3. คำนวณ risk score = probability × impact
4. จัดลำดับ severity: `Critical`, `High`, `Medium`, `Low`
5. ดูรายละเอียดใน [references/risk-scoring.md](references/risk-scoring.md)

### 7. Check Mitigation And Rollback

> Goal: ตรวจสอบ mitigation และ rollback ครบถ้วน

1. ตรวจ critical/high risks มี mitigation plan
2. ตรวจ mitigation plan สามารถลด probability หรือ impact ได้จริง
3. ตรวจ high-risk tasks มี rollback strategy หรือ fallback
4. ตรวจ assumptions ระบุชัดเจนและมีพื้นฐานจริง
5. ถ้า mitigation ไม่พอ → ระบุเป็น finding และแนะนำ action

### 8. Score And Report

> Goal: สรุป risk score และ prioritized actions

1. คำนวณ risk score รวมจาก [references/risk-scoring.md](references/risk-scoring.md)
2. ทำ `/report-table` พร้อม risk register: No., Risk, Category, Probability, Impact, Score, Severity, Mitigation
3. ทำ `/report-table` สรุป Risk Summary: Category, Status, Findings, Score
4. สร้างตาราง Action Items: No., Risk, Action, Owner, Priority
5. แสดง go/no-go หรือ proceed-with-caution recommendation พร้อมเหตุผล
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข target ระหว่าง review
- ถ้าต้องแก้ plan ให้ใช้ `plan` หรือ `deep-plan` หลัง review
- ถ้าต้องแก้ไข implementation ให้ใช้ `fix`, `resolve-errors`, หรือ `refactor` หลัง review
- ทุก finding ต้องมี evidence และ location

### 2. Evidence-Based Findings

- ใช้ `scan-codebase`, `Grep`, และ `/report-config-files` สำหรับ verification
- ทุก risk ระบุ source (file, plan section, chat, หรือ assumption)
- จัดลำดับตาม severity: Critical → High → Medium → Low
- ห้ามสร้าง risk ที่ไม่มี evidence

### 3. Scoring

- คะแนนต่อ category: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Risk readiness score = (total score / total categories) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำปรับ mitigation หรือ scope ก่อน proceed
- คำนวณ individual risk score ตาม [references/risk-scoring.md](references/risk-scoring.md)

### 4. Cross-Reference Discipline

- ถ้า target ชัดเจนเป็น `plan`, `deploy`, `migration`, `security`, `compliance` → เรียก review skill ที่เหมาะสมเพื่อไม่ซ้ำซ้อน
- สรุป findings จาก cross-references เป็น risk register หน่วยเดียว
- ไม่สร้าง duplicate findings ระหว่าง review skills

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Risk Register พร้อม category, probability, impact, score, severity, mitigation
- รายงาน Risk Summary พร้อม risk readiness score และ grade
- รายงาน Action Items เรียงตาม priority
- Go/no-go หรือ proceed-with-caution recommendation พร้อมเหตุผล
- ไม่มี risks ที่สำคัญถูกมองข้าม
- ส่งต่อให้ skill ถัดไปผ่าน `/suggest-next-action`
