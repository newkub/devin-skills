---
name: review-cost
description: "ตรวจสอบ infrastructure cost: compute, storage, bandwidth, third-party, idle resources"
argument-hint: "[service-or-resource]"
related:
  - report
  - review-performance
  - run-review
---

## Goal

ตรวจสอบ infrastructure cost: compute, storage, bandwidth, third-party services และ idle resources ก่อนส่งต่อไปยัง section `## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. baseline: cost/service, top spenders, trend
2. idle waste: stop/schedule dev resources, orphaned volumes/snapshots cleanup + backup
3. right-size ตาม utilization evidence; storage tiers
4. transfer: CDN cache, compression, batching; log/metric volume
5. CI spend: path filters, right-size runners, artifact retention
6. verify: cost alerts/budgets + rollback plan สำหรับ high-risk
## Scope

ใช้กับ cloud deployment: Cloudflare Workers, AWS, Vercel, fly.io โดย audit usage โดยไม่แก้ไข resources

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: deep-cost-analysis) — ถ้าต้อง deep cost model, unit economics และ projection ที่ scale สูง ดู `references/deep-cost-analysis.md`

สำหรับ dedicated fix pass อยู่ที่ `/deep-review-then-fix`

## Execute

### 1. Audit Costs

> Goal: รู้ cost drivers

1. ตรวจ billing dashboard และ invoices
2. ระบุ top cost drivers ตาม service
3. ตรวจ logs/metrics usage
4. ตรวจ storage ทีไม่จำเป็น

### 2. Review Compute And Concurrency

> Goal: ตรวจ compute efficiency

1. ตรวจ cold starts, idle instances
2. ตรวจ concurrency limits ทีเกินความจำเป็น
3. ตรวจ edge vs origin compute split

### 3. Review Storage And Bandwidth

> Goal: ตรวจ storage/bandwidth waste

1. ตรวจ unused databases, tables, buckets
2. ตรวจ logs/artifacts lifecycle
3. ตรวจ CDN cache hit ratio

### 4. Review Third-party Services

> Goal: ตรวจค่าใช้จ่าย third-party

1. ตรวจ API calls ที charge ตาม request
2. ตรวจ managed services ทีใช้น้อย
3. ระบุ services ที duplicate กัน

### 5. Rate And Report

> Goal: สรุป findings พร้อม fix direction

1. ทำ `/report` ด้วย columns: No., Service, Cost, Waste, Severity, Fix
2. ชี้ไป section `## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. baseline: cost/service, top spenders, trend
2. idle waste: stop/schedule dev resources, orphaned volumes/snapshots cleanup + backup
3. right-size ตาม utilization evidence; storage tiers
4. transfer: CDN cache, compression, batching; log/metric volume
5. CI spend: path filters, right-size runners, artifact retention
6. verify: cost alerts/budgets + rollback plan สำหรับ high-risk
## Rules

### 1. Read Only

- ห้ามลบ resources หรือเปลี่ยน plan ระหว่าง review
- ใช้ billing data และ observability เท่านั้น

### 2. Evidence Required

- ทุก finding ต้องมี billing amount, usage metric หรือ resource id
- ไม่แนะนำ cost cut โดยไม่มี risk assessment

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. baseline: cost/service, top spenders, trend
2. idle waste: stop/schedule dev resources, orphaned volumes/snapshots cleanup + backup
3. right-size ตาม utilization evidence; storage tiers
4. transfer: CDN cache, compression, batching; log/metric volume
5. CI spend: path filters, right-size runners, artifact retention
6. verify: cost alerts/budgets + rollback plan สำหรับ high-risk
- ใช้ /review-performance ถ้าจำเป็น

## References

- [Full-dimension checklist](references/checklist.md)
- ใช้ /run-review ถ้าจำเป็น

- ใช้ /review-performance ถ้าจำเป็น

## Expected Outcome

- รายงาน findings ครอบคลุม compute, storage, bandwidth, third-party
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน section `## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. baseline: cost/service, top spenders, trend
2. idle waste: stop/schedule dev resources, orphaned volumes/snapshots cleanup + backup
3. right-size ตาม utilization evidence; storage tiers
4. transfer: CDN cache, compression, batching; log/metric volume
5. CI spend: path filters, right-size runners, artifact retention
6. verify: cost alerts/budgets + rollback plan สำหรับ high-risk
