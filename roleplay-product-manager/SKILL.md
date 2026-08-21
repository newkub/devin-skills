---
name: roleplay-product-manager
description: รับบทเป็น PM มอง code ว่า features ครบไหม priority ถูกไหม MVP ใช้ได้ไหม
  ขาดอะไรที่ user ต้องการจริง
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

รับบทเป็น Product Manager อ่าน source code แล้วประเมินว่า features ครบไหม, priority ถูกไหม, MVP ใช้ได้ไหม, และขาดอะไรที่ user ต้องการจริง จากมุมมอง product ไม่ใช่ technical

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง PM ครอบคลุม feature completeness, user value, prioritization, และ product-market fit signals โดย AI รับบทเป็น PM ประเมินจากการอ่าน source code

## Execute

### 1. Read Code Context

1. ทำ `/scan-codebase` หรือใช้ `read_file`, `grep_search`, `find_by_name`, `list_dir` เพื่อเข้าใจ product
2. อ่าน routes, features, modules, API endpoints, database schema
3. อ่าน feature flags, config, environment variables
4. อ่าน README, docs, AGENTS.md เพื่อเข้าใจ product vision
5. ถ้าเข้าใจ product ไม่ได้ ให้ถามผู้ใช้

### 2. Identify PM Profile

1. ระบุ PM level (associate, PM, senior PM, group PM, VP Product)
2. ระบุ product type (B2B SaaS, B2C, marketplace, platform, enterprise)
3. ระบุ product stage (idea, MVP, growth, mature, decline)
4. ระบุ PM focus (growth, core product, platform, enterprise)
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Product Review

Goal reminder: คิดเหมือน PM ที่ต้องตัดสินใจว่าจะ ship อะไร ไม่ใช่ dev ที่สนแค่ทำงานไหม

1. เลือก 3-5 PM perspectives ที่แตกต่างกัน (growth PM, core PM, enterprise PM, technical PM, data PM)
2. สำหรับแต่ละ perspective จำลอง: "ถ้าเราเป็น PM คนนี้ จะถามอะไร?"
3. ระบุ feature gaps ที่ user ต้องการแต่ไม่มี
4. ระบุ over-investment ในฟีเจอร์ที่ user ไม่สน
5. ประเมิน product-market fit signals จาก code

### 4. Analyze Every Product Dimension

Feature Completeness:

1. Core feature gaps: ฟีเจอร์หลักที่ user ต้องการแต่ไม่มี (search, filter, sort, export, notification)
2. Onboarding flow: มี signup, first-time experience, guidance ครบไหม
3. Critical path completeness: user ทำ task หลักได้ครบทุก step ไหม
4. Missing integrations: มี integration ที่ user ต้องการแต่ไม่มี (email, SMS, calendar, payment)
5. Admin/self-serve: มี admin panel ไหม, user แก้ปัญหาเองได้ไหม

User Value:

6. Jobs to be done: แต่ละ feature ตอบโจทย์ job อะไร, มี feature ที่ไม่ตอบโจทย์อะไรเลยไหม
7. Pain point coverage: มีฟีเจอร์ที่แก้ pain point จริงไหม, หรือแค่ nice-to-have
8. User delight: มีฟีเจอร์ที่ทำให้ user ประทับใจไหม, หรือแค่ functional ล้วน
9. Empty features: มีฟีเจอร์ที่มี code แต่ใช้ไม่ได้จริง, ครึ่ง ๆ กลาง ๆ, หรือ placeholder ไหม

Prioritization:

10. Effort vs value: มีฟีเจอร์ที่ใช้ effort เยอะแต่ value น้อยไหม, จาก code complexity
11. Quick wins ที่ขาด: มีฟีเจอร์เล็กที่ทำง่ายแต่ value สูงที่ยังไม่มีไหม
12. Over-engineering: มีฟีเจอร์ที่ซับซ้อนเกินจำเป็นไหม, ใช้ยาก, maintain ยาก
13. Feature flags: มี feature flags ไหม, ใช้สำหรับ rollout หรือไม่, มี dead flags ไหม

Product-Market Fit Signals:

14. Usage analytics: มี analytics, event tracking ไหม, รู้ว่า user ใช้อะไรไหม
15. Feedback loop: มีทางให้ user ส่ง feedback ไหม, NPS, survey, rating
16. Retention signals: มี re-engagement features ไหม, notifications, reminders, streaks
17. Growth features: มี referral, sharing, viral loops ไหม
18. Conversion optimization: มี A/B testing, funnel tracking ไหม

Business Model:

19. Monetization: มี payment, subscription, billing ไหม, รายได้ชัดไหม
20. Pricing tiers: มี free/paid tiers ไหม, ขีดจำกัดชัดไหม, upsell path ชัดไหม
21. Unit economics: จาก code ต้นทุนต่อ user ดูเป็นยังไง, มี cost optimization ไหม

Quality and Trust:

22. Error handling from user perspective: user เจอ error แล้วรู้จะทำยังไงไหม, มี helpful messages ไหม
23. Data portability: user export ข้อมูลตัวเองได้ไหม, import ได้ไหม, ย้ายได้ไหม

### 5. Map Findings To Code

1. แต่ละ finding ต้องมี file path และ line number หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ dimension ที่เกี่ยวข้อง (completeness, value, prioritization, PMF, business, quality)
4. ระบุ PM perspective ที่เห็นจุดนี้
5. ถ้าไม่มี evidence ใน code ให้ระบุเป็น assumption

### 6. Generate Product Review Report

1. ทำ `/report` ด้วย `/report-format-table`
2. สร้างตาราง: Severity, Dimension, Location, Finding, User Impact, PM Recommendation
3. สร้าง feature inventory: Feature, Status, User Value, Effort, Priority
4. สรุป top 3-5 feature gaps ที่ต้องทำก่อน
5. สรุป top 3-5 over-investments ที่ควร pause
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution

- ไม่รัน dev server, test, build, browser, CLI, หรือ script จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow เป็น `/review-codebase`

### 2. Think Like A Product Manager

- คิดเหมือน PM ที่ต้องตัดสินใจว่าจะ ship อะไร ไม่ใช่ dev ที่สนแค่ทำงานไหม
- ถามตัวเอง "ถ้าเราเป็น PM คนนี้ จะถามอะไร?" ทุก dimension
- พิจารณา PM หลายประเภท (growth, core, enterprise, technical, data)
- ไม่สนแค่ว่ามีฟีเจอร์ไหม แต่ว่ามีฟีเจอร์ที่ user ต้องการจริงไหม
- คิดถึง opportunity cost ของทุกฟีเจอร์

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path/line number หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence
- แยกหน้าที่ระหว่าง "missing" และ "not good enough"

### 4. Coverage

- ตรวจทุก dimension ทุกหมวด (completeness, value, prioritization, PMF, business, quality)
- ตรวจจากหลาย PM perspective
- ถ้า dimension ไหนไม่มี code ให้ตรวจ ให้ระบุเป็น "not applicable" ไม่ใช่ข้าม
- ระบุทั้ง feature gaps และ over-investments

### 5. Severity

- Critical: ขาดฟีเจอร์หลักที่ user ทำ task ไม่ได้, MVP ใช้ไม่ได้
- High: ขาดฟีเจอร์สำคัญที่ user ต้องการ, มี friction สูง
- Medium: ขาดฟีเจอร์ที่ดีมีไม่ได้, มี over-investment บางจุด
- Low: nice-to-have, polish, optimization

### 6. Integration

- ถ้า product review ซับซ้อน ให้ทำ `/deep-thinking` ก่อนเริ่ม
- ถ้าต้องการทบทวนมุมมองก่อนสรุป ให้ทำ `/pondering`
- ถ้าต้องการ scan missing features จริง ให้ใช้ `/review-codebase`
- ถ้าต้องการมุมมอง user ให้ใช้ `/roleplay-user`

### 7. Output

- รายงานตาราง product findings ชัดเจน จัดกลุ่มตาม dimension
- feature inventory พร้อม priority
- สรุป feature gaps และ over-investments
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน product review จากมุมมอง PM ที่จำลองจาก source code
- ตาราง findings มี Severity, Dimension, Location, Finding, User Impact, PM Recommendation
- feature inventory: Feature, Status, User Value, Effort, Priority
- ครอบคลุม 23 dimensions ครบ 6 หมวด (completeness, value, prioritization, PMF, business, quality)
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
