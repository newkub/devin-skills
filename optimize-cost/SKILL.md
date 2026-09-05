---
name: optimize-cost
description: ปรับปรุง infrastructure cost: compute, storage, bandwidth, third-party, idle resources
argument-hint: "[service-or-resource]"
related:
  - optimize-codebase-everything
  - optimize-network
  - optimize-memory
  - report-table
---

## Goal

ปรับปรุง infrastructure cost: compute, storage, bandwidth, third-party services, idle resources

## Scope

ใช้กับ cloud deployment: Cloudflare Workers, AWS, Vercel, fly.io โดย audit usage และ optimize

## Execute

### 1. Audit Costs

> Goal: Audit Costs

1. ตรวจ billing dashboard
2. ระบุ top cost drivers
3. ตรวจ logs/metrics usage
4. ตรวจ storage ทีไม่จำเป็น

### 2. Optimize Compute

> Goal: Optimize Compute

1. ลด cold starts
2. ใช้ caching ลด compute
3. ใช้ edge functions ถ้าเหมาะสม
4. ลด concurrency ถ้าเกินความจำเป็น

### 3. Optimize Storage

> Goal: Optimize Storage

1. ลบ logs/artifacts เก่า
2. ใช้ object lifecycle rules
3. บีบอัด backups
4. ลบ unused databases/tables

### 4. Optimize Bandwidth

> Goal: Optimize Bandwidth

1. ใช้ CDN
2. บีบอัด assets
3. ลบ unnecessary third-party scripts
4. ใช้ edge caching

### 5. Reduce Third-Party Costs

> Goal: Reduce Third-Party Costs

1. ตรวจ billing ของ APIs/SaaS
2. ใช้ rate limiting
3. ใช้ caching สำหรับ external API
4. ยกเลิก services ทีไม่ใช้

### 6. Validate

> Goal: Validate

1. วัด cost หลัง optimize
2. ทำ `/report-table` สรุป

## Rules

- ไม่ลด reliability เพื่อ cost
- ตรวจ cost หลังทุก change
- ใช้ alerts สำหรับ cost spikes

## Expected Outcome

- Cost ลดลง
- ไม่มere reliability regression
- Idle resources ถูก cleanup
