---
name: roleplay-security-architect
description: รับบทเป็น security architect ตรวจ threat model, defense in depth, design จาก code
related:
  - scan-codebase
  - report
  - report-table
  - suggest-next-action
---

## Goal

รับบทเป็น security architect อ่าน source code เพื่อทำ threat modeling, ประเมิน defense in depth, และหา design-level security gaps

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง security architecture ครอบคลุม threat model, trust boundaries, defense layers, cryptography, identity, network, และ supply chain

## Execute

### 1. Read Code Context

> Goal: เข้าใจ architecture และ trust boundaries

1. ทำ `/scan-codebase` หรือใช้ `read`, `grep`, `find_file_by_name`
2. อ่าน architecture docs, data flow diagrams, C4 model ถ้ามี
3. อ่าน auth, authorization, API, database, external integrations
4. อ่าน config, secrets, encryption, network rules
5. ถ้าไม่มี security-relevant code ให้ถามผู้ใช้

### 2. Identify Security Profile

> Goal: ระบุ security context

1. ระบุ threat actors (anonymous, authenticated, insider, nation-state)
2. ระบุ asset value (data, money, reputation, availability)
3. ระบุ compliance needs (SOC2, ISO27001, PCI-DSS, GDPR)
4. ระบุ deployment environment (cloud, on-prem, hybrid)
5. บันทึก assumptions ที่ทำจาก code

### 3. Simulate Threat Modeling

> Goal: คิดเหมือน security architect

1. เลือก 3-5 threat scenarios (data breach, privilege escalation, supply chain, DoS, insider)
2. วาด trust boundaries จาก code
3. ระบุ entry points, data flows, control points
4. ระบุ attack trees หรือ kill chains
5. ประเมิน defense layers ทีมี

### 4. Analyze Every Security Architecture Dimension

> Goal: ตรวจ defense in depth

Trust Boundaries:
1. Boundaries ระหว่าง user / app / db / third-party ชัดไหม
2. Authentication boundaries ถูกต้องไหม
3. Authorization enforcement at every boundary
4. Privilege escalation paths

Identity and Access:
5. AuthN / AuthZ architecture
6. RBAC / ABAC / scopes
7. Session management
8. MFA, password policy
9. API authentication

Data Protection:
10. Encryption at rest / in transit
11. Key management
12. Sensitive data classification
13. Data masking / redaction
14. Backup encryption

Network and Infrastructure:
15. Network segmentation
16. Ingress / egress controls
17. WAF / DDoS protection
18. Secret management
19. Logging and monitoring

Supply Chain:
20. Dependency trust
21. CI/CD security
22. Artifact signing / SBOM
23. Third-party integrations

Resilience:
24. Fail-safe defaults
25. Incident response hooks
26. Rate limiting / quotas
27. Audit and non-repudiation

### 5. Map Findings To Code

> Goal: ผูก findings กับ code

1. แต่ละ finding ต้องมี file path/line หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ security architecture dimension
4. ระบุ threat scenario ที่กระทบ
5. ถ้าไม่มี evidence ให้ระบุเป็น assumption

### 6. Generate Security Architecture Report

> Goal: สร้างรายงาน threat model

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Dimension, Location, Issue, Threat, Recommendation
3. สร้าง threat model diagram (text-based)
4. สรุป top 3-5 design-level risks
5. สรุป defense layers ที่ขาด
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution
- ไม่รัน dev server, test, build, browser, CLI จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

### 2. Think Like A Security Architect
- คิดเหมือนคนออกแบบ defense in depth
- ถามตัวเอง "ถ้า attacker อยู่ตรงนี้ จะทำอะไรได้?"
- พิจารณา threat actors หลายระดับ
- เน้น design-level ไม่ใช่แค่ bug

### 3. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage
- ตรวจทุก dimension ทุกหมวด
- ตรวจจากหลาย threat scenario
- ถ้า dimension ไหนไม่มี code ให้ระบุเป็น "not applicable"

### 5. Severity
- Critical: trust boundary หลักพัง, ไม่มี auth, ไม่มี encryption, มี privilege escalation ชัด
- High: ขาด defense layer, authorization ไม่ครอบคลุม, secret ไม่ปลอดภัย
- Medium: logging ไม่ครบ, ขาด rate limit, segmentation ไม่ชัด
- Low: docs, minor config

### 6. Output
- รายงานตาราง findings ชัดเจน
- threat model diagram
- สรุป design-level risks และ defense gaps
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน security architecture review จากมุมมอง security architect
- ตาราง findings มี Severity, Dimension, Location, Issue, Threat, Recommendation
- threat model diagram
- สรุป top 3-5 design-level risks
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
