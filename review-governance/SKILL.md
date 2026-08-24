---
name: review-governance
description: Governance review ครอบคลุง governance ownership policies review process พร้อม review score
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - suggest-next-action
  - validate
---

## Goal

Review governance ของ project ครอบคลุง governance structure, ownership, policies, review process พร้อม aggregate findings และ review score

## Scope

governance review สำหรับ: governance structure (decision making, roles, responsibilities, escalation), ownership (code ownership, module ownership, CODEOWNERS, accountability), policies (coding standards, security, compliance, data, release, branching, contribution), review process (code review, approval, CI checks, merge criteria, review cadence)

## Execute

### 1. Prepare And Scan

เตรียม context ก่อน review

> Goal: เข้าใจ governance structure ใน codebase

1. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ถ้าไม่พบ issues ที่เกี่ยวข้อง → stop และ report

### 2. Governance Review

ตรวจสอบ governance structure

> Goal: ครอบคลุง governance, decision making, roles

1. ตรวจสอบ governance framework: roles, responsibilities, decision making, escalation path
2. ตรวจสอบ project charter, `README`, `CONTRIBUTING`, `GOVERNANCE.md` ถ้ามี
3. ตรวจสอบ communication channels, meeting cadence, RFC process
4. Critical: missing governance for critical decisions, no escalation path, no decision log
5. High: unclear roles, missing project charter, informal decision process

### 3. Ownership Review

ตรวจสอบ code ownership และ accountability

> Goal: ครอบคลุง ownership, CODEOWNERS, module assignment

1. ตรวจสอบ `CODEOWNERS` / `OWNERS` file ครอบคลุมทุก module
2. ตรวจสอบ package / directory ownership assignment
3. ตรวจสอบ accountability สำหรับ security, release, incident
4. Critical: no `CODEOWNERS`, critical path ไม่มี owner, security area ไม่มี owner
5. High: incomplete coverage, outdated owners, overlapping ownership

### 4. Policies Review

ตรวจสอบ policies และ standards

> Goal: ครอบคลุง coding, security, compliance, data, release policies

1. ตรวจสอบ coding standards: style guide, lint config, formatting, conventions
2. ตรวจสอบ security policy: secrets, auth, vulnerability disclosure, incident response
3. ตรวจสอบ compliance policy: GDPR, data retention, licensing, data residency
4. ตรวจสอบ data policy: PII handling, retention, deletion, classification
5. ตรวจสอบ release / branching policy: versioning, CHANGELOG, deprecation, breaking changes
6. ตรวจสอบ contribution policy: PR template, issue template, CLA, code of conduct
7. Critical: no security policy, no compliance policy ถ้ามี regulatory requirements, no data retention policy ถ้ามี PII, no license
8. High: missing coding standards, no CHANGELOG, missing PR template, no incident response process

### 5. Review Process Review

ตรวจสอบ review process และ approval flow

> Goal: ครอบคลุง code review, CI checks, merge criteria

1. ตรวจสอบ code review workflow: required reviewers, approval count, `CODEOWNERS` integration
2. ตรวจสอบ CI / checks ก่อน merge: lint, typecheck, test, security scan
3. ตรวจสอบ merge criteria: passing checks, review approval, status checks
4. ตรวจสอบ review cadence, stale PR handling, review feedback tracking
5. ตรวจสอบ automation for governance: stale issue / PR, security audit, dependency update
6. Critical: no required code review, merge without checks, no CI in critical path
7. High: single reviewer for critical code, missing status checks, no stale PR handling

### 6. Validate And Report

ตรวจสอบ findings ให้คะแนน severity และรายงานผล

> Goal: Issues ถูก validate ครบถ้วน จัดลำดับตาม severity และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ให้ severity: Critical, High, Medium, Low, Info — คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review — ถ้าพบ incomplete implementations → เพิ่มเป็น findings
6. ทำ `/report` พร้อม `/report-table` สร้างตาราง aggregate findings จากทุก section
7. ทำ `/suggest-next-action`

## Rules

### 1. Severity Classification

- Critical: no governance for critical decisions, missing security / compliance / data policy, no code review requirement, no ownership for critical path, no CI in critical path
- High: unclear roles, incomplete ownership, missing coding standards, no CHANGELOG, missing PR template, single reviewer for critical code, missing status checks
- Medium: outdated owner, informal decision process, policy gaps, inconsistent policy enforcement, stale PR handling missing
- Low: documentation gap, naming convention, minor process improvement

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ policy, process, owner ที่เกี่ยวข้อง

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- แยก review process จาก fix process
- ถ้าต้องการแก้ไข ให้ทำ `/resolve-errors` หลัง review

### 4. Scope Boundaries

- focus ที่ governance, ownership, policies, review process
- ไม่ review implementation detail ที่ `/review-codebase` อื่นครอบคลุม
- ถ้าต้องการ drill-down ด้าน security / compliance ให้ทำ `/review-codebase` security / compliance

### 5. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง findings ครอบคลุม governance, ownership, policies, review process
- รายงาน recommended actions พร้อม priority
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
