# business

Persona details for the `business` category — merged from the original `workflows/business` skill.


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
| business-strategist | business model, pricing/entitlements, moat, alignment | `### business/business-strategist` |
| sales-specialist | demo-ability, trial flow, enterprise features, collateral | `### business/sales-specialist` |
| partnership-manager | API/webhooks/OAuth surface, partner docs, white-label | `### business/partnership-manager` |
| operations-manager | ops workflows, backoffice, manual gaps, escalation | `### business/operations-manager` |

2. อ่าน section `### business/<role>` ในไฟล์นี้

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
