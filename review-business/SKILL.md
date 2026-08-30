---
name: review-business
description: Review business logic ครอบคลุม payment, subscription, multi-tenancy, feature flags, realtime, email
---

## Goal

Review business logic ครอบคลุมทุก dimension ของ business พร้อม aggregate findings และ review score

## Scope

business review สำหรับ: payment processing, subscription lifecycle, multi-tenancy isolation, feature flag management, realtime communication, email sending

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ business logic setup ใน codebase

- ดูรายละเอียดใน [references/prepare-and-scan.md](references/prepare-and-scan.md)
- บันทึก findings พร้อม severity และ evidence

### 2. Payment Review

> Goal: ครอบคลุมทุก payment dimension

- ดูรายละเอียดใน [references/payment-review.md](references/payment-review.md)
- บันทึก findings พร้อม severity และ evidence

### 3. Subscription Review

> Goal: ครอบคลุมทุก subscription dimension

- ดูรายละเอียดใน [references/subscription-review.md](references/subscription-review.md)
- บันทึก findings พร้อม severity และ evidence

### 4. Multi-Tenancy Review

> Goal: ครอบคลุมทุก multi-tenancy dimension

- ดูรายละเอียดใน [references/multi-tenancy-review.md](references/multi-tenancy-review.md)
- บันทึก findings พร้อม severity และ evidence

### 5. Feature Flags Review

> Goal: ครอบคลุมทุก feature flag dimension

- ดูรายละเอียดใน [references/feature-flags-review.md](references/feature-flags-review.md)
- บันทึก findings พร้อม severity และ evidence

### 6. Realtime Review

> Goal: ครอบคลุมทุก realtime dimension

- ดูรายละเอียดใน [references/realtime-review.md](references/realtime-review.md)
- บันทึก findings พร้อม severity และ evidence

### 7. Email Review

> Goal: ครอบคลุมทุก email dimension

- ดูรายละเอียดใน [references/email-review.md](references/email-review.md)
- บันทึก findings พร้อม severity และ evidence

### 8. Validate Findings

> Goal: Issues ถูกต้องและจัดลำดับตาม severity

- ดูรายละเอียดใน [references/validate-findings.md](references/validate-findings.md)
- บันทึก findings พร้อม severity และ evidence

### 9. Report

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

- ดูรายละเอียดใน [references/report.md](references/report.md)
- บันทึก findings พร้อม severity และ evidence

### 10. Implement All

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

- ดูรายละเอียดใน [references/implement-all.md](references/implement-all.md)
- บันทึก findings พร้อม severity และ evidence

## Rules

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ข้าม section ที่ไม่เกียวข้อง: ดู [references/prepare-and-scan.md](references/prepare-and-scan.md)
- จัดลำดับ severity และ evidence: ดู [references/validate-findings.md](references/validate-findings.md)
- คำนวณ score และ metrics: ดู [references/scoring.md](references/scoring.md)
- Format รายงาน: ดู [references/report.md](references/report.md)

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก business section
- รายงาน recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
