---
name: review-cost-optimize-cost
description: Apply cost findings — ลด compute, storage, bandwidth, third-party spend ตาม severity
argument-hint: "[service-or-resource]"
related:
  - review-cost
  - report
  - report-before-after
  - ask-me
---

## Goal

แก้ findings จาก `/review-cost` จริง — ลด compute, storage, bandwidth และ third-party spend — ทุก change มี evidence, user confirmation และ rollback path

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้ — review/report-only โดย default
- ครอบคลุม: compute right-sizing, storage tiers/lifecycle, egress/CDN, third-party plans, CI spend, LLM token usage
- ไม่รวม code-level optimization → `/review-performance` fix flow

## Execute

### 1. Baseline And Prioritize

> Goal: รู้ตัวเลขเดิมและเรียง savings

1. เก็บ baseline: cost/service, top spenders, trend จาก billing dashboard
2. map findings → severity และ estimated savings — เรียงมาก → น้อย
3. ทุก change ที่ลบ/ลด resource → เขียน rollback plan ก่อนลงมือ

### 2. Cut Compute And Idle Waste

> Goal: จ่ายเฉพาะ compute ที่ใช้จริง

1. stop/schedule dev และ staging resources ที่ idle นอกเวลาทำงาน
2. right-size instances/serverless limits ตาม utilization evidence — ดู peak ไม่ใช่แค่ average
3. ลด cold start cost — provisioned concurrency/warmup เมื่อ cold start tax สูง
4. cleanup orphaned volumes/snapshots — สำรองก่อนลบเสมอ

### 3. Reduce Storage And Bandwidth

> Goal: ลด storage/egress bill

1. ย้าย cold data ไป storage tier ที่ถูกกว่า, ตั้ง lifecycle policy สำหรับ logs/artifacts/backups
2. ลด egress: เพิ่ม CDN cache hit ratio, compression, batch requests
3. ลด log/metric volume — sampling, retention, drop noisy dimensions

### 4. Reduce Third-party And CI Spend

> Goal: ตัดค่าใช้จ่ายที่ซ้ำหรือเกินจำเป็น

1. ตรวจ third-party services ที่ซ้ำกัน — consolidate หรือ downgrade plan ที่ใช้ไม่เต็ม
2. cache external API calls และ rate-limit integrations ที่ยิง request ถี่ — ลด per-request charges
3. CI spend: path filters, right-size runners, artifact retention, cache deps
4. ตั้ง budget alerts ถ้า provider รองรับ

### 5. Reduce LLM Token Spend

> Goal: ลด token usage และ model cost โดยไม่ลด quality

1. ลด prompt bloat — trim system prompts, remove redundant context, compact tool schemas
2. เปิด prompt caching เมื่อ provider รองรับ — cache stable prefixes แทน resend ทุก request
3. route งานง่ายไป cheaper model tier — ใช้ flagship model เฉพาะ task ที่จำเป็น
4. จำกัด output tokens และใช้ structured output เพื่อลด verbosity
5. batch/dedupe LLM calls — cache responses สำหรับ inputs ที่ซ้ำ

### 6. Verify And Report

> Goal: ลด cost โดยไม่ลด reliability

1. smoke test services ที่แก้ — ลด size แต่ต้องไม่ down, RPO/RTO เหมือนเดิม
2. ทำ `/report-before-after` ด้วยตัวเลข cost ต่อ service
3. ระบุ findings ที่ค้างและ recommended next actions

## Rules

- ทุก change ต้องมี billing/usage evidence — ห้าม cut โดยเดา
- การลบ resource, downgrade plan, หรือลด redundancy ต้องผ่าน `/ask-me` confirm
- สำรองข้อมูลก่อนลบเสมอ — rollback path ต้องทำได้จริง
- ห้ามลด reliability/security เพื่อ cost
- แยก change ต่อกลุ่ม ให้ rollback ได้ทีละส่วน

## Expected Outcome

- cost ลดลงตามตัวเลข before/after ต่อ service
- ไม่มี idle/orphaned spend ที่จ่ายโดยไม่ใช้
- ทุก destructive change มี backup + rollback plan
