---
name: review-queue
description: Review job processing, idempotency, retry, dead letter queue, concurrency, backpressure, priority
---

## Goal

Review queue system ครอบคลุม job processing, idempotency, retry, backpressure, prioritization พร้อม review score

## Scope

queue review สำหรับ: job processing patterns, job serialization, job idempotency, retry strategies, backoff configuration, max retry limits, dead letter queue, failed job handling, worker concurrency, backpressure handling, job prioritization, queue selection, job scheduling, job dependencies, queue monitoring

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ queue system และ job patterns

1. ทำ `/scan-codebase` เพื่อเข้าใจ queue structure
2. ระบุ queue system (BullMQ, Redis Queue, SQS, RabbitMQ, custom), job patterns, retry config, dead letter queue strategy ที่ใช้
3. ถ้า project ไม่มี queue system → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก queue dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ queue patterns
2. ทำ `/update-review-cli` — `/update-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Job Processing And Idempotency Review

> Goal: ครอบคลุม job processing, serialization, idempotency

1. ตรวจสอบ job processing patterns: job definition, job handler structure, job input validation, job output handling, job lifecycle, job state tracking
2. ตรวจสอบ job serialization: job payload serialization, serialization format (JSON, protobuf), serialization safety (circular refs, functions), deserialization error handling, version compatibility
3. ตรวจสอบ job idempotency: idempotency key, duplicate job detection, idempotent processing, side effect deduplication, idempotency storage, idempotency expiration
4. ตรวจสอบ job dependencies: job chaining, job fan-out, job fan-in, dependency graph, dependency failure handling, parallel job execution

### 4. Retry, Dead Letter, Concurrency And Backpressure Review

> Goal: ครอบคลุม retry, dead letter queue, worker concurrency, backpressure, prioritization

1. ตรวจสอบ retry strategies: retry on failure, retry conditions, max retries, backoff strategy (exponential, linear, jitter), retry budget, retry idempotency, retry delay
2. ตรวจสอบ dead letter queue: failed job storage, dead letter queue processing, manual replay capability, alerting on dead letter, retention policy, dead letter queue size limits
3. ตรวจสอบ worker concurrency: worker concurrency config, concurrency limits, concurrency per worker, auto-scaling workers, worker pool management
4. ตรวจสอบ backpressure handling: queue depth monitoring, backpressure strategy, job rejection on overload, rate limiting producers, queue size limits, memory management
5. ตรวจสอบ job prioritization: priority levels, priority queue config, priority starvation prevention, priority fairness, priority override
6. ตรวจสอบ queue monitoring: queue metrics, queue health, queue dashboard, queue alerting, job processing time, queue throughput, failed job rate

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-format-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี queue system → stop และ report
- ถ้า project ไม่มี dead letter queue → ข้าม Step 4 item 2
- ถ้า project ไม่มี job prioritization → ข้าม Step 4 item 5

### 2. Severity Classification

- Critical: no idempotency ที่ก่อให้เกิด duplicate side effects, job loss, no retry, no dead letter queue, unbounded concurrency, no backpressure ที่ก่อให้เกิด crash, job loss on queue overflow
- High: missing idempotency, missing retry logic, missing dead letter queue, missing backpressure, missing worker monitoring, missing prioritization, missing queue metrics
- Medium: suboptimal backoff, suboptimal concurrency, missing job dependencies, incomplete monitoring, minor serialization issue
- Low: cosmetic, minor queue improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ queue, job type, หรือ worker ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก queue section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
