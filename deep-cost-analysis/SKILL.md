---
name: deep-cost-analysis
description: วิเคราะห์ cost drivers เชิงลึก — infra, APIs, data transfer และ scaling trajectory
argument-hint: "[service-or-scope]"
related:
  - review-cost
  - optimize-cost
  - optimize-token-usage
  - analyze-dependencies
  - report-schema
  - report-table
---

## Goal

วิเคราะห์ cost structure ของ system เชิงลึก — ไม่ใช่แค่ดู bill แต่เข้าใจ cost drivers, unit economics และ cost ที่จะโตตาม scale — เพื่อตัดสินใจ optimization อย่างมีหลักฐาน

## Scope

- ครอบคลุม: compute, storage, egress/transfer, third-party APIs (per-call pricing), LLM tokens, managed services, CI minutes
- Analysis-first: ผลลัพธ์คือ cost model + recommendations — แก้ไขผ่าน `/optimize-cost`, `/optimize-token-usage`
- ใช้ข้อมูลจริงเมื่อมี (bills, usage metrics) — ระบุ assumptions ชัดเจนเมื่อ estimate

## Execute

### 1. Inventory Cost Sources

> Goal: map ทุกอย่างที่เสียเงิน

1. รวมบริการ: hosting (Cloudflare/Vercel/Railway/AWS), DB, storage, CDN, third-party APIs, LLM usage, CI/CD, email/SMS services
2. ดึงข้อมูลจริงถ้าเข้าถึงได้: bills, usage dashboards, billing APIs
3. ถ้าไม่มี access → สร้าง cost model จาก architecture + pricing pages โดยระบุว่าเป็น estimate

### 2. Build Cost Model

> Goal: เข้าใจ cost function ของระบบ

1. แยก fixed vs variable costs ต่อ service
2. ระบุ unit economics: cost per user/request/GB — metric ที่ scale กับ usage
3. หา drivers หลัก: อะไรที่ทำให้ bill โต (egress? API calls? token volume? always-on compute?)

### 3. Project At Scale

> Goal: model cost ที่ usage สูงขึ้น

1. คำนวณ cost ที่ 10x, 100x current usage — อะไรโต linear vs superlinear
2. flag: free tiers ที่จะหลุด, rate limits ที่บังคับ paid plans, egress ที่โตเร็ว
3. ระบุ inflection points: usage ระดับไหนที่ architecture ปัจจุบันไม่คุ้ม

### 4. Identify Optimization Levers

> Goal: หาจุดที่ลด cost ได้จริง

1. เรียง levers ตาม savings potential: idle resources, oversized instances, missing caching, chatty APIs, uncompressed transfer, expensive service ที่มีทางเลือก
2. เทียบกับ effort — quick wins vs architectural changes
3. เชื่อมไป `/optimize-cost`, `/optimize-network`, `/optimize-token-usage` ตาม domain

### 5. Report

> Goal: cost analysis ที่ decision-ready

1. ใช้ `/report-table`: `No.`, `Cost Source`, `Current`, `Driver`, `At 10x`, `Lever`, `Savings Est.`
2. ระบุ data quality: actual vs estimated พร้อม assumptions
3. สรุป: top 3 levers + inflection risks + recommended actions

## Rules

### 1. Evidence Or Assumption

- แยกตัวเลขจริงจาก estimates ชัดเจน — ทุก estimate ต้องมี assumption
- ไม่มี access ข้อมูลจริง → บอกความไม่แน่นอน ไม่แสร้งความแม่น

### 2. Analysis Only

- ไม่เปลี่ยน infra/services — รายงานแล้วให้ optimize skills ทำ
- คำแนะนำที่เสี่ยง (เปลี่ยน provider) ต้องระบุ trade-offs ครบ

### 3. Business Context

- cost optimization ต้องไม่ทำ reliability/security เสีย — ระบุ trade-off เสมอ
- cheapest ≠ best — รวม operational cost (maintenance, lock-in) ใน analysis

## Expected Outcome

- Cost model ที่เข้าใจ drivers และ unit economics
- Projection ที่หลาย scale levels พร้อม inflection points
- Ranked optimization levers พร้อม effort/savings
