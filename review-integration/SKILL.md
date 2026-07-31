---
name: review-integration
description: Review API client design, timeout, connection pooling, retry, circuit breaker, vendor lock-in, abstraction, swappability, fallback
---

## Goal

Review third-party integrations ครอบคลุม API client design, retry, circuit breaker, vendor lock-in, fallback พร้อม health score

## Scope

integration review สำหรับ: API client design, timeout configuration, connection pooling, error handling, retry strategies, circuit breaker patterns, vendor lock-in risk, abstraction layer, swappability, rate limit handling, fallback/degradation, integration health monitoring, integration testability, webhook integration, OAuth integration, SDK usage

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ integration landscape ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ integration structure
2. ระบุ third-party services, SDK usage, API client patterns, integration points ที่ใช้
3. ถ้า project ไม่มี third-party integrations → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก integration dimension พร้อม health score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ integration patterns
2. ทำ `/update-codebase-health-cli` — `/update-codebase-health-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-codebase-health-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-health` เพื่อดึง metrics ล่าสุด

### 3. API Client And Connection Review

> Goal: ครอบคลุม client design, timeout, pooling, error handling

1. ตรวจสอบ API client design: client instantiation, client reuse vs per-request, client configuration, base URL management, header management, auth token injection, client typing
2. ตรวจสอบ timeout configuration: request timeout, connection timeout, read timeout, write timeout, retry timeout, timeout per endpoint
3. ตรวจสอบ connection pooling: pool size, pool configuration, connection reuse, connection cleanup, connection leak prevention, keep-alive strategy
4. ตรวจสอบ error handling: HTTP error mapping, network error handling, timeout error handling, 5xx vs 4xx handling, error propagation, error retry decision
5. Critical: no timeout on external call, no error handling on critical integration, connection leak, client created per request ใน hot path
6. High: missing timeout configuration, inconsistent error handling, missing connection pooling, missing error propagation

### 4. Resilience And Abstraction Review

> Goal: ครอบคลุม retry, circuit breaker, vendor lock-in, fallback

1. ตรวจสอบ retry strategies: retry on failure, retry conditions (5xx, network, timeout), max retries, backoff strategy (exponential, jitter), retry budget, retry idempotency
2. ตรวจสอบ circuit breaker: circuit breaker pattern, failure threshold, recovery strategy, half-open state, circuit breaker per service, fallback on open circuit
3. ตรวจสอบ vendor lock-in risk: abstraction layer, swappability, vendor-specific code isolation, interface-based integration, adapter pattern
4. ตรวจสอบ rate limit handling: rate limit header parsing, rate limit backoff, rate limit queue, 429 handling, rate limit per service
5. ตรวจสอบ fallback/degradation: fallback strategy, degraded mode operation, cached response fallback, default value fallback, user-facing fallback message
6. ตรวจสอบ integration health monitoring: integration health check, integration metrics, integration alerting, integration status dashboard, dependency status page
7. ตรวจสอบ integration testability: integration test strategy, mock/stub patterns, integration test coverage, contract testing, sandbox vs production
8. Critical: no circuit breaker on critical dependency, no fallback on critical integration, hardcoded vendor dependency ที่ไม่มี abstraction, no retry on critical integration
9. High: missing retry, no circuit breaker, no rate limit handling, missing fallback, missing integration health monitoring, untestable integration

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ health score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-format-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี third-party integrations → ข้ามทั้งหมด
- ถ้า integration ไม่มี retry → ข้าม Step 4 item 1
- ถ้า integration ไม่มี circuit breaker → ข้าม Step 4 item 2
- ถ้า integration ไม่มี rate limit → ข้าม Step 4 item 4

### 2. Severity Classification

- Critical: no timeout on external call, no error handling on critical integration, connection leak, no circuit breaker on critical dependency, no fallback on critical integration, hardcoded vendor dependency ที่ไม่มี abstraction, no retry on critical integration
- High: missing timeout configuration, inconsistent error handling, missing connection pooling, missing retry, no rate limit handling, missing fallback, missing integration health monitoring, untestable integration
- Medium: suboptimal retry strategy, missing abstraction layer, minor vendor lock-in, missing integration metrics, incomplete test coverage
- Low: cosmetic, minor client improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ integration, service, client, หรือ endpoint ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก integration section
- Health score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
