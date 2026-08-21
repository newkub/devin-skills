---
name: review-scalability
description: Review stateless design, horizontal scaling, database scaling, queue design, caching strategy, resource pooling, rate limiting, batch processing
---

## Goal

Review scalability ครอบคลุม stateless design, horizontal scaling, database scaling, caching, resource pooling พร้อม review score

## Scope

scalability review สำหรับ: stateless design, horizontal scaling (shared state, file-based locks, singleton patterns), database scaling (N+1 queries, unbounded queries, connection pool config), queue design (backlog handling, worker scaling, backpressure), caching strategy, resource pooling, rate limiting on expensive endpoints, batch processing, CDN strategy, read replicas, sharding, partitioning

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ scalability patterns และ deployment setup

1. ทำ `/scan-codebase` เพื่อเข้าใจ scalability structure
2. ระบุ deployment strategy (single instance, multi-instance, serverless), caching layers, database scaling approach, queue design ที่ใช้

### 2. Deep Analyze

> Goal: ครอบคลุมทุก scalability dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ scalability patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Stateless Design And Horizontal Scaling Review

> Goal: ครอบคลุม stateless design, horizontal scaling, shared state

1. ตรวจสอบ stateless design: stateless API handlers, no in-process session, no in-memory state ที่ต้อง share ระหว่าง instances, stateless auth (JWT vs session), stateless file processing
2. ตรวจสอบ shared state: shared mutable state ที่ break ใน multi-instance, file-based locks ที่ไม่ work ใน multi-instance, singleton patterns ที่ break ใน multi-instance, global variables, module-level cache
3. ตรวจสอบ horizontal scaling: scaling strategy, auto-scaling config, load balancer compatibility, sticky session avoidance, health check endpoint for load balancer, graceful drain on scale-down
4. ตรวจสอบ singleton patterns: singleton ที่ break ใน multi-instance, singleton ที่ควรเป็น distributed lock, singleton ที่ควรเป็น external service, singleton alternatives
5. Critical: shared mutable state ที่ break ใน multi-instance, in-process session ที่ไม่ scale, file-based lock ที่ไม่ work ใน multi-instance, singleton ที่ก่อให้เกิด inconsistency
6. High: in-memory cache ที่ไม่ share ระหว่าง instances, missing health check endpoint, sticky session dependency, missing graceful drain

### 4. Database, Queue, Cache And Resource Review

> Goal: ครอบคลุม database scaling, queue design, caching, resource pooling, rate limiting

1. ตรวจสอบ database scaling: N+1 queries ใน hot path, unbounded queries ที่ crash ที่โหลดสูง, connection pool config, connection pool size, read replicas, query timeout, slow query detection, sharding strategy, partitioning strategy
2. ตรวจสอบ queue design: backlog handling, worker scaling, backpressure handling, queue depth monitoring, queue overflow prevention, queue priority, queue partitioning
3. ตรวจสอบ caching strategy: cache layers (CDN, edge, application, database), cache invalidation strategy, cache stampede prevention, cache key design, cache TTL, cache warming, cache hit ratio
4. ตรวจสอบ resource pooling: connection pool management, resource pool limits, resource leak detection, resource cleanup, pool sizing, pool monitoring
5. ตรวจสอบ rate limiting on expensive endpoints: rate limit on expensive operations, rate limit on resource-intensive endpoints, rate limit per user, rate limit per IP, rate limit headers, 429 response with retry-after
6. ตรวจสอบ batch processing: batch operations, bulk insert/update, batch size optimization, batch error handling, batch timeout, batch retry, streaming processing
7. Critical: unbounded query ที่ crash ที่โหลดสูง, missing connection pool, cache stampede ที่ก่อให้เกิด cascade failure, no backpressure ที่ก่อให้เกิด resource exhaustion
8. High: N+1 query ใน hot path, missing queue backlog handling, missing cache invalidation, missing resource pooling, missing rate limiting on expensive endpoints, missing batch processing

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

- ถ้า project เป็น single instance → ข้าม Step 3 item 2-4 (แต่ยังตรวจ Step 4)
- ถ้า project ไม่มี queue → ข้าม Step 4 item 2
- ถ้า project ไม่มี caching → ข้าม Step 4 item 3
- ถ้า project ไม่มี database → ข้าม Step 4 item 1

### 2. Severity Classification

- Critical: shared mutable state ที่ break ใน multi-instance, in-process session ที่ไม่ scale, file-based lock ที่ไม่ work, singleton ที่ก่อให้เกิด inconsistency, unbounded query ที่ crash ที่โหลดสูง, missing connection pool, cache stampede, no backpressure ที่ก่อให้เกิด resource exhaustion
- High: in-memory cache ที่ไม่ share, missing health check, sticky session dependency, N+1 query ใน hot path, missing queue backlog handling, missing cache invalidation, missing resource pooling, missing rate limiting, missing batch processing
- Medium: suboptimal cache strategy, suboptimal connection pool size, missing read replicas, suboptimal batch size, missing cache warming
- Low: cosmetic, minor optimization, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ endpoint, query, cache key, หรือ resource ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก scalability section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
