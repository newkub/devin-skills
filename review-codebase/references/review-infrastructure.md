---
name: review-infrastructure
description: Review infrastructure ครอบคลุม deployment, CI/CD, config files, monitoring, tracing, disaster recovery, backup, caching, cost, resilience, environment, observability, health endpoints, upgrade safety
---

## Goal

Review infrastructure ครอบคลุมทุก dimension ของ infrastructure พร้อม aggregate findings และ review score

## Scope

infrastructure review สำหรับ: deployment, CI/CD, config files, monitoring, tracing, disaster recovery, backup, caching, cost optimization, resilience, environment, observability, health endpoints, upgrade safety

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ infrastructure setup และ platform ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ infrastructure setup
2. ระบุ deployment platform, CI/CD tools, monitoring tools, และ cloud providers ที่ใช้
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/update-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
5. รัน `bun --filter @booking/tools-review review:json` เพื่อดึง review report พร้อม metrics
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

Review DR plan และ backup ครอบคลุม RPO/RTO, failover, data backup, recovery procedures, restore testing

> Goal: ครอบคลุมทุก DR และ backup dimension

1. ตรวจสอบ RPO/RTO targets: definition per service, measurement method, compliance status
2. ตรวจสอบ failover strategy: active-passive vs active-active, failover trigger, failback procedure
3. ตรวจสอบ data backup: backup frequency, backup type, backup storage, backup encryption, และ retention policy
4. ตรวจสอบ recovery procedures: recovery steps, recovery time estimation, recovery validation, และ restore testing
5. ตรวจสอบ DR testing: test frequency, test scope, test documentation, automated DR test
6. ตรวจสอบ DR documentation: runbook, contact list, escalation procedure, dependency map
7. ตรวจสอบ single points of failure: redundant services, data replication, geographic distribution
8. Critical: no backup, no failover, single point of failure บน critical service, untested restore, RPO/RTO non-compliance
9. High: missing RPO/RTO, no DR testing, missing recovery procedure, missing restore test, inconsistent backup, no retention policy

### 6. Caching Review

Review caching strategy ครอบคลุม invalidation, key design, TTL, storage, stale-while-revalidate

> Goal: ครอบคลุมทุก caching dimension

1. ตรวจสอบ cache invalidation strategy, key design, และ namespace management
2. ตรวจสอบ TTL configuration, expiration policy, และ cache eviction
3. ตรวจสอบ cache storage selection, memory vs persistent, และ distributed cache
4. ตรวจสอบ stale-while-revalidate patterns, cache warming, และ cache hit ratio
5. Critical: cache poisoning, no invalidation on data change, cache stampede
6. High: missing TTL, inconsistent cache key, no cache warming

### 7. Cost Review

Review cloud cost optimization ครอบคลุม resource usage, billing, waste elimination

> Goal: ครอบคลุมทุก cost dimension

1. ตรวจสอบ compute cost: server sizing, auto-scaling config, idle resource detection
2. ตรวจสอบ storage cost: storage volume, retention policy, duplicate data, orphaned storage
3. ตรวจสอบ bandwidth cost: CDN usage, image optimization, response compression, caching headers
4. ตรวจสอบ third-party API cost: API call volume, caching strategy, batch API usage, free tier utilization
5. ตรวจสอบ database cost: query efficiency, index bloat, connection pool sizing, read replica necessity
6. ตรวจสอบ cost monitoring: cost alerts, budget limits, cost attribution, cost dashboard
7. ตรวจสอบ waste elimination: unused resources, over-provisioned resources, zombie processes
8. Critical: significant waste, no cost monitoring, unbounded resource scaling
9. High: missing caching strategy, over-provisioned resources, no cost alerts

### 8. Resilience Review

Review resilience patterns ครอบคลุม circuit breakers, fallbacks, graceful degradation, retry strategies

> Goal: ครอบคลุมทุก resilience dimension

1. ตรวจสอบ circuit breaker: threshold config, open/half-open/closed states, fallback on open
2. ตรวจสอบ fallback mechanisms: default responses, cached data fallback, static fallback
3. ตรวจสอบ graceful degradation: partial feature disable, read-only mode, queue-based degradation
4. ตรวจสอบ retry strategies: max retries, backoff strategy, jitter, retry budget
5. ตรวจสอบ bulkhead patterns: resource isolation, connection pool limits, concurrent request limits
6. ตรวจสอบ timeout management: request timeouts, circuit breaker timeouts, overall deadline
7. Critical: no circuit breaker บน critical service, no timeout, cascading failure risk
8. High: missing fallback, no retry strategy, no bulkhead isolation

### 9. Environment Review

Review environment config ครอบคลุม env var validation, parity, secret rotation, documentation, env safety

> Goal: ครอบคลุมทุก environment dimension

1. ตรวจสอบ env var validation: required vars, type validation, default values, missing var handling
2. ตรวจสอบ env parity: dev vs staging vs prod, missing vars per environment, extra vars per environment
3. ตรวจสอบ secret rotation: rotation schedule, rotation evidence, stale secrets
4. ตรวจสอบ env documentation: .env.example completeness, env var descriptions, setup guide
5. ตรวจสอบ env var exposure: client-side vs server-side, VITE_ prefix, secret leakage to client
6. ตรวจสอบ env var type safety: string vs number vs boolean, parsing logic, invalid value handling
7. ตรวจสอบ env migration safety: removed vars, renamed vars, backward compatibility
8. Critical: secret exposed to client, missing required env var in prod, no validation on critical env var
9. High: env parity gap, missing .env.example, no secret rotation, missing env documentation

### 10. Health Endpoint Review

Review health and readiness endpoints ครอบคลุม liveness, readiness probes, dependency checks, graceful shutdown

> Goal: ครอบคลุมทุก health endpoint dimension

1. ตรวจสอบ liveness probe: endpoint path, response format, status codes, no dependency checks
2. ตรวจสอบ readiness probe: endpoint path, dependency checks, response format, status codes
3. ตรวจสอบ dependency health checks: database connectivity, cache availability, external service reachability
4. ตรวจสอบ graceful shutdown: SIGTERM handling, connection draining, in-flight request completion
5. ตรวจสอบ health endpoint security: public vs internal, authentication, rate limiting
6. ตรวจสอบ response format: structured JSON, status enum, dependency details, version info
7. Critical: no health endpoint, liveness checks dependencies, no graceful shutdown, health endpoint exposes secrets
8. High: missing readiness probe, no dependency check, incomplete shutdown, missing health endpoint auth

### 11. Upgrade Safety Review

Review upgrade safety ครอบคลุม breaking change analysis, migration scripts, rollback plan, compatibility matrix

> Goal: ครอบคลุมทุก upgrade safety dimension

1. ตรวจสอบ breaking change detection: changelog analysis, deprecated API usage, removed exports
2. ตรวจสอบ migration script coverage: database migrations, config migrations, code transform scripts
3. ตรวจสอบ rollback plan: rollback scripts, state rollback, data rollback, rollback testing
4. ตรวจสอบ compatibility matrix: peer dependency conflicts, version range overlap, engine requirements
5. ตรวจสอบ upgrade testing: upgrade test suite, integration tests post-upgrade, smoke tests
6. ตรวจสอบ upgrade documentation: upgrade guide, breaking change list, migration timeline
7. Critical: no rollback plan for critical dependency, breaking change without migration, data loss risk in upgrade
8. High: missing migration script, no upgrade tests, incompatible peer dependency, missing upgrade guide

### 12. Validate, Report And Implement

ตรวจสอบ findings, validate, รายงานผล และตรวจสอบ implementation completeness

> Goal: Issues ถูก validate ครบถ้วน จัดลำดับตาม severity และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review — ถ้าพบ incomplete implementations → เพิ่มเป็น findings
5. ทำ `/report` พร้อม `/report-table` สร้างตาราง aggregate findings จากทุก section
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี deployment setup หรือ CI/CD → ข้าม Section 2
- ถ้า project ไม่มี config files → ข้าม Section 3
- ถ้า project ไม่มี monitoring, tracing หรือ observability → ข้าม Section 4
- ถ้า project ไม่มี DR plan หรือ backup → ข้าม Section 5
- ถ้า project ไม่มี caching → ข้าม Section 6
- ถ้า project ไม่มี cloud resources → ข้าม Section 7
- ถ้า project ไม่มี external dependencies → ข้าม Section 8
- ถ้า project ไม่มี environment config → ข้าม Section 9
- ถ้า project ไม่มี health endpoints → ข้าม Section 10
- ถ้า project ไม่มี dependencies → ข้าม Section 11

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

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก infrastructure section
- รายงาน recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
