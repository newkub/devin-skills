---
name: review-by-all-stakeholder
description: Review dispatcher — review project จากมุมมอง stakeholder/persona ตาม role details ใน references/
argument-hint: "<category-or-role> [role]"
related:
  - deep-review
  - scan-codebase
  - review
  - ask-me
  - report
  - suggest-next-action
---

## Goal

รับบท persona หรือ stakeholder ที่ user เลือก โดยอ่าน role details จาก `references/<category>.md` (section `### <category>/<role>`) แล้ว review project จากมุมมองนั้น

## Scope

ใช้กับทุก project ที่ต้องการมุมมองภายนอก — ครอบคลุม 18 categories ใน `references/` (75 roles): product, engineering, quality, user, customer, research, marketing, growth, business, data, operations, finance, legal, content, creative, communication, management, technical — ไม่แก้ code โดยตรง

ถ้าต้องการ feedback จาก stakeholder จริง (ไม่ใช่ roleplay) → ใช้ `/deep-review` แทน

## Execute

### 1. Identify Role

> Goal: รู้ persona ที่จะรับบท

1. ถ้ามี `<role-or-category>` argument → ใช้ role/category นั้น
2. ถ้าไม่มี → แสดงตาราง Category Mapping แล้ว `/ask-me` ให้ user เลือก
3. ถ้า role ไม่อยู่ในตาราง → แจ้ง และถามว่าจะใช้ closest role ไหน

### 2. Map To Category Reference

> Goal: หา `references/<category>.md` และ role section ที่ถูกต้อง

1. ใช้ตาราง Category Mapping ด้านล่าง — แต่ละ category map ไป `references/<category>.md`; role details อยู่ใน section `### <category>/<role>` ภายในไฟล์นั้น
2. role ที่เป็น security/compliance domain → ส่งต่อ `/deep-review` แทน
3. ถ้า role ตกอยู่ในหลาย category → ให้ user ยืนยัน
4. เปิด `references/<category>.md` → อ่าน role table ด้านบน + section `### <category>/<role>` ของ role ที่เลือก

### 3. Roleplay And Collect

> Goal: review ตาม lens ของ role จาก reference details

1. ทำ `/scan-codebase` เพื่อรวบรวม context ก่อน
2. รับบท role ตาม persona details (Goal/Scope/Execute/focus areas ใน section)
3. รับ findings, severity และ recommendations

### 4. Report

> Goal: สรุปผลจากมุมมอง persona

1. ทำ `/report` พร้อม findings และ recommendation
2. ระบุ top 3-5 ประเด็นที่สำคัญที่สุด
3. ทำ `/suggest-next-action`

## Category Mapping

| No. | Category Reference | Roles (`### <category>/<role>`) |
|----:|--------------------|--------------------------------|
| 1 | `references/product.md` | product-manager, product-designer, business-analyst, product-analyst |
| 2 | `references/engineering.md` | software-architect, frontend-developer, backend-developer, fullstack-developer, database-engineer, devops-engineer |
| 3 | `references/quality.md` | qa-engineer, test-engineer, code-reviewer, debugger, security-engineer, performance-engineer |
| 4 | `references/user.md` | ux-researcher, user-researcher, user-advocate, accessibility-specialist |
| 5 | `references/customer.md` | customer-success, customer-support, customer-advocate, community-manager |
| 6 | `references/research.md` | researcher, market-researcher, competitive-analyst, trend-analyst |
| 7 | `references/marketing.md` | marketing-strategist, content-marketer, seo-specialist, brand-strategist, social-media-manager |
| 8 | `references/growth.md` | growth-strategist, conversion-optimizer, retention-specialist, experimentation-specialist |
| 9 | `references/business.md` | business-strategist, sales-specialist, partnership-manager, operations-manager |
| 10 | `references/data.md` | data-analyst, data-scientist, ml-engineer, ai-engineer |
| 11 | `references/operations.md` | process-analyst, automation-specialist, release-manager, compliance-specialist |
| 12 | `references/finance.md` | financial-analyst, pricing-analyst, cost-analyst, accountant |
| 13 | `references/legal.md` | legal-advisor, privacy-specialist, compliance-advisor, risk-analyst |
| 14 | `references/content.md` | copywriter, editor, content-strategist, technical-writer |
| 15 | `references/creative.md` | visual-designer, brand-designer, creative-director |
| 16 | `references/communication.md` | communications-strategist, presenter, public-relations |
| 17 | `references/management.md` | project-manager, engineering-manager, technical-lead, scrum-master |
| 18 | `references/technical.md` | researcher, code-optimizer, refactoring-specialist, documentation-writer |

## Rules

- ไม่แก้ code ระหว่าง roleplay review
- ทุก finding ต้องมี evidence จาก code หรือ config
- ถ้า role ไม่ชัด → ถามก่อน
- ส่งต่อไปยัง role เดียวต่อครั้ง — ไม่ mixed perspective; ถ้าต้องการหลายมุมให้รันทีละ role หรือใช้ `/deep-review`
- ไม่ deploy หรือรันอะไรจริง

## Expected Outcome

- รายงาน findings จากมุมมอง persona ที่เลือก
- Top issues พร้อม recommendation
- รายงาน severity ชัดเจน
- Next actions ผ่าน `/suggest-next-action`
