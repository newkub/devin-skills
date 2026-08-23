---
name: review-compliance
description: Review compliance for regulations, policies, audit, data handling, and privacy
auto_execution_mode: 3
related:
  - /scan-codebase
  - /review-codebase
  - /deep-validate
  - /validate
  - /report
  - /report-table
  - /suggest-next-action

---


## Goal

Review compliance ครอบคลุม regulations, policies, audit, data handling, privacy, consent, data retention, และ regulatory requirements พร้อม review score

## Scope

ใช้กับ projects ที่มี regulatory / privacy / data handling requirements — อยู่ภายใต้ `/review-codebase` เมื่อ review security ทั้งหมด — security controls, auth, RBAC อยู่ใน `/review-codebase`

## Execute

### 1. Analyze

> Goal: วิเคราะห์สถานะปัจจุบันของ compliance

1. ทำ `/scan-codebase` เพื่อหา issues ที่เกียวข้องกับ PII, consent, data retention, และ policies
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ระบุ regulations ที่บังคับใช้: GDPR, CCPA, HIPAA, PCI-DSS, SOC2
4. ระบุ data types: PII, PHI, payment data, sensitive data
5. ถ้าไม่พบ issues ที่เกียวข้อง -> stop และ report

### 2. Review

> Goal: ตรวจสอบ compliance ตาม regulations, policies, audit, data handling — convert action to review

#### 2.1 Regulations and Policies

1. ตรวจสอบ GDPR/CCPA/HIPAA/PCI-DSS/SOC2 controls
2. ตรวจสอบ data residency, cross-border transfer
3. ตรวจสอบ compliance documentation, DPO contact, และ internal policies
4. ตรวจสอบว่า policies (retention, access, classification) ถูก implement ใน code, config, และ process

#### 2.2 Privacy and Data Handling

1. ตรวจสอบ PII handling, data classification, consent collection
2. ตรวจสอบ consent withdrawal, right to access, right to erasure
3. ตรวจสอบ data export, portability, breach notification process
4. ตรวจสอบ data minimization, purpose limitation, และ lawful basis
5. ตรวจสอบ data retention policies, retention periods, deletion procedures

#### 2.3 Audit and Retention

1. ตรวจสอบ audit trail coverage สำหรับ sensitive actions
2. ตรวจสอบ audit log integrity, immutability, retention
3. ตรวจสอบ user attribution, timestamp integrity, และ tamper detection

### 3. Validate and Report

> Goal: รายงาน compliance findings

1. ทำ `/deep-validate`
2. ทำ `/validate`
3. ให้ severity, คำนวณ review score
4. ทำ `/report` พร้อม `/report-table`
5. ทำ `/suggest-next-action`

## Rules

### 1. Scope

- ไม่ review security controls เชิงเทคนิค — ใช้ `/review-codebase`
- ไม่ review auth — ใช้ `/review-codebase`
- อยู่ภายใต้ `/review-codebase` เมื่อ review security ทั้งหมด

### 2. Severity

- Critical: unencrypted PII, no consent management, no data deletion path, missing audit log สำหรับ sensitive action
- High: PII in logs, missing retention policy, incomplete audit coverage, missing GDPR documentation
- Medium: missing consent withdrawal, incomplete data classification
- Low: documentation gap, minor improvement

### 3. Evidence

- ทุก finding ต้องมี file path / config evidence
- ระบุ regulation ที่ impacted

### 4. No Deletions

- ทำ review เท่านั้น ไม่แก้ไขหรือลบ code, data, หรือไฟล์ ระหว่าง review
- ถ้าพบข้อมูลที่ต้องลบ -> รายงานเป็น finding ไม่ดำเนินการเอง

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน compliance findings
- Review score
- Regulatory gap analysis
- Next actions
