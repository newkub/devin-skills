---
name: review-business
description: Review business logic ครอบคลุม payment, subscription, multi-tenancy, feature flags, realtime, email
argument-hint: "[scope]"
related:
  - report
  - suggest-next-action
  - run-review

  - use-subagents
---

## Goal

Review business logic ครอบคลุมทุก dimension ของ business พร้อม aggregate findings และ review score

## Scope

business review สำหรับ: payment processing, subscription lifecycle, multi-tenancy isolation, feature flag management, realtime communication, email sending

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ business logic setup ใน codebase

- ดูรายละเอียดใน [subagents/business-reviewer/prepare-and-scan.md](subagents/business-reviewer/prepare-and-scan.md)
- บันทึก findings พร้อม severity และ evidence

### 2. Payment Review

> Goal: ครอบคลุมทุก payment dimension

- ดูรายละเอียดใน [subagents/business-reviewer/payment-review.md](subagents/business-reviewer/payment-review.md)
- บันทึก findings พร้อม severity และ evidence

### 3. Subscription Review

> Goal: ครอบคลุมทุก subscription dimension

- ดูรายละเอียดใน [subagents/business-reviewer/subscription-review.md](subagents/business-reviewer/subscription-review.md)
- บันทึก findings พร้อม severity และ evidence

### 4. Multi-Tenancy Review

> Goal: ครอบคลุมทุก multi-tenancy dimension

- ดูรายละเอียดใน [subagents/business-reviewer/multi-tenancy-review.md](subagents/business-reviewer/multi-tenancy-review.md)
- บันทึก findings พร้อม severity และ evidence

### 5. Feature Flags Review

> Goal: ครอบคลุมทุก feature flag dimension

- ดูรายละเอียดใน [subagents/business-reviewer/feature-flags-review.md](subagents/business-reviewer/feature-flags-review.md)
- บันทึก findings พร้อม severity และ evidence

### 6. Realtime Review

> Goal: ครอบคลุมทุก realtime dimension

- ดูรายละเอียดใน [subagents/business-reviewer/realtime-review.md](subagents/business-reviewer/realtime-review.md)
- บันทึก findings พร้อม severity และ evidence

### 7. Email Review

> Goal: ครอบคลุมทุก email dimension

- ดูรายละเอียดใน [subagents/business-reviewer/email-review.md](subagents/business-reviewer/email-review.md)
- บันทึก findings พร้อม severity และ evidence

### 8. Validate Findings

> Goal: Issues ถูกต้องและจัดลำดับตาม severity

- ดูรายละเอียดใน [subagents/business-reviewer/validate-findings.md](subagents/business-reviewer/validate-findings.md)
- บันทึก findings พร้อม severity และ evidence

### 9. Report

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

- ดูรายละเอียดใน [subagents/business-reviewer/report.md](subagents/business-reviewer/report.md)
- บันทึก findings พร้อม severity และ evidence

### 10. Implement All

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

- ดูรายละเอียดใน [subagents/business-reviewer/implement-all.md](subagents/business-reviewer/implement-all.md)
- บันทึก findings พร้อม severity และ evidence

## Rules

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review (business)
- ข้าม section ที่ไม่เกียวข้อง: ดู [subagents/business-reviewer/prepare-and-scan.md](subagents/business-reviewer/prepare-and-scan.md)
- จัดลำดับ severity และ evidence: ดู [subagents/business-reviewer/validate-findings.md](subagents/business-reviewer/validate-findings.md)
- คำนวณ score และ metrics: ดู [subagents/business-reviewer/scoring.md](subagents/business-reviewer/scoring.md)
- Format รายงาน: ดู [subagents/business-reviewer/report.md](subagents/business-reviewer/report.md)

- ใช้ /review-compliance ถ้าจำเป็น
- ใช้ /review-security ถ้าจำเป็น
- ใช้ /review-code-quality ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. จัดลำดับ findings ตาม severity — canonical steps ที่ `../shared/review-fix.md`
2. แก้ตาม finding ด้าน payment, subscription, multi-tenancy, feature flags และ email (business)
3. preserve behavior + verify + report — canonical ที่ `../shared/review-fix.md`

## References

- [Full-dimension checklist](subagents/business-reviewer/checklist.md)
- [Payment](subagents/business-reviewer/payment-review.md)
- [Subscription](subagents/business-reviewer/subscription-review.md)
- [Multi-tenancy](subagents/business-reviewer/multi-tenancy-review.md)
- [Feature flags](subagents/business-reviewer/feature-flags-review.md)
- [Realtime](subagents/business-reviewer/realtime-review.md)
- [Email](subagents/business-reviewer/email-review.md)
- [Scoring](subagents/business-reviewer/scoring.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /use-subagents ถ้าจำเป็น

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก business section
- รายงาน recommended actions พร้อม priority (business)
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
