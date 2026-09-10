---
name: review-compliance
description: Review compliance ครอบคลุม GDPR, CCPA, HIPAA, PCI-DSS, SOC2, PDPA, consent, DSAR, audit, retention
argument-hint: "[scope]"
related:
  - review-security
  - review-business
  - scan-codebase
  - deep-analyze
  - deep-validate
  - report
  - suggest-next-action

---
## Goal

สร้าง short orchestrator สำหรับ review compliance ทุก dimension โดย delegate ไปยัง reference files แล้ว aggregate findings และ review score

## Scope

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: review-by-compliance)

compliance review สำหรับ GDPR, CCPA, HIPAA, PCI-DSS, SOC2, PDPA (Thailand), consent management, DSAR, audit trails, data retention, cross-border transfer, privacy by design

ไม่รวม `/review-security` และ `/review-business`

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ compliance setup ใน codebase

1. ทำ `/scan-codebase` เพื่อ map data handling, privacy controls, และ compliance tooling
2. ระบุ applicable regulations และ data classification (PII, PHI, payment, sensitive, public)
3. ระบุ consent tool, retention policy, และ audit logging setup
4. ทำ `/deep-analyze` และ review CLI เพื่อดึง metrics ปัจจุบัน

### 2. Regulation Reviews

> Goal: ตรวจแต่ละ regulation
Review แต่ละ regulation ที่เกี่ยวข้องโดยใช้ reference checklist แลกบันทึก findings พร้อม file paths และ severity

1. GDPR — ดู `references/gdpr.md`
2. CCPA — ดู `references/ccpa.md`
3. HIPAA — ดู `references/hipaa.md`
4. PCI-DSS — ดู `references/pci-dss.md`
5. SOC2 — ดู `references/soc2.md`
6. PDPA — ดู `references/pdpa.md`

### 3. Cross-Cutting Reviews

> Goal: ตรวจ cross-cutting topics
1. Consent management — ดู `references/consent.md`
2. DSAR process — ดู `references/dsar.md`
3. Audit trail — ดู `references/audit-trail.md`
4. Data retention — ดู `references/data-retention.md`
5. Cross-border transfer — ดู `references/cross-border.md`

### 4. Validate, Score And Report

> Goal: validate findings และสร้าง score-based report

1. ทำ `/deep-validate` สำหรับทุก finding
2. จัดลำดับ findings ตาม severity: Critical, High, Medium, Low
3. คำนวณ per-dimension และ overall score ตาม `references/scoring.md`
4. รายงานด้วย `/report` และ `/suggest-next-action`

## Rules

- สร้าง backup branch ก่อน review
- ใช้ evidence-based findings พร้อม file path และ regulation อ้างอิง
- ไม่แก้ไข code ระหว่าง review
- ดูรายละเอียด severity, formatting, และ independence rules ใน `references/rules.md`
- รายงานผลด้วย `/report` และ `/suggest-next-action`

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/review` (compliance)

Merged from: improve-compliance

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้ (compliance)
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง (compliance)
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test-unit` ถ้ามี แล้วสรุปผลด้วย `/report-before-after` (compliance)

- `references/fix-improve-compliance.md` — แก้ findings จาก review-compliance ครอบคลุม licenses, privacy, audit และ data handling
## Expected Outcome

- รายงานตาราง aggregate findings จากทุก compliance section
- รายงาน recommended actions พร้อม priority (compliance)
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
