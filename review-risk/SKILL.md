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

Review project, plan, or implementation risks เพื่อระบุความเสี่ยงทั้งหมด ประเมิน probability และ impact ตรวจสอบ mitigation และ rollback แล้วสรุป risk score

## Scope

ใช้ก่อน execute plan, migration, deploy หรือตรวจ project ใดๆ:
- ตรวจ risks ใน `.devin/plan/`, `AGENTS.md`, chat plan, หรือ code/workspace
- ครอบคลุม technical, schedule, security, compliance, business, operational, financial
- รองรับ target: `plan`, `project`, `deploy`, `migration`, หรือ default เป็น current workspace
- ส่งต่อให้ `review-plan`, `review-migration`, `review-deploy`, `review-security`, `review-compliance` เมื่อ target ชัดเจน

## Execute
### 1. Prepare Context

> Goal: เข้าใจ review target และ project context

1. ทำ `/scan-codebase`
2. ระบุ target จาก argument หรือ context
3. ถ้า target เป็น `plan`/`deploy`/`migration` → อ่าน target หรือเรียก review skill ที่เหมาะสม
4. ถ้าไม่พบ target → stop และ report

### 2. Identify Technical Risks

> Goal: ระบุ technical risks

1. ทำตาม [references/risk-checklist.md](references/risk-checklist.md) — Identify Technical Risks

### 3. Identify Schedule And Resource Risks

> Goal: ระบุ schedule และ resource risks

1. ทำตาม [references/risk-checklist.md](references/risk-checklist.md) — Identify Schedule And Resource Risks

### 4. Identify Security And Compliance Risks

> Goal: ระบุ security และ compliance risks

1. ทำตาม [references/risk-checklist.md](references/risk-checklist.md) — Identify Security And Compliance Risks

### 5. Identify Business And Operational Risks

> Goal: ระบุ business และ operational risks

1. ทำตาม [references/risk-checklist.md](references/risk-checklist.md) — Identify Business And Operational Risks

### 6. Assess Probability, Impact, Severity

> Goal: ประเมินแต่ละ risk ด้วยตัวเลขและระดับ

1. ทำตาม `references/risk-scoring.md`

### 7. Check Mitigation And Rollback

> Goal: ตรวจสอบ mitigation และ rollback ครบถ้วน

1. ทำตาม [references/risk-checklist.md](references/risk-checklist.md) — Check Mitigation And Rollback

### 8. Score And Report

> Goal: สรุป risk score และ prioritized actions

1. ทำตาม `references/scoring.md`
2. ทำ `/report-table` risk register: No., Risk, Category, Probability, Impact, Score, Severity, Mitigation
3. ทำ `/report-table` Risk Summary และ Action Items
4. แสดง go/no-go หรือ proceed-with-caution
5. ทำ `/suggest-next-action`

## Rules

### 1. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข target ระหว่าง review
- ถ้าต้องแก้ plan ให้ใช้ `plan` หรือ `deep-plan` หลัง review
- ถ้าต้องแก้ไข implementation ให้ใช้ `fix`, `resolve-errors`, หรือ `refactor` หลัง review
- ทุก finding ต้องมี evidence และ location

### 2. Evidence-Based Findings

- ใช้ `scan-codebase`, `grep`, `/report-config-files` สำหรับ verification
- ทุก risk ระบุ source (file, plan section, chat, assumption)
- จัดลำดับตาม severity: Critical → High → Medium → Low
- ห้ามสร้าง risk ที่ไม่มี evidence

### 3. Scoring

- คะแนนต่อ category: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Risk readiness score = (total score / total categories) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำปรับ mitigation หรือ scope ก่อน proceed
- คำนวณ individual risk score ตาม `references/risk-scoring.md`

### 4. Cross-Reference Discipline

- ถ้า target ชัดเจนเป็น `plan`, `deploy`, `migration`, `security`, `compliance` → เรียก review skill ที่เหมาะสม
- สรุป findings จาก cross-references เป็น risk register หน่วยเดียว
- ไม่สร้าง duplicate findings ระหว่าง review skills

### 5. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

- ใช้ /prioritize ถ้าจำเป็น

## Expected Outcome

- รายงาน Risk Register พร้อม category, probability, impact, score, severity, mitigation
- รายงาน Risk Summary พร้อม risk readiness score และ grade
- รายงาน Action Items เรียงตาม priority
- Go/no-go หรือ proceed-with-caution recommendation
- ไม่มี risks ที่สำคัญถูกมองข้าม
- ส่งต่อให้ skill ถัดไปผ่าน `/suggest-next-action`
