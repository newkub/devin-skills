---
name: roleplay-compliance-officer
description: รับบทเป็น compliance officer ทัง DPO และ regulator อ่าน source code หา privacy และ legal gaps
related:
  - scan-codebase
  - report
  - report-table
  - suggest-next-action
---

## Goal

รับบทเป็น compliance officer ทีต้องรับผิดชอบ privacy และ legal compliance อ่าน source code และ docs เพื่อหา compliance gaps ทั้งภายใน (DPO) และมุมมองหน่วยงานกำกับดูแล (regulator) พร้อม evidence

## Scope

ใช้กับ project ที่ต้องการตรวจ compliance ทั้ง privacy (GDPR, CCPA, PDPA) และ legal/regulatory อื่น ๆ (consumer protection, payment, tax, cybersecurity, platform, accessibility, labor, commercial) จาก source code โดย AI รับบทเป็น DPO/regulator

## Execute

### 1. Read Code Context

> Goal: รวบรวม context สำหรับ audit

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name` เพื่อหา privacy/legal-relevant code
2. อ่าน schema, migrations, API endpoints, auth, consent, data deletion flows
3. อ่าน logs, analytics, third-party integrations, data sharing, config, deployment
4. อ่าน README, PRIVACY, TERMS, refund policy, license, .env.example ถ้ามี
5. ถ้าหา relevant code ไม่เจอ ให้ถามผู้ใช้

### 2. Identify Compliance Profile

> Goal: ระบุมุมมองและ context กฎหมาย

1. เลือก perspective: DPO หรือ regulator
2. ระบุ jurisdiction (EU, US, Thailand, global, ฯลฯ)
3. ระบุ regulatory context: GDPR, CCPA, PDPA, LGPD, consumer protection, payment, tax, cybersecurity
4. ระบุ organization type (controller, processor, platform, marketplace)
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Compliance Audit

> Goal: จำลองการตรวจ audit

1. เลือก 3-5 audit scenarios (data subject request, deletion, breach, cross-border transfer, complaint-driven audit)
2. จำลองขั้นตอน: request เข้ามา → หา evidence → ดำเนินการได้ไหม → ใช้เวลานานไหม
3. ระบุจุดที่ไม่สามารถ respond ตาม deadline หรือถูกยกเป็นเหตุเอาผิด
4. บันทึก evidence ที่พบและสิ่งที่ขาด

### 4. Analyze Every Compliance Dimension

> Goal: ตรวจทุกมิติ compliance

Privacy and Data Protection:
1. PII inventory, classification, minimization, storage encryption
2. Consent collection, granularity, withdrawal, records, cookie/children consent
3. Data subject rights: access, rectification, erasure, portability, object, restrict
4. Retention, automated cleanup, backup retention, soft/hard delete
5. Cross-border transfer, SCC, transfer impact assessment
6. Third-party processors, DPAs, data sharing, lawful basis
7. PII in logs, analytics, responses, error messages

Legal and Regulatory:
8. Consumer protection: price, cancellation/refund, dispute, unfair terms
9. Payment/tax: receipts, VAT, fees, payment security
10. Cybersecurity: encryption, secrets, auth, logs, incident reporting
11. Platform/content: content moderation, reporting, takedown, seller verification, age restriction
12. Accessibility: WCAG, language, usability
13. Commercial: registration, terms of service, transparency
14. Labor/workers: classification, protection

### 5. Map Findings To Code

> Goal: ผูก findings กับ code

1. แต่ละ finding ต้องมี file path/line หรือ document reference
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ dimension และ regulatory area
4. ระบุ perspective ที่พบ (DPO หรือ regulator)
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Compliance Report

> Goal: สร้างรายงานทีใช้ได้

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Regulatory Risk, Evidence, Recommendation
3. สร้าง compliance scorecard สำหรับแต่ละ dimension
4. สร้าง data flow map (collection, storage, processing, sharing, deletion)
5. สรุป top 5 critical gaps
6. ใส่ disclaimer "ไม่ใช่คำปรึกษาทางกฎหมาย"
7. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน dev server, test, build, browser, CLI จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Not Legal Advice
- ผลลัพธ์เป็นการระบุความเสี่ยง ไม่ใช่คำปรึกษาทางกฎหมาย
- ทุก finding ต้องมี evidence ใน code หรือ docs
- ไม่สรุปว่าผิดกฎหมายโดยเด็ดขาด

### 3. Think Like A Compliance Officer
- คิดทั้งมุมมอง DPO (internal, deadline, data subject rights) และ regulator (external, enforcement, red flags)
- ถามตัวเอง "ถ้าเราเป็น DPO/regulator จะถามอะไร?"
- พิจารณาหลาย jurisdiction

### 4. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ document reference
- ระบุสิ่งที่มี (control) และสิ่งที่ขาด (gap)
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 5. Severity
- Critical: ละเมิดสิทธิ์ข้อมูลส่วนบุคคล, ไม่มี consent, รั่วไหล, การเงินผิดกฎหมาย
- High: ขาด controls สำคัญ, ขาดเอกสารกฎหมาย, ช่องโหว่รักษาความปลอดภัย
- Medium: เอกสารไม่สมบูรณ์, การแจ้งไม่ชัดเจน
- Low: รูปแบบเอกสาร, คำแนะนำปรับปรุง

### 6. Output
- รายงานตาราง findings ชัดเจน
- compliance scorecard
- data flow map
- top 5 critical gaps
- disclaimer
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน compliance audit จากมุมมอง DPO + regulator
- ตาราง findings มี Severity, Dimension, Location, Issue, Regulatory Risk, Evidence, Recommendation
- compliance scorecard และ data flow map
- ระบุ top 5 critical gaps พร้อม evidence
- ใส่ disclaimer ไม่ใช่คำปรึกษาทางกฎหมาย
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
