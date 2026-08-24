---
name: review-infrastructure
description: Review infrastructure including workers, queues, webhooks, scalability, cost, and migration
allowed-tools:
  - ask_user_question
  - edit
  - exec
  - glob
  - grep
  - read
triggers:
  - model
  - user
related:
  - review-codebase
  - review-correctness
  - review-docs
  - review-frontend
  - review-performance
  - review-quality
  - review-reliability
  - review-security
  - suggest-next-action
  - validate
---

## Goal

Review infrastructure ครอบคลุมทุก dimension ของ infrastructure พร้อม aggregate findings และ review score Review background workers ครอบคลุม job lifecycle, cron jobs, scheduling, health monitoring, scaling พร้อม review score Review queue system ครอบคลุม job processing, idempotency, retry, backpres...

## Scope

infrastructure review สำหรับ: deployment, CI/CD, config files, monitoring, tracing, disaster recovery, backup, caching, cost optimization, resilience, environment, observability, health endpoints, upgrade safety workers review สำหรับ: job lifecycle, job error handling, cron jobs, schedule configuration, timezone handling, task dependencies, worker health monitoring, restart strategy, worker sca...

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ infrastructure setup และ platform ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ infrastructure setup
2. ระบุ deployment platform, CI/CD tools, monitoring tools, และ cloud providers ที่ใช้
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
5. รัน `bun --filter tools-review review:json` เพื่อดึง review report พร้อม metrics
6. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด

### 2. Deployment And CI/CD Review

Review deployment, CI/CD pipeline, rollback, zero-downtime, env vars, post-deploy validation

> Goal: ครอบคลุมทุก deployment และ CI/CD dimension

1. ตรวจสอบ CI/CD pipeline, workflow structure, job dependencies, execution order, และ deployment steps
2. ตรวจสอบ rollback strategy, zero-downtime config, post-deploy validation, และ environment promotion
3. ตรวจสอบ env var coverage, missing config, hardcoded values, และ secrets management
4. ตรวจสอบ caching strategy, artifact management, build optimization, และ parallel job efficiency
5. ตรวจสอบ secrets handling, environment variables, permissions, test automation, และ conditional execution
6. Critical: no rollback strategy, no post-deploy validation, hardcoded secrets, exposed secrets, broken pipeline, no test gate, missing required env var, missing required workflow
7. High: missing CI/CD step, no zero-downtime, inconsistent config, missing caching, slow pipeline, no artifact retention, broken job dependency

### 3. Config Files Review

Review config files ครอบคลุม tsconfig, vite, biome, env-specific configs, consistency

> Goal: ครอบคลุมทุก config dimension

1. ตรวจสอบ tsconfig, compiler options, path aliases, และ project references
2. ตรวจสอบ vite config, build options, plugin configuration, และ dev server settings
3. ตรวจสอบ biome config, lint rules, format rules, และ ignore patterns
4. ตรวจสอบ config consistency across workspaces, config documentation, และ config duplication
5. Critical: broken config, conflicting settings, missing required config
6. High: inconsistent config across workspaces, missing path alias, suboptimal compiler option

### 4. Monitoring, Tracing And Observability Review

Health monitoring, distributed tracing และ observability stack ครอบคลุม metrics, alerts, dashboards, span propagation, correlation IDs, incident response

> Goal: ครอบคลุมทุก monitoring, tracing และ observability dimension

1. ตรวจสอบ metrics collection, custom metrics, metric labeling, และ metric aggregation
2. ตรวจสอบ alert configuration, threshold tuning, alert routing, และ alert correlation with dashboards
3. ตรวจสอบ dashboard design, metric visualization, data freshness, และ service health coverage
4. ตรวจสอบ trace context propagation: W3C Trace Context, B3 propagation, header forwarding
5. ตรวจสอบ span creation, span attributes, span events, span coverage บน database queries, external API calls, background jobs, error paths
6. ตรวจสอบ trace sampling, cross-service correlation, log-trace-metric correlation, และ trace visualization
7. ตรวจสอบ instrumentation coverage, structured logging, log levels, log retention, และ observability tooling SDK initialization
8. ตรวจสอบ incident response readiness, runbook availability, และ escalation paths
9. Critical: no monitoring on critical path, missing alert for critical metric, no trace context propagation, missing span บน critical path, no error tracing, no observability on critical path, no correlation between signals, broken dashboard
10. High: missing key metric, alert fatigue, no runbook, missing trace sampling, no cross-service correlation, incomplete instrumentation, missing dashboard for core service, no trace-log correlation
11. ทำ `/review-codebase` เพื่อ observability deep dive เฉพาะทาง

### 5. Disaster Recovery And Backup Review

### Workers Deep Checks

> Goal: เข้าใจ worker structure และ scheduling patterns

1. ทำ `/scan-codebase` เพื่อเข้าใจ worker structure
2. ระบุ worker framework, cron scheduler, job patterns, worker deployment strategy ที่ใช้
3. ถ้า project ไม่มี background workers → stop และ report


> Goal: ครอบคลุมทุก worker dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ worker patterns
2. ทำ `/update-create-review-cli` — เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้



### Queue Deep Checks

> Goal: เข้าใจ queue system และ job patterns

1. ทำ `/scan-codebase` เพื่อเข้าใจ queue structure
2. ระบุ queue system (BullMQ, Redis Queue, SQS, RabbitMQ, custom), job patterns, retry config, dead letter queue strategy ที่ใช้
3. ถ้า project ไม่มี queue system → stop และ report


> Goal: ครอบคลุมทุก queue dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ queue patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้



### Webhook Deep Checks

> Goal: เข้าใจ webhook structure และ providers

1. ทำ `/scan-codebase` เพื่อเข้าใจ webhook structure
2. ระบุ webhook providers (Stripe, GitHub, Slack, custom), signature scheme, secret management strategy ที่ใช้
3. ถ้า project ไม่มี webhooks → stop และ report


> Goal: ครอบคลุมทุก webhook dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ webhook patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้



### Scalability Deep Checks

> Goal: เข้าใจ scalability patterns และ deployment setup

1. ทำ `/scan-codebase` เพื่อเข้าใจ scalability structure
2. ระบุ deployment strategy (single instance, multi-instance, serverless), caching layers, database scaling approach, queue design ที่ใช้


> Goal: ครอบคลุมทุก scalability dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ scalability patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้


> Goal: ครอบคลุม stateless design, horizontal scaling, shared state

### Cost Deep Checks

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ cost drivers และ infrastructure spend ใน codebase

1. ทำ `/scan-codebase` เพื่อหา cloud config, infra-as-code, deployment config, และ cost-related settings
2. ระบุ cloud providers, services, pricing models, และ resource types ที่ใช้
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด


Review compute spend ครอบคลุม instance sizing, auto-scaling, idle resources, reserved capacity

> Goal: ครอบคลุมทุก compute cost dimension

1. ตรวจสอบ instance / container sizing: CPU, memory, over-provisioning, right-sizing opportunities

### Migration Deep Checks

รวบรวม context ก่อน review migrations

> Goal: เข้าใจ migration history, tools, และ patterns

1. ทำ `/scan-codebase` เพื่อหา migration files, scripts, versioning
2. ระบุ migration tools: `Drizzle`, `Prisma`, `TypeORM`, custom scripts
3. ระบุ environments: dev, staging, prod


หา migrations ทั้งหมด

> Goal: มี inventory ครบ

1. ตรวจสอบ migration files ทั้งหมด: database, schema, framework, data
2. ตรวจสอบ migration ordering, version control


## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี deployment setup หรือ CI/CD → ข้าม Section 2
- ถ้า project ไม่มี config files → ข้าม Section 3
- ถ้า project ไม่มี monitoring, tracing หรือ observability → ข้าม Section 4
- ถ้า project ไม่มี DR plan หรือ backup → ข้าม Section 5
- ถ้า project ไม่มี caching → ข้าม Section 6

### 2. Severity Classification

- Critical: no rollback strategy, exposed secrets, no monitoring on critical path, no backup, no failover, cache poisoning, no circuit breaker บน critical service, secret exposed to client, no health endpoint, no rollback plan for critical dependency
- High: missing CI/CD step, no zero-downtime, missing key metric, missing RPO/RTO, missing TTL, missing fallback, env parity gap, incomplete instrumentation, missing readiness probe, missing migration script
- Medium: suboptimal deployment config, suboptimal parallelization, suboptimal alert threshold, inconsistent backup, suboptimal TTL, inconsistent timeout, inconsistent default values, inconsistent metric naming, inconsistent response format, incomplete migration coverage
- Low: minor deployment improvement, minor workflow improvement, minor config improvement, minor metric improvement, minor backup improvement, minor cache improvement, minor cost optimization, minor pattern improvement, naming convention, documentation gap

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

### 1. Skip Conditions


*Some details from merged source skills were condensed to keep the skill under 250 lines.*
