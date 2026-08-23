---
name: review-cost
description: Review cost/infra spend ครอบคลุม compute, storage, bandwidth, database, API และ waste
---


## Goal

Review cost และ infrastructure spend ครอบคลุมทุก dimension พร้อม aggregate findings และ review score

## Scope

cost review สำหรับ: compute, storage, bandwidth, database, third-party API, caching, scaling, monitoring, budget, waste elimination

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ cost drivers และ infrastructure spend ใน codebase

1. ทำ `/scan-codebase` เพื่อหา cloud config, infra-as-code, deployment config, และ cost-related settings
2. ระบุ cloud providers, services, pricing models, และ resource types ที่ใช้
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
5. รัน `bun --filter tools-review review:json` เพื่อดึง review report พร้อม metrics
6. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด

### 2. Compute Cost Review

Review compute spend ครอบคลุม instance sizing, auto-scaling, idle resources, reserved capacity

> Goal: ครอบคลุมทุก compute cost dimension

1. ตรวจสอบ instance / container sizing: CPU, memory, over-provisioning, right-sizing opportunities
2. ตรวจสอบ auto-scaling config: scale-out/scale-in thresholds, min/max capacity, schedule-based scaling
3. ตรวจสอบ idle or unused resources: stopped instances, unused load balancers, orphan resources
4. ตรวจสอบ reserved capacity: reserved instances, savings plans, spot/preemptible usage
5. ตรวจสอบ serverless cost: invocation count, duration, memory allocation, concurrency limits
6. Critical: significant over-provisioning, unbounded auto-scaling, no reserved capacity on predictable workload
7. High: missing right-sizing, idle resources, suboptimal auto-scaling thresholds, under-utilized reservations

### 3. Storage Cost Review

Review storage spend ครอบคลุม volume, retention, duplication, tiering, backup

> Goal: ครอบคลุมทุก storage cost dimension

1. ตรวจสอบ storage volume and growth: database size, object storage, logs, artifacts
2. ตรวจสอบ retention policy: data retention, log retention, backup retention, compliance requirements
3. ตรวจสอบ duplicate or orphaned data: unused databases, old backups, duplicate artifacts
4. ตรวจสอบ storage tiering: hot/warm/cold tiers, lifecycle policies, archive strategy
5. ตรวจสอบ backup cost: backup frequency, cross-region replication, snapshot retention
6. Critical: unbounded storage growth, no retention policy, orphaned storage causing runaway cost
7. High: missing tiering, duplicate data, over-retention, untagged storage

### 4. Bandwidth And CDN Cost Review

Review bandwidth and CDN spend ครอบคลุม egress, CDN usage, compression, caching headers

> Goal: ครอบคลุมทุก bandwidth cost dimension

1. ตรวจสอบ data transfer cost: inter-region, inter-AZ, public egress, NAT gateway
2. ตรวจสอบ CDN usage: cache hit ratio, origin pull, edge locations, dynamic vs static content
3. ตรวจสอบ response compression: gzip, brotli, image/video optimization
4. ตรวจสอบ caching headers: Cache-Control, TTL, stale-while-revalidate
5. ตรวจสอบ API payload size: over-fetching, unnecessary fields, large JSON responses
6. Critical: massive unexpected egress, no CDN on static content, uncompressible large payloads
7. High: low CDN cache hit ratio, missing compression, excessive inter-region transfer

### 5. Database Cost Review

Review database spend ครอบคลุม instance class, query efficiency, indexes, read replicas, connections

> Goal: ครอบคลุมทุก database cost dimension

1. ตรวจสอบ database instance class and size: over-provisioned CPU/memory, storage type
2. ตรวจสอบ query efficiency: slow queries, missing indexes, N+1 queries, high IOPS
3. ตรวจสอบ read replica necessity: replica count, replication lag, read/write split
4. ตรวจสอบ connection pool sizing: max connections, idle connections, pooler usage
5. ตรวจสอบ index bloat and storage: unused indexes, duplicate indexes, bloat cleanup
6. Critical: database significantly over-provisioned, runaway query cost, no indexing on hot path
7. High: missing read replica optimization, oversized instance, connection pool overflow

### 6. Third-Party API And License Cost Review

Review external API and license spend ครอบคลุม usage volume, tiers, caching, batching

> Goal: ครอบคลุมทุก external cost dimension

1. ตรวจสอบ API call volume: per endpoint, per consumer, rate limits, quota usage
2. ตรวจสอบ pricing tiers and free tier utilization: plan selection, overage charges
3. ตรวจสอบ caching strategy for API responses: TTL, key design, stale-while-revalidate
4. ตรวจสอบ batching and deduplication: batch API calls, retry without amplification
5. ตรวจสอบ software licenses: seat count, feature tiers, unused subscriptions
6. Critical: unbounded API spend, no caching on expensive calls, license overage
7. High: missing batching, underutilized free tier, duplicate API calls, unused licenses

### 7. Cost Monitoring And Budget Review

Review cost observability ครอบคลุม budgets, alerts, attribution, dashboards

> Goal: ครอบคลุมทุก cost monitoring dimension

1. ตรวจสอบ budget and alerts: monthly budget, anomaly alerts, threshold notifications
2. ตรวจสอบ cost attribution: tagging strategy, per-team/service visibility, cost allocation
3. ตรวจสอบ cost dashboards: cloud console dashboards, third-party tooling, trend analysis
4. ตรวจสอบ forecasting and reserved capacity planning: usage prediction, commitment analysis
5. Critical: no budget alerts, no cost monitoring, no tagging strategy
6. High: missing anomaly detection, incomplete cost attribution, no dashboards

### 8. Validate And Report

ตรวจสอบ findings, validate, รายงานผล

> Goal: Issues ถูก validate ครบถ้วน จัดลำดับตาม severity และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review — ถ้าพบ incomplete implementations → เพิ่มเป็น findings
5. ทำ `/report` พร้อม `/report-table` สร้างตาราง aggregate findings จากทุก section
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี cloud/infra resources → ข้าม section ที่ไม่เกี่ยวข้อง
- ถ้า project ไม่มี CDN → ข้าม Section 4
- ถ้า project ไม่มี third-party API → ข้าม Section 6
- ถ้า project ไม่มี database → ข้าม Section 5

### 2. Severity Classification

- Critical: significant waste, no cost monitoring, unbounded resource scaling, unbounded API spend, license overage, no budget alerts
- High: missing caching strategy, over-provisioned resources, no cost alerts, missing right-sizing, idle resources, missing tiering
- Medium: suboptimal instance size, suboptimal retention, inconsistent tagging, minor caching gap, suboptimal CDN config
- Low: minor optimization opportunity, naming convention, documentation gap, minor budget improvement

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

- รายงานตาราง aggregate findings จากทุก cost/infra spend section
- รายงาน recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
