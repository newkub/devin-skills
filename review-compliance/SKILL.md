---
name: review-compliance
description: Review compliance ครอบคลุม GDPR, CCPA, HIPAA, PCI-DSS, SOC2, consent, DSAR, audit, retention
---

## Goal

Review compliance ครอบคลุมทุก dimension ของ regulatory และ data protection compliance พร้อม aggregate findings และ review score

## Scope

compliance review สำหรับ: GDPR, CCPA, HIPAA, PCI-DSS, SOC2, consent management, data subject rights (DSAR), audit trails, data retention, cross-border transfer, privacy by design

ไม่รวม security review (ใช้ `/review-security`) และ business review (ใช้ `/review-business`)

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ compliance setup ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ compliance setup, data handling, privacy controls
2. ระบุ applicable regulations: GDPR (EU users), CCPA (California users), HIPAA (health data), PCI-DSS (payment), SOC2 (SaaS), regional laws (PDPA Thailand, PDPA Singapore)
3. ระบุ data classification: PII, PHI, payment data, sensitive data, public data
4. ระบุ consent management tool, data retention policy, audit logging setup
5. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
6. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
7. รัน `bun --filter tools-review review:json` เพื่อดึง review report พร้อม metrics
8. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด

### 2. GDPR Review

Review GDPR compliance ครอบคลุม data subject rights, lawful basis, consent, privacy by design — ดู `references/gdpr.md`

> Goal: ครอบคลุมทุก GDPR dimension

1. ตรวจสอบ lawful basis: consent, contract, legal obligation, vital interest, public task, legitimate interest
2. ตรวจสอบ data subject rights: access (Article 15), rectification (Article 16), erasure (Article 17), portability (Article 20), objection (Article 21)
3. ตรวจสอบ consent management: granular consent, consent withdrawal, consent record, consent versioning
4. ตรวจสอบ privacy by design: data minimization, purpose limitation, storage limitation, default privacy settings
5. ตรวจสอบ DPIA: data protection impact assessment, high-risk processing identification
6. ตรวจสอบ data breach notification: 72-hour notification, breach detection, breach record
7. ตรวจสอบ DPO appointment: Data Protection Officer requirement, DPO contact
8. Critical: no lawful basis, no consent mechanism, no DSAR process, no breach notification, data minimization violation
9. High: missing consent withdrawal, no DPIA, no privacy by design, incomplete DSAR, no DPO

### 3. CCPA Review

Review CCPA compliance ครอบคลุม consumer rights, opt-out, sale of data, notice — ดู `references/ccpa.md`

> Goal: ครอบคลุมทุก CCPA dimension

1. ตรวจสอบ consumer rights: know, delete, opt-out of sale, non-discrimination
2. ตรวจสอบ notice at collection: privacy policy, categories collected, purpose, retention
3. ตรวจสอบ opt-out mechanism: `Do Not Sell My Personal Information` link, opt-out signal (GPC)
4. ตรวจสอบ sale of data: sale definition, third-party sale, service provider exception
5. ตรวจสอบ verification: identity verification for requests, authorized agent
6. ตรวจสอบ financial incentive: notice, value, opt-out right
7. Critical: no opt-out mechanism, no notice at collection, no consumer right process, selling data without notice
8. High: missing verification, missing GPC support, incomplete privacy policy, no authorized agent process

### 4. HIPAA Review

Review HIPAA compliance ครอบคลุม PHI, safeguards, BAAs, access controls — ดู `references/hipaa.md`

> Goal: ครอบคลุมทุก HIPAA dimension

1. ตรวจสอบ PHI handling: protected health information identification, minimum necessary, de-identification
2. ตรวจสอบ administrative safeguards: workforce training, access management, incident response, sanction policy
3. ตรวจสอบ physical safeguards: facility access, workstation security, device media controls
4. ตรวจสอบ technical safeguards: access control, audit controls, integrity, transmission security, encryption
5. ตรวจสอบ Business Associate Agreement (BAA): vendor BAA, subcontractor BAA, BAA scope
6. ตรวจสอบ breach notification: 60-day notification, HHS notification, media notification
7. ตรวจสอบ Notice of Privacy Practices (NPP): content, acknowledgment, availability
8. Critical: no BAA with vendor, unencrypted PHI, no access control, no audit log, no breach notification
9. High: missing workforce training, incomplete NPP, no de-identification, missing transmission security

### 5. PCI-DSS Review

Review PCI-DSS compliance ครอบคลุม cardholder data, network security, access control, monitoring — ดู `references/pci-dss.md`

> Goal: ครอบคลุมทุก PCI-DSS dimension

1. ตรวจสอบ cardholder data handling: PAN masking, truncation, storage minimization, no CVV storage
2. ตรวจสอบ network security: firewall config, network segmentation, cardholder data environment isolation
3. ตรวจสอบ access control: unique ID, RBAC, MFA for CDE access, physical access
4. ตรวจสอบ encryption: strong cryptography, key management, key rotation, TLS for transmission
5. ตรวจสอบ monitoring: audit logs, log review, file integrity monitoring, intrusion detection
6. ตรวจสอบ vulnerability management: patch management, vulnerability scan, penetration test
7. ตรวจสอบ secure coding: secure development, change management, code review
8. Critical: CVV storage, unencrypted PAN, no network segmentation, shared credentials, no audit log
9. High: missing MFA, weak encryption, missing vulnerability scan, no file integrity monitoring

### 6. SOC2 Review

Review SOC2 compliance ครอบคลุม trust services criteria, controls, monitoring — ดู `references/soc2.md`

> Goal: ครอบคลุมทุก SOC2 dimension

1. ตรวจสอบ Security criteria: access control, network monitoring, intrusion detection, vulnerability management
2. ตรวจสอบ Availability criteria: performance monitoring, incident response, backup recovery, capacity planning
3. ตรวจสอบ Processing Integrity criteria: input validation, processing accuracy, error handling, reconciliation
4. ตรวจสอบ Confidentiality criteria: data classification, encryption, NDA, data disposal
5. ตรวจสอบ Privacy criteria: notice, consent, choice, collection, use, retention, disposal, disclosure
6. ตรวจสอบ control monitoring: control testing, control exception, remediation plan
7. Critical: missing access control, no incident response, no backup, no encryption, no privacy notice
8. High: missing monitoring, incomplete control documentation, no remediation tracking, missing NDA

### 7. Consent Management Review

Review consent management ครอบคลุม collection, withdrawal, record, versioning — ดู `references/consent.md`

> Goal: ครอบคลุมทุก consent dimension

1. ตรวจสอบ consent collection: granular consent, purpose-specific, pre-ticked box avoidance, explicit consent
2. ตรวจสอบ consent withdrawal: easy withdrawal, withdrawal mechanism, withdrawal effect
3. ตรวจสอบ consent record: who, when, what, version, proof of consent
4. ตรวจสอบ consent versioning: policy version, consent re-collection on change, version history
5. ตรวจสอบ consent for minors: age verification, parental consent, age-appropriate design
6. ตรวจสอบ consent for marketing: opt-in vs opt-out, unsubscribe, frequency
7. Critical: no consent mechanism, pre-ticked consent, no withdrawal, no consent record, no minor protection
8. High: missing granular consent, missing versioning, no unsubscribe, inconsistent consent record

### 8. Data Subject Rights (DSAR) Review

Review DSAR process ครอบคลุม access, deletion, portability, objection — ดู `references/dsar.md`

> Goal: ครอบคลุมทุก DSAR dimension

1. ตรวจสอบ DSAR intake: request channel, identity verification, request tracking, response timeline
2. ตรวจสอบ access request: data export, data categories, data sources, third-party data
3. ตรวจสอบ deletion request: data deletion, backup deletion, third-party deletion, deletion verification
4. ตรวจสอบ portability request: machine-readable format, data export, direct transmission
5. ตรวจสอบ objection request: processing stop, marketing opt-out, profiling stop
6. ตรวจสอบ DSAR exception: legal obligation, freedom of expression, public interest, legal claims
7. Critical: no DSAR process, no identity verification, no deletion including backup, no response within timeline
8. High: missing portability, missing objection, no DSAR tracking, incomplete data export

### 9. Audit Trail Review

Review audit trail ครอบคลุม logging, tamper protection, retention, review — ดู `references/audit-trail.md`

> Goal: ครอบคลุมทุก audit trail dimension

1. ตรวจสอบ audit log content: who, what, when, where, before/after, reason
2. ตรวจสอบ audit log coverage: authentication, authorization, data access, data modification, configuration change
3. ตรวจสอบ tamper protection: append-only, cryptographic hash, digital signature, access restriction
4. ตรวจสอบ audit log retention: retention period, archive, legal hold, disposal
5. ตรวจสอบ audit log review: regular review, anomaly detection, escalation, review record
6. ตรวจสอบ audit log access: access control, access log, segregation of duties
7. Critical: no audit log on data access, no tamper protection, audit log can be modified, no retention
8. High: incomplete coverage, missing review, no anomaly detection, missing access control

### 10. Data Retention Review

Review data retention ครอบคลุม policy, schedule, enforcement, disposal — ดู `references/data-retention.md`

> Goal: ครอบคลุมทุก data retention dimension

1. ตรวจสอบ retention policy: data category, retention period, legal basis, business need
2. ตรวจสอบ retention schedule: data inventory, retention trigger, retention end, automated enforcement
3. ตรวจสอบ retention enforcement: automated deletion, manual deletion, deletion verification, backup deletion
4. ตรวจสอบ legal hold: hold process, hold scope, hold release, hold record
5. ตรวจสอบ data disposal: secure disposal, disposal verification, disposal record, third-party disposal
6. ตรวจสอบ retention documentation: policy document, schedule document, exception record
7. Critical: no retention policy, no automated deletion, indefinite retention without basis, no legal hold process
8. High: incomplete schedule, missing enforcement, no disposal verification, no documentation

### 11. Cross-Border Transfer Review

Review cross-border data transfer ครอบคลุม transfer mechanism, adequacy, safeguard — ดู `references/cross-border.md`

> Goal: ครอบคลุมทุก cross-border dimension

1. ตรวจสอบ transfer identification: data flow mapping, transfer direction, data category, recipient country
2. ตรวจสอบ transfer mechanism: adequacy decision, Standard Contractual Clauses (SCC), Binding Corporate Rules (BCR), derogation
3. ตรวจสอบ transfer safeguard: encryption, pseudonymization, access control, contractual safeguard
4. ตรวจสอบ transfer documentation: transfer record, transfer impact assessment, safeguard documentation
5. ตรวจสอบ Schrems II compliance: supplementary measure, transfer assessment, surveillance risk
6. Critical: no transfer mechanism, no safeguard, no transfer documentation, transfer to non-adequate country without SCC
7. High: missing transfer mapping, no supplementary measure, no transfer impact assessment

### 12. Validate, Score And Report

ตรวจสอบ findings และรายงานผล

> Goal: findings ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score ตาม `references/scoring.md`
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี EU users → ข้าม Section 2
- ถ้า project ไม่มี California users → ข้าม Section 3
- ถ้า project ไม่มี health data → ข้าม Section 4
- ถ้า project ไม่มี payment processing → ข้าม Section 5
- ถ้า project ไม่ใช่ SaaS → ข้าม Section 6
- ถ้า project ไม่มี consent collection → ข้าม Section 7
- ถ้า project ไม่มี cross-border transfer → ข้าม Section 11

### 2. Severity Classification

- Critical: no lawful basis, no consent mechanism, no DSAR process, CVV storage, unencrypted PHI, no audit log on data access, no retention policy, no transfer mechanism, no breach notification
- High: missing consent withdrawal, missing MFA for CDE, incomplete DSAR, no DPIA, missing BAA, no anomaly detection, no legal hold, missing SCC
- Medium: incomplete privacy policy, inconsistent consent record, missing retention documentation, suboptimal audit review
- Low: cosmetic, documentation gap, minor naming

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ regulation, article, control, data category, หรือ process ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่ซ้ำกับ `/review-security` — ใช้ workflow นั้นสำหรับ security controls
- ไม่ซ้ำกับ `/review-delivery` Section 15 — ใช้ workflow นี้สำหรับ compliance เชิงลึก
- ใช้ `/roleplay-data-privacy-officer` และ `/roleplay-regulator` สำหรับ perspective-based review

### 5. Health Score

- คำนวณ review score เป็น percentage (0-100) — ดูสูตรใน `references/scoring.md`
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก compliance section
- รายงาน recommended actions พร้อม priority
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
