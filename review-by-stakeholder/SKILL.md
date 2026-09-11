---
name: review-by-stakeholder
description: Review จากมุมมอง stakeholder/persona — roleplay lens หรือเก็บ feedback จริงเพื่อ prioritize
argument-hint: "[persona-or-area]"
related:
  - roleplay-stakeholder
  - review-uxui
  - review-business
  - review-architecture
  - review-test
  - review-gaps
  - capture
  - report
  - ask-me
  - suggest-next-action
  - scan-codebase
  - run-review
---

## Goal

Review project จากมุมมอง stakeholder — เลือก persona/sub-role แล้ว roleplay review หา findings พร้อม evidence หรือรวบรวม feedback จริงจาก stakeholder เพื่อ prioritize การปรับปรุง

merged from: review-by-engineer, review-by-product, review-by-data, review-by-designer, review-by-qa, review-by-user

## Scope

ใช้เมื่อต้อง review จากมุมมอง persona เฉพาะ (engineer, product, data, designer, QA, user) หรือเก็บ feedback จาก stakeholder จริง — ไม่แก้ code โดยตรง

ถ้ามาจาก `/roleplay-stakeholder` ให้ใช้ `sub-role` ที่ dispatcher ส่งมา

## Execute

### 1. Identify Persona

> Goal: รู้ persona ที่จะ review

1. ถ้ามี `persona-or-area` หรือ `sub-role` จาก argument → map เข้า Persona Table
2. ถ้าไม่มี → แสดง Persona Table แล้ว `/ask-me`
3. ถ้าไม่ชัด → ใช้ default `staff-engineer`
4. ถ้าต้อง run หลาย persona → ทำตาม `references/select-stakeholders.md` และ `references/run-stakeholder-reviews.md`

### 2. Scan And Understand

> Goal: เข้าใจ context ตาม lens ของ persona

1. ทำ `/scan-codebase` หา architecture, features, tests, analytics ตาม persona
2. อ่าน `README.md`, `AGENTS.md`, `docs/` ถ้ามี
3. ระบุ modules, critical paths และ flows ที่เกี่ยวกับ persona
4. ถ้า review กับ stakeholder จริง → รวบรวม evidence (screenshots จาก `/capture`, `agent-browser snapshot`, URLs, components, states)

### 3. Roleplay Review

> Goal: หา findings จากมุมมอง persona

1. ใช้ lens จาก Persona Table
2. หา evidence จาก code, config, docs, tests, screenshots
3. จัด findings ตาม severity: Critical, High, Medium, Low, Info

### 4. Present And Record Feedback (stakeholder จริง)

> Goal: ถาม stakeholder อย่างชัดเจนและบันทึก feedback — ข้ามถ้าเป็น roleplay เท่านั้น

1. ใช้ `/report` แสดง finding, evidence, proposed change — ถามเฉพาะจุดพร้อม options และ trade-offs
2. บันทึก feedback ตาม item พร้อม decision: accept, reject, defer, needs-design — ระบุ role และวันที่
3. ถ้าไม่ชัด → ใช้ `/ask-me` — ไม่เดา stakeholder intent

### 5. Prioritize

> Goal: เรียงลำดับ action items

1. ใช้ impact/effort matrix จัดลำดับตาม business value
2. ระบุ dependencies ระหว่าง items
3. ทำ checklist พร้อม acceptance criteria

### 6. Report

> Goal: สรุป findings และ next actions

1. ทำ `/report` พร้อม file/line หรือ visual evidence
2. ระบุ top 3-5 issues
3. ทำตาม `references/aggregate-findings.md` และ `references/generate-stakeholder-report.md` ถ้า run หลาย persona
4. ทำ `/suggest-next-action`

## Persona Table

### Engineering (merged from: review-by-engineer)

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 1 | `new-developer` | onboarding, missing docs, confusing code, context gaps |
| 2 | `staff-engineer` | architecture, tech debt, scalability trade-offs |
| 3 | `performance-engineer` | latency, throughput, resource usage, cost |
| 4 | `devops-engineer` | deployability, monitoring, rollback, observability |
| 5 | `solutions-engineer` | integration, scalability, ROI for enterprise |
| 6 | `open-source-contributor` | CONTRIBUTING, PR flow, community, license |
| 7 | `technical-writer` | docs, examples, discoverability, clarity |

### Product And Business (merged from: review-by-product)

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 8 | `product-manager` | feature completeness, priority, MVP fit, user needs gaps |
| 9 | `ceo` | business value, strategic risk, vision, investment |
| 10 | `growth-manager` | funnel, A/B tests, acquisition, retention |
| 11 | `marketing-manager` | messaging, positioning, SEO, content |

### Data (merged from: review-by-data)

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 12 | `data-analyst` | data quality, event tracking, metrics, dashboards |
| 13 | `data-engineer` | data pipelines, ETL, schema, data infrastructure |
| 14 | `financial-analyst` | pricing, burn, unit economics, financial impact |

### Design (merged from: review-by-designer)

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 15 | `ui-designer` | visual consistency, design system, interaction, spacing, color, typography |
| 16 | `ux-researcher` | research questions, pain points, bias, usability, research gaps |

### QA (merged from: review-by-qa)

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 17 | `qa-tester` | edge cases, boundary conditions, test scenarios, regressions |

### User And Support (merged from: review-by-user)

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 18 | `user` | ทำไมต้องใช้? onboarding ง่ายไหม? value proposition ชัดไหม? friction ตรงไหน? |
| 19 | `customer-success-manager` | health score, onboarding, churn, support gaps |
| 20 | `customer-support-agent` | ปัญหาที่ user ถามบ่อย, จุดที่ support ไม่มีคำตอบ, docs ที่ขาด |

### Stakeholder (จริง — ไม่ใช่ roleplay)

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 21 | `product-owner` | priority, acceptance criteria, business value |
| 22 | `frontend-lead` | technical feasibility, component ownership |
| 23 | `end-user-representative` | real usage, pain points, expectations |

## Rules

### 1. Evidence First

- ไม่ถาม stakeholder หรือ flag finding โดยไม่มี evidence
- ใช้ screenshots, URLs, code snippets — ระบุ context เช่น route, viewport, role
- ทุก finding ต้องมี file/line หรือ visual evidence

### 2. Review Independence

- ไม่แก้ code ระหว่าง roleplay review
- ถ้า role ไม่ชัด → ถามก่อน — ใช้ lens ของ role โดยเฉพาะ

### 3. Traceability

- บันทึกทุก feedback กับ item — ระบุ stakeholder role, decision และเหตุผล
- ถ้า feedback conflict → escalate ผ่าน `/ask-me`

### 4. Findings Routing

- ส่ง findings ไปจัดลำดับที่ `/review-gaps` หรือ domain review ที่ตรง
- engineering findings → `## Fix` ของ `/review-architecture` หรือ `/review-quality`
- product/business findings → `## Fix` ของ `/review-business`
- design/user findings → `## Fix` ของ `/review-uxui`
- QA findings → `## Fix` ของ `/review-test`
- data findings → `## Fix` ของ `/review-observability` หรือ domain ที่ตรง

## References

- [Full-dimension checklist](references/checklist.md)
- ใช้ /run-review ถ้าจำเป็น

## Expected Outcome

- รายงาน findings จากมุมมอง persona ที่เลือก พร้อม severity และ evidence
- Feedback จาก stakeholder จริงบันทึกชัดเจนพร้อม decision (ถ้ามี)
- Priority list เรียงลำดับตาม impact/effort
- Next actions ผ่าน `/suggest-next-action`
