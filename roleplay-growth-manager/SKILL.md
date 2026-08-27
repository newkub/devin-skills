---
name: roleplay-growth-manager
description: รับบทเป็น growth manager ตรวจ funnel, A/B test, acquisition, retention จาก code
---

## Goal

รับบทเป็น growth manager อ่าน source code เพื่อประเมิน growth loops, funnel, conversion, activation, retention, และ A/B testing infrastructure

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง growth ครอบคลุม acquisition, activation, retention, referral, monetization, และ experimentation

## Execute

### 1. Read Code Context

> Goal: เข้าใจ growth surfaces

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name`
2. อ่าน onboarding, signup, payment, referral, invite flows
3. อ่าน analytics, event tracking, feature flags, experiment code
4. อ่าน emails, push notifications, in-app messages
5. ถ้าไม่มี growth-relevant code ให้ถามผู้ใช้

### 2. Identify Growth Profile

> Goal: ระบุ growth context

1. ระบุ business model (SaaS, marketplace, B2C, platform)
2. ระบุ growth stage (pre-PMF, scaling, mature)
3. ระบุ north star metric และ pirate metrics (AARRR)
4. ระบุ channels หลัก (organic, paid, viral, sales)
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Funnel Analysis

> Goal: คิดเหมือน growth manager วิเคราะห์ funnel

1. เลือก 3-5 funnels (signup → activation, trial → paid, visitor → signup)
2. จำลอง step-by-step ของ user ในแต่ละ funnel
3. ระบุ drop-off points จาก code
4. ระบุ experiments ที่ควรทำ
5. ประเมิน conversion แต่ละขั้นตอน

### 4. Analyze Every Growth Dimension

> Goal: ตรวจ growth engine

Acquisition:
1. Traffic sources / attribution มีไหม
2. SEO / landing pages / CTAs
3. Referral / invite mechanisms
4. Paid acquisition tracking

Activation:
5. Onboarding flow ครบไหม
6. First value moment ชัดไหม
7. Empty states และ guidance
8. Time to value เร็วไหม

Retention:
9. Engagement loops / habits
10. Notifications / re-engagement
11. Cohort analysis / retention metrics
12. Churn signals

Monetization:
13. Pricing / paywall placement
14. Upsell / cross-sell flows
15. Trial / freemium mechanics
16. Payment friction

Experimentation:
17. Feature flags / A/B test setup
18. Event tracking ครบไหม
19. Metrics definitions ชัดไหม
20. Experiment velocity

### 5. Map Findings To Code

> Goal: ผูก findings กับ code

1. แต่ละ finding ต้องมี file path/line หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ growth dimension
4. ระบุ funnel ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Growth Report

> Goal: สร้างรายงาน growth gaps

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Growth Impact, Recommendation
3. สร้าง growth scorecard
4. สรุป top 3-5 growth opportunities
5. สรุป top 3-5 funnel blockers
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน dev server, test, build, browser, CLI จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Think Like A Growth Manager
- คิดเหมือนคนต้อง grow metrics
- ถามตัวเอง "funnel นี้ convert ดีไหม?"
- พิจารณา AARRR ทุกขั้นตอน
- เน้น data และ experiments

### 3. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage
- ตรวจทุก dimension ทุกหมวด
- ตรวจจากหลาย funnel
- ถ้า dimension ไหนไม่มี code ให้ระบุเป็น "not applicable"

### 5. Severity
- Critical: ไม่มี acquisition, funnel หลักหัก, payment ไม่ได้, churn สูง
- High: onboarding ไม่ดี, retention features ขาด, A/B ไม่ได้
- Medium: ขาด referral, notifications ไม่ดี, tracking ไม่ครบ
- Low: wording, CTA, minor optimization

### 6. Output
- รายงานตาราง findings ชัดเจน
- growth scorecard
- สรุป growth opportunities และ funnel blockers
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน growth review จากมุมมอง growth manager
- ตาราง findings มี Severity, Dimension, Location, Issue, Growth Impact, Recommendation
- growth scorecard
- สรุป top 3-5 growth opportunities
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
