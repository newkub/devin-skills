---
name: roleplay-by-all-stakeholder
description: Roleplay dispatcher — รับบท stakeholder/persona แล้วส่งต่อ roleplay-<category> <role>
argument-hint: "<role-or-category> [role]"
related:
  - review-by-stakeholder
  - scan-codebase
  - review
  - ask-me
  - report
  - suggest-next-action
---

## Goal

รับบท persona หรือ stakeholder ที่ user ระบุ แล้วส่งต่อไปยัง `/roleplay-<category> <role>` (sub-role skill) หรือ domain review skill ที่เหมาะสม เพื่อ review project จากมุมมองนั้น

## Scope

ใช้กับทุก project ที่ต้องการมุมมองภายนอก — ครอบคลุม 18 categories, ~70 roles: product, engineering, quality, user, customer, research, marketing, growth, business, data, operations, finance, legal, content, creative, communication, management, technical — ไม่แก้ code โดยตรง

ถ้าต้องการ feedback จาก stakeholder จริง (ไม่ใช่ roleplay) → ใช้ `/review-by-stakeholder` แทน

## Execute

### 1. Identify Role

> Goal: รู้ persona ที่จะรับบท

1. ถ้ามี `<role-or-category>` argument → ใช้ role/category นั้น
2. ถ้าไม่มี → แสดงตาราง category mapping แล้ว `/ask-me` ให้ user เลือก
3. ถ้า role ไม่อยู่ในตาราง → แจ้ง และถามว่าจะใช้ closest role ไหน

### 2. Map To Category Skill

> Goal: ส่งต่อไปยัง `roleplay-<category>` ที่ถูกต้อง

1. ใช้ตาราง Category Mapping ด้านล่าง — แต่ละ category คือ parent skill ที่มี `subskills/<role>/SKILL.md`
2. role ที่เป็น security/compliance domain → ส่งต่อ `/review-security` หรือ `/review-compliance` (persona lens อยู่ใน roleplay-legal)
3. ถ้า role ตกอยู่ในหลาย category → ให้ user ยืนยัน
4. ส่งต่อพร้อม context และ argument — invoke: `/roleplay-<category> <role>` หรืออ่าน `roleplay-<category>/subskills/<role>/SKILL.md` โดยตรง

### 3. Delegate And Collect

> Goal: ให้ sub-role skill ทำ review ตาม lens ของ role

1. ทำ `/scan-codebase` เพื่อรวบรวม context ก่อนส่งต่อ
2. เรียก sub-role skill ที่เหมาะสม
3. รับ findings, severity และ recommendations

### 4. Report

> Goal: สรุปผลจากมุมมอง persona

1. ทำ `/report` พร้อม findings และ recommendation
2. ระบุ top 3-5 ประเด็นที่สำคัญที่สุด
3. ทำ `/suggest-next-action`

## Category Mapping

| No. | Category Skill | Roles (subskills) |
|----:|----------------|-------------------|
| 1 | `/roleplay-product` | product-manager, product-designer, business-analyst, product-analyst |
| 2 | `/roleplay-engineering` | software-architect, frontend-developer, backend-developer, fullstack-developer, database-engineer, devops-engineer |
| 3 | `/roleplay-quality` | qa-engineer, test-engineer, code-reviewer, debugger, security-engineer, performance-engineer |
| 4 | `/roleplay-user` | ux-researcher, user-researcher, user-advocate, accessibility-specialist |
| 5 | `/roleplay-customer` | customer-success, customer-support, customer-advocate, community-manager |
| 6 | `/roleplay-research` | researcher, market-researcher, competitive-analyst, trend-analyst |
| 7 | `/roleplay-marketing` | marketing-strategist, content-marketer, seo-specialist, brand-strategist, social-media-manager |
| 8 | `/roleplay-growth` | growth-strategist, conversion-optimizer, retention-specialist, experimentation-specialist |
| 9 | `/roleplay-business` | business-strategist, sales-specialist, partnership-manager, operations-manager |
| 10 | `/roleplay-data` | data-analyst, data-scientist, ml-engineer, ai-engineer |
| 11 | `/roleplay-operations` | process-analyst, automation-specialist, release-manager, compliance-specialist |
| 12 | `/roleplay-finance` | financial-analyst, pricing-analyst, cost-analyst, accountant |
| 13 | `/roleplay-legal` | legal-advisor, privacy-specialist, compliance-advisor, risk-analyst |
| 14 | `/roleplay-content` | copywriter, editor, content-strategist, technical-writer |
| 15 | `/roleplay-creative` | visual-designer, brand-designer, creative-director |
| 16 | `/roleplay-communication` | communications-strategist, presenter, public-relations |
| 17 | `/roleplay-management` | project-manager, engineering-manager, technical-lead, scrum-master |
| 18 | `/roleplay-technical` | researcher, code-optimizer, refactoring-specialist, documentation-writer |

## Rules

- ไม่แก้ code ระหว่าง roleplay review
- ทุก finding ต้องมี evidence จาก code หรือ config
- ถ้า role ไม่ชัด → ถามก่อน
- ส่งต่อไปยัง role เดียวต่อครั้ง — ไม่ mixed perspective; ถ้าต้องการหลายมุมให้รันทีละ role หรือใช้ `/review-by-stakeholder`
- ไม่ deploy หรือรันอะไรจริง

## Expected Outcome

- รายงาน findings จากมุมมอง persona ที่เลือก
- Top issues พร้อม recommendation
- รายงาน severity ชัดเจน
- Next actions ผ่าน `/suggest-next-action`
