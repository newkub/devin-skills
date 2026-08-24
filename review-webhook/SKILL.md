---
name: review-webhook
description: Review webhook signature verification, replay, idempotency, retry, dead letter queue, secrets
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
  - validate
  - suggest-next-action
---

## Goal

Review webhook handling ครอบคลุม signature verification, replay prevention, idempotency, retry, secret management พร้อม review score

## Scope

webhook review สำหรับ: signature verification, timestamp validation, replay attack prevention, idempotency handling, event deduplication, retry logic, backoff strategy, dead letter queue, payload validation, webhook secret management, webhook endpoint security, webhook delivery tracking, webhook event ordering

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ webhook structure และ providers

1. ทำ `/scan-codebase` เพื่อเข้าใจ webhook structure
2. ระบุ webhook providers (Stripe, GitHub, Slack, custom), signature scheme, secret management strategy ที่ใช้
3. ถ้า project ไม่มี webhooks → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก webhook dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ webhook patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Security And Verification Review

> Goal: ครอบคลุม signature, replay prevention, secret management

1. ตรวจสอบ signature verification: signature scheme (HMAC, RSA, Ed25519), signature header parsing, constant-time comparison, signature failure handling, missing signature check
2. ตรวจสอบ timestamp validation: timestamp window check, stale webhook rejection, clock skew tolerance, timestamp header parsing
3. ตรวจสอบ replay attack prevention: nonce tracking, event ID deduplication, replay window enforcement, idempotency key from webhook payload
4. ตรวจสอบ webhook secret management: secret storage (env vars, secret manager), secret rotation strategy, secret access logging, no hardcoded secrets, secret per endpoint

### 4. Processing, Retry And Delivery Review

> Goal: ครอบคลุม idempotency, retry, dead letter queue, payload validation

1. ตรวจสอบ idempotency handling: idempotency key extraction, duplicate event detection, idempotent processing, event deduplication strategy, idempotency storage
2. ตรวจสอบ payload validation: payload schema validation, payload size limits, malformed payload handling, unexpected field handling, content-type validation
3. ตรวจสอบ retry logic: retry strategy, backoff configuration (exponential, linear), max retry limits, retry-on-failure semantics, retry header parsing
4. ตรวจสอบ dead letter queue: failed webhook storage, dead letter queue processing, manual replay capability, alerting on dead letter, retention policy
5. ตรวจสอบ event ordering: event ordering guarantees, out-of-order handling, sequence number tracking, event versioning, breaking change handling
6. ตรวจสอบ delivery tracking: webhook delivery logging, delivery status tracking, delivery metrics, failure rate monitoring, alerting on delivery failures

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี webhooks → ข้ามทั้งหมด
- ถ้า project ไม่มี retry mechanism → ข้าม Step 4 item 3
- ถ้า project ไม่มี dead letter queue → ข้าม Step 4 item 4

### 2. Severity Classification

- Critical: missing signature verification, webhook secret exposed, no replay prevention, hardcoded webhook secret, no idempotency, no retry, job loss, no dead letter queue
- High: missing timestamp validation, weak signature scheme, no secret rotation, missing retry logic, missing delivery tracking, no alerting
- Medium: suboptimal backoff, missing event ordering, missing delivery metrics, incomplete payload validation
- Low: cosmetic, minor logging improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ webhook endpoint, provider, หรือ handler ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก webhook section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

