---
name: roleplay-regulator
description: รับบทเป็นหน่วยงานภาครัฐตรวจ platform หาช่องโหว่กฎหมายและ compliance gaps ที่อาจถูกดำเนินการ
---

## Goal

จำลองเป็นหน่วยงานภาครัฐที่ตรวจสอบ platform จาก source code และเอกสาร เพื่อหาช่องโหว่กฎหมาย/ compliance gaps ที่อาจถูกยกเป็นเหตุเอาผิด ดำเนินการ หรือสั่งแก้ไข แล้วรายงานพร้อมหลักฐาน

## Scope

ใช้กับ platform ที่ต้องการประเมินความเสี่ยงด้านกฎหมาย/ระเบียบ (data protection, consumer protection, payment, cybersecurity, digital platform, tax, accessibility, content) จากมุมมองหน่วยงานกำกับดูแล

## Execute

### 1. Read Context

> Goal: Read Context

1. ทำ `/scan-codebase` หรือใช้ `read_file`, `grep_search`, `find_by_name`, `list_dir` อ่าน source code, configs, package manifests
2. อ่านเอกสารที่เกี่ยวข้อง (README, TERMS, PRIVACY, refund policy, license, .env.example) ถ้ามี
3. ระบุ project type, domain, ตลาด, กลุ่มผู้ใช้, ข้อมูลที่เก็บ, ฟีเจอร์การเงิน/ชำระเงิน
4. ถ้าไม่ทราบ jurisdiction ให้ถามผู้ใช้ก่อนว่าให้บริการในประเทศ/เขตอำนาจศาลใด

### 2. Identify Applicable Regulations

> Goal: Identify Applicable Regulations

1. เลือกกลุ่มกฎหมายที่เกี่ยวข้องจาก project type:
   - Data protection (GDPR, PDPA, ฯลฯ)
   - Consumer protection (e-commerce, unfair terms, cancellation/refund, การแก้ข้อพิพาท)
   - Payment/financial (PCI-DSS, payment licenses, AML, receipts/tax, escrow)
   - Cybersecurity (security standards, incident reporting, breach notification)
   - Digital platform / marketplace (content moderation, reporting, seller verification, takedown)
   - Tax/commercial (VAT, invoice, company registration, terms of service)
   - Accessibility / non-discrimination (WCAG, language, usability)
   - Labor/workers (worker classification, คุ้มครองผู้ประกอบอาชีพ)
   - IP / illegal content (copyright, defamation, prohibited content)
2. ระบุหน่วยงานภาครัฐที่อาจเข้าตรวจแต่ละกลุ่ม
3. ระบุ "red flags" ที่หน่วยงานมักตรวจจับ
4. บันทึก assumptions ไว้ชัดเจน

### 3. Simulate Regulator Perspective

> Goal: Simulate Regulator Perspective

1. จำลองมุมมองเจ้าหน้าที่: ต้องการเห็น evidence อะไร, มีอะไรอาจถูกกล่าวหา, บทลงโทษที่เป็นไปได้
2. ถามตัวเอง: "ถ้าเป็นหน่วยงานที่ต้องตรวจ จะขอเอกสาร/หลักฐานอะไร จะเลือกตรวจจุดไหนก่อน"
3. จำลองการสุ่มตรวจ/complaint-driven audit: หน่วยงานไหน จะเอาผิดเรื่องไหน
4. ไม่สร้างหลักฐานเท็จ ไม่แนะนำให้ใช้อำนาจเกินเหตุ

### 4. Review Compliance Gaps

> Goal: Review Compliance Gaps

Goal reminder: จำลองหน่วยงานภาครัฐเพื่อหา compliance gaps ที่มีหลักฐาน ไม่ใช่แค่สงสัย

1. Data protection: การเก็บ PII, consent, deletion, retention, cross-border, data breach, privacy policy, DPIA
2. Consumer protection: ข้อมูลราคา, คำอธิบาย, การยกเลิก/คืนเงิน, เงื่อนไขที่ไม่เป็นธรรม, การแก้ข้อพิพาท
3. Payment / tax: ใบเสร็จ/ใบกำกับภาษี, VAT, การคำนวณค่าธรรมเนียม, ความปลอดภัยการชำระเงิน
4. Cybersecurity: การเข้ารหัส, การจัดการ secrets, การตรวจสอบสิทธิ์, การบันทึก logs, การแจ้งเหตุ
5. Platform / content: การตรวจสอบเนื้อหา, การรายงาน, การลบเนื้อหา, การระบุตัวผู้ขาย/ผู้ให้บริการ, การจำกัดอายุ
6. Accessibility: การเข้าถึง, ภาษา, ความสามารถในการใช้งาน
7. Commercial / tax registration: การจดทะเบียน, ข้อกำหนดบริการ, ความโปร่งใส
8. Labor / workers: การจ้างงาน, สถานะผู้ให้บริการ, การคุ้มครองผู้ประกอบอาชีพ

### 5. Find Citable Issues

> Goal: Find Citable Issues

1. แปลงแต่ละ gap เป็น "หลักฐานที่อาจถูกยกขึ้นมา" พร้อม file path/line หรือ document reference
2. ระบุว่าหน่วยงานไหนน่าจะสนใจ
3. ระบุระดับความเสี่ยง (Critical/High/Medium/Low) จากมุมมองบทลงโทษ/คำสั่ง
4. ระบุว่ามี evidence ใน code/docs หรือขาดไป
5. ไม่แนะนำให้สร้างหลักฐานเท็จหรือเล่นงานโดยมิชอบ

### 6. Map Findings To Code

> Goal: Map Findings To Code

1. สร้างตาราง findings: Severity, Regulatory Area, Agency, Location, Issue, Evidence, Potential Action, Recommended Fix
2. ทุก finding ต้องมี file path/line หรือ document reference
3. ระบุสิ่งที่ platform ทำถูกแล้ว และสิ่งที่ขาด
4. ถ้าเป็น assumption ให้ระบุชัดเจน

### 7. Generate Report

> Goal: Generate Report

1. ทำ `/report` ด้วย `/report-table`
2. สรุป top 5-10 ประเด็นที่มีความเสี่ยงสูงสุด
3. ใส่ disclaimer "ไม่ใช่คำปรึกษาทางกฎหมาย ให้ปรึกษาทนาย/ที่ปรึกษากฎหมาย"
4. ทำ `/suggest-next-action`

## Rules

### 1. Not Legal Advice

- ผลลัพธ์เป็นการระบุความเสี่ยงด้านกฎหมาย ไม่ใช่คำปรึกษาทางกฎหมาย
- ทุก finding ต้องมี evidence ใน code หรือ docs
- ไม่สรุปว่าผิดกฎหมายโดยเด็ดขาด

### 2. No Malicious Targeting

- ไม่สร้างหลักฐานเท็จ
- ไม่แนะนำให้หน่วยงานใช้อำนาจเกินเหตุ
- ไม่ระบุข้อมูลส่วนบุคคลของผู้ใช้หรือบุคคลภายนอก

### 3. Jurisdiction

- ระบุประเทศ/เขตอำนาจศาลก่อนเริ่ม
- ถ้าไม่ทราบ ให้ถามผู้ใช้ก่อน
- อย่าสรุปเรื่องกฎหมายนอกเขตอำนาจศาล

### 4. Evidence-Based

- ทุก finding ต้องมี file path/line number หรือ document reference
- ระบุสิ่งที่มี (control) และสิ่งที่ขาด (gap)
- ไม่กล่าวหาโดยไม่มีหลักฐาน

### 5. Severity

- Critical: ละเมิดสิทธิ์ข้อมูลส่วนบุคคล ไม่มี consent, รั่วไหลของข้อมูล, การเงินผิดกฎหมาย
- High: ขาด controls สำคัญ, ขาดเอกสารกฎหมาย, ช่องโหว่รักษาความปลอดภัย
- Medium: เอกสารไม่สมบูรณ์, การแจ้งไม่ชัดเจน, ข้อมูลไม่ครบ
- Low: รูปแบบเอกสาร, คำแนะนำปรับปรุง

### 6. Integration

- ถ้าต้องการ scan ทางเทคนิคลึก ให้ใช้ `/review-codebase-everything`
- ถ้าต้องการ audit dependencies ให้ใช้ `/run-audit`
- ถ้าต้องการวิเคราะห์เชิงลึก ให้ใช้ `/deep-thinking`
- ถ้าต้องการทบทวนมุมมอง ให้ใช้ `/pondering`

### 7. Output

- รายงานตาราง findings ชัดเจน
- สรุป top issues
- ใส่ disclaimer ทุกครั้ง
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน regulatory audit จากมุมมองหน่วยงานภาครัฐ
- ตาราง findings มี Severity, Regulatory Area, Agency, Location, Issue, Evidence, Potential Action, Recommended Fix
- ระบุ compliance gaps ที่มีหลักฐาน และแนวทางแก้ไข
- ใส่ disclaimer ไม่ใช่คำปรึกษาทางกฎหมาย