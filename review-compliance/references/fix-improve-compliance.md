# Fix Guide

(merged from: improve-compliance)

## Goal

แก้ไข compliance findings จาก `/review-compliance` — ครอบคลุม license obligations, privacy/data handling, audit trail, retention และ regulatory gaps

## Scope

- รับ findings จาก `/review-compliance` หรือ `/review-compliance`
- ครอบคลุม: dependency licenses, LICENSE/NOTICE files, personal data handling, logging of sensitive data, cookie/consent, data retention, audit logging
- Action-oriented: แก้ไขจริงตาม severity — legal-critical items ต้อง escalate ให้ user

## Execute

### 1. Triage Findings

> Goal: เรียง findings ตามความเสี่ยง

1. อ่าน findings จาก `/review-compliance` report ล่าสุด
2. จัดกลุ่ม: license issues, privacy/data protection, audit/logging, documentation obligations
3. แยก findings ที่แก้ด้วย code ได้ ออกจากที่ต้องการการตัดสินใจของ user/legal

### 2. Fix License Compliance

> Goal: แก้ license obligations

1. เพิ่ม/แก้ `LICENSE` file ให้ตรงกับ declared license — ทำ `/follow-lib-license-md`
2. เพิ่ม `NOTICE`/attribution ถ้า deps บังคับ (Apache-2.0, BSD)
3. flag deps ที่ license ขัดกับ project (GPL ใน proprietary) — escalate ให้ user เลือก: เปลี่ยน lib (`/use-lib-better`) หรือรับความเสี่ยง
4. ตรวจ `/check-repo-hygiene` ให้ repo files ครบ

### 3. Fix Data Handling

> Goal: แก้ privacy และ data protection issues

1. flag/mask sensitive data ใน logs (PII, tokens, passwords) — ทำ `/review-observability` ร่วม
2. ตรวจ data collection ที่ไม่มี consent mechanism — เพิ่มหรือ flag ให้ user
3. แก้ retention: เพิ่ม expiry/cleanup สำหรับ data ที่เก็บเกินจำเป็น
4. ตรวจ `/check-secrets-leak` ว่าไม่มี secrets ใน code/logs

### 4. Fix Audit Trail

> Goal: ครอบคลุม audit requirements

1. เพิ่ม audit logging สำหรับ sensitive operations (auth, data access, admin actions) ตาม findings
2. ตรวจ log integrity: immutable append, timestamps, actor identity

### 5. Verify And Report

> Goal: สรุป remediation และ items ที่ค้าง

1. `/run-check` + `/run-test` ต้องผ่าน
2. ใช้ `/report-review` สรุป: fixed, escalated, remaining risks
3. ระบุ items ที่ต้อง legal/user decision ชัดเจน

## Rules

### 1. Evidence-Based

- แก้เฉพาะ findings ที่ trace ได้ — ไม่เดา compliance requirements
- legal-critical decisions (license conflicts, data collection) ต้อง `/ask-me` ไม่ตัดสินใจแทน

### 2. No Secret Exposure

- ห้าม log หรือ commit sensitive data — mask เสมอ
- remediation ต้องไม่สร้าง compliance issue ใหม่

### 3. Documented

- ทุก fix ที่แตะ compliance ต้องมี reasoning บันทึกไว้ (comment หรือ report)
- escalate items ต้องระบุตัวเลือกและผลกระทบชัดเจน

## Expected Outcome

- Compliance findings ที่แก้ได้ถูกแก้ครบตาม severity
- License/NOTICE ถูกต้อง และ sensitive data handling ปลอดภัยขึ้น
- รายงาน items ที่ต้องการ user/legal decision แยกชัดเจน
