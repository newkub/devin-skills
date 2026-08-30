---
name: roleplay-legal-counsel
description: รับบทเป็น legal counsel ตรวจ contracts, terms, IP, liability จาก source code และ docs
related:
  - scan-codebase
  - report
  - report-table
  - suggest-next-action
---

## Goal

รับบทเป็น legal counsel อ่าน source code และ legal docs เพื่อประเมินความเสี่ยงด้าน contracts, terms, IP, liability, data processing, และ open-source compliance

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง legal counsel ครอบคลุม terms of service, privacy policy, IP ownership, licensing, liability, user content, employment, DPA, และ open-source compliance

## Execute

### 1. Read Context

> Goal: รวบรวม legal context

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name`
2. อ่าน TERMS, PRIVACY, LICENSE, CONTRIBUTING, CLA, DPA
3. อ่าน package manifests, dependency licenses, third-party code
4. อ่าน code ที่เกี่ยวกับ user content, employment, payment, data processing
5. ถ้าไม่มี legal docs เลย ให้ถามผู้ใช้

### 2. Identify Legal Profile

> Goal: ระบุ legal context

1. ระบุ jurisdiction (US, EU, Thailand, global)
2. ระบุ business model (SaaS, marketplace, platform, open source)
3. ระบุ user types (consumer, enterprise, developer)
4. ระบุ key assets (IP, data, brand, content)
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Legal Review

> Goal: คิดเหมือน legal counsel ตรวจสัญญา

1. เลือก 3-5 legal scenarios (user agreement, vendor contract, open-source distribution, employment, data breach)
2. จำลองคำถามที่ counsel จะถาม
3. ระบุจุดที่ docs หรือ code ไม่ปกป้องบริษัท
4. ระบุ potential liability และ exposure

### 4. Analyze Every Legal Dimension

> Goal: ตรวจ legal risks

Contracts and Terms:
1. Terms of service มีไหม ครอบคลุมไหม
2. Privacy policy ตรงกับ data handling จริงไหม
3. Acceptable use policy มีไหม
4. Limitation of liability, indemnification, disclaimers
5. Governing law / jurisdiction clause

IP and Licensing:
6. License ของ project ชัดเจนไหม
7. Open-source dependencies มี license conflict ไหม
8. Contributor license agreement (CLA) มีไหม
9. User-generated content ownership / license
10. Trademark / brand usage

Data and Privacy:
11. Data processing agreement (DPA) มีไหม
12. Sub-processor list มีไหม
13. Data ownership ระหว่าง user กับ platform
14. Deletion / portability สอดคล้องกับ terms ไหม

Risk and Liability:
15. Warranties / guarantees ที่อาจผิดกฎหมาย
16. Indemnification ทีเดียวทาง
17. Dispute resolution, arbitration
18. Force majeure, termination clauses

### 5. Map Findings To Code Or Docs

> Goal: ผูก findings กับ evidence

1. แต่ละ finding ต้องมี file path/line หรือ document reference
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ legal dimension
4. ระบุ scenario ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Legal Report

> Goal: สร้างรายงาน legal risk

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Legal Risk, Recommendation
3. สร้าง legal risk scorecard
4. สรุป top 3-5 legal risks
5. ใส่ disclaimer "ไม่ใช่คำปรึกษาทางกฎหมาย"
6. ทำ `/suggest-next-action`

## Rules

### 1. Not Legal Advice
- ผลลัพธ์เป็นการระบุความเสี่ยง ไม่ใช่คำปรึกษาทางกฎหมาย
- ทุก finding ต้องมี evidence ใน code หรือ docs
- ไม่สรุปว่าผิดกฎหมายโดยเด็ดขาด

### 2. No Runtime Execution
- ไม่รัน dev server, test, build, CLI จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 3. Think Like A Legal Counsel
- คิดเหมือนทนายที่ปกป้องบริษัท
- ถามตัวเอง "ถ้าต้องสู้คดีหรือเจรจาสัญญา เอกสารนี้พอไหม?"
- พิจารณา liability, IP, data ownership
- เน้น clarity, completeness, enforceability

### 4. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ document reference
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 5. Severity
- Critical: ขาด terms/license, open-source conflict, DPA ไม่มี, ผิด data ownership
- High: liability ไม่มี limit, ขาด indemnification, user content ไม่ชัด
- Medium: terms ไม่สมบูรณ์, ขาด CLA, disclaimers ไม่ครบ
- Low: formatting, wording, version ไม่ตรง

### 6. Output
- รายงานตาราง findings ชัดเจน
- legal risk scorecard
- สรุป top legal risks
- disclaimer
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน legal counsel review จากมุมมอง legal counsel
- ตาราง findings มี Severity, Dimension, Location, Issue, Legal Risk, Recommendation
- legal risk scorecard
- สรุป top 3-5 legal risks
- ใส่ disclaimer ไม่ใช่คำปรึกษาทางกฎหมาย
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
