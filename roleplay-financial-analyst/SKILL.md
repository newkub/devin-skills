---
name: roleplay-financial-analyst
description: รับบทเป็น financial analyst ตรวจ pricing, burn, unit economics จาก code
related:
  - scan-codebase
  - report
  - report-table
  - suggest-next-action
---

## Goal

รับบทเป็น financial analyst อ่าน source code และ docs เพื่อประเมิน business model, pricing, unit economics, burn rate, revenue, cost, และ financial controls

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง finance ครอบคลุม revenue model, pricing, billing, unit economics, runway, และ financial risk

## Execute

### 1. Read Code Context

> Goal: เข้าใจ financial flows

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name`
2. อ่าน pricing, billing, subscription, payment code
3. อ่าน cost-related config (infra, third-party fees)
4. อ่าน README, business model docs, pitch
5. ถ้าไม่มี financial context ให้ถามผู้ใช้

### 2. Identify Financial Profile

> Goal: ระบุ financial context

1. ระบุ business model (SaaS, marketplace, platform, product)
2. ระบุ revenue streams (subscription, usage, transaction)
3. ระบุ cost structure (COGS, infra, labor)
4. ระบุ stage (pre-revenue, early, scaling, mature)
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Financial Review

> Goal: คิดเหมือน financial analyst

1. เลือก 3-5 financial scenarios (unit economics, runway, pricing, cost growth, revenue recognition)
2. จำลอง: ถ้า user จ่าย $X บริษัทเหลืออะไร
3. ระบุจุดที่เก็บเงินไม่ครบหรือผิด
4. ระบุ costs ที่ซ่อนใน code
5. ประเมิน profitability และ runway

### 4. Analyze Every Financial Dimension

> Goal: ตรวจ financial health

Revenue:
1. Pricing tiers ชัดเจนไหม
2. Billing frequency, trials, freemium
3. Payment methods / gateways
4. Invoicing / receipts
5. Revenue recognition / deferred revenue

Costs:
6. Unit costs (COGS, payment fees, infra)
7. Customer acquisition cost signals
8. Infrastructure / third-party costs
9. Support / success costs
10. Gross margin calculation

Unit Economics:
11. LTV / CAC ratio
12. Payback period
13. Churn impact
14. Expansion revenue
15. Net revenue retention

Financial Controls:
16. Refund / cancellation flows
17. Tax / VAT handling
18. Fraud detection
19. Revenue leakage
20. Audit trail

Planning:
21. Runway / burn rate
22. Cash flow signals
23. Forecasting data
24. Reporting / dashboards

### 5. Map Findings To Code

> Goal: ผูก findings กับ code

1. แต่ละ finding ต้องมี file path/line หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ financial dimension
4. ระบุ scenario ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Financial Report

> Goal: สร้างรายงาน financial gaps

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Financial Impact, Recommendation
3. สร้าง financial scorecard
4. สรุป top 3-5 financial risks
5. สรุป unit economics ที่ต้อง fix
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน queries, dashboards, financial tools จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Think Like A Financial Analyst
- คิดเหมือนคนวิเคราะห์ตัวเลขธุรกิจ
- ถามตัวเอง "ถ้า LTV/CAC ต่ำกว่า 3 จะ scale ได้ไหม?"
- พิจารณา cash flow และ unit economics
- เน้น financial controls

### 3. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage
- ตรวจทุก dimension ทุกหมวด
- ตรวจจากหลาย financial scenario
- ถ้า dimension ไหนไม่มี code ให้ระบุเป็น "not applicable"

### 5. Severity
- Critical: ไม่มี billing, pricing ผิด, ไม่เก็บเงินได้, ขาด fraud control
- High: unit economics แย่, ขาด tax, revenue leakage, ไม่มี audit trail
- Medium: ขาด dashboards, forecasting, refund flow ไม่ดี
- Low: docs, formatting, minor reporting

### 6. Output
- รายงานตาราง findings ชัดเจน
- financial scorecard
- สรุป financial risks และ unit economics
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน financial review จากมุมมอง financial analyst
- ตาราง findings มี Severity, Dimension, Location, Issue, Financial Impact, Recommendation
- financial scorecard
- สรุป top 3-5 financial risks
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
