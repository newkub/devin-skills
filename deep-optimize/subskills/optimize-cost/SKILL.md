---
name: deep-optimize-optimize-cost
description: ลด infrastructure cost — idle resources, right-sizing, egress, third-party spend
argument-hint: "[service-or-resource]"
related:
  - review-cost
  - report
  - report-before-after
  - ask-me
---

## Goal

ลด infrastructure cost — ตัด idle resources, right-size ตาม utilization, ลด egress/bandwidth waste — ทุก change มี evidence และ rollback path

## Scope

- ใช้กับ cloud deployment: Cloudflare Workers, AWS, Vercel, fly.io ตามที่ตรวจพบ
- ครอบคลุม: compute, storage, bandwidth/egress, third-party services, CI spend
- ไม่รวม code-level performance (ทำ `/deep-optimize-optimize-performance`)

## Execute

### 1. Baseline Spend

> Goal: รู้ว่าเงินไปอยู่ที่ไหน

1. ตรวจ billing dashboard / invoices — ระบุ cost ต่อ service และ trend
2. list top spenders และ resources ที่ provision ไว้
3. บันทึก baseline เป็น cost/service/month เพื่อ compare หลังแก้

### 2. Cut Idle Resources

> Goal: ตัดสิ่งที่จ่ายแต่ไม่ได้ใช้

1. หา idle compute — instances/dev environments ที่รันตลอดแต่ใช้เฉพาะเวลาทำงาน → stop หรือ schedule
2. หา orphaned resources — volumes, snapshots, old images, unused databases/buckets
3. สำรองข้อมูลก่อนลบเสมอ และ flag ให้ user confirm — การลบ resource ต้องผ่าน `/ask-me`

### 3. Right-Size And Reduce Egress

> Goal: จ่ายเท่าที่ใช้จริง

1. right-size compute ตาม utilization evidence — CPU/memory ที่ใช้จริง vs provisioned
2. ย้าย storage ที่เข้าถึงน้อยไป tier ที่ถูกกว่า และตั้ง lifecycle policy สำหรับ logs/artifacts
3. ลด egress: เพิ่ม CDN cache hit ratio, compression, batch requests, ลด log/metric volume
4. ตรวจ third-party services ที่ซ้ำกันหรือ plan เกินความจำเป็น

### 4. Verify And Guard

> Goal: ลด cost โดยไม่ลด reliability

1. smoke test services ที่แก้ — ลด size แต่ต้องไม่ down
2. ตั้ง budget alerts หรือ cost anomaly detection ถ้า provider รองรับ
3. เขียน rollback plan สำหรับทุก high-risk change
4. ทำ `/report-before-after` ด้วยตัวเลข cost ต่อ service

## Rules

- ทุก change ต้องมี billing/usage evidence — ห้าม cut โดยเดา
- การลบหรือเปลี่ยน plan ต้องมี user confirmation และ backup ก่อนเสมอ
- ห้ามลด reliability/security เพื่อ cost — RPO/RTO ต้องเหมือนเดิม
- แก้ทีละกลุ่มเรียง savings มาก → น้อย แยก commit/change ให้ rollback ได้
- right-sizing ต้องดู peak load ไม่ใช่แค่ average

## Expected Outcome

- cost ลดลงตามตัวเลขที่วัดได้ พร้อม before/after report
- ไม่มี idle/orphaned resources ที่จ่ายโดยไม่ใช้
- budget alerts ตั้งไว้แล้ว และทุก change มี rollback path
