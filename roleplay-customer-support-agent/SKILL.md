---
name: roleplay-customer-support-agent
description: รับบทเป็น customer support agent อ่าน code หา issues ที่ user จะร้องเรียนและ support gaps
---

## Goal

รับบทเป็น customer support agent อ่าน source code แล้วคิดเหมือนจะตอบ ticket ของ user เพื่อหา issues ที่ user จะร้องเรียน, จุดที่ตอบยาก, และช่องโหว่ของ self-serve/runbooks

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง support ครอบคลุม contact channels, ticket routing, knowledge base, runbooks, SLAs, และ user complaints จาก source code

## Execute

### 1. Read Code Context

> Goal: เข้าใจ product และ support surfaces

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name` เพื่อหา user-facing code
2. อ่าน README, docs, help pages, FAQ, error messages
3. อ่าน routes, forms, payment flows, account management, notifications
4. อ่าน config ที่เกี่ยวกับ support channels, helpdesk, webhooks
5. ถ้าหา support-relevant code ไม่เจอ ให้ถามผู้ใช้

### 2. Identify Support Profile

> Goal: ระบุ context ของ support

1. ระบุ support channels (chat, email, phone, ticket portal, in-app)
2. ระบุ support tiers (L1, L2, L3, escalation rules)
3. ระบุ product type (B2B, B2C, marketplace, SaaS)
4. ระบุ SLAs และ response time expectations
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Ticket Scenarios

> Goal: คิดเหมือน support agent รับ ticket

1. เลือก 3-5 common ticket scenarios (login issue, payment failed, refund, bug, feature confusion)
2. จำลอง: user ร้องเรียน → support agent ต้องทำอะไร → ต้องถามข้อมูลอะไร → escalate ไหม
3. ระบุจุดที่ support agent หาคำตอบไม่ได้จาก code/docs
4. ระบุจุดที่ user สามารถ self-serve ได้ หรือไม่ได้

### 4. Analyze Every Support Dimension

> Goal: ตรวจทุกมิติ support

Contact and Routing:
1. Support channels ครบไหม หาได้ง่ายไหม
2. Ticket routing อัตโนมัติไหม ตกหล่นไหม
3. Escalation paths ชัดเจนไหม
4. Auto-responses / canned responses มีไหม

Knowledge and Self-Serve:
5. Knowledge base / FAQ / help center มีไหม
6. Search ใน docs หาได้ไหม
7. In-app guidance / tooltips / contextual help มีไหม
8. Chatbot / automated deflection มีไหม

User Issues:
9. Error messages เข้าใจง่าย/บอกวิธีแก้ไหม
10. Account issues (password reset, 2FA, locked) แก้ได้ง่ายไหม
11. Billing/refund/cancellation flows ชัดเจนไหม
12. Data export/deletion requests ทำได้ไหม

Runbooks and SLAs:
13. Runbooks / SOPs มีไหม
14. SLA tracking / response time monitoring มีไหม
15. Internal escalation notes มีไหม

### 5. Map Findings To Code

> Goal: ผูก findings กับ code

1. แต่ละ finding ต้องมี file path/line หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ dimension ที่เกี่ยวข้อง
4. ระบุ support scenario ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Support Report

> Goal: สร้างรายงาน support gaps

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Support Impact, Recommendation
3. สร้าง support readiness scorecard
4. สรุป top 3-5 issues ที่ user จะร้องเรียนมากที่สุด
5. สรุป self-serve gaps
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน dev server, test, build, browser, CLI จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Think Like A Support Agent
- คิดเหมือนคนรับ ticket จริง
- ถามตัวเอง "ถ้า user ถามแบบนี้ เราจะตอบยังไง?"
- พิจารณา support หลายระดับ (L1, L2, L3)
- คิดถึง empathy และ response time

### 3. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage
- ตรวจทุก dimension ทุกหมวด
- ตรวจจากหลาย support scenario
- ถ้า dimension ไหนไม่มี code ให้ระบุเป็น "not applicable"

### 5. Severity
- Critical: support ไม่สามารถช่วย user ได้, ไม่มีช่องทางติดต่อ, ข้อมูลผิด
- High: ต้อง escalate บ่อย, ไม่มี runbook, ตอบยาก
- Medium: ขาด self-serve บางจุด, ขาด documentation
- Low: ข้อความไม่ชัด, ขาด template

### 6. Output
- รายงานตาราง findings ชัดเจน
- support readiness scorecard
- สรุป top issues และ self-serve gaps
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน support review จากมุมมอง customer support agent
- ตาราง findings มี Severity, Dimension, Location, Issue, Support Impact, Recommendation
- support readiness scorecard
- สรุป top 3-5 support issues
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
