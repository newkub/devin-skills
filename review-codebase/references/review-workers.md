---
name: review-workers
description: Review background workers: job lifecycle, cron jobs, scheduling, health, restart, scaling, shutdown
related:
  - scan-codebase
  - deep-analyze
  - update-create-review-cli
  - update-rules
  - run-review
  - deep-validate
  - validate
  - report
  - report-table
  - suggest-next-action
---

## Goal

Review background workers ครอบคลุม job lifecycle, cron jobs, scheduling, health monitoring, scaling พร้อม review score

## Scope

workers review สำหรับ: job lifecycle, job error handling, cron jobs, schedule configuration, timezone handling, task dependencies, worker health monitoring, restart strategy, worker scaling, worker graceful shutdown, worker resource management, worker logging, worker deployment

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ worker structure และ scheduling patterns

1. ทำ `/scan-codebase` เพื่อเข้าใจ worker structure
2. ระบุ worker framework, cron scheduler, job patterns, worker deployment strategy ที่ใช้
3. ถ้า project ไม่มี background workers → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก worker dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ worker patterns
2. ทำ `/update-create-review-cli` — เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Job Lifecycle And Cron Review

> Goal: ครอบคลุม job lifecycle, cron jobs, scheduling, timezone

1. ตรวจสอบ job lifecycle: job initialization, job execution, job completion, job failure, job timeout, job cancellation, job state transitions
2. ตรวจสอบ cron jobs: cron expression correctness, cron schedule coverage, cron job idempotency, cron job overlap prevention, cron job lock, cron job missed execution handling
3. ตรวจสอบ schedule configuration: schedule format (cron, interval, one-time), schedule persistence, schedule update, schedule deletion, schedule conflict detection
4. ตรวจสอบ timezone handling: timezone config, timezone in cron expression, UTC vs local time, daylight saving time handling, timezone conversion, timezone consistency
5. ตรวจสอบ task dependencies: task dependency graph, dependency failure handling, parallel task execution, sequential task execution, dependency timeout, circular dependency detection
6. จัด severity ตาม `## Rules` §2

### 4. Health, Restart, Scaling And Shutdown Review

> Goal: ครอบคลุม worker health, restart, scaling, graceful shutdown

1. ตรวจสอบ worker health monitoring: health check endpoint, heartbeat mechanism, health check interval, health check failure detection, worker status reporting
2. ตรวจสอบ restart strategy: auto-restart on crash, restart delay, max restart attempts, restart backoff, restart logging, crash loop detection
3. ตรวจสอบ worker scaling: auto-scaling config, scaling triggers (queue depth, CPU, memory), min/max workers, scaling cooldown, scaling metrics
4. ตรวจสอบ graceful shutdown: SIGTERM handling, in-progress job completion, shutdown timeout, resource cleanup on shutdown, connection cleanup, queue disconnection
5. ตรวจสอบ worker resource management: memory limits, CPU limits, file descriptor limits, connection limits, resource monitoring, resource leak detection
6. ตรวจสอบ worker logging: job start/end logging, job error logging, job duration logging, worker status logging, structured logging, log level configuration
7. จัด severity ตาม `## Rules` §2

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

- ถ้า project ไม่มี background workers → ข้ามทั้งหมด
- ถ้า project ไม่มี cron jobs → ข้าม Step 3 item 2
- ถ้า project ไม่มี worker scaling → ข้าม Step 4 item 3

### 2. Severity Classification

- Critical: worker crash without restart, cron job ที่ก่อให้เกิด data corruption, timezone error ใน scheduling, no graceful shutdown ที่ก่อให้เกิด job loss, unbounded worker scaling, missing health monitoring ที่ทำให้ worker ตายเงียบ
- High: missing cron job idempotency, missing timezone config, missing task dependency handling, missing restart strategy, missing graceful shutdown, missing worker scaling, missing resource management, incomplete logging
- Medium: suboptimal restart backoff, suboptimal scaling config, minor timezone issue, missing heartbeat, suboptimal shutdown timeout
- Low: cosmetic, minor logging improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ worker, cron job, หรือ schedule ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก worker section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
