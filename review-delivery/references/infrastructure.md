# Infrastructure Checks

## Goal

ตรวจสอบ infrastructure, deployment, background workers, queues, webhooks, scalability, cost และ migration

## Scope

ครอบคลุม workers, queues, webhooks, scalability, deployment, CI/CD, config files, monitoring, tracing, observability, cost, migration — ไม่ครอบคลุม security, quality, correctness

## Checks

### Workers And Queues

1. ตรวจสอบ worker lifecycle: scheduling, cron, timezone, task dependencies, restart strategy
2. ตรวจสอบ job processing: idempotency, retry, backpressure, dead letter queue
3. ระบุ worker framework, queue system: `BullMQ`, `SQS`, `RabbitMQ`, `Redis`, custom
4. ถ้าไม่มี background workers หรือ queues → ข้ามส่วนที่ไม่มี

### Webhooks

1. ระบุ webhook providers: Stripe, GitHub, Slack, custom
2. ตรวจสอบ signature scheme, secret management, idempotency, replay protection
3. ตรวจสอบ error handling, retry, timeout และ provider contract
4. ถ้าไม่มี webhooks → ข้าม step นี้

### Scalability And Cost

1. ตรวจสอบ deployment strategy: single instance, multi-instance, serverless
2. ตรวจสอบ stateless design, horizontal scaling, shared state, caching layers
3. ตรวจสอบ database scaling, read replicas, sharding, connection pooling
4. ตรวจสอบ compute spend: CPU, memory, over-provisioning, right-sizing, auto-scaling
5. ระบุ idle resources และ reserved capacity opportunities

### Deployment And CI/CD

1. ตรวจสอบ CI/CD workflow, job dependencies, deployment steps, environment promotion
2. ตรวจสอบ rollback strategy, zero-downtime config, post-deploy validation
3. ตรวจสอบ env var coverage, missing config, hardcoded values, secrets management
4. ตรวจสอบ build optimization, caching, artifact management, parallel job efficiency

### Configuration And Observability

1. ตรวจสอบ `tsconfig.json`, `vite.config.ts`, `biome.json`, environment-specific configs
2. ตรวจสอบ config consistency ข้าม workspaces, path aliases, compiler options
3. ตรวจสอบ metrics, logs, traces, alerts, dashboards, SLOs
4. ตรวจสอบ trace context propagation, span coverage, log-trace-metric correlation

### Disaster Recovery And Migration

1. ตรวจสอบ DR plan, RPO/RTO targets, backup schedules, restore procedures
2. ตรวจสอบ runbooks, incident response, escalation paths
3. ตรวจสอบ migration files: ordering, version control, rollback strategy
4. ระบุ migration tools: `Drizzle`, `Prisma`, `TypeORM`, custom scripts

## Severity

- Critical: no rollback strategy, exposed secrets, no monitoring on critical path, no backup/failover, no circuit breaker, no health endpoint
- High: missing CI/CD step, no zero-downtime, missing key metric, missing RPO/RTO, missing TTL/fallback, env parity gap
- Medium: suboptimal deployment, suboptimal alert threshold, inconsistent backup, incomplete migration coverage
- Low: minor deployment improvement, minor workflow improvement, naming convention, documentation gap

## Rules

- ทำ review เท่านั้น ไม่แก้ไข infrastructure หรือ config ระหว่าง review
- ถ้าพบ issue นอก scope → ระบุเป็น info เท่านั้น
- ไม่เปลี่ยนแปลง production settings
- ทุก finding ต้องมี file path, line number หรือ config/dashboard link
- ระบุ impact ต่อ critical paths และ users
