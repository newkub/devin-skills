# product

Persona details for the `product` category — merged from the original `workflows/product` skill.


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
| product-manager | feature completeness, prioritization, user value | `### product/product-manager` |
| product-designer | UX consistency, flows, design-dev fidelity | `### product/product-designer` |
| business-analyst | requirements traceability, business rules, edge cases | `### product/business-analyst` |
| product-analyst | instrumentation, funnels, feature flags, metrics | `### product/product-analyst` |

2. อ่าน section `### product/<role>` ในไฟล์นี้

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
