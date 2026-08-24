---
name: review-infrastructure
description: Review infrastructure: workers, queues, webhooks, scalability, cost, and migration
---

## Goal

ตรวจสอบ infrastructure, deployment, background workers, queues, webhooks, scalability, cost และ migration พร้อมคะแนน review

## Scope

- ครอบคลุม workers: job lifecycle, cron, scheduling, error handling, health monitoring
- ครอบคลุม queues: job processing, idempotency, retry, backpressure, dead letter queue
- ครอบคลุม webhooks: signature, secret management, idempotency, provider integration
- ครอบคลุม scalability: stateless design, horizontal scaling, caching, database scaling
- ครอบคลุม deployment, CI/CD, config files, monitoring, tracing, observability
- ครอบคลุม cost: instance sizing, auto-scaling, idle resources, reserved capacity
- ครอบคลุม migration: schema, data, framework, versioning, rollback
- ไม่ครอบคลุม `review-security`, `review-quality`, `review-correctness`

## Execute

### 1. Prepare and Scan

> Goal: เข้าใจ infrastructure setup และ platform ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, deployment, CI/CD, cloud providers
2. ระบุ worker framework, queue system, webhook providers, migration tools และ monitoring tools
3. ระบุ critical paths, config files และ environments: dev, staging, prod
4. ถ้าไม่มี infrastructure concerns → stop และ report

### 2. Workers and Queues Review

> Goal: ตรวจสอบ background workers และ queue system

1. ตรวจสอบ worker lifecycle: scheduling, cron, timezone, task dependencies, restart strategy
2. ตรวจสอบ job processing: idempotency, retry, backpressure, dead letter queue
3. ระบุ worker framework, queue system: `BullMQ`, `SQS`, `RabbitMQ`, `Redis`, custom
4. ถ้าไม่มี background workers หรือ queues → ข้ามส่วนที่ไม่มี

### 3. Webhooks Review

> Goal: ตรวจสอบ webhook integration

1. ระบุ webhook providers: Stripe, GitHub, Slack, custom
2. ตรวจสอบ signature scheme, secret management, idempotency, replay protection
3. ตรวจสอบ error handling, retry, timeout และ provider contract
4. ถ้าไม่มี webhooks → ข้าม step นี้

### 4. Scalability and Cost Review

> Goal: ตรวจสอบ scalability และ cost

1. ตรวจสอบ deployment strategy: single instance, multi-instance, serverless
2. ตรวจสอบ stateless design, horizontal scaling, shared state, caching layers
3. ตรวจสอบ database scaling, read replicas, sharding, connection pooling
4. ตรวจสอบ compute spend: CPU, memory, over-provisioning, right-sizing, auto-scaling
5. ระบุ idle resources และ reserved capacity opportunities

### 5. Deployment and CI/CD Review

> Goal: ตรวจสอบ deployment pipeline

1. ตรวจสอบ CI/CD workflow, job dependencies, deployment steps, environment promotion
2. ตรวจสอบ rollback strategy, zero-downtime config, post-deploy validation
3. ตรวจสอบ env var coverage, missing config, hardcoded values, secrets management
4. ตรวจสอบ build optimization, caching, artifact management, parallel job efficiency

### 6. Configuration and Observability Review

> Goal: ตรวจสอบ config files และ observability

1. ตรวจสอบ `tsconfig.json`, `vite.config.ts`, `biome.json`, environment-specific configs
2. ตรวจสอบ config consistency ข้าม workspaces, path aliases, compiler options
3. ตรวจสอบ metrics, logs, traces, alerts, dashboards, SLOs
4. ตรวจสอบ trace context propagation, span coverage, log-trace-metric correlation

### 7. Disaster Recovery and Migration Review

> Goal: ตรวจสอบ DR และ migration

1. ตรวจสอบ DR plan, RPO/RTO targets, backup schedules, restore procedures
2. ตรวจสอบ runbooks, incident response, escalation paths
3. ตรวจสอบ migration files: ordering, version control, rollback strategy
4. ระบุ migration tools: `Drizzle`, `Prisma`, `TypeORM`, custom scripts

### 8. Validate and Report

> Goal: สรุป findings พร้อมคะแนนและส่งต่อ action ถัดไป

1. ทำ `/validate` สำหรับ findings ทุกรายการ
2. จัดลำดับ severity: Critical → High → Medium → Low → Info
3. คำนวณ review score เป็น percentage ต่อ dimension และ overall
4. ทำ `/report` พร้อม `/report-table` และ `/suggest-next-action`

## Rules

### 1. Scope

- ทำ review เท่านั้น ไม่แก้ไข infrastructure หรือ config ระหว่าง review
- ถ้าพบ issue นอก scope → ระบุเป็น info เท่านั้น
- ไม่เปลี่ยนแปลง production settings

### 2. Severity

- Critical: no rollback strategy, exposed secrets, no monitoring on critical path, no backup/failover, no circuit breaker บน critical service, no health endpoint
- High: missing CI/CD step, no zero-downtime, missing key metric, missing RPO/RTO, missing TTL/fallback, env parity gap
- Medium: suboptimal deployment, suboptimal alert threshold, inconsistent backup, suboptimal TTL, incomplete migration coverage
- Low: minor deployment improvement, minor workflow improvement, minor config improvement, naming convention, documentation gap

### 3. Evidence

- ทุก finding ต้องมี file path, line number หรือ config/dashboard link
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ impact ต่อ critical paths และ users

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code หรือ config
- ไม่ apply fixes ไม่ merge ไม่ย้ายเนื้อหา

### 5. Formatting

- ห้ามใช้ double-asterisk markers สำหรับเน้นข้อความ — ใช้ backticks สำหรับ `tools`, `commands`, paths และ skill references
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

### 6. Health Score

- คำนวณ review score เป็น percentage (0-100)
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after

## Expected Outcome

- รายงาน infrastructure findings พร้อม evidence, severity, file path หรือ config
- คะแนน review ต่อ dimension: workers, queues, webhooks, scalability, cost, deployment, DR, migration
- คะแนน overall infrastructure score
- ตารางสรุป findings ด้วย `/report-table`
- ข้อเสนอแนะ action ถัดไป

*Merged from source review-* skills.*