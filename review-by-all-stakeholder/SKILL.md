---
name: review-by-all-stakeholder
description: Review dispatcher — review project จากมุมมอง stakeholder/persona ผ่าน workflows/<category> <role>
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

รับบท persona หรือ stakeholder ที่ user ระบุ แล้วส่งต่อไปยัง `workflows/<category>` (category skill) → `workflows/<category>/workflows/<role>` (sub-role skill) หรือ domain review skill ที่เหมาะสม เพื่อ review project จากมุมมองนั้น

## Scope

ใช้กับทุก project ที่ต้องการมุมมองภายนอก — ครอบคลุม 18 categories ใน `workflows/` (75 roles): product, engineering, quality, user, customer, research, marketing, growth, business, data, operations, finance, legal, content, creative, communication, management, technical — ไม่แก้ code โดยตรง

ถ้าต้องการ feedback จาก stakeholder จริง (ไม่ใช่ roleplay) → ใช้ `/deep-review` แทน

## Execute

### 1. Identify Role

> Goal: รู้ persona ที่จะรับบท

1. ถ้ามี `<role-or-category>` argument → ใช้ role/category นั้น
2. ถ้าไม่มี → แสดงตาราง category mapping แล้ว `/ask-me` ให้ user เลือก
3. ถ้า role ไม่อยู่ในตาราง → แจ้ง และถามว่าจะใช้ closest role ไหน

### 2. Map To Category Workflow

> Goal: ส่งต่อไปยัง `workflows/<category>` ที่ถูกต้อง

1. ใช้ตาราง Category Mapping ด้านล่าง — แต่ละ category คือ workflow ที่มี `workflows/<category>/SKILL.md` และ roles อยู่ใน `workflows/<category>/workflows/<role>/SKILL.md`
2. role ที่เป็น security/compliance domain → ส่งต่อ `/deep-review` หรือ `/deep-review` (persona lens อยู่ใน `workflows/legal`)
3. ถ้า role ตกอยู่ในหลาย category → ให้ user ยืนยัน
4. ส่งต่อพร้อม context และ argument — อ่าน `workflows/<category>/SKILL.md` (dispatch ต่อไป role) หรือ `workflows/<category>/workflows/<role>/SKILL.md` โดยตรง

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

| No. | Category Workflow | Roles (`workflows/<role>`) |
|----:|-------------------|----------------------------|
| 1 | `workflows/product` | product-manager, product-designer, business-analyst, product-analyst |
| 2 | `workflows/engineering` | software-architect, frontend-developer, backend-developer, fullstack-developer, database-engineer, devops-engineer |
| 3 | `workflows/quality` | qa-engineer, test-engineer, code-reviewer, debugger, security-engineer, performance-engineer |
| 4 | `workflows/user` | ux-researcher, user-researcher, user-advocate, accessibility-specialist |
| 5 | `workflows/customer` | customer-success, customer-support, customer-advocate, community-manager |
| 6 | `workflows/research` | researcher, market-researcher, competitive-analyst, trend-analyst |
| 7 | `workflows/marketing` | marketing-strategist, content-marketer, seo-specialist, brand-strategist, social-media-manager |
| 8 | `workflows/growth` | growth-strategist, conversion-optimizer, retention-specialist, experimentation-specialist |
| 9 | `workflows/business` | business-strategist, sales-specialist, partnership-manager, operations-manager |
| 10 | `workflows/data` | data-analyst, data-scientist, ml-engineer, ai-engineer |
| 11 | `workflows/operations` | process-analyst, automation-specialist, release-manager, compliance-specialist |
| 12 | `workflows/finance` | financial-analyst, pricing-analyst, cost-analyst, accountant |
| 13 | `workflows/legal` | legal-advisor, privacy-specialist, compliance-advisor, risk-analyst |
| 14 | `workflows/content` | copywriter, editor, content-strategist, technical-writer |
| 15 | `workflows/creative` | visual-designer, brand-designer, creative-director |
| 16 | `workflows/communication` | communications-strategist, presenter, public-relations |
| 17 | `workflows/management` | project-manager, engineering-manager, technical-lead, scrum-master |
| 18 | `workflows/technical` | researcher, code-optimizer, refactoring-specialist, documentation-writer |

## Rules

- ไม่แก้ code ระหว่าง roleplay review
- ทุก finding ต้องมี evidence จาก code หรือ config
- ถ้า role ไม่ชัด → ถามก่อน
- ส่งต่อไปยัง role เดียวต่อครั้ง — ไม่ mixed perspective; ถ้าต้องการหลายมุมให้รันทีละ role หรือใช้ `/deep-review`
- ไม่ deploy หรือรันอะไรจริง

## Merged Details

### business

##### Goal

รับบท business persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง business — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| business-strategist | business model, pricing/entitlements, moat, alignment | `workflows/business-strategist/SKILL.md` |
| sales-specialist | demo-ability, trial flow, enterprise features, collateral | `workflows/sales-specialist/SKILL.md` |
| partnership-manager | API/webhooks/OAuth surface, partner docs, white-label | `workflows/partnership-manager/SKILL.md` |
| operations-manager | ops workflows, backoffice, manual gaps, escalation | `workflows/operations-manager/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### business/business-strategist

##### Goal



รับบทเป็น Business Strategist — ผู้วางกลยุทธ์ที่มอง product ผ่านมุม business model, moat และ revenue — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Business model signals — pricing tiers, plan definitions, entitlement/feature-gating logic ใน code

- Monetization surface — billing integration, payment provider, invoice, subscription lifecycle

- Moat/defensibility — unique data capture, network-effect features, lock-in/switching-cost mechanisms

- Strategic alignment — product surface เทียบกับ mission/positioning ใน README/docs

- Revenue leak risks — hardcoded free access, missing entitlement check, unbounded free tier

- Unit economics surface — usage metering, cost-driving features (AI calls, storage, bandwidth)

- Market positioning — differentiators ใน copy/features เทียบ competitor assumptions

- Pricing/packaging artifacts — plan config, upgrade/downgrade logic, grandfathering



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง business-strategist พร้อม severity และ evidence

### business/operations-manager

##### Goal



รับบทเป็น Operations Manager — ผู้ดูแล day-to-day ops ของ business ต้องการ tooling ที่ทำให้ ops team ทำงานได้โดยไม่ต้องพึ่ง engineer — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Admin/backoffice — admin screens, ops tooling, user management surface สำหรับ internal team

- Manual process gaps — workflow ที่ต้องทำมือหรือต้องให้ engineer รัน script/SQL แทน ops

- Escalation paths — error alerting, on-call hooks, support escalation flow

- Customer ops — refund, suspension, account recovery, impersonation/support tools

- Queue/job management — background job dashboard, retry, dead-letter handling surface

- Internal dashboards — health, usage, ops metrics ที่ non-engineer อ่านได้

- Data ops — bulk operations, import/export, correction tooling

- Ops docs — runbooks, internal tooling docs, access-control สำหรับ ops actions



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง operations-manager พร้อม severity และ evidence

### business/partnership-manager

##### Goal



รับบทเป็น Partnership Manager — ผู้ดูแล integration partners และ ecosystem ต้องการให้คนอื่น integrate กับ product ได้ง่าย — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Integration surface — public API endpoints, API docs, versioning strategy, deprecation policy

- Webhooks — outbound events, signature verification, retry/delivery semantics, event catalog

- OAuth/apps — OAuth flow, app registration, scopes, marketplace/directory hooks

- Partner docs — integration guides, SDK/client libraries, example code, sandbox for partners

- White-label hooks — theming config, custom domain support, embeddable widgets/SDK

- Partner telemetry — usage data ที่ partner เข้าถึงได้, partner-facing dashboard/API

- Rate limits/quotas — documented limits, headers, upgrade path สำหรับ integrator

- Third-party integrations ที่มีอยู่ — connectors, iPaaS (Zapier/Make) surface



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง partnership-manager พร้อม severity และ evidence

### business/sales-specialist

##### Goal



รับบทเป็น Sales Specialist — seller ที่ต้อง demo product ให้ prospect และปิด deal โดยเฉพาะ enterprise — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Demo-ability — seed data, demo mode, sandbox environment, resettable state สำหรับ live demo

- Trial flows — trial signup, expiry logic, trial limits, upgrade prompt ก่อน/หลังหมด

- Enterprise features — SSO/SAML, audit logs, admin console, RBAC, SCIM

- Sales collateral surface — docs, feature pages, security/trust page, comparison page

- Champion enablement — usage reports, team management, invoice/billing self-serve

- Team onboarding — org/workspace setup, member invites, seat management

- Procurement blockers — missing security questionnaire surface, compliance badges, DPA/privacy docs

- Upgrade path — in-app upgrade CTA, contact-sales flow, quote request handling



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง sales-specialist พร้อม severity และ evidence

### communication

##### Goal

รับบท communication persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง communication — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| communications-strategist | messaging consistency, announcement/changelog surface | `workflows/communications-strategist/SKILL.md` |
| presenter | demo flows, presentable states, screenshot-ability | `workflows/presenter/SKILL.md` |
| public-relations | public-facing surface, reputation risk, news hooks | `workflows/public-relations/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### communication/communications-strategist

##### Goal



รับบทเป็น Communications Strategist — นักวางแผนสื่อสารที่ดูแลว่า product พูดกับ user ด้วยเสียงเดียวกันทุก channel — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ messaging consistency — value proposition, key messages, taglines ตรงกันระหว่าง site, app, docs

- ตรวจ announcement/changelog surface — changelog, release notes, in-app announcements มีและ up-to-date

- ตรวจ notification/email copy — transactional emails, notification templates สอดคล้องกับ brand voice

- ตรวจ crisis-comms readiness — status page, incident comms templates, error page messaging

- ตรวจ audience segmentation — messaging สำหรับ user types ต่างกัน (dev vs buyer) เหมาะสม

- ตรวจ internal comms artifacts — PR descriptions, commit messages, release comms process

- ตรวจ feature naming/positioning — feature names สื่อความหมาย, consistent กับ positioning

- ตรวจ feedback channels — มีทางให้ user ส่ง feedback/report, contact surfaces ชัดเจน



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง communications-strategist พร้อม severity และ evidence

### communication/presenter

##### Goal



รับบทเป็น Presenter — ผู้นำเสนอที่ต้อง demo product ต่อหน้าคนและต้องการให้ทุก state พร้อมแสดงได้ทุกเมื่อ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ demo flows — happy paths ที่ demo ได้, seed/demo data สำหรับ showcase, guided tour surfaces

- ตรวจ presentable states — loading, empty, error states ดูดีพอจะแสดงต่อหน้าคนหรือไม่

- ตรวจ screenshot-ability — หน้าจอหลักถ่าย screenshot สวย, ไม่มี debug info/dev badges ปน

- ตรวจ storytelling structure — user journey เล่าเรื่องได้, key features โชว์ได้ในลำดับที่ make sense

- ตรวจ demo blockers — flows ที่ต้องใช้ real credentials/payment, states ที่ reproduce ยาก

- ตรวจ presentation assets — slides/screenshots/videos ใน repo, demo scripts, talk track docs

- ตรวจ "wow moments" — features ที่ impressive เมื่อ demo, hidden gems ที่ไม่มีใครเห็น

- ตรวจ demo environment surface — staging/demo mode, feature flags สำหรับ demo scenarios



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง presenter พร้อม severity และ evidence

### communication/public-relations

##### Goal



รับบทเป็น Public Relations — ฝ่าย PR ที่ดูแล public image, reputation risk และความพร้อมของข้อความที่โลกภายนอกเห็น — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ public-facing surface — about page, press page, blog, careers, contact info ครบและ current

- ตรวจ reputation risks in copy — claims ที่พิสูจน์ไม่ได้ ("#1", "best"), promises ที่ทำไม่ได้, competitor mentions

- ตรวจ news hooks — launch announcements, milestone content, press kit/assets พร้อมสำหรับ media

- ตรวจ legal-safe public claims — performance claims, security claims, compliance badges ที่ต้องจริง

- ตรวจ embarrassing leftovers — internal jokes, test content, profanity, placeholder text ใน public surfaces

- ตรวจ spokesperson/contact readiness — press contact, media inquiries path, response templates

- ตรวจ social proof surfaces — testimonials, logos, case studies ที่มี permission ใช้จริง

- ตรวจ crisis exposure — ข้อความ/feature ที่อาจถูก screenshot แล้วกลายเป็น PR crisis



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง public-relations พร้อม severity และ evidence

### content

##### Goal

รับบท content persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง content — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| copywriter | microcopy, tone, error/empty-state copy → `/deep-review` | `workflows/copywriter/SKILL.md` |
| editor | grammar/style consistency, terminology alignment | `workflows/editor/SKILL.md` |
| content-strategist | content architecture, docs/blog organization, lifecycle | `workflows/content-strategist/SKILL.md` |
| technical-writer | docs accuracy, API docs sync, runnable examples → `/deep-review` | `workflows/technical-writer/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### content/content-strategist

##### Goal



รับบทเป็น Content Strategist — นักวางแผนเนื้อหาที่ดู information architecture, content lifecycle และว่าเนื้อหาถูกที่ถูกเวลา — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ content architecture — information hierarchy ของ docs/site, navigation structure, findability

- ตรวจ docs/blog/changelog organization — taxonomy, categorization, tagging, cross-linking ระหว่างเนื้อหา

- ตรวจ content lifecycle — stale/outdated content, last-updated signals, orphan pages ที่ไม่มี path เข้าถึง

- ตรวจ content gaps — features ที่ไม่มี docs, FAQ ที่ไม่ตอบ, user journeys ที่ขาด supporting content

- ตรวจ duplication across channels — เนื้อหาซ้ำกันใน README, docs site, in-app help ที่อาจ drift

- ตรวจ content ownership — ชัดเจนหรือไม่ว่าใคร maintain เนื้อหาแต่ละส่วน (CODEOWNERS, frontmatter)

- ตรวจ SEO/discoverability surface — meta titles/descriptions, sitemap, indexable content structure

- ตรวจ content formats — consistent templates สำหรับ blog, changelog entries, guides



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง content-strategist พร้อม severity และ evidence

### content/copywriter

##### Goal



รับบทเป็น Copywriter — นักเขียน copy ที่ห่วงใยทุกคำที่ user เห็น — จาก button labels ถึง error messages — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ microcopy quality — button labels, form placeholders, helper text, tooltips ที่กระชับและชัดเจน

- ตรวจ tone consistency — voice/tone เดียวกันทั้ง app, formal vs casual mismatch ระหว่าง screens

- ตรวจ error message copy — เข้าใจง่าย, บอกวิธีแก้, ไม่ technical jargon, ไม่ blame user

- ตรวจ empty-state copy — อธิบายว่าเกิดอะไร, ชวนให้ action, ไม่ใช่แค่ "No data"

- ตรวจ CTA wording — action-oriented, specific ("Start free trial" vs "Submit"), hierarchy ของ primary/secondary CTA

- ตรวจ confirmation/destructive copy — confirm dialogs ชัดเจนว่าจะเกิดอะไร, irreversible actions เตือนจริง

- ตรวจ hardcoded strings ที่กระจายใน code — duplication ของ copy เดียวกัน, ควรอยู่ใน i18n/copy file เดียว

- Deep pass → `/deep-review` สำหรับ writing review เชิงลึก



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง copywriter พร้อม severity และ evidence

### content/editor

##### Goal



รับบทเป็น Editor — บรรณาธิการที่คุม grammar, style guide และ terminology ให้สม่ำเสมอทุกหน้าทุกข้อความ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ grammar/spelling — typos, subject-verb agreement, punctuation ใน user-facing strings และ docs

- ตรวจ style consistency — capitalization (Title Case vs sentence case), oxford comma, date/number formats

- ตรวจ terminology alignment — ชื่อ feature/product ใช้เหมือนกันทุกที่ ("workspace" vs "project"), glossary drift

- ตรวจ content structure — heading hierarchy ถูกต้อง, parallel structure ใน lists, scannable formatting

- ตรวจ consistency ข้าม surfaces — app copy, docs, emails, error pages พูดเรื่องเดียวกันแบบเดียวกัน

- ตรวจ deprecated terminology — ชื่อเก่าที่ยังหลงเหลือใน code/docs หลัง rebrand/rename

- ตรวจ localization readiness — concatenated strings, hardcoded plurals, strings ที่แปลยาก

- ตรวจ redundant/contradictory copy — ข้อความที่พูดซ้ำหรือขัดกันในหน้าเดียวกัน



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง editor พร้อม severity และ evidence

### content/technical-writer

##### Goal



รับบทเป็น Technical Writer — นักเขียนเชิงเทคนิคที่ทำให้ docs ถูกต้อง ครบถ้วน และตามได้จริง — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ docs completeness — features/APIs ทั้งหมดมี docs หรือไม่, undocumented config options

- ตรวจ docs accuracy — คำสั่ง, parameter names, defaults ใน docs ตรงกับ code จริงหรือ drift

- ตรวจ API docs sync — OpenAPI/spec files ตรงกับ implementation, request/response examples ถูกต้อง

- ตรวจ examples runnable — code snippets compile/run, version pinning, setup steps ครบ

- ตรวจ code-comment quality — comments อธิบาย why ไม่ใช่ what, stale comments ที่ขัดกับ code

- ตรวจ getting-started/onboarding docs — quickstart ใช้ได้จริง, prerequisites ครบ, ไม่มีขั้นตอนขาดหาย

- ตรวจ troubleshooting/FAQ — error messages มี doc ที่อธิบาย, common pitfalls documented

- ตรวจ doc structure — per-doc purpose ชัดเจน, reference vs guide vs tutorial แยกประเภทถูก

- Deep pass → `/deep-review` สำหรับ documentation review เชิงลึก



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง technical-writer พร้อม severity และ evidence

### creative

##### Goal

รับบท creative persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง creative — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| visual-designer | visual consistency, spacing/typography → `/deep-review` | `workflows/visual-designer/SKILL.md` |
| brand-designer | brand asset usage, logo/color integrity | `workflows/brand-designer/SKILL.md` |
| creative-director | creative coherence, hero visuals, differentiation | `workflows/creative-director/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### creative/brand-designer

##### Goal



รับบทเป็น Brand Designer — ผู้ดูแล brand identity ให้โลโก้ สี และ brand assets ถูกใช้อย่างถูกต้องและสม่ำเสมอทุก surface — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ brand asset usage — logo files ที่ถูกต้อง (version, format, clear space), favicon/app icons ครบและตรง brand

- ตรวจ logo/color integrity — brand colors ตรงกับ brand guidelines, ไม่มี near-miss colors ที่ใกล้แต่ผิด

- ตรวจ brand consistency across surfaces — app, emails, docs, social preview images, error pages ใช้ brand เดียวกัน

- ตรวจ old/deprecated brand assets — โลโก้เก่า, สีเก่า, brand name เก่าที่ยังหลงเหลือ

- ตรวจ brand naming — product name spelling/capitalization ถูกต้อง, trademark usage

- ตรวจ og/social images — og:image, twitter cards ใช้ branded assets ที่ current

- ตรวจ brand asset organization — assets folder structure, source of truth สำหรับ brand files

- ตรวจ white-label/theming surfaces ที่อาจทำ brand integrity พัง



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง brand-designer พร้อม severity และ evidence

### creative/creative-director

##### Goal



รับบทเป็น Creative Director — ผู้กำกับ creative vision ที่ดูภาพรวมว่าทุกชิ้นงานเล่าเรื่องเดียวกันและโดดเด่นกว่าคู่แข่ง — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ creative coherence รวม — visual language, tone, imagery style ไปทางเดียวกันทั้ง product/marketing

- ตรวจ hero/marketing visuals — landing page, hero sections, key screenshots มีคุณภาพและ impact

- ตรวจ creative differentiation — ดู generic/template-like หรือไม่, มี signature visual elements หรือเปล่า

- ตรวจ storytelling arc — onboarding, landing, about pages เล่าเรื่องที่เชื่อมกันและสร้าง emotional connection

- ตรวจ asset quality bar — illustrations, photos, videos อยู่ในระดับ production quality

- ตรวจ campaign/launch surfaces — announcement pages, feature highlights, release visuals

- ตรวจ creative debt — half-finished design explorations, placeholder images, lorem ipsum ที่หลงเหลือ

- ตรวจ motion/interaction polish — animations, transitions, micro-interactions ที่ช่วยหรือรบกวน experience



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง creative-director พร้อม severity และ evidence

### creative/visual-designer

##### Goal



รับบทเป็น Visual Designer — นักออกแบบที่ห่วง visual consistency, typography, spacing และคุณภาพของทุก pixel — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ visual consistency — component ที่หน้าตาไม่ตรงกัน, ad-hoc styles นอก design system

- ตรวจ spacing/layout — inconsistent margins/padding, hardcoded pixel values vs spacing tokens, misalignment

- ตรวจ typography — font scale consistency, line-height, font weights, too many font sizes

- ตรวจ icon/asset quality — mixed icon sets, inconsistent stroke/sizes, low-res images, missing alt

- ตรวจ color usage — hardcoded hex values vs theme tokens, contrast issues, inconsistent semantic colors

- ตรวจ responsive/visual states — hover, focus, disabled, loading, empty states ที่ยังไม่ได้ออกแบบ

- ตรวจ design token coverage — theme files, CSS variables, dark mode readiness

- Deep pass → `/deep-review` สำหรับ UX/UI review เชิงลึก



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง visual-designer พร้อม severity และ evidence

### customer

##### Goal

รับบท customer persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง customer — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| customer-success | time-to-value, onboarding, adoption blockers | `workflows/customer-success/SKILL.md` |
| customer-support | error messages, self-serve troubleshooting, support surface | `workflows/customer-support/SKILL.md` |
| customer-advocate | promises vs implementation, reliability, cancellation flows | `workflows/customer-advocate/SKILL.md` |
| community-manager | contributor docs, community surface, feedback loops | `workflows/community-manager/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### customer/community-manager

##### Goal



รับบทเป็น Community Manager — คนที่ดูแล contributor experience และช่องทางที่ community มีส่วนร่วมกับ project ตั้งแต่ issue แรกจนถึง PR แรก — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- `CONTRIBUTING.md` completeness — dev setup steps, PR process, code style, review expectations, commit/branch conventions

- Issue/PR surface — issue templates, PR template, labels (โดยเฉพาะ `good first issue`/`help wanted`), `CODEOWNERS`, triage process docs

- Community channels — links ไป Discord/Slack/forum/Discussions, `CODE_OF_CONDUCT.md`, governance/maintainer docs

- Contributor onboarding — dev setup reproducible จริงไหม: README dev section, setup scripts, devcontainer/docker-compose, seed/fixture data

- Feedback loops — roadmap visibility, RFC/design docs, feature request channel, release notes/changelog cadence

- Contributor health signals — response-time expectations, stale PR/issue policy, recognition mechanisms (contributors list, credits)

- Docs hygiene — setup instructions ที่ outdated หรือ run ไม่ได้แล้ว, broken links, stale badges, dead community links



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง community-manager พร้อม severity และ evidence

### customer/customer-advocate

##### Goal



รับบทเป็น Customer Advocate — คนที่ตรวจว่า product ทำตามที่ promise กับ customer จริง และ customer ได้รับการปฏิบัติอย่างยุติธรรมรวมถึงตอนอยากออกจาก product — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Promise audit — claims ใน README/marketing/docs (`"easy"`, `"secure"`, `"one-click"`, uptime/SLA numbers) เทียบกับ implementation จริง

- Reliability signals — retry/timeout handling, graceful degradation, data-loss risks ใน destructive ops ที่ไม่มี confirm/backup

- Cancellation/refund path — account deletion, subscription cancel, billing flows มีและทำงานจริงไหม; ซ่อน, dead-end หรือต้องติดต่อคนเท่านั้น

- Data ownership — export/backup paths, format portability, lock-in signals (proprietary-only formats, no export endpoint)

- Limits honesty — rate limits, quotas, size limits ที่ docs claim vs ที่ enforce จริงใน code/config

- Privacy promise vs reality — analytics/tracking calls, third-party requests, data ที่ส่งออกจริงเทียบกับที่ privacy copy บอก

- Change handling — breaking changes มี notice/deprecation period ไหม; changelog/migration docs ตรงกับ behavior จริง



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง customer-advocate พร้อม severity และ evidence

### customer/customer-success

##### Goal



รับบทเป็น Customer Success Manager — คนที่ own ว่า customer ได้ value จาก product เร็วที่สุดและ adopt ได้ด้วยตัวเองโดยไม่ต้องพึ่งคน — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Time-to-value — path จาก install/signup → first success กี่ steps; มี quickstart, sample data, demo mode หรือ template ที่ลดเวลาไหม

- Onboarding completeness — getting-started docs, README quickstart, in-app onboarding, setup checklist; step ไหนที่ customer น่าจะ drop

- Adoption blockers — setup ที่หนักก่อนใช้งานได้: required env config, external accounts/keys, seed data ที่ต้องสร้างเอง, manual steps ที่ automate ได้

- Self-serve success paths — templates, examples, sensible defaults, sandbox/trial mode; หรือทุกอย่างต้องติดต่อคน

- Activation instrumentation — มี tracking ของ onboarding/activation milestones ไหม (analytics events, progress state, health checks)

- Stuck-state recovery — docs สำหรับคนที่ setup ไม่ผ่าน, migration/upgrade guides, version compatibility notes, rollback paths

- Expansion visibility — feature ที่มีแต่ customer ไม่รู้: undiscovered routes/pages, hidden settings, ไม่มี in-product surfacing หรือ upsell cues



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง customer-success พร้อม severity และ evidence

### customer/customer-support

##### Goal



รับบทเป็น Customer Support Engineer — คนที่รับ ticket จริงทุกวัน สนใจว่า user แก้ปัญหาเองได้ก่อนส่ง ticket และ support มีข้อมูลพอจะ diagnose เมื่อต้องเข้าไปช่วย — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Error message quality — user-facing errors บอก what happened + what to do next; ไม่ใช่ raw stack trace, error code ล้วน, หรือ `"Something went wrong"`

- Error taxonomy — structured error codes/types ที่ docs หรือ support lookup ได้; error ที่ไม่มี classification เลย

- Self-serve troubleshooting — troubleshooting docs, FAQ, known-issues page, debug/`--verbose` modes, diagnostic commands

- Supportability — log levels, correlation/request IDs, error context ที่ support ใช้ reproduce ได้, diagnostic export/bundle

- Support surface — contact/support links ใน product, issue tracker link, status page, help menu, `SUPPORT.md`

- Failure UX — retry guidance, offline/degraded states, rate-limit/quota messaging ที่บอกว่าเมื่อไหร่จะใช้ได้อีก

- Docs accuracy — error strings และ troubleshooting steps ใน docs ตรงกับที่ code emit จริง (เทียบ error strings ใน code กับ docs)



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง customer-support พร้อม severity และ evidence

### data

##### Goal

รับบท data persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง data — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| data-analyst | metrics/dashboards, event tracking, reporting models, export | `workflows/data-analyst/SKILL.md` |
| data-scientist | data quality, features, notebooks, reproducibility | `workflows/data-scientist/SKILL.md` |
| ml-engineer | model serving, versioning, monitoring, pipelines → `/deep-review` | `workflows/ml-engineer/SKILL.md` |
| ai-engineer | prompts, evals, guardrails, token cost → `/deep-review` | `workflows/ai-engineer/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### data/ai-engineer

##### Goal



รับบทเป็น AI Engineer — engineer ที่สร้าง LLM-powered features สนใจ prompt quality, eval coverage, safety และ cost per request — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Prompts — system/user prompt ใน code, prompt versioning, hardcoded vs templated prompts

- Evals — eval harness, test sets, regression check เมื่อเปลี่ยน prompt/model

- Guardrails — input/output validation, PII handling, jailbreak/injection defenses

- Token cost — context size, model choice per task, caching, truncation strategy

- Model config — temperature, max tokens, provider abstraction, per-feature config

- Fallbacks — retries, degraded mode, hallucination handling, human-in-the-loop

- Observability — LLM call logging, latency/cost tracking, trace per request

- Deep pass → delegate `/deep-review` สำหรับ full AI/LLM review



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass — ใช้ `/deep-review` เป็นหลัก



##### Expected Outcome



- findings จากมุมมอง ai-engineer พร้อม severity และ evidence

### data/data-analyst

##### Goal



รับบทเป็น Data Analyst — analyst ที่ต้องตอบ business question จากข้อมูล ต้องการ tracking ครบ metric นิยามชัด และดึงข้อมูลออกได้ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Metrics/dashboards — KPI definitions, dashboard/reporting views, metric source of truth

- Event tracking coverage — analytics events, naming consistency, funnel gaps, untracked key actions

- Data models for reporting — schema design, reporting/denormalized tables, queryable structure

- Exportability — CSV export, data API, BI connector surface, warehouse sync

- Metric definitions — นิยาม metric ใน code/docs, conflicting definitions, single source of truth

- Data quality — validation, constraints, freshness checks, null/duplicate handling

- Self-serve surface — query/report builder, scheduled reports, alerting on metrics

- Data access — permissions, PII masking สำหรับ analyst access



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง data-analyst พร้อม severity และ evidence

### data/data-scientist

##### Goal



รับบทเป็น Data Scientist — scientist ที่สร้าง insight/model จากข้อมูล สนใจ data quality, feature surface และ reproducibility — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Data quality — missing-value handling, validation rules, schema enforcement, anomaly detection

- Feature engineering surface — feature pipeline, feature store, reusable transformations

- Experiment artifacts — notebooks, analysis scripts, ad-hoc queries ใน repo และ organization

- Reproducibility — random seeds, pinned dependencies, data versioning, environment capture

- Statistical rigor — test methodology, significance/confidence handling, multiple-comparison risk

- Labeling/ground truth — label sources, label quality checks, leakage risk

- Training-serving consistency — offline/online feature parity, skew risk

- Data access patterns — how scientist ดึงข้อมูล, sampling, privacy constraints



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง data-scientist พร้อม severity และ evidence

### data/ml-engineer

##### Goal



รับบทเป็น ML Engineer — engineer ที่รับผิดชอบ model ตั้งแต่ training ถึง production serving สนใจ reliability และ lifecycle ของ model — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Model serving — inference endpoints, latency budget, batching, scaling strategy

- Training/inference split — pipeline separation, feature parity offline vs online

- Model versioning — model registry, artifact storage, deploy/rollback path

- Model monitoring — drift detection, prediction logging, performance metrics, alerting

- Data pipelines — training ETL, feature freshness, pipeline failure handling

- Resource/cost — GPU/CPU usage, inference cost per request, caching

- Retraining — retraining triggers, data refresh cadence, eval gate ก่อน promote

- LLM-specific parts (prompts, evals, guardrails) → delegate `/deep-review` เป็น deep pass



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass — LLM parts ไป `/deep-review`



##### Expected Outcome



- findings จากมุมมอง ml-engineer พร้อม severity และ evidence

### engineering

##### Goal

รับบท engineering persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง engineering — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| software-architect | modularity, boundaries, coupling, resilience | `workflows/software-architect/SKILL.md` |
| frontend-developer | component structure, state, rendering, a11y | `workflows/frontend-developer/SKILL.md` |
| backend-developer | API/service layer, data flow, error handling | `workflows/backend-developer/SKILL.md` |
| fullstack-developer | e2e wiring, FE↔BE contracts, cross-layer duplication | `workflows/fullstack-developer/SKILL.md` |
| database-engineer | schema, indexes, queries, migrations | `workflows/database-engineer/SKILL.md` |
| devops-engineer | CI/CD, deploy config, env management, observability | `workflows/devops-engineer/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### engineering/backend-developer

##### Goal



รับบทเป็น Backend Developer — คนที่ own server-side implementation สนใจ API correctness, data flow, และ failure behavior ฝั่ง server — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- API layer — route handlers, input validation, response shapes, status codes ที่ consistent และตรง contract

- Service layer — business logic placement (controller vs service vs model), transaction boundaries, orchestration

- Error handling — error propagation, consistent error response format, unhandled promise/async errors, error classification

- Data access — repository/query layer patterns, query correctness, transaction usage สำหรับ multi-write

- Auth/middleware — auth checks placement, middleware ordering, permission enforcement ที่ handler level

- Async work — background jobs, queue producers/consumers, scheduled tasks, retry/dead-letter handling

- Request lifecycle — request validation → processing → response ที่มีจุดรั่ว (unvalidated input, leaked internals)

- Serialization/output — response shaping, sensitive field filtering, pagination contracts



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง backend-developer พร้อม severity และ evidence

### engineering/database-engineer

##### Goal



รับบทเป็น Database Engineer — คนที่ own data layer สนใจ schema quality, query efficiency, และ migration safety — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Schema design — normalization level, data types ที่เหมาะสม, missing constraints (`NOT NULL`, `UNIQUE`, `CHECK`), column choices ที่เสี่ยง

- Indexes — missing indexes บน query paths/join columns/foreign keys, unused/duplicate indexes, composite index column order

- Query patterns — N+1 queries, `SELECT *`, missing `WHERE` บน update/delete, full table scans, inefficient pagination (offset ลึก)

- Migrations — migration safety (locking, long-running), reversibility, ordering conflicts, schema-vs-code drift

- Relationships — missing FK constraints, orphan row risks, cascade behavior (`ON DELETE`) ที่ผิดหรือขาด

- Data integrity — uniqueness ที่ enforce แค่ app layer, nullability ที่ไม่ตรง business rules, default values ที่ขาด

- Connection/resource handling — connection pooling config, transaction scope ที่กว้างเกิน, long-lived transactions

- Data lifecycle — soft-delete patterns, archival/TTL ที่ขาดบนตารางที่โตเร็ว



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง database-engineer พร้อม severity และ evidence

### engineering/devops-engineer

##### Goal



รับบทเป็น DevOps Engineer — คนที่ own delivery pipeline และ runtime environment สนใจว่า build/deploy น่าเชื่อถือและ recover ได้ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- CI/CD pipeline — pipeline stages (lint/test/build/deploy), test gates ที่ขาด, pipeline config quality, caching ของ dependencies

- Deploy config — health checks, readiness/liveness probes, rollback strategy, zero-downtime deployment capability

- Env management — env vars ที่ undocumented, secrets handling (committed secrets, plaintext config), per-environment config drift

- Infra config — Dockerfile quality (base image, layers, non-root user), docker-compose correctness, IaC files

- Observability — health endpoints, structured logging config, metrics exposure, alerting hooks ที่ขาด

- Dependency/runtime pinning — lock files committed, version pinning, unpinned base images/actions (`:latest`)

- Build reproducibility — build steps ที่ env-dependent, missing `.dockerignore`/`.gitignore` สำหรับ artifacts, nondeterministic builds

- Backup/recovery signals — DB backup config, disaster recovery hooks, stateful service handling



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง devops-engineer พร้อม severity และ evidence

### engineering/frontend-developer

##### Goal



รับบทเป็น Frontend Developer — คนที่ own client-side implementation สนใจ component quality, state correctness, และ rendering behavior — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Component structure — components ที่ใหญ่เกิน, prop drilling ลึก, decomposition ที่ควรทำ, mixed concerns (data fetching + rendering)

- State management — local vs global state ที่เลือกผิด, derived state ที่ duplicate, stale state risks, state colocation

- Rendering patterns — unnecessary re-renders, missing/unstable `key` props, effect misuse (missing deps, cleanup ที่ขาด)

- Data fetching — loading/error states ที่ขาด, race conditions, waterfall fetching, caching strategy

- a11y basics — missing labels/`alt`, non-semantic HTML, keyboard navigation gaps, focus management ใน modals

- Asset handling — unoptimized images, heavy imports, missing code splitting/lazy loading

- Form handling — controlled/uncontrolled mixing, validation wiring, submission state handling

- Client-side routing — route guards, deep-link handling, 404/redirect behavior



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง frontend-developer พร้อม severity และ evidence

### engineering/fullstack-developer

##### Goal



รับบทเป็น Fullstack Developer — คนที่ own feature แบบ end-to-end สนใจว่า UI → API → DB เชื่อมครบและ contract ระหว่าง layer ตรงกัน — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- End-to-end feature wiring — แต่ละ feature มี UI → API → data path ครบ; ปุ่ม/form ที่ไม่มี handler, endpoint ที่ไม่มี caller

- Contract consistency — request/response shapes ที่ frontend expect vs backend return จริง (field names, types, nullability)

- Type/schema sharing — type definitions ที่ duplicate กันฝั่ง FE/BE, schema drift ระหว่าง layers, shared contract files ที่ควรมี

- Cross-layer duplication — validation logic ที่ implement ซ้ำ FE/BE แบบไม่ตรงกัน, business rules ที่กระจายทั้งสองฝั่ง

- Error handling end-to-end — server errors surface ถึง user อย่างถูกต้อง, error codes/messages ที่ map ได้, fallback UI

- Env/config consistency — API base URLs, env vars, feature flags ที่ FE/BE reference ตรงกัน

- Auth/session flow — token handling, session expiry, refresh flow ที่ wire ครบทั้งสองฝั่ง

- Data flow integrity — optimistic updates vs server truth, refetch/invalidation strategy, stale data risks



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ใช้ `/deep-review` + `/deep-review` ร่วมกัน



##### Expected Outcome



- findings จากมุมมอง fullstack-developer พร้อม severity และ evidence

### engineering/software-architect

##### Goal



รับบทเป็น Software Architect — คนที่ own structural integrity ของระบบ สนใจ boundaries, coupling, และความทนทานต่อ change/failure — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Module boundaries — layer separation (presentation/domain/infra), domain boundaries ที่ชัดหรือรั่ว, god modules

- Coupling — circular dependencies, cross-module imports ที่ข้าม boundary, shared mutable state ระหว่าง modules

- Dependency direction — domain → infrastructure violations, framework/library leakage เข้า domain logic, dependency inversion ที่ขาด

- Resilience — timeouts, retries, circuit breakers, graceful degradation สำหรับ external calls ที่ขาดหรือผิด

- Service/module contracts — interface stability, API versioning, breaking change surface ระหว่าง modules

- Scalability signals — stateful components ที่ scale ยาก, singletons, in-memory caches ที่จะพังใน multi-instance

- Dependency health — outdated deps, libraries ที่ทำงานซ้ำกัน, heavy transitive dependencies

- Evolution risk — god files, tight coupling ที่ทำให้ change เล็กกระทบกว้าง



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง software-architect พร้อม severity และ evidence

### finance

##### Goal

รับบท finance persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง finance — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| financial-analyst | revenue/billing correctness, invoice/refund flows | `workflows/financial-analyst/SKILL.md` |
| pricing-analyst | pricing tiers, entitlements, upgrade/downgrade paths | `workflows/pricing-analyst/SKILL.md` |
| cost-analyst | infra cost drivers, third-party spend, waste → `/deep-review` | `workflows/cost-analyst/SKILL.md` |
| accountant | transaction integrity, audit trail, tax/currency handling | `workflows/accountant/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### finance/accountant

##### Goal



รับบทเป็น Accountant — นักบัญชีที่ดูแลความสมบูรณ์ของ financial records, audit trail และการ reconcile ยอด — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ financial records integrity — transaction schema, immutable ledger vs mutable balances, missing fields

- ตรวจ audit trail — มี log ของทุก financial event (create/update/void), actor และ timestamp ครบหรือไม่

- ตรวจ tax/currency handling — VAT/tax calculation, multi-currency storage, exchange rate source และ precision

- ตรวจ reconciliation surfaces — settlement records vs internal transactions, gap/mismatch handling

- ตรวจ decimal/money types — ใช้ integer cents หรือ decimal type แทน float ในการเก็บยอดเงิน

- ตรวจ period closing/backdating — สามารถแก้ transaction ย้อนหลังได้โดยไม่มี audit log หรือไม่

- ตรวจ sequential numbering — invoice/receipt numbers ต่อเนื่อง ไม่ซ้ำ ไม่ข้าม

- ตรวจ export/report endpoints สำหรับ accounting (CSV, journal entries) ว่ามีและถูกต้อง



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง accountant พร้อม severity และ evidence

### finance/cost-analyst

##### Goal



รับบทเป็น Cost Analyst — ผู้ควบคุมต้นทุนที่มองหา infra spend, third-party bills และ resource waste ใน codebase — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ infra cost drivers — instance sizes, autoscaling config, reserved capacity ใน IaC/deploy configs

- ตรวจ third-party spend — paid API calls (OpenAI, maps, SMS), per-request pricing, unbounded usage

- ตรวจ resource waste — polling loops, unbatched jobs, oversized DB queries, unused services

- ตรวจ storage cost — log retention, blob storage growth, missing lifecycle/expiry policies

- ตรวจ egress/bandwidth costs — large payloads, missing caching/CDN, chatty APIs

- ตรวจ cron/scheduled jobs ที่รันถี่เกินจำเป็น หรือ retry storms ที่เผา quota

- ตรวจ dev/staging environments ที่เปิดทิ้ง หรือ over-provisioned relative to prod

- Deep pass → `/deep-review` สำหรับ cost analysis เชิงลึก



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง cost-analyst พร้อม severity และ evidence

### finance/financial-analyst

##### Goal



รับบทเป็น Financial Analyst — นักวิเคราะห์การเงินที่ดูแลความถูกต้องของตัวเลขรายได้ ใบแจ้งหนี้ และรายงานทางการเงิน — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ revenue/billing logic — การคำนวณยอดเงิน, rounding, currency conversion ใน payment/billing modules

- ตรวจ invoice generation flow — line items, tax calculation, total ตรงกับ subtotal หรือไม่

- ตรวจ refund/credit note flow — ยอด refund ถูกต้อง, partial refund, idempotency ของ refund endpoint

- ตรวจ financial reporting surface — endpoints/jobs ที่ aggregate ยอดขาย, MRR, revenue recognition

- ตรวจ webhook จาก payment provider (Stripe, etc.) — จัดการ event ครบ, ไม่ double-count revenue

- ตรวจ edge cases ทางการเงิน — negative amounts, zero-decimal currencies, failed payment retries

- ตรวจ consistency ระหว่าง ledger/transaction records กับยอดที่แสดงใน dashboard/report

- ตรวจ promo/discount application ที่กระทบยอดเรียกเก็บจริง



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง financial-analyst พร้อม severity และ evidence

### finance/pricing-analyst

##### Goal



รับบทเป็น Pricing Analyst — ผู้เชี่ยวชาญโครงสร้างราคาและ feature gating ที่ดูแลว่าแต่ละ tier ให้คุณค่าและเก็บเงินถูกต้อง — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ pricing tiers structure — plan definitions, price constants, tier mapping ใน config/DB seed

- ตรวจ entitlements/feature gating — feature flags, plan checks ใน middleware/ guards ครบทุก route ที่เป็น paid feature

- ตรวจ upgrade/downgrade paths — proration logic, effective date, state transition ของ subscription

- ตรวจ discount/coupon logic — stacking rules, expiry, eligibility checks, abuse surface

- ตรวจ free tier limits — quota enforcement, soft vs hard limits, overage handling

- ตรวจ trial logic — trial length, trial-to-paid conversion, expired trial state

- ตรวจ pricing page/paywall copy vs actual entitlement ใน code — ตรงกันหรือขาด feature gate

- ตรวจ grandfathering/legacy plan handling เมื่อ pricing เปลี่ยน



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง pricing-analyst พร้อม severity และ evidence

### growth

##### Goal

รับบท growth persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง growth — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| growth-strategist | acquisition hooks, viral loops, activation flow, instrumentation | `workflows/growth-strategist/SKILL.md` |
| conversion-optimizer | CTA, form friction, funnel drop-offs, pricing/signup/checkout | `workflows/conversion-optimizer/SKILL.md` |
| retention-specialist | re-engagement, notifications, churn signals, habit loops | `workflows/retention-specialist/SKILL.md` |
| experimentation-specialist | feature flags, A/B infra, tracking, variant isolation | `workflows/experimentation-specialist/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### growth/conversion-optimizer

##### Goal



รับบทเป็น Conversion Optimizer — CRO specialist ที่ลด friction ทุกจุดบน path จาก visitor → paying user — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- CTA clarity & hierarchy — button labels, placement, contrast, primary vs secondary บนหน้าสำคัญ

- Form friction — จำนวน field, required fields, validation UX, error state, inline guidance

- Funnel drop-offs — multi-step flow (signup → onboarding → checkout), abandoned/incomplete states

- Pricing page — plan comparison, anchoring, trial CTA, FAQ, trust/money-back signals

- Checkout/signup flow — payment steps, guest checkout, redirect hops, dead ends

- Microcopy — value prop บน conversion path, error/helper text ที่ทำให้เลิกกลางทาง

- Blockers — cookie consent, modal, interstitial ที่บัง CTA; mobile conversion surface

- Trust surface — testimonials, security badges, social proof ตำแหน่งก่อน commit



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง conversion-optimizer พร้อม severity และ evidence

### growth/experimentation-specialist

##### Goal



รับบทเป็น Experimentation Specialist — ผู้เชี่ยวชาญ A/B testing และ feature flags ที่ต้องการให้ทุกเปลี่ยนแปลงวัดผลได้ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Feature flag infra — flag provider/config, flag usage ใน code, kill switches

- A/B test framework — variant assignment, bucketing logic, sticky assignment ข้าม session

- Experiment tracking — exposure events, conversion metric ต่อ variant, analytics wiring

- Variant isolation — shared state leak, CSS/DOM bleed ระหว่าง variant, cache ที่ทำ variant ปนกัน

- Measurement integrity — event schema สำหรับ experiment, missing baseline/control tracking

- Experiment lifecycle — stale flags, dead variant code ที่ไม่ cleanup, flag debt

- Config-driven tests — experiment definitions ใน config/JSON ที่แก้ได้โดยไม่ deploy

- Guardrail metrics — performance/error tracking แยกตาม variant



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง experimentation-specialist พร้อม severity และ evidence

### growth/growth-strategist

##### Goal



รับบทเป็น Growth Strategist — growth lead ที่ดู scalable acquisition และ activation loops เป็นหลัก สนใจว่า product เติบโตเองได้แค่ไหน — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Acquisition entry points — landing routes, SEO surface (`metadata`, `sitemap`, `robots.txt`), shareable/deep-linkable URLs

- Activation flow — signup → first-value path, จำนวน step, friction, time-to-value

- Viral/referral loops — invite flow, share buttons, referral code, mechanism ที่ user พาคนอื่นเข้ามา

- Growth instrumentation — analytics events บน funnel steps, UTM/attribution handling, missing tracking ตรงจุดสำคัญ

- Paywall/upgrade placement — free-to-paid triggers, upgrade CTA ตาม user journey

- Capture points — newsletter, waitlist, drip signup, gated content

- Growth hooks in code — hardcoded promo copy, kill switch, growth-specific flags/config



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง growth-strategist พร้อม severity และ evidence

### growth/retention-specialist

##### Goal



รับบทเป็น Retention Specialist — ผู้เชี่ยวชาญที่ทำให้ user กลับมาใช้ซ้ำและไม่ churn สนใจ lifecycle และ habit formation — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Re-engagement hooks — email digest, win-back flow, push/in-app reactivation triggers

- Notification surface — channels, user preferences, unsubscribe/frequency control, missing opt-out

- Churn signals — inactivity detection, usage-drop tracking, cancellation/downgrade flow

- Habit loops — streaks, reminders, saved progress, returning-user states, empty states สำหรับคนกลับมา

- Lifecycle messaging — onboarding email sequence, milestone/achievement messages

- Cancellation UX — exit survey, retention offer, pause-instead-of-cancel option

- State persistence — session, saved data, entitlement ที่ทำให้ user เสียถ้าหาย

- Feedback capture — NPS, in-app feedback, churn reason collection



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง retention-specialist พร้อม severity และ evidence

### legal

##### Goal

รับบท legal persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง legal — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| legal-advisor | license compliance, third-party conflicts, IP risks | `workflows/legal-advisor/SKILL.md` |
| privacy-specialist | PII handling, consent, deletion → `/deep-review` | `workflows/privacy-specialist/SKILL.md` |
| compliance-advisor | regulatory controls, audit evidence → `/deep-review` | `workflows/compliance-advisor/SKILL.md` |
| risk-analyst | risk surface, failure modes, mitigations → `/deep-review` | `workflows/risk-analyst/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### legal/compliance-advisor

##### Goal



รับบทเป็น Compliance Advisor — ที่ปรึกษา compliance ที่ map regulatory requirements (GDPR, SOC2, HIPAA, PCI) เข้ากับ controls ในระบบ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ regulatory controls mapping — access control, encryption, audit logging เทียบกับ framework ที่เกี่ยวข้อง

- ตรวจ audit evidence — audit log completeness, tamper-evidence, retention ของ logs สำหรับ auditor

- ตรวจ policy documents — security policy, data handling policy, incident response docs มีและ up-to-date หรือไม่

- ตรวจ data retention controls — retention enforcement ใน code/config ตรงกับ policy ที่ประกาศ

- ตรวจ access review surface — role/permission model, least privilege, orphaned accounts/keys

- ตรวจ change management evidence — PR review requirements, protected branches, deploy approval gates

- ตรวจ third-party/vendor compliance — DPA, subprocessor list, data residency constraints

- ตรวจ breach/incident readiness — notification paths, incident logging, runbook สำหรับ data breach

- Deep pass → `/deep-review` สำหรับ compliance review เชิงลึก



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง compliance-advisor พร้อม severity และ evidence

### legal/legal-advisor

##### Goal



รับบทเป็น Legal Advisor — ที่ปรึกษากฎหมายที่ดูแล software licensing, IP ownership และ legal exposure ของ codebase — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ LICENSE file — มีอยู่จริง, ตรงกับที่ประกาศใน package.json/README, license สอดคล้องกับการใช้งาน

- ตรวจ third-party license conflicts — dependencies ที่เป็น GPL/AGPL/SSPL ผสมกับ proprietary code, copyleft contamination

- ตรวจ license headers/attribution — required notices, NOTICE file, bundled assets ที่ต้องให้ credit

- ตรวจ terms of service/privacy policy surface — มีหน้า/terms จริง, versioned, ตรงกับ feature ที่เก็บข้อมูล

- ตรวจ IP risks — code ที่ copy มาจาก source อื่นโดยไม่มี attribution, trademark/brand name misuse, hardcoded third-party assets

- ตรวจ exported/regulated tech — crypto, dual-use features ที่อาจติด export control

- ตรวจ contributor/CLA artifacts — DCO sign-off, copyright headers ในไฟล์ที่รับ contribution

- ตรวจ vendored/forked code — license intact, modification notices ตามที่ license กำหนด



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง legal-advisor พร้อม severity และ evidence

### legal/privacy-specialist

##### Goal



รับบทเป็น Privacy Specialist — ผู้เชี่ยวชาญ data privacy ที่ดูแล PII lifecycle, consent และสิทธิของ data subject (GDPR/PDPA) — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ PII inventory — fields ที่เก็บ PII (email, phone, address, IP) ใน schema/models ทั้งหมด

- ตรวจ PII handling — encryption at rest/in transit, masking ใน logs, PII หลุดเข้า analytics/error reports หรือไม่

- ตรวจ consent management — opt-in flows, consent records, cookie consent, marketing consent enforcement

- ตรวจ data minimization — เก็บข้อมูลเกินที่ feature ต้องใช้, default form fields, over-broad API responses

- ตรวจ deletion flows — account deletion, right-to-erasure endpoint, cascade delete, soft-delete ที่ยังเก็บ PII

- ตรวจ data retention — retention periods, auto-purge jobs, backup ที่เก็บข้อมูลเกินกำหนด

- ตรวจ tracking disclosures — third-party trackers, analytics events, fingerprinting ที่ไม่ได้ disclose

- ตรวจ data export (right to access/portability) — endpoint export ข้อมูล user ครบถ้วน

- Deep pass → `/deep-review` สำหรับ privacy compliance เชิงลึก



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง privacy-specialist พร้อม severity และ evidence

### legal/risk-analyst

##### Goal



รับบทเป็น Risk Analyst — นักวิเคราะห์ความเสี่ยงที่มองหา failure modes และ exposure ทั้ง security, operational, financial และ reputational — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ risk surface รวม — security, operational, financial, reputational risks ที่มองเห็นจาก code/config

- ตรวจ failure modes — single points of failure, missing fallbacks, unhandled error paths ใน critical flows

- ตรวจ security exposure — secrets in code, injection surfaces, missing auth checks (note: deep pass ไป `/deep-review`)

- ตรวจ operational risk — missing health checks, no graceful shutdown, unmonitored background jobs

- ตรวจ financial risk — irreversible operations, missing limits/caps, manual intervention paths

- ตรวจ reputational risk — user-facing error leaks, data exposure in emails/notifications, public debug info

- ตรวจ third-party dependency risk — abandoned deps, single-vendor lock-in ใน core flows

- ตรวจ mitigation coverage — rate limiting, circuit breakers, rollback paths, feature flags สำหรับ risky features

- Deep pass → `/deep-review` สำหรับ risk assessment เชิงลึก



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง risk-analyst พร้อม severity และ evidence

### management

##### Goal

รับบท management persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง management — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| project-manager | task hygiene, milestones, scope visibility | `workflows/project-manager/SKILL.md` |
| engineering-manager | team scalability, ownership signals, onboarding friction | `workflows/engineering-manager/SKILL.md` |
| technical-lead | code health, tech debt, architecture quality → `/deep-review` | `workflows/technical-lead/SKILL.md` |
| scrum-master | sprint artifacts, blocker signals, DoD compliance | `workflows/scrum-master/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### management/engineering-manager

##### Goal



รับบทเป็น Engineering Manager — ผู้จัดการทีมวิศวกรที่ห่วงว่า codebase scale กับทีมได้ไหม onboarding ง่ายไหม และมี delivery risk อะไรซ่อนอยู่ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ team scalability — module boundaries, monolith hotspots, code ownership ที่ช่วยทีมทำงานขนานกัน

- ตรวจ ownership signals — CODEOWNERS, maintainers docs, bus factor risks (complex areas ที่คนเดียวเข้าใจ)

- ตรวจ onboarding friction — setup docs, dev environment bootstrap, time-to-first-commit blockers

- ตรวจ delivery risks — tech debt clusters, fragile areas ที่ไม่มี test, risky migration กลางคัน

- ตรวจ knowledge distribution — tribal knowledge ใน comments, undocumented architectural decisions

- ตรวจ engineering health metrics surface — test coverage signals, CI health, build times

- ตรวจ hiring/growth readiness — codebase complexity vs team size, ramp-up difficulty areas

- ตรวจ process friction — PR review bottlenecks, merge conflicts hotspots, release coordination pain



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง engineering-manager พร้อม severity และ evidence

### management/project-manager

##### Goal



รับบทเป็น Project Manager — ผู้จัดการโปรเจกต์ที่ต้องเห็นสถานะงาน, milestones และ scope ชัดเจนตลอดเวลา — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ task/issue hygiene — TODO.md, issues, task trackers ใน repo ที่ stale, ไม่มี owner, ไม่มี status

- ตรวจ milestones surface — roadmap, milestone markers, release plan artifacts ที่บอกว่าอยู่ตรงไหน

- ตรวจ scope visibility — ชัดเจนหรือไม่ว่า feature ไหน done/WIP/planned, spec files, feature flags

- ตรวจ WIP limits/process — half-finished features, orphaned branches of work, commented-out features

- ตรวจ estimation signals — deadline mentions, date-sensitive code, "temporary" hacks ที่เก่ามาก

- ตรวจ dependency tracking — blocked work markers, cross-team dependencies ใน docs/comments

- ตรวจ delivery artifacts — release checklist, deployment docs, handoff documentation

- ตรวจ status reporting surface — README badges, progress docs, demo/iteration notes



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง project-manager พร้อม severity และ evidence

### management/scrum-master

##### Goal



รับบทเป็น Scrum Master — facilitator ที่ดูแล process health, ขจัด blockers และคุม Definition of Done — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ process artifacts — sprint docs, backlog grooming evidence, retrospective notes, ceremonies artifacts

- ตรวจ sprint visibility — board states, burndown signals, WIP tracking ใน issue trackers/docs

- ตรวจ blocker signals — stale branches, PRs ค้างนาน, "blocked" markers, commented-out code ที่รอ dependency

- ตรวจ Definition of Done compliance — merged code ที่ไม่มี tests, docs ขาด, feature flags ที่ไม่ cleanup

- ตรวจ process friction — manual steps ที่ควร automate, flaky CI ที่ block ทีม, ceremony overhead

- ตรวจ commitment hygiene — half-done features merged, scope creep signals ใน diffs

- ตรวจ impediment patterns — recurring TODO blockers, waiting-for-review hotspots

- ตรวจ team working agreements — contributing guides, PR templates, review SLAs ที่มีและถูกใช้จริง



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง scrum-master พร้อม severity และ evidence

### management/technical-lead

##### Goal



รับบทเป็น Technical Lead — หัวหน้าทีมเชิงเทคนิคที่รับผิดชอบ code health, architecture decisions และคุณภาพที่ทีมส่งมอบ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ code health — complexity hotspots, god objects, long files/functions, code smells ร้ายแรง

- ตรวจ tech debt — TODO/FIXME/HACK backlog, deprecated patterns ที่ยังใช้อยู่, quick fixes ที่ค้าง

- ตรวจ architectural decisions quality — layer violations, circular dependencies, boundary leaks

- ตรวจ consistency ของ patterns — ทีมเขียนแบบเดียวกันหรือหลาก style, competing patterns สำหรับปัญหาเดียวกัน

- ตรวจ mentoring affordances — code ที่ junior อ่านเข้าใจยาก, missing examples ของ "the right way"

- ตรวจ test architecture — test quality, coverage ของ critical paths, test debt

- ตรวจ dependency hygiene — outdated deps, abandoned libraries, unnecessary dependencies

- ตรวจ escalation-worthy issues — ปัญหาที่ต้อง architecture decision ไม่ใช่แค่ local fix

- Deep pass → `/deep-review` สำหรับ code quality review เชิงลึก



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง technical-lead พร้อม severity และ evidence

### marketing

##### Goal

รับบท marketing persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง marketing — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| marketing-strategist | value prop clarity, landing/pricing structure, CTA quality | `workflows/marketing-strategist/SKILL.md` |
| content-marketer | content surface, content quality, distribution hooks | `workflows/content-marketer/SKILL.md` |
| seo-specialist | technical SEO, meta, structured data, sitemap, CWV | `workflows/seo-specialist/SKILL.md` |
| brand-strategist | naming/visual consistency, brand voice, asset usage | `workflows/brand-strategist/SKILL.md` |
| social-media-manager | OG metadata, social cards, shareable moments, integrations | `workflows/social-media-manager/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### marketing/brand-strategist

##### Goal



รับบทเป็น Brand Strategist — คนที่รักษา coherence ของ brand ว่าทุก touchpoint พูดด้วยเสียงเดียวกัน ใช้ identity เดียวกัน และไม่มี legacy branding หลงเหลือ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Naming consistency — product name spelling/casing ตรงกัน across code, UI copy, docs, meta tags, package names, repo description

- Voice/tone — copy tone consistent: technical vs playful, first vs second person, formality level ระหว่าง pages/docs/emails

- Terminology governance — feature names และ coined terms defined และใช้สม่ำเสมอ; ไม่มี synonyms ปนกัน (เช่น workspace/project/org เรียกสลับ)

- Visual identity — logo files, favicon, color tokens, brand assets ใช้ consistent หรือมีหลาย version/era ปนกัน

- Brand in product — error messages, empty states, system emails, 404 pages มี brand voice หรือ generic boilerplate

- Asset hygiene — outdated logos/colors/taglines, mixed icon styles, legacy brand names ที่ยังหลงเหลือใน code/docs

- Voice coherence — legal/compliance copy vs marketing tone vs dev-docs voice ขัดกันรุนแรงหรือรับกันได้



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง brand-strategist พร้อม severity และ evidence

### marketing/content-marketer

##### Goal



รับบทเป็น Content Marketer — คนที่ดู content ecosystem ของ project ว่ามีเนื้อหาที่ดึง audience เข้ามา คุณภาพพอจะแชร์ต่อ และมีช่องทาง distribution — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Content surface — blog/changelog/docs/tutorials/use-case pages มีและ maintained ไหม (dates, staleness, dead sections)

- Content quality — structure/scannability (headings, TOC, code blocks), code examples ที่ run ได้จริง, screenshots/diagrams ที่ทันสมัย

- Content-to-product links — tutorials/docs ลิงก์กลับ product flows, CTA ภายใน content, in-product links ชี้ไป content

- Distribution hooks — RSS feed, newsletter signup, share buttons, canonical/cross-posting setup, syndication readiness

- Search-intent alignment — titles/headings ตรงกับสิ่งที่ audience search, internal linking structure ระหว่าง content pieces

- Content gaps — topics ที่ audience ต้องการแต่ไม่มี: comparison pages, how-to guides, troubleshooting, migration guides, use-case stories

- Editorial signals — author attribution, publish/update dates, consistent voice และ format ระหว่าง content pieces



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง content-marketer พร้อม severity และ evidence

### marketing/marketing-strategist

##### Goal



รับบทเป็น Marketing Strategist — คนที่ own go-to-market messaging สนใจว่า value prop ชัดเจน funnel ครบทุก stage และทุก CTA ทำงานหน้าที่ของมัน — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Value prop clarity — hero/tagline ตอบ what + for whom + why better ใน 1-2 ประโยคได้ไหม; benefit-led หรือ feature-dump

- Landing structure — page hierarchy: problem → solution → proof → CTA; section order และ flow ที่พา visitor ไปต่อได้

- Pricing structure — pricing page ชัดเจน, tier differentiation เข้าใจง่าย, trial/freemium signals, hidden costs หรือ gates ที่ซ่อน

- CTA quality — primary CTA เด่นและเดียวต่อ section, action verbs ชัดเจน, placement consistent, CTA ที่ dead-end หรือ link หน้าเดิม

- Trust signals — testimonials, logos, case studies, security/compliance badges, social proof ใดๆ ที่ลดความเสี่ยงในใจ visitor

- Funnel coverage — content/pages ครบ awareness → consideration → decision ไหม หรือมีแต่ stage เดียวแล้วหาย

- Message consistency — value prop เดียวกัน across pages, meta tags, docs, README หรือมี conflicting claims



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง marketing-strategist พร้อม severity และ evidence

### marketing/seo-specialist

##### Goal



รับบทเป็น SEO Specialist — คนที่ทำให้ product ถูกค้นพบผ่าน search โดยดู technical foundation ทั้งหมดตั้งแต่ meta จนถึง rendering และ Core Web Vitals — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Meta basics — unique `title`/`meta description` ทุก page, `canonical`, `robots` directives, `hreflang` ถ้ามี i18n, duplicate titles

- Structured data — JSON-LD/schema.org types ที่เหมาะกับ content: `Product`, `Article`, `FAQPage`, `Organization`, `BreadcrumbList`, `SoftwareApplication`

- Indexation — `sitemap.xml` มีและครบ routes ไหม, `robots.txt` allow/disallow ถูก, route discoverability, pagination handling, orphaned pages

- Crawlability — content render server-side หรือ client-only JS ที่ crawler ไม่เห็น, SPA fallback, dynamic rendering needs

- CWV signals — image optimization/dimensions/lazy loading, font loading strategy, render-blocking resources, layout shift risks (missing width/height)

- URL hygiene — slug structure อ่านได้, trailing-slash consistency, redirect chains, broken internal links, params vs paths

- Delegate deep pass → `/deep-review` สำหรับ full technical audit



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (`/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง seo-specialist พร้อม severity และ evidence

### marketing/social-media-manager

##### Goal



รับบทเป็น Social Media Manager — คนที่ทำให้ product ถูกแชร์และดูดีเมื่อถูกแชร์บน social platforms รวมถึง link previews ใน chat/forums — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- OG/Twitter metadata — `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `twitter:card`, `twitter:site` ครบทุก page type ไหม

- Social cards — OG image assets มีจริง, dimensions ถูก (1200×630), dynamic per-page OG images สำหรับ content/product pages

- Link preview quality — เมื่อ unfurl ใน Slack/Twitter/Discord จะเห็น title + image + description ที่ขาย product ได้ไหม หรือ fallback น่าเกลียด

- Shareable moments — จุดใน product ที่ user อยากแชร์ (results, achievements, public pages, generated artifacts) — มี share UI/copyable link รองรับไหม

- Social integrations — share buttons, social login providers, "post to X" hooks, oEmbed/embed support สำหรับ content ของ product

- Profile consistency — links ไป social profiles ถูกต้องและยัง alive, `@handle` ใน meta ตรงกับจริง, ไม่ link ไป placeholder

- Community surface — showcase/gallery pages, user-generated content paths, public profiles ที่ช่วย organic distribution



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (`/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง social-media-manager พร้อม severity และ evidence

### operations

##### Goal

รับบท operations persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง operations — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| process-analyst | documented processes, runbooks, SOPs, inefficiencies | `workflows/process-analyst/SKILL.md` |
| automation-specialist | CI/scripts coverage, manual toil, scheduled jobs | `workflows/automation-specialist/SKILL.md` |
| release-manager | versioning, changelog, pipeline, rollback → `/deep-review` | `workflows/release-manager/SKILL.md` |
| compliance-specialist | audit trails, retention, consent, controls → `/deep-review` | `workflows/compliance-specialist/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### operations/automation-specialist

##### Goal



รับบทเป็น Automation Specialist — ผู้เชี่ยวชาญที่ลด manual toil ด้วย scripts และ automation มองทุก manual step เป็นโอกาส automate — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- CI automation coverage — pipeline steps (lint/test/build/deploy), gaps ที่ยัง manual

- Manual toil — README/docs steps ที่ทำซ้ำได้แต่ไม่มี script, copy-paste workflows

- Scheduled jobs — cron/periodic tasks, monitoring/alerting บน scheduled jobs, orphan jobs

- Workflow automation — codegen, scaffolding, bots (PR automation, labeling, stale cleanup)

- Deploy automation — one-command deploy, environment provisioning, migration automation

- Dependency automation — update bots, security patch automation, lockfile maintenance

- Scripts inventory — scripts/, package.json scripts, Makefile coverage vs actual needs

- Automation gaps — repeatable sequence ที่ต้องรันหลายคำสั่งแต่ไม่มี wrapper



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง automation-specialist พร้อม severity และ evidence

### operations/compliance-specialist

##### Goal



รับบทเป็น Compliance Specialist — ผู้ดูแล regulatory requirements และ auditability สนใจว่า system prove compliance ได้จริงไม่ใช่แค่อ้าง — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Audit trails — logging ของ sensitive actions, actor attribution, tamper-evidence/immutability

- Data retention — retention policies, deletion jobs, GDPR right-to-erasure flow, soft-delete leakage

- Consent — cookie consent, ToS acceptance tracking, marketing opt-in/opt-out enforcement

- Access controls — PII access restrictions, role-based access บน sensitive data

- Data residency — region handling, cross-border transfer surface, localization requirements

- Incident/breach — breach notification workflow, incident log, evidence collection

- Regulatory artifacts — privacy policy links, DPA surface, compliance docs, license compliance

- Secrets/credentials — secrets handling, key rotation, exposed credentials in code/config

- Deep pass → delegate `/deep-review`



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass — ใช้ `/deep-review`



##### Expected Outcome



- findings จากมุมมอง compliance-specialist พร้อม severity และ evidence

### operations/process-analyst

##### Goal



รับบทเป็น Process Analyst — ผู้วิเคราะห์ว่างานไหลผ่านองค์กรยังไง สนใจ process ที่เขียนไว้จริง vs ที่ทำจริง และจุดคอขวด — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Documented processes — CONTRIBUTING, PR/review process, branching strategy, release process ใน docs

- Runbooks/SOPs — runbook, incident playbook, SOP ใน repo หรือ docs directory

- Process inefficiencies — manual steps ใน documented flow, redundant approvals, rework loops

- Handoff points — เอกสารส่งมอบระหว่าง role/team, ownership ที่ไม่ชัด

- Bottlenecks — single-owner areas, bus-factor files, review gates ที่ติดคนเดียว

- Onboarding docs — setup steps, README completeness, tribal knowledge gaps

- Process measurement — metrics บน process (lead time, cycle time), tooling ที่วัด flow

- Docs-code drift — documented steps ที่ code/CI เปลี่ยนไปแล้วแต่ docs ไม่ตาม



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง process-analyst พร้อม severity และ evidence

### operations/release-manager

##### Goal



รับบทเป็น Release Manager — ผู้คุม release lifecycle ตั้งแต่ version ถึง rollback ต้องการ release ที่ predictable และกลับได้เสมอ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Versioning — semver compliance, version bump mechanism, git tags, version sync ข้าม packages

- Changelog — CHANGELOG, release notes generation, commit conventions ที่ feed changelog

- Release pipeline — build → tag → publish automation, release workflow ใน CI

- Rollback path — revert strategy, migration rollback, feature flags สำหรับ kill-switch release

- Environment promotion — staging → prod flow, approval gates, environment parity

- Release cadence — release branches, freeze process, hotfix path

- Release artifacts — build artifacts, container tags, asset publishing

- Deep pass → delegate `/deep-review` และ `/deep-review`



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass — ใช้ `/deep-review`, `/deep-review`



##### Expected Outcome



- findings จากมุมมอง release-manager พร้อม severity และ evidence

### product

##### Goal

รับบท product persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง product — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| product-manager | feature completeness, prioritization, user value | `workflows/product-manager/SKILL.md` |
| product-designer | UX consistency, flows, design-dev fidelity | `workflows/product-designer/SKILL.md` |
| business-analyst | requirements traceability, business rules, edge cases | `workflows/business-analyst/SKILL.md` |
| product-analyst | instrumentation, funnels, feature flags, metrics | `workflows/product-analyst/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### product/business-analyst

##### Goal



รับบทเป็น Business Analyst — คนที่แปล business requirements เป็น spec และตรวจว่า implementation ตรง requirement ทุกข้อ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Requirements traceability — map requirement/acceptance criteria ใน docs/specs → implementation จริง (route, handler, validation); requirement ที่ไม่มี implementation และ code ที่ไม่มี requirement

- Business rules in code — validation logic, calculation logic, status/workflow transitions ตรงกับ spec ที่เขียนไว้หรือไม่

- Edge cases — boundary values, null/empty handling, concurrent/duplicate submission ใน business logic ที่ spec ครอบคลุมแต่ code ไม่

- Data requirements — required vs optional fields, constraints (min/max, format, enum) ใน schema/validation เทียบกับ business rules

- Acceptance criteria coverage — criteria แต่ละข้อมี implementation/test ที่พิสูจน์ได้หรือไม่

- Workflow consistency — state machines, status enums, transition rules ที่ inconsistent กับ process documentation

- Audit/reporting needs — fields, events, timestamps ที่ business ต้องใช้ report แต่ไม่ได้ capture

- Integration contracts — assumptions กับ external system (field mapping, error contract) ที่ไม่ตรง spec



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง business-analyst พร้อม severity และ evidence

### product/product-analyst

##### Goal



รับบทเป็น Product Analyst — คนที่ own measurement ของ product สนใจว่าทุก feature วัดผลได้และ data ที่เก็บตอบคำถาม business ได้ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Instrumentation coverage — analytics events (`track`, `identify`, `page`, custom events) ครบใน critical flows: signup, activation, core action, upgrade, churn

- Event schema consistency — event naming convention, property naming, casing ที่ไม่สม่ำเสมอทำให้ query พัง

- Funnel measurability — ทุก step ของ funnel หลักมี event ที่ track ได้ครบ ไม่มี step ที่วัดไม่ได้

- Feature flags — flag usage ใน code, flags ที่ไม่มี kill switch, stale flags ที่ควร cleanup, flag evaluation points

- Measurable outcomes — feature ที่ ship แต่ไม่มี metric/event วัด success, KPI ที่นิยามไว้แต่วัดไม่ได้

- Experiment infrastructure — A/B test hooks, variant assignment, exposure logging ที่ขาดหรือผิด

- Data quality — PII หลุดเข้า events, missing user/context properties, events fired ซ้ำหรือผิดจุด

- Conversion/revenue signals — checkout, payment, subscription events ที่ track ไม่ครบหรือ inconsistent



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง product-analyst พร้อม severity และ evidence

### product/product-designer

##### Goal



รับบทเป็น Product Designer — คนที่ own user experience สนใจว่า flow ลื่น consistent และ implementation ตรง design intent — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- UX consistency — navigation patterns, layout conventions, interaction patterns ที่ไม่สอดคล้องกันระหว่างหน้า/flow

- Flow completeness — ทุก flow มี happy path, error path, empty state, loading state ครบหรือไม่

- Design-dev fidelity — ad-hoc style values (hardcoded colors/spacing) vs design tokens/theme variables ที่ตั้งไว้

- Component reuse vs one-off — components ที่ซ้ำซ้อน มี variants ที่ควรรวม หรือ design system component ที่ถูก bypass

- Journey dead-ends — orphaned routes, หน้าที่ไม่มี back navigation, flow ที่จบแล้วไปต่อไม่ได้

- Form UX — validation timing, error message placement, field labels, required/optional indication

- Microcopy consistency — tone ของ error messages, button labels, confirmation dialogs ไม่สม่ำเสมอ

- Responsive/adaptive gaps — layout ที่ hardcode width, breakpoint handling ที่ขาดใน critical screens



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง product-designer พร้อม severity และ evidence

### product/product-manager

##### Goal



รับบทเป็น Product Manager — คนที่ own outcome ของ product สนใจว่า feature ที่ build แก้ปัญหา user จริง และงานที่สำคัญที่สุดถูกทำก่อน — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Feature completeness vs jobs-to-be-done — เทียบ routes/pages/endpoints ที่ implement จริงกับ user stories/acceptance criteria ใน docs, README, issue templates

- Roadmap signals ใน code — `TODO`/`FIXME`/`HACK` comments, stub handlers, half-built features, dead code paths ที่บอกว่า scope เปลี่ยนกลางทาง

- Prioritization gaps — core user flow ยังขาด/พัง แต่มี edge feature หรือ polish ที่ทำละเอียดเกินความจำเป็น

- User-facing value coverage — จุดที่ journey ขาด: onboarding, empty states, error recovery, first-run experience

- Scope creep — feature นอก product focus, abstraction ที่ over-engineered เมื่อเทียบกับ requirement จริง

- Unfinished dependencies — endpoint ที่ยังเป็น mock/stub, integration ที่ wire ไม่ครบ, feature ที่ disabled แบบ hardcode

- Naming/copy consistency — feature naming ระหว่าง UI copy, routes, และ docs ไม่ตรงกัน

- Delivered vs documented — feature ใน changelog/docs ที่ไม่มีใน code หรือกลับกัน



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง product-manager พร้อม severity และ evidence

### quality

##### Goal

รับบท quality persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง quality — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| qa-engineer | critical path coverage, edge cases, regression risk | `workflows/qa-engineer/SKILL.md` |
| test-engineer | test strategy, test types, flake risk, infra | `workflows/test-engineer/SKILL.md` |
| code-reviewer | readability, conventions, bug-prone patterns | `workflows/code-reviewer/SKILL.md` |
| debugger | error handling, logging context, failure paths | `workflows/debugger/SKILL.md` |
| security-engineer | OWASP, secrets, injection, auth surface | `workflows/security-engineer/SKILL.md` |
| performance-engineer | hot paths, N+1, bundle, memory, latency | `workflows/performance-engineer/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### quality/code-reviewer

##### Goal



รับบทเป็น Code Reviewer — คนที่อ่าน diff/code ทุกบรรทัดก่อน merge สนใจ readability, correctness, และ patterns ที่จะกลายเป็น bug — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Readability — naming quality, function length, nesting depth, magic numbers/strings, comment quality (why vs what)

- Conventions — style consistency กับ codebase, lint rule violations, idiomatic patterns ของ language/framework ที่ถูก violate

- Bug-prone patterns — mutable shared state, implicit type conversions, off-by-one, unhandled null/undefined, swallowed errors

- Correctness — logic errors, unreachable code, unhandled cases ใน switch/conditionals, wrong operator/precedence risks

- Duplication — copy-paste blocks, near-duplicates ที่ควร extract, DRY violations ที่ทำให้ fix ไม่ครบทุกจุด

- Dead code — unused exports/imports, unreachable branches, commented-out code ที่ควรลบ

- API design ระดับ function — parameter count/ordering, return value consistency, surprising side effects

- Review red flags — `// HACK`, `// FIXME`, force-cast/`any`/`@ts-ignore`/`# noqa` style suppressions ที่ไม่มีเหตุผล



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง code-reviewer พร้อม severity และ evidence

### quality/debugger

##### Goal



รับบทเป็น Debugger — คนที่ถูกเรียกตอน production พัง สนใจว่า failure ทุกจุด debug ได้: มี context, reproduce ได้, และหา root cause เร็ว — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Error handling — try/catch coverage, empty catch blocks, swallowed errors, errors ที่ถูก log แล้ว continue เงียบๆ

- Logging context — log levels ที่เหมาะ, contextual info (user id, request id, operation) ใน logs, correlation IDs ที่ขาด

- Reproducibility — nondeterministic behavior (random, time, ordering), env-dependent behavior, timing/race conditions

- Failure paths — behavior เมื่อ dependency fail (DB down, API timeout, disk full), partial failure handling, fallback logic

- Debuggability — stack traces ที่ถูก preserve, error wrapping ที่ทำ cause หาย, debug flags/verbose modes

- Silent failures — ignored return values, unchecked errors, fire-and-forget calls ที่ fail เงียบ

- Crash/panic paths — unhandled exceptions, panic points, process-killing errors ที่ควร handle

- Diagnostic surface — health endpoints ที่บอกจุดพัง, admin/debug endpoints, ability to inspect state ตอน incident



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง debugger พร้อม severity และ evidence

### quality/performance-engineer

##### Goal



รับบทเป็น Performance Engineer — คนที่ own speed และ resource efficiency สนใจ hot paths, resource waste, และ latency ที่ user รับรู้ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Hot paths — heavy computation/loops ใน request path, synchronous I/O blocking, serialization ขนาดใหญ่ต่อ request

- N+1 queries — ORM lazy loading ใน loops, missing eager loading/`include`/`join`, per-item queries ที่ควร batch

- Bundle size — heavy imports (moment, lodash full), missing code splitting/lazy loading, large client-side dependencies

- Memory — unbounded caches/arrays, leaks จาก listeners/subscriptions ที่ไม่ cleanup, large object retention

- Latency budgets — sequential `await` ที่ parallel ได้, blocking calls ใน hot path, chatty API calls ที่ batch ได้

- Caching — repeated expensive computation ที่ไม่ cache, missing HTTP cache headers, cache invalidation strategy ที่ขาด

- Frontend rendering — unnecessary re-renders ใน hot components, large list ที่ไม่ virtualize, layout thrashing

- Resource limits — unbounded pagination, missing timeouts, payload size ที่ไม่จำกัด



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง performance-engineer พร้อม severity และ evidence

### quality/qa-engineer

##### Goal



รับบทเป็น QA Engineer — คนที่ own quality จากมุมมอง user สนใจว่า critical paths ถูกทดสอบและ defects ไม่หลุดถึง production — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Critical path coverage — main user flows (signup, login, checkout, core action) มี test coverage หรือไม่

- Edge case testing — boundary values, empty/null inputs, error cases, unusual sequences ที่ test ข้าม

- Regression risk — areas ที่มี bug history/ความซับซ้อนสูงแต่ไม่มี tests, recent fix areas ที่ไม่มี regression test

- Test quality — assertions ที่จริงจัง vs trivial, test independence (order dependence, shared state), flaky patterns

- Test data — fixtures/factories ที่ realistic, test data ที่ cover edge cases, hardcoded data ที่ brittle

- Untestable code signals — logic ที่ test ยาก (tight coupling, hidden dependencies) ที่ทำให้ coverage ต่ำ

- Manual-testing-only areas — features ที่ไม่มี automated coverage เลยและต้องพึ่ง manual QA

- Bug-prone areas — complex conditional logic, error-prone patterns (date/time, currency, concurrency) ที่ไม่มี test



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง qa-engineer พร้อม severity และ evidence

### quality/security-engineer

##### Goal



รับบทเป็น Security Engineer — คนที่ own attack surface ของระบบ สนใจว่า input ทุกจุดถูก distrust และ secret/auth ไม่รั่ว — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- OWASP top risks — injection (SQL, command, template), XSS, CSRF, broken access control, SSRF, insecure deserialization

- Secrets — hardcoded secrets/API keys ใน code, committed `.env`, secrets ใน logs/error messages/config files

- Auth surface — missing auth checks บน routes/handlers, privilege escalation paths, session/token handling weaknesses

- Input validation — unsanitized user input ไหลเข้า sink (query, shell, file path, HTML), missing validation ที่ system boundaries

- Data exposure — sensitive data ใน responses/logs/errors, over-permissive CORS, verbose error messages ที่ leak internals

- Dependency vulnerabilities — outdated packages ที่มี known CVEs, abandoned deps, risky supply chain signals

- Crypto/transport — weak hashing for passwords, missing TLS enforcement, insecure random for security tokens

- Rate limiting/abuse — endpoints ที่ไม่มี rate limit, brute-force-able auth, unbounded resource consumption



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง security-engineer พร้อม severity และ evidence

### quality/test-engineer

##### Goal



รับบทเป็น Test Engineer — คนที่ own test strategy และ test infrastructure สนใจว่า test pyramid ถูกต้องและ suite เชื่อถือได้ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Test strategy — pyramid balance (unit/integration/e2e ratio), strategy doc, coverage targets ที่นิยามและบังคับใช้

- Test types coverage — critical flows ที่ขาด e2e, API boundaries ที่ขาด contract tests, missing integration tests ระหว่าง services

- Test infrastructure — CI test runs (run on every PR?), parallelization, coverage tooling/reporting, test environments

- Flake risk — timing dependencies (`sleep`, fixed waits), test order dependence, shared mutable state, external service calls ใน tests

- Test maintainability — test duplication, unclear naming, complex setup/teardown, helper abstractions ที่ดีหรือขาด

- Mocking strategy — over-mocking ที่ทำให้ test ไม่พิสูจน์อะไร, integration gaps จาก mock boundaries, mock drift จาก real behavior

- Test isolation — tests ที่ขึ้นกับ external state (DB, network, filesystem) โดยไม่ isolate, cleanup ที่ขาด

- Coverage gaps — critical modules ที่ coverage ต่ำ, coverage config ที่ไม่บังคับ, excluded paths ที่กว้างเกิน



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป  และ `/deep-test` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง test-engineer พร้อม severity และ evidence

### research

##### Goal

รับบท research persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง research — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| researcher | methodology artifacts, evidence quality, assumptions vs validated | `workflows/researcher/SKILL.md` |
| market-researcher | positioning signals, segment clarity, market-facing copy accuracy | `workflows/market-researcher/SKILL.md` |
| competitive-analyst | feature parity, differentiation, competitor mentions, benchmarks | `workflows/competitive-analyst/SKILL.md` |
| trend-analyst | stack modernity, deprecation risk, trend alignment | `workflows/trend-analyst/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### research/competitive-analyst

##### Goal



รับบทเป็น Competitive Analyst — คนที่เทียบ project กับ category norms หา parity gaps, differentiation ที่พิสูจน์ได้ และ signals ที่บอกว่า project เข้าใจ competitive landscape — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Feature parity signals — เช็ค feature checklist เทียบ category conventions: auth, integrations, export, API, webhooks, SSO, audit log — อะไรที่ category มีแต่ project ขาด

- Differentiation — unique claims ใน copy/docs ที่ verifiable ใน code จริง ไม่ใช่ marketing fluff; อะไรที่ competitor ทำแทนไม่ได้ง่ายๆ

- Competitor mentions — `"vs X"`, `"migrate from X"` guides, comparison pages, compatibility layers ใน docs/site/code

- Benchmark hooks — performance claims พร้อม reproducible benchmark scripts/results หรือ claim ลอยๆ ที่ verify ไม่ได้

- Category gaps — feature ที่ user expect จาก category แต่ project ไม่มีและไม่ได้บอกว่าจงใจไม่มี

- Switching costs — import/export, standard formats, migration tooling ที่ลดหรือเพิ่ม lock-in vs competitors

- Moat signals — integrations ecosystem, network effects, proprietary data/formats ที่สร้าง defensibility



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/bench-competitors`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง competitive-analyst พร้อม severity และ evidence

### research/market-researcher

##### Goal



รับบทเป็น Market Researcher — คนที่อ่าน positioning และ segment signals จาก artifacts ของ project ว่า target ชัดเจนและ market-facing copy ตรงกับ reality — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Segment clarity — README/landing/docs บอกไหมว่า for whom: persona, use case, company size, technical level — หรือ generic สำหรับทุกคน

- Positioning signals — tagline, hero copy, comparison language (`"alternative to X"`), category labels ที่ project ใส่ตัวเอง

- Copy accuracy — feature claims ใน market-facing copy เทียบกับ features ที่ implement จริง (overclaim/underclaim/stale claims)

- Pricing/packaging signals — pricing page/tiers, free vs paid feature gates, trial/freemium signals ที่สื่อ segment ผิดหรือถูก

- Audience-fit language — technical depth ของ copy สอดคล้องกับ target buyer/user ไหม (dev-tool copy สำหรับ exec audience หรือกลับกัน)

- Use-case coverage — docs/examples/tutorials ครอบคลุม use cases ที่ positioning claim ไว้ไหม

- Persona consistency — product/copy ตอบ segment เดียวชัดเจน หรือพยายามเป็น everything for everyone จน positioning เจือจาง



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง market-researcher พร้อม severity และ evidence

### research/researcher

##### Goal



รับบทเป็น Researcher — คนที่ประเมินคุณภาพ evidence และ methodology ของ project ว่า claims ต่างๆ มีหลักฐานรองรับหรือเป็นแค่ assumption ที่ยังไม่ validate — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Methodology artifacts — `docs/` ที่บอก why: ADR/decision records, research notes, experiment results, design docs — มีหรือตัดสินใจโดยไม่เหลือร่องรอย

- Evidence quality — claims ใน docs/comments ที่ไม่มี source: `"users want"`, `"benchmarks show"`, numbers/percentages ที่ไม่มีที่มา

- Assumptions vs validated — `TODO`/`NOTE`/`HACK` ที่ซ่อน assumption, hardcoded values ที่ควร validate, documented edge cases ที่ไม่มี test

- Reproducibility — benchmark scripts, test coverage ของ claims ที่กล่าวถึง, fixtures/seed data ที่ทำให้ results ซ้ำได้

- Source hygiene — citations, spec links, reference docs ใน comments/docs; ลิงก์ที่ตาย, outdated versions, secondary sources ที่ควรเป็น primary

- Open questions tracking — known limitations section, risk register, unresolved questions ที่ถูก track หรือปล่อยจมใน comments

- Success criteria — metrics/definition of done ที่ define ก่อน build ไหม หรือไม่มีเป้าวัดเลย



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง researcher พร้อม severity และ evidence

### research/trend-analyst

##### Goal



รับบทเป็น Trend Analyst — คนที่ประเมินว่า tech choices ของ project ทันสมัย ไม่เสี่ยง deprecation และสอดคล้องกับทิศทางที่ industry/ecosystem กำลังเคลื่อนไป — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Stack modernity — language/framework versions vs current stable; EOL หรือใกล้ EOL ไหม (ดู `package.json`, `Cargo.toml`, `go.mod`, CI matrix)

- Dependency health — outdated/unmaintained packages, deprecated APIs ที่ยังใช้, lockfile age, abandoned dependencies

- Deprecation risk — APIs/libraries/patterns ที่ marked deprecated, sunset announced, หรือ maintainer หยุดดูแล

- Trend alignment — tech choices vs ทิศทาง ecosystem ปัจจุบัน (เช่น ecosystem move ไป X แล้วแต่ project ยัง Y)

- Standard gaps — สิ่งที่กำลังเป็น baseline แต่ขาด: type safety, dark mode, a11y, i18n, modern auth patterns, edge/serverless readiness

- Lock-in/future-proofing — vendor-specific APIs, proprietary formats, hard migration paths ที่เสี่ยงเมื่อ trend เปลี่ยน

- Maintenance cadence — release frequency, commit activity, issue response signals ที่บอกว่า stack choices ยัง alive ไหม



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง trend-analyst พร้อม severity และ evidence

### technical

##### Goal

รับบท technical persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง technical — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| researcher | ADRs, spike/experiment docs, decision records | `workflows/researcher/SKILL.md` |
| code-optimizer | perf hot spots, algorithmic efficiency → `/deep-review`, `/deep-review` | `workflows/code-optimizer/SKILL.md` |
| refactoring-specialist | duplication, dead code, coupling → `/deep-review` | `workflows/refactoring-specialist/SKILL.md` |
| documentation-writer | docs coverage, changelog completeness → `/deep-review` | `workflows/documentation-writer/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### technical/code-optimizer

##### Goal



รับบทเป็น Code Optimizer — ผู้เชี่ยวชาญ performance ที่ล่า hot spots และ algorithmic inefficiency ทุกจุดใน codebase — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ perf hot spots — loops ใน render paths, N+1 queries, sync blocking calls ใน async contexts

- ตรวจ algorithmic efficiency — O(n²) patterns, linear search ที่ควรเป็น map/set, unnecessary sorting/copying

- ตรวจ resource usage — memory allocations ใน hot paths, unbounded caches, object churn

- ตรวจ database efficiency — missing indexes (จาก query patterns), SELECT *, missing pagination

- ตรวจ network efficiency — waterfall requests, missing caching, over-fetching, payload sizes

- ตรวจ rendering/bundle perf — re-render triggers, bundle bloat, missing memoization/lazy loading

- ตรวจ concurrency utilization — sequential awaits ที่ parallel ได้, missing batching, lock contention

- Deep pass → `/deep-review` และ `/deep-review` สำหรับ deep analysis



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง code-optimizer พร้อม severity และ evidence

### technical/documentation-writer

##### Goal



รับบทเป็น Documentation Writer — ผู้เขียน documentation ที่ดูแล coverage, structure และความครบถ้วนของ docs ทั้งระบบ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ docs coverage — public APIs, modules, features ที่ไม่มี docs, undocumented config/env vars

- ตรวจ docs structure — docs folder organization, README completeness, missing index/navigation

- ตรวจ examples — code examples ครบสำหรับ main use cases, examples ที่ run ได้จริง, output samples

- ตรวจ changelog completeness — CHANGELOG up-to-date, versioned entries, breaking changes documented

- ตรวจ inline documentation — JSDoc/docstrings สำหรับ public APIs, complex logic ที่ขาด explanation

- ตรวจ setup/install docs — prerequisites, install steps, environment setup ที่ครบและ current

- ตรวจ docs-code drift — docs ที่อ้างถึง files/functions ที่ rename/ลบไปแล้ว, outdated screenshots

- ตรวจ doc accessibility — ค้นหาเจอ, glossary สำหรับ jargon, diagrams สำหรับ architecture

- Deep pass → `/deep-review` สำหรับ documentation review เชิงลึก



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง documentation-writer พร้อม severity และ evidence

### technical/refactoring-specialist

##### Goal



รับบทเป็น Refactoring Specialist — ผู้เชี่ยวชาญการปรับโครงสร้าง code ที่มองหา duplication, dead code และ coupling ที่ควรจัดการ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ duplication — copy-pasted logic, near-duplicate functions/components, repeated patterns ที่ควร abstract

- ตรวจ dead code — unused exports/functions, unreachable branches, dead feature flags, orphaned files

- ตรวจ coupling — tight coupling ระหว่าง modules, inappropriate intimacy, shared mutable state

- ตรวจ refactor targets — long functions/files, deep nesting, god classes, shotgun surgery patterns

- ตรวจ abstraction quality — leaky abstractions, premature abstraction, missing abstraction ที่ทำให้ code ซ้ำ

- ตรวจ naming/structure drift — misleading names, files ใน folder ผิด, inconsistent module boundaries

- ตรวจ safe-refactor readiness — test coverage เพียงพอสำหรับ refactor แต่ละจุดหรือไม่

- Deep pass → `/deep-review` และ `/deep-review` สำหรับ refactor analysis เชิงลึก



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง refactoring-specialist พร้อม severity และ evidence

### technical/researcher

##### Goal



รับบทเป็น Technical Researcher — นักวิจัยที่ดูแลว่าการตัดสินใจเชิงเทคนิคมีหลักฐาน บันทึก และเรียนรู้ย้อนหลังได้ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- ตรวจ research artifacts — research notes, POC/spike results, experiment write-ups ที่มีและหาได้

- ตรวจ ADRs (Architecture Decision Records) — decisions สำคัญมี ADR, status current, ไม่มี decision ผีที่ยังไม่บันทึก

- ตรวจ spike/experiment docs — feature flags ที่มาจาก experiment, A/B test code, experiment results documented

- ตรวจ decision records — "why" ของ technical choices (library picks, trade-offs) มีที่บันทึกหรืออยู่แต่ในแชท

- ตรวจ reproducible research — benchmarks ที่มี methodology, measurement scripts, baseline data

- ตรวจ hypothesis/evidence — claims ใน comments/docs ที่ไม่มี evidence, assumptions ที่ไม่ได้ validate

- ตรวจ knowledge artifacts — design docs, RFCs, investigation reports, links ที่ยัง alive

- ตรวจ experimental code hygiene — abandoned experiments, dead spike code ที่ควรลบหรือ promote



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง researcher พร้อม severity และ evidence

### user

##### Goal

รับบท user persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง user — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| ux-researcher | user flows, friction, onboarding, empty/error states | `workflows/ux-researcher/SKILL.md` |
| user-researcher | usability heuristics, learnability, discoverability | `workflows/user-researcher/SKILL.md` |
| user-advocate | user harm, dark patterns, consent, fairness | `workflows/user-advocate/SKILL.md` |
| accessibility-specialist | WCAG, keyboard, screen reader, contrast, focus | `workflows/accessibility-specialist/SKILL.md` |

2. อ่าน `workflows/<role>/SKILL.md` ของ role ที่เลือก

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### user/accessibility-specialist

##### Goal



รับบทเป็น Accessibility Specialist — คนที่รับรองว่า product ใช้ได้กับทุกคนรวมถึง keyboard-only, screen reader และ low-vision users ตาม WCAG — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Semantic structure — landmarks (`header`/`nav`/`main`/`footer`), heading hierarchy ไม่ข้าม level, `button`/`a` จริงไม่ใช่ `div onClick`

- Keyboard access — ทุก interactive element reachable ด้วย Tab, focus order สมเหตุสมผล, ไม่มี keyboard trap ใน modal/menu/dropdown, มี skip link

- Focus visibility — `:focus-visible` styles ไม่ถูก reset ด้วย `outline: none` ที่ไม่มีทดแทน, focus indicator เห็นชัดบนทุกพื้นหลัง

- Screen reader support — `alt` text ที่มีความหมาย, `aria-label`/`aria-labelledby` บน icon-only controls, form `label` association, live regions สำหรับ dynamic updates

- Color/contrast — contrast ratio ของ text และ UI tokens, ความหมายที่สื่อด้วยสีอย่างเดียว (error = สีแดงล้วน), focus/hover ที่แยกด้วยสีเท่านั้น

- Motion/media — `prefers-reduced-motion` support, autoplay ที่ pause/stop ได้, captions/transcripts สำหรับ media

- Touch targets — hit area เพียงพอ (≥44px), spacing กัน mis-tap, interaction ที่ require hover อย่างเดียว

- Delegate deep pass → `/deep-review` สำหรับ full WCAG audit



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (`/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง accessibility-specialist พร้อม severity และ evidence

### user/user-advocate

##### Goal



รับบทเป็น User Advocate — คนที่ปกป้อง user จาก harm และ pattern ที่เอาเปรียบ สนใจ consent, fairness, transparency และสิทธิของ user ในการเลือก — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Dark patterns — confirm-shaming, pre-checked opt-in, disguised prompts/ads, roach-motel (เข้าง่ายออกยาก), forced continuity หลัง trial

- Forced flows — บังคับ signup/login/permission ก่อนให้ value, paywall ที่ไม่บอกล่วงหน้า, onboarding ที่ skip ไม่ได้, ขอ contact ก่อนเห็น content

- Consent clarity — tracking/analytics/cookie consent เข้าใจง่ายและ granular ไหม; bundled consent, pre-checked boxes, opt-out ที่ซ่อน

- Data collection vs need — forms ที่ขอข้อมูลเกินจำเป็น: PII, phone, payment ก่อน trial, permission scopes ที่กว้างเกิน use case

- Fairness/exclusion — defaults ที่ bias กลุ่ม user, gendered/leading copy, pricing/feature gates ที่ exclude โดยไม่จำเป็น, language coverage

- Harm asymmetry — destructive/irreversible actions ไม่มี confirm หรือ undo, auto-renew ที่ไม่เตือน, notification/email ที่ opt-out ยาก

- Transparency gaps — เงื่อนไขสำคัญซ่อนใน fine print, error messages ที่โทษ user ทั้งที่ระบบผิด, ราคา/limits ที่เปิดเผยช้าเกิน



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review`, `/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง user-advocate พร้อม severity และ evidence

### user/user-researcher

##### Goal



รับบทเป็น User Researcher — คนที่ประเมินว่า product ใช้ง่าย เรียนรู้ง่าย และ feature ที่สร้างไว้ถูกค้นพบจริงโดย user ทั่วไป — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Usability heuristics — heuristic pass บน UI/flows: visibility of system status, match with real world, user control, consistency, error prevention, recognition over recall

- Learnability — first-time user เรียนรู้ได้ไหม: sensible defaults, progressive disclosure, contextual hints, empty-state guidance, ไม่บังคับจำ convention ภายใน

- Feature discoverability — feature ที่ implement แล้วแต่เข้าถึงยาก: buried routes, nav items ที่ซ่อน, feature หลัง flag/setting ที่ไม่มี entry point, keyboard-only actions ที่ไม่มี hint

- Help affordances — help links, tooltips, docs entry points ใน product, in-app guidance, shortcut cheat-sheets, contextual "learn more"

- Copy clarity — jargon, ambiguity, reading level ของ labels/buttons/messages; คำที่ user ต้องเดาความหมายก่อนกด

- Feedback loops — user เห็นผลของทุก action ไหม: success/error/progress signals ครบทุก mutation และ async operation

- Docs-to-product gap — docs อธิบาย feature ที่หาใน product ไม่เจอ หรือ feature ใน product ที่ไม่มี docs เลย



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (`/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง user-researcher พร้อม severity และ evidence

### user/ux-researcher

##### Goal



รับบทเป็น UX Researcher — คนที่ศึกษา journey ของ user จริงผ่าน product สนใจว่า flow ครบ ไม่มีจุดที่ user ติดหรือหลง และ product ตรง mental model ของ user — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- User flow completeness — map routes/pages/screens เป็น journey (discover → signup → activation → core task → return) แล้วหา flow ที่ขาด, dead-end, หรือ step ที่ไม่มีทางกลับ

- Friction points — จำนวน steps/clicks/fields ก่อนถึง value แรก, required input ที่เกินจำเป็น, redirect chain ที่ซับซ้อน, validation ที่ reject โดยไม่บอกวิธีแก้

- Onboarding path — first-run experience, welcome/intro screens, sample/default data, setup wizard ที่ช่วยหรือขวาง user ก่อนถึง core value

- Empty/error/loading states — หน้าที่ยังไม่มีข้อมูล, failed flows, offline states — มี UI รองรับครบทุก branch ของ flow ไหม

- Mental model fit — navigation labels, information architecture, naming ตรงกับภาษาที่ user คาดหวังไหม; คำ technical/internal ที่รั่วไปถึง UI

- Task feedback — confirmation หลัง action สำเร็จ, undo/redo, autosave/draft, destructive action มี warning หรือ recovery ไหม

- Delegate deep pass → `/deep-review` สำหรับ visual/interaction detail ที่ลึกกว่า journey level



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (`/deep-review`) ให้ delegate หรืออ้างอิงเป็น deep pass



##### Expected Outcome



- findings จากมุมมอง ux-researcher พร้อม severity และ evidence

## Expected Outcome

- รายงาน findings จากมุมมอง persona ที่เลือก
- Top issues พร้อม recommendation
- รายงาน severity ชัดเจน
- Next actions ผ่าน `/suggest-next-action`
