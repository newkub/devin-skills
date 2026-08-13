---
name: review-compliance
description: Review compliance: GDPR, privacy, consent, audit, retention, and regulatory requirements
auto_execution_mode: 3
related:
  - /scan-codebase
  - /deep-validate
  - /validate
  - /report
  - /report-format-table
  - /suggest-next-action
  - /review-security
  - /review-auth
---

## Goal

Review compliance ครอบคลุม GDPR, privacy, consent, data retention, audit trail, และ regulatory requirements พร้อม health score

## Scope

ใช้สำหรับ projects ที่มี regulatory / privacy requirements — อยู่ภายใต้ `/review-security` เมื่อ review security ทั้งหมด — security controls, auth, RBAC อยู่ใน `/review-auth` และ `/review-security`

## Execute

### 1. Gather Context

รวบรวม context ก่อน review compliance

> Goal: เข้าใจ regulatory scope และ data handling

1. ทำ `/scan-codebase` เพื่อหา PII handling, consent, data retention
2. ระบุ regulations ที่บังคับใช้: GDPR, CCPA, HIPAA, PCI-DSS, SOC2
3. ระบุ data types: PII, PHI, payment data, sensitive data

### 2. Privacy and Consent

ตรวจสอบ privacy และ consent

> Goal: ข้อมูลส่วนบุคคลถูกจัดการถูกต้อง

1. ตรวจสอบ PII handling, data classification, consent collection
2. ตรวจสอบ consent withdrawal, right to access, right to erasure
3. ตรวจสอบ data export, portability, breach notification process

### 3. Data Retention and Audit

ตรวจสอบ retention และ audit trail

> Goal: ข้อมูลและการกระทำถูกบันทึกและลบตาม policy

1. ตรวจสอบ data retention policies, retention periods, deletion procedures
2. ตรวจสอบ audit trail coverage สำหรับ sensitive actions
3. ตรวจสอบ audit log integrity, immutability, retention

### 4. Regulatory Mapping

ตรวจสอบการ mapping กับ regulation

> Goal: ครอบคลุม requirements ที่บังคับใช้

1. ตรวจสอบ GDPR/CCPA/HIPAA/PCI-DSS controls
2. ตรวจสอบ data residency, cross-border transfer
3. ตรวจสอบ compliance documentation และ DPO contact

### 5. Validate and Report

ตรวจสอบและรายงาน compliance findings

> Goal: รายงาน compliance findings

1. ทำ `/deep-validate`
2. ทำ `/validate`
3. ให้ severity, คำนวณ health score
4. ทำ `/report` พร้อม `/report-format-table`
5. ทำ `/suggest-next-action`

## Rules

### 1. Scope

- ไม่ review security controls เชิงเทคนิค — ใช้ `/review-security`
- ไม่ review auth — ใช้ `/review-auth`
- อยู่ภายใต้ `/review-security` เมื่อ review security ทั้งหมด

### 2. Severity

- Critical: unencrypted PII, no consent management, no data deletion path, missing audit log สำหรับ sensitive action
- High: PII in logs, missing retention policy, incomplete audit coverage, missing GDPR documentation
- Medium: missing consent withdrawal, incomplete data classification
- Low: documentation gap, minor improvement

### 3. Evidence

- ทุก finding ต้องมี file path / config evidence
- ระบุ regulation ที่ impacted

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงาน compliance findings
- Health score
- Regulatory gap analysis
- Next actions
