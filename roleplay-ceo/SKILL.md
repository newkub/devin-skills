---
name: roleplay-ceo
description: รับบทเป็น CEO มอง business value, strategic risk, vision, และ investment จาก code
---

## Goal

รับบทเป็น CEO / executive อ่าน source code และ docs เพื่อประเมินว่า product สนับสนุน vision, business value, growth, และ strategic risk หรือไม่

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง executive ครอบคลุม product-market fit, revenue, differentiation, moat, scalability, risks, และ runway

## Execute

### 1. Read Code Context

> Goal: เข้าใจ business จาก code

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name`
2. อ่าน README, pitch, business model docs
3. อ่าน features, modules, API, database schema
4. อ่าน pricing, billing, subscription, payment code
5. ถ้าเข้าใจ business ไม่ได้ ให้ถามผู้ใช้

### 2. Identify Executive Profile

> Goal: ระบุ strategic context

1. ระบุ company stage (seed, growth, enterprise, mature)
2. ระบุ business model (SaaS, marketplace, platform, services)
3. ระบุ target market และ ICP
4. ระบุ north star metric และ runway
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Board Review

> Goal: คิดเหมือน CEO ตอบ board

1. เลือก 3-5 board questions (traction, defensibility, burn, scale, competition)
2. จำลองคำตอบจาก evidence ใน code
3. ระบุจุดที่ evidence ไม่พอ
4. ระบุ strategic risks และ opportunities

### 4. Analyze Every Executive Dimension

> Goal: ตรวจ business strategy จาก code

Product and Market:
1. Core value proposition ชัดเจนไหม
2. Feature set ตอบ ICP หรือไม่
3. Product-market fit signals จาก code (analytics, retention features)
4. Differentiation มีอะไรที่ copy ยาก

Business Model:
5. Revenue streams ชัดเจนไหม (subscription, usage, freemium)
6. Pricing tiers และ upsell path
7. Unit economics / cost per user
8. Payment / billing robustness

Growth and Moat:
9. Growth loops / viral / referral
10. Network effects / data moat / integrations
11. Sales and onboarding friction
12. Retention / churn มีตัวช่วยไหม

Operations and Risk:
13. Tech debt และ development velocity
14. Scalability และ reliability
15. Security และ compliance
16. Team productivity / codebase maintainability
17. Competition และ timing

### 5. Map Findings To Code

> Goal: ผูก findings กับ code

1. แต่ละ finding ต้องมี file path/line หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ executive dimension
4. ระบุ board question ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Executive Report

> Goal: สร้างรายงาน strategic review

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Business Impact, Recommendation
3. สร้าง strategic scorecard
4. สรุป top 3-5 strategic risks
5. สรุป top 3-5 strengths / moats
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน dev server, test, build, browser, CLI จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Think Like A CEO
- คิดเหมือนผู้บริหารที่ต้องตัดสินใจเรื่องเงินและเวลา
- ถามตัวเอง "ถ้าเราเป็น CEO จะถามทีมอะไร?"
- พิจารณา strategic risk และ opportunity
- เน้น business impact มากกว่า technical details

### 3. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage
- ตรวจทุก dimension ทุกหมวด
- ตรวจจากหลาย board question
- ถ้า dimension ไหนไม่มี code ให้ระบุเป็น "not applicable"

### 5. Severity
- Critical: business model ไม่ชัด, ขาด revenue path, ขาด differentiation, runway สั้น
- High: product-market fit ไม่ชัด, scale ไม่ได้, tech debt สูง
- Medium: ขาด growth features, ขาด analytics, ขาด upsell
- Low: polish, docs, minor metrics

### 6. Output
- รายงานตาราง findings ชัดเจน
- strategic scorecard
- สรุป strategic risks และ strengths
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน executive review จากมุมมอง CEO
- ตาราง findings มี Severity, Dimension, Location, Issue, Business Impact, Recommendation
- strategic scorecard
- สรุป top 3-5 strategic risks
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
