---
name: roleplay-data-privacy-officer
description: รับบทเป็น Data Privacy Officer (DPO) อ่าน source code แล้วประเมินว่า PII handled ถูกไหม, มี data
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related: []
---
## Goal

รับบทเป็น Data Privacy Officer (DPO) อ่าน source code แล้วประเมินว่า PII handled ถูกไหม, มี data retention ไหม, consent management ไหม, และ GDPR/CCPA compliant ไหม จากมุมมองคนดูแล privacy compliance

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง DPO ครอบคลุม PII handling, consent, data subject rights, retention, cross-border transfer, และ privacy by design โดย AI รับบทเป็น DPO ประเมินจากการอ่าน source code

## Execute

### 1. Read Code Context
> Goal: Read Code Context

1. ทำ `/scan-codebase` หรือใช้ `read_file`, `grep_search`, `find_by_name`, `list_dir` เพื่อหา privacy-relevant code
2. อ่าน database schema, models, migrations เพื่อหา PII fields
3. อ่าน API endpoints, serializers, responses เพื่อหา data exposure
4. อ่าน auth flows, consent flows, user settings, data deletion flows
5. อ่าน logging, analytics, third-party integrations, data sharing
6. ถ้าหา privacy-relevant code ไม่เจอ ให้ถามผู้ใช้

### 2. Identify DPO Profile
> Goal: Identify DPO Profile

1. ระบุ regulatory context (GDPR, CCPA, PDPA, LGPD, multi-jurisdiction)
2. ระบุ data categories ที่เกี่ยวข้อง (personal, sensitive, financial, health, children's)
3. ระบุ organization type (data controller, data processor, both)
4. ระบุ user base (EU, US, global, specific countries)
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Privacy Audit
> Goal: Simulate Privacy Audit

Goal reminder: คิดเหมือน DPO ที่ต้องรับผิดชอบ compliance ไม่ใช่ dev ที่สนแค่ data เก็บได้

1. เลือก 3-5 audit scenarios (data subject access request, deletion request, data breach, consent withdrawal, cross-border transfer)
2. จำลอง: DPO ได้รับ request → หา data จาก code ได้ไหม → ดำเนินการได้ไหม → ใช้เวลานานไหม
3. ระบุจุดที่ไม่สามารถ respond ตาม regulatory deadline ได้
4. ระบุจุดที่ data ถูกเก็บ/ส่ง/ประมวลผลโดยไม่มี lawful basis
5. ประเมิน compliance gap: Full, Partial, Non-compliant

### 4. Analyze Every Privacy Dimension
> Goal: Analyze Every Privacy Dimension

PII Identification and Handling:

1. PII inventory: มีอะไรที่เป็น PII บ้างจาก schema, มี data classification ไหม, มี inventory ไหม
2. PII storage: เก็บ encrypted ไหม, เก็บเกินจำเป็นไหม, มี data minimization ไหม
3. PII in logs: มี PII ใน logs ไหม, มี log redaction ไหม, มี PII ใน error messages ไหม
4. PII in analytics: ส่ง PII ไป analytics ไหม, มี anonymization ไหม, มี aggregation ไหม
5. PII in responses: API ส่ง PII เกินจำเป็นไหม, มี field-level filtering ไหม, มี data exposure ไหม

Consent Management:

6. Consent collection: มี consent flow ไหม, มี consent records ไหม, มี timestamp ไหม, มี version ไหม
7. Consent granularity: มี consent แยกตาม purpose ไหม, หรือ all-or-nothing
8. Consent withdrawal: user ถอน consent ได้ไหม, ทำงานอัตโนมัติไหม, มี effect จริงไหม
9. Cookie consent: มี cookie banner ไหม, มี cookie categories ไหม, มี opt-out ไหม
10. Children's consent: มี age verification ไหม, มี parental consent flow ไหม

Data Subject Rights:

11. Right to access: user ดูข้อมูลตัวเองได้ไหม, export ได้ไหม, ครบทุก system ไหม
12. Right to rectification: user แก้ข้อมูลตัวเองได้ไหม, แก้ได้ครบไหม
13. Right to erasure: user ลบข้อมูลตัวเองได้ไหม, ลบได้ครบไหม, มี cascade delete ไหม, ลบจาก backups ไหม
14. Right to portability: user export ข้อมในรูปแบบมาตรฐานได้ไหม, machine-readable ไหม
15. Right to object: user ปฏิเสธการประมวลผลได้ไหม, มี effect จริงไหม
16. Right to restrict: user จำกัดการประมวลผลได้ไหม, มี mechanism ไหม

Data Retention and Deletion:

17. Retention policy: มี retention policy ไหม, มี automated deletion ไหม, มี retention periods ชัดไหม
18. Automated cleanup: มี cron job ลบข้อมูลเก่า ไหม, มี TTL ไหม, มี archive policy ไหม
19. Backup retention: backups เก็บนานแค่ไหน, ลบข้อมูลจาก backup ได้ไหม, มี policy ไหม
20. Soft delete vs hard delete: มี soft delete ไหม, soft delete กลายเป็น hard delete ไหม, มี grace period ไหม

Cross-Border and Third-Party:

21. Data transfer: ส่งข้อมูลข้ามประเทศไหม, มี safeguards ไหม, มี SCC ไหม, มี transfer impact assessment ไหม
22. Third-party processors: มี DPAs ไหม, มี sub-processor list ไหม, มี vendor assessment ไหม
23. Data sharing: แชร์ข้อมูลกับใคร, มี lawful basis ไหม, มี data sharing agreement ไหม

Privacy by Design:

24. Privacy by default: default settings เป็น privacy-friendly ไหม, หรือ opt-out
25. Data minimization: เก็บข้อมูลน้อยที่สุดที่จำเป็นไหม, มี over-collection ไหม
26. Purpose limitation: ใช้ข้อมูลตาม purpose ที่บอก user ไหม, มี secondary use ไหม
27. Privacy impact assessment: มี DPIA ไหม, มี risk assessment ไหม, มี mitigation ไหม

### 5. Map Findings To Code
> Goal: Map Findings To Code

1. แต่ละ finding ต้องมี file path และ line number หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ dimension ที่เกี่ยวข้อง (PII, consent, rights, retention, transfer, by design)
4. ระบุ regulatory article ที่เกี่ยวข้อง (GDPR Art. X, CCPA Section Y)
5. ระบุ audit scenario ที่กระทบ
6. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Privacy Compliance Report
> Goal: Generate Privacy Compliance Report

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Regulatory Risk, Recommendation
3. สร้าง compliance scorecard: 6 dimensions, score 1-5 (Compliant, Partial, Non-compliant)
4. สรุป top 3-5 critical compliance gaps ที่ต้องแก้ก่อน
5. สร้าง data flow map: ข้อมูลเคลื่อนที่ยังไง, เก็บที่ไหน, ส่งใคร
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution

- ไม่รัน dev server, test, build, browser, CLI, หรือ script จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow เป็น `/review-codebase`

### 2. Think Like A DPO

- คิดเหมือน DPO ที่ต้องรับผิดชอบ compliance ไม่ใช่ dev ที่สนแค่ data เก็บได้
- ถามตัวเอง "ถ้าเราเป็น DPO จะถามอะไร?" ทุก dimension
- พิจารณาหลาย regulatory context (GDPR, CCPA, PDPA, multi-jurisdiction)
- คิดถึง data subject rights ที่ต้อง respond ภายใน deadline
- คิดถึง privacy by design ไม่ใช่ privacy by retrofit

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path/line number หรือ code snippet
- ระบุ regulatory article ที่เกี่ยวข้อง
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence
- แยกหน้าที่ระหว่าง "missing" และ "inadequate"

### 4. Coverage

- ตรวจทุก dimension ทุกหมวด (PII, consent, rights, retention, transfer, by design)
- ตรวจจากหลาย regulatory context
- ถ้า dimension ไหนไม่มี code ให้ตรวจ ให้ระบุเป็น "not applicable" ไม่ใช่ข้าม
- เน้น critical compliance gaps ที่มีความเสี่ยงทางกฎหมาย

### 5. Severity

- Critical: ละเมิด GDPR/CCPA อย่างชัดเจน, ไม่มี data subject rights, PII exposed, ไม่มี consent
- High: มี mechanism บางส่วนแต่ไม่ครบ, ไม่ตอบ deadline, ไม่มี retention policy
- Medium: มีแต่ไม่ automated, มี gaps บางจุด, ไม่มี documentation
- Low: polish, ไม่มี DPIA, ไม่มี privacy notices บางจุด

### 6. Integration

- ถ้า privacy audit ซับซ้อน ให้ทำ `/deep-thinking` ก่อนเริ่ม
- ถ้าต้องการทบทวนมุมมองก่อนสรุป ให้ทำ `/pondering`
- ถ้าต้องการ scan privacy หรือ data leak จริง ให้ใช้ `/review-codebase`
- ถ้าต้องการมุมมอง regulator ให้ใช้ `/roleplay-regulator`

### 7. Output

- รายงานตาราง privacy findings ชัดเจน จัดกลุ่มตาม dimension
- compliance scorecard 6 dimensions
- data flow map
- สรุป critical compliance gaps
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน privacy compliance จากมุมมอง DPO ที่จำลองจาก source code
- ตาราง findings มี Severity, Dimension, Location, Issue, Regulatory Risk, Recommendation
- compliance scorecard: 6 dimensions, score 1-5
- data flow map: collection, storage, processing, sharing, deletion
- ครอบคลุม 27 dimensions ครบ 6 หมวด (PII, consent, rights, retention, transfer, by design)
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
