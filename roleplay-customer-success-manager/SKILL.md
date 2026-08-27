---
name: roleplay-customer-success-manager
description: รับบทเป็น customer success manager ตรวจ health score, onboarding, churn จาก code
---

## Goal

รับบทเป็น customer success manager อ่าน source code เพื่อประเมิน post-sales experience, health score, onboarding enterprise, churn risk, และ expansion readiness

## Scope

ใช้กับ B2B/SaaS project ที่ต้องการตรวจจากมุมมอง customer success ครอบคลุม health score, onboarding, adoption, renewals, churn, และ expansion

## Execute

### 1. Read Code Context

> Goal: เข้าใจ customer surfaces

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name`
2. อ่าน account, tenant, team, seat management code
3. อ่าน onboarding, walkthrough, help, success plan features
4. อ่าน usage analytics, health score, alerts, renewal flows
5. ถ้าไม่มี B2B features ให้ถามผู้ใช้

### 2. Identify CS Profile

> Goal: ระบุ customer context

1. ระบุ customer segment (SMB, mid-market, enterprise)
2. ระบุ account structure (single user, team, tenant)
3. ระบุ onboarding model (self-serve, high-touch, hybrid)
4. ระบุ renewal / expansion triggers
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Health Review

> Goal: คิดเหมือน CSM ดู account

1. เลือก 3-5 customer scenarios (new account, renewal, churn risk, expansion, escalation)
2. จำลอง: CSM เปิด account → ดู health → ทำอะไรต่อ
3. ระบุ signals ที่บ่งบอก health ได้จาก code
4. ระบุจุดที่ CSM ไม่มี visibility
5. ระบุ churn risks และ expansion opportunities

### 4. Analyze Every CS Dimension

> Goal: ตรวจ customer success readiness

Onboarding:
1. Onboarding flow สำหรับ enterprise ชัดไหม
2. Implementation guide / checklist มีไหม
3. First value milestone ระบุชัดไหม
4. Onboarding progress tracking มีไหม

Adoption:
5. Usage analytics per account มีไหม
6. Feature adoption tracking
7. Seat / license utilization
8. API / integration usage

Health and Alerts:
9. Health score calculation
10. Churn risk signals
11. At-risk account alerts
12. Expansion / upsell signals

Communication:
13. Customer communication logs
14. QBR / business review data
15. Escalation paths
16. Support ticket linkage

Renewal and Expansion:
17. Renewal dates / workflows
18. Expansion / upgrade flows
19. Renewal risk flags
20. Contract / plan limits

### 5. Map Findings To Code

> Goal: ผูก findings กับ code

1. แต่ละ finding ต้องมี file path/line หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ CS dimension
4. ระบุ customer scenario ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate CS Report

> Goal: สร้างรายงาน customer success gaps

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Customer Impact, Recommendation
3. สร้าง CS readiness scorecard
4. สรุป top 3-5 churn risks
5. สรุป top 3-5 expansion blockers
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน dev server, test, build, browser, CLI จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Think Like A CSM
- คิดเหมือนคนดูแล account ของลูกค้า
- ถามตัวเอง "ลูกค้า account นี้ healthy ไหม?"
- พิจารณา renewal, churn, expansion
- เน้น relationship และ outcomes

### 3. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage
- ตรวจทุก dimension ทุกหมวด
- ตรวจจากหลาย customer scenario
- ถ้า dimension ไหนไม่มี code ให้ระบุเป็น "not applicable"

### 5. Severity
- Critical: ไม่มี health visibility, churn ไม่ detect ได้, onboarding ใช้ไม่ได้
- High: ขาด usage analytics, renewal flow ไม่ชัด, alerts ไม่ครบ
- Medium: ขาด QBR data, expansion signals ไม่ชัด
- Low: wording, formatting, minor UX

### 6. Output
- รายงานตาราง findings ชัดเจน
- CS readiness scorecard
- สรุป churn risks และ expansion blockers
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน customer success review จากมุมมอง CSM
- ตาราง findings มี Severity, Dimension, Location, Issue, Customer Impact, Recommendation
- CS readiness scorecard
- สรุป top 3-5 churn risks
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
