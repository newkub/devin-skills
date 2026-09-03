---
name: roleplay-stakeholder
description: รับบทตาม persona / stakeholder ทีระบุ เพื่อ review code/project จากมุมมองนั้น
argument-hint: "[role-name]"
related:
  - scan-codebase
  - review-uxui
  - review-security
  - review-quality
  - review-performance
  - report
  - suggest-next-action
  - ask-me
---

## Goal

รับบทเป็น persona หรือ stakeholder ที user ระบุ แล้ว review project จากมุมมองนั้นทีเดียว

## Scope

- ใช้กับทุก project ทีต้องการมุมมองภายนอก
- รองรับทัง business, technical, security, user, compliance, growth
- ไม่แก้ code โดยตรง ให้ report findings พร้อม recommendation

- ดูเพิ่มเติม: /review-uxui, /review-security, /review-quality, /review-performance

## Execute

### 1. Identify Role

> Goal: รู้ persona ทีจะรับบท

1. ถ้ามี argument → ใช้ role นั้น
2. ถ้าไม่มี → แสดงตาราง role แล้วทำ `/ask-me` ให้ user เลือก
3. ถ้า role ไม่อยู่ในตาราง → แจ้ง และถามว่าจะใช้ closest role ไหน

### 2. Scan And Understand

> Goal: เข้าใจ context ก่อน review

1. ทำ `/scan-codebase` เพื่อเข้าใจ structure
2. อ่าน `README.md`, `AGENTS.md`, `docs/` ถ้ามี
3. ระบุ scope ทีจะ review ตาม role

### 3. Roleplay Review

> Goal: คิดผ่านเลนส์ของ persona

1. ใช้ตารางด้านล่างเพื่อระบุ lens / questions ของ role
2. หา evidence จาก code, config, docs
3. จัด findings ตาม severity: Critical, High, Medium, Low, Info

### 4. Report

> Goal: สรุปผลจากมุมมอง persona

1. ทำ `/report` พร้อม findings และ recommendation
2. ระบุ top 3-5 ประเด็นทีสำคัญทีสุด
3. ทำ `/suggest-next-action`

## Persona Table

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 1 | `user` | user journey, usage friction, onboarding, value proposition |
| 2 | `ui-designer` | visual design, design system, interaction, consistency |
| 3 | `ux-researcher` | research questions, pain points, biases, usability |
| 4 | `qa-tester` | edge cases, boundary conditions, test scenarios, regressions |
| 5 | `product-manager` | feature completeness, priority, MVP fit, user needs gaps |
| 6 | `new-developer` | onboarding, missing docs, confusing code, context gaps |
| 7 | `devops-engineer` | deployability, monitoring, rollback, observability |
| 8 | `competitor` | weaknesses, vulnerabilities, opportunities to outperform |
| 9 | `attacker` | vulnerabilities, attack surfaces, exploit paths |
| 10 | `ceo` | business value, strategic risk, vision, investment |
| 11 | `compliance-officer` | privacy, legal, regulatory, data handling gaps |
| 12 | `customer-success-manager` | health score, onboarding, churn, support gaps |
| 13 | `customer-support-agent` | issues users complain about, support gaps |
| 14 | `data-analyst` | data quality, event tracking, metrics, dashboards |
| 15 | `data-engineer` | data pipelines, ETL, schema, data infrastructure |
| 16 | `financial-analyst` | pricing, burn, unit economics, financial impact |
| 17 | `growth-manager` | funnel, A/B tests, acquisition, retention |
| 18 | `incident-commander` | incident response, runbooks, communication |
| 19 | `legal-counsel` | contracts, terms, IP, liability, legal exposure |
| 20 | `marketing-manager` | messaging, positioning, SEO, content |
| 21 | `open-source-contributor` | CONTRIBUTING, PR flow, community, license |
| 22 | `performance-engineer` | latency, throughput, resource usage, cost |
| 23 | `security-architect` | threat model, defense in depth, design security |
| 24 | `solutions-engineer` | integration, security, scalability, ROI for enterprise |
| 25 | `staff-engineer` | architecture, tech debt, scalability trade-offs |
| 26 | `technical-writer` | docs, examples, discoverability, clarity |

## Rules

- ไม่ลงมือแก้ code ระหว่าง roleplay review
- ทุก finding ต้องมี evidence จาก code หรือ config
- ถ้า role ไม่ชัด → ถามก่อน
- ใช้ lens ของ role โดยเฉพาะ ไม่ผสมกับ perspective อื่น
- ไม่ deploy หรือรันอะไรจริง

## Expected Outcome

- รายงาน findings จากมุมมอง persona ทีเลือก
- Top issues พร้อม recommendation
- รายงาน severity ชัดเจน
- Next actions ผ่าน `/suggest-next-action`
