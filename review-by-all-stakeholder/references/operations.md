# operations

Persona details for the `operations` category — merged from the original `workflows/operations` skill.


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
| process-analyst | documented processes, runbooks, SOPs, inefficiencies | `### operations/process-analyst` |
| automation-specialist | CI/scripts coverage, manual toil, scheduled jobs | `### operations/automation-specialist` |
| release-manager | versioning, changelog, pipeline, rollback → `/deep-review-codebase` | `### operations/release-manager` |
| compliance-specialist | audit trails, retention, consent, controls → `/deep-review-codebase` | `### operations/compliance-specialist` |

2. อ่าน section `### operations/<role>` ในไฟล์นี้

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

- Deep pass → delegate `/deep-review-codebase`



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass — ใช้ `/deep-review-codebase`



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

- Deep pass → delegate `/deep-review-codebase` และ `/deep-review-codebase`



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass — ใช้ `/deep-review-codebase`, `/deep-review-codebase`



##### Expected Outcome



- findings จากมุมมอง release-manager พร้อม severity และ evidence
