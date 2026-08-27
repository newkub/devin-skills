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

1. ดูรายละเอียดใน [references/prepare-and-scan.md](references/prepare-and-scan.md)
2. บันทึก findings พร้อม severity และ evidence

### 2. Payment Review

> Goal: ครอบคลุมทุก payment dimension

1. ดูรายละเอียดใน [references/payment-review.md](references/payment-review.md)
2. บันทึก findings พร้อม severity และ evidence

### 3. Subscription Review

> Goal: ครอบคลุมทุก subscription dimension

1. ดูรายละเอียดใน [references/subscription-review.md](references/subscription-review.md)
2. บันทึก findings พร้อม severity และ evidence

### 4. Multi-Tenancy Review

> Goal: ครอบคลุมทุก multi-tenancy dimension

1. ดูรายละเอียดใน [references/multi-tenancy-review.md](references/multi-tenancy-review.md)
2. บันทึก findings พร้อม severity และ evidence

### 5. Feature Flags Review

> Goal: ครอบคลุมทุก feature flag dimension

1. ดูรายละเอียดใน [references/feature-flags-review.md](references/feature-flags-review.md)
2. บันทึก findings พร้อม severity และ evidence

### 6. Realtime Review

> Goal: ครอบคลุมทุก realtime dimension

1. ดูรายละเอียดใน [references/realtime-review.md](references/realtime-review.md)
2. บันทึก findings พร้อม severity และ evidence

### 7. Email Review

> Goal: ครอบคลุมทุก email dimension

1. ดูรายละเอียดใน [references/email-review.md](references/email-review.md)
2. บันทึก findings พร้อม severity และ evidence

### 8. Validate Findings

> Goal: Issues ถูกต้องและจัดลำดับตาม severity

1. ดูรายละเอียดใน [references/validate-findings.md](references/validate-findings.md)
2. บันทึก findings พร้อม severity และ evidence

### 9. Report

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

1. ดูรายละเอียดใน [references/report.md](references/report.md)
2. บันทึก findings พร้อม severity และ evidence

### 10. Implement All

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ดูรายละเอียดใน [references/implement-all.md](references/implement-all.md)
2. บันทึก findings พร้อม severity และ evidence

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี payment processing ให้ข้าม Section 2
- ถ้า project ไม่มี subscription model ให้ข้าม Section 3
- ถ้า project ไม่มี multi-tenancy ให้ข้าม Section 4
- ถ้า project ไม่มี feature flags ให้ข้าม Section 5
- ถ้า project ไม่มี realtime features ให้ข้าม Section 6
- ถ้า project ไม่มี email sending ให้ข้าม Section 7

### 2. Severity Classification

- Critical: payment data leak, unverified webhook, missing renewal handling, cross-tenant data access, flag crash when off, broken connection, data loss during reconnect, broken unsubscribe, no SPF/DKIM, email injection vulnerability
- High: missing idempotency, incorrect proration, inconsistent tenant propagation, stale flags, missing reconnection, missing bounce handling, broken template, no DMARC
- Medium: suboptimal checkout UX, inconsistent billing cycle, missing per-tenant quota, inconsistent naming, inconsistent connection pattern, missing suppression list, inconsistent template
- Low: minor payment UI improvement, subscription naming convention, tenant naming convention, flag naming convention, cosmetic improvement, minor email improvement

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

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

- รายงานตาราง aggregate findings จากทุก business section
- รายงาน recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
