---
name: review-business
description: Review business logic ครอบคลุม payment, subscription, multi-tenancy, feature flags, realtime, email
---

## Goal

Review business logic ครอบคลุมทุก dimension ของ business พร้อม aggregate findings และ health score

## Scope

business review สำหรับ: payment processing, subscription lifecycle, multi-tenancy isolation, feature flag management, realtime communication, email sending

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ business logic setup ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ business logic setup
2. ระบุ payment provider, subscription model, tenant model, flag provider, realtime protocol, email tools
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/update-codebase-health-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
5. รัน `bun --filter @booking/tools-health health:json` เพื่อดึง health report พร้อม metrics
6. ทำ `/run-health` เพื่อรัน health CLI และดึง metrics ล่าสุด

### 2. Payment Review

Review payment processing ครอบคลุม checkout, subscription, refund, Stripe integration, payment security

> Goal: ครอบคลุมทุก payment dimension

1. ตรวจสอบ checkout flow, payment intent creation, และ confirmation handling
2. ตรวจสอบ subscription lifecycle, billing cycles, และ proration logic
3. ตรวจสอบ refund processing, dispute handling, และ payment state transitions
4. ตรวจสอบ Stripe Connect integration, platform fee calculation, และ payout scheduling
5. ตรวจสอบ webhook signature verification, idempotency, และ payment event ordering
6. Critical: payment data leak, broken checkout, unverified webhook, missing refund path
7. High: missing idempotency, broken subscription renewal, incorrect fee calculation, missing payment state tracking

### 3. Subscription Review

Review subscription lifecycle ครอบคลุม billing cycles, renewal, cancellation, proration, subscription state

> Goal: ครอบคลุมทุก subscription dimension

1. ตรวจสอบ subscription creation: plan selection, trial period, payment method collection
2. ตรวจสอบ billing cycle: cycle period, billing date, timezone handling, leap year handling
3. ตรวจสอบ renewal process: auto-renewal, failed renewal, dunning management, retry logic
4. ตรวจสอบ cancellation: immediate vs end-of-period, cancellation reason, reactivation
5. ตรวจสอบ proration: upgrade/downgrade proration, mid-cycle change, credit calculation
6. ตรวจสอบ subscription state: state machine, state transitions, webhook synchronization
7. ตรวจสอบ subscription analytics: MRR, churn rate, LTV tracking
8. Critical: missing renewal handling, failed payment ไม่มี dunning, state desync
9. High: incorrect proration, missing cancellation handling, no webhook sync

### 4. Multi-Tenancy Review

Review multi-tenancy isolation ครอบคลุม data partitioning, tenant context, cross-tenant leak prevention

> Goal: ครอบคลุมทุก multi-tenancy dimension

1. ตรวจสอบ tenant context propagation ผ่านทุก layer: API → service → database
2. ตรวจสอบ data isolation: tenant_id filtering ในทุก query, missing tenant scope, cross-tenant data access
3. ตรวจสอบ tenant-specific configuration: per-tenant settings, feature flags, rate limits
4. ตรวจสอบ resource isolation: per-tenant quotas, storage limits, compute limits
5. ตรวจสอบ tenant onboarding/offboarding: provisioning, data migration, data deletion
6. Critical: cross-tenant data access, missing tenant_id filter, tenant context leak
7. High: inconsistent tenant propagation, missing tenant isolation ใน shared resources

### 5. Feature Flags Review

Review feature flag management ครอบคลุม rollout strategy, flag cleanup, default values, flag governance

> Goal: ครอบคลุมทุก feature flag dimension

1. ตรวจสอบ flag definition: naming convention, description, default value, flag type
2. ตรวจสอบ flag evaluation: server-side vs client-side, evaluation context, fallback behavior
3. ตรวจสอบ rollout strategy: percentage rollout, user targeting, segment-based rollout
4. ตรวจสอบ flag lifecycle: stale flags, orphaned flags, flags without cleanup plan
5. ตรวจสอบ flag governance: flag ownership, flag documentation, flag audit trail
6. ตรวจสอบ flag coupling: flags depending on other flags, flag conflict detection
7. Critical: flag ที่ควรเป็น production-safe ไม่ได้, flag ที่ทำให้ app crash เมื่อ off
8. High: stale flags ที่ควรลบ, missing default value, flag ที่ไม่มี cleanup plan

### 6. Realtime Review

Review realtime และ notification ครอบคลุม SSE/WebSocket, reconnection, notification channels, availability updates

> Goal: ครอบคลุมทุก realtime dimension

1. ตรวจสอบ SSE/WebSocket patterns, connection lifecycle, และ error handling
2. ตรวจสอบ reconnection logic, backoff strategy, และ connection state recovery
3. ตรวจสอบ message ordering, data sync, และ availability update patterns
4. ตรวจสอบ notification channels, delivery patterns, template management, และ batching logic
5. ตรวจสอบ user preferences, notification routing, delivery reliability, และ retry logic
6. Critical: broken connection, data loss during reconnect, no error handling, broken delivery channel, no user preferences, notification spam
7. High: missing reconnection, no backoff strategy, broken message ordering, missing retry logic, no deduplication, broken template

### 7. Email Review

Review email ครอบคลุม template rendering, validation, unsubscribe, deliverability, SPF/DKIM/DMARC

> Goal: ครอบคลุมทุก email dimension

1. ตรวจสอบ email template rendering, dynamic content, และ template versioning
2. ตรวจสอบ email validation, bounce handling, และ suppression list management
3. ตรวจสอบ unsubscribe handling, consent management, และ CAN-SPAM compliance
4. ตรวจสอบ deliverability: SPF, DKIM, DMARC, และ email authentication headers
5. Critical: broken unsubscribe, no SPF/DKIM, email injection vulnerability
6. High: missing bounce handling, broken template, no DMARC

### 8. Validate Findings

ตรวจสอบและ validate issues จากทุก section

> Goal: Issues ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low

### 9. Report

รายงานผล review ในรูปแบบตาราง

> Goal: รายงาน aggregate findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-format-table`
2. สร้างตาราง aggregate findings จากทุก section
3. ทำ `/suggest-next-action`

### 10. Implement All

ตรวจสอบว่า findings ที่พบสามารถ implement ได้จริง

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

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

- คำนวณ health score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก business section
- รายงาน recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
