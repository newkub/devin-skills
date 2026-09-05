---
name: review-cost
description: ตรวจสอบ infrastructure cost: compute, storage, bandwidth, third-party, idle resources
argument-hint: "[service-or-resource]"
related:
  - optimize-cost
  - report-table
  - review-performance
---

## Goal

ตรวจสอบ infrastructure cost: compute, storage, bandwidth, third-party services และ idle resources ก่อนส่งต่อให้ `/optimize-cost`

## Scope

ใช้กับ cloud deployment: Cloudflare Workers, AWS, Vercel, fly.io โดย audit usage โดยไม่แก้ไข resources

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

1. ทำ `/report-table` ด้วย columns: No., Service, Cost, Waste, Severity, Fix
2. ชี้ไป `/optimize-cost` สำหรับการแก้ไข
3. ถ้ามี performance ปัญหา → เชื่อม `/review-performance`

## Rules

### 1. Read Only

- ห้ามลบ resources หรือเปลี่ยน plan ระหว่าง review
- ใช้ billing data และ observability เท่านั้น

### 2. Evidence Required

- ทุก finding ต้องมี billing amount, usage metric หรือ resource id
- ไม่แนะนำ cost cut โดยไม่มี risk assessment

## Expected Outcome

- รายงาน findings ครอบคลุม compute, storage, bandwidth, third-party
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน `/optimize-cost`
