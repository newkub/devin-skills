---
name: improve-security
description: แก้ไข security findings จาก review-security ตาม severity และมาตรฐาน OWASP
argument-hint: "[scope-or-file]"
related:
  - review-security
  - resolve-errors
  - deep-validate
  - run-check
  - run-test
  - report-table
  - follow-best-practice
  - ask-me
---

## Goal

แก้ไข security findings จาก `/review-security` ตาม severity และมาตรฐาน OWASP จนผ่าน validation

## Scope

ใช้หลัง `/review-security` หรือเมื่อพบช่องโหว่ที่ต้อง remediation ครอบคลุม injection, authn/authz, secrets, dependencies, headers และ input validation — ไม่รวมการเปลี่ยน security policy ของ infra

## Execute

### 1. Collect Findings

> Goal: รวบรวม findings ที่ต้องแก้

1. รัน `/review-security` ถ้ายังไม่มี findings
2. รวม findings พร้อม severity, file/line และ evidence
3. จัดกลุ่มตามประเภท: injection, authn/authz, secrets, deps, headers, validation

### 2. Prioritize By Risk

> Goal: แก้ตามความเสี่ยงสูงสุดก่อน

1. เรียง Critical → High → Medium → Low ตาม exploitability และ impact
2. ถ้า finding เป็น false positive → บันทึกเหตุผลและข้าม
3. ถ้าขาด context หรือเสี่ยงสูง → `/ask-me`

### 3. Fix Injection And Validation

> Goal: ปิดช่องโหว่ input handling

1. แทนที่ string concatenation ด้วย parameterized queries / prepared statements
2. เพิ่ม input validation และ sanitization ที่ trust boundary
3. ตรวจ output encoding สำหรับ XSS

### 4. Fix Auth And Secrets

> Goal: ปิดช่องโหว่ authentication, authorization และ secrets

1. ตรวจ authn/authz ทุก endpoint และ sensitive action
2. ย้าย hardcoded secrets ไป env vars หรือ secret manager
3. ตรวจ session, token expiry และ secure cookie flags

### 5. Fix Dependencies And Headers

> Goal: ปิดช่องโหว่จาก supply chain และ HTTP surface

1. อัปเดต vulnerable dependencies ตาม advisory
2. เพิ่ม security headers (CSP, HSTS, X-Frame-Options, nosniff)
3. ตรวจ CORS และ rate limiting

### 6. Validate And Report

> Goal: ยืนยันว่าแก้แล้วปลอดภัยและไม่มี regression

1. รัน `/deep-validate` และ `/run-check`
2. รัน `/run-test` สำหรับ auth/security test cases
3. ทำ `/report-table` สรุป findings → fix → status

## Rules

### 1. Evidence Based

- แก้เฉพาะ findings ที่มี evidence ไม่เดา
- ห้าม suppress warnings โดยไม่มีเหตุผลที่บันทึกไว้
- ทุก fix ต้องมี file/line และ rationale

### 2. No Secrets In Code

- ห้าม commit secrets, keys หรือ credentials ลง repository
- ห้าม log secrets หรือข้อมูล sensitive
- ถ้าพบ secret ที่รั่ว → แนะนำ rotate ทันที

### 3. Minimal And Safe

- แก้เฉพาะ security issue ไม่ refactor เกินจำเป็น
- ทุก fix ต้องไม่ทำลาย functionality หลัก
- ถ้า fix เสี่ยงสูง → backup และ `/ask-me` ก่อน

- ใช้ /resolve-errors ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น

## Expected Outcome

- Critical/High findings ถูกแก้ไขหรือมี mitigation plan
- ไม่มี hardcoded secrets ใน repository
- Validation และ tests ผ่าน
- รายงานสรุป findings, fix และ residual risk
