---
name: check-secrets-leak
description: ตรวจหา secrets หลุดใน git history และไฟล์ด้วย automated scanners
argument-hint: "[path]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - review-security
  - check-reference
---

## Goal
ตรวจหา secrets, API keys, tokens หรือ credentials ทีอาจหลุดรอดใน repository หรือไฟล์

## Scope
- รองรับ git history scan และ filesystem scan
- ใช้ gitleaks, trufflehog, หรือ regex patterns
- รายงานพร้อม severity และ location

## Execute
### 1. Prepare

> Goal: Prepare

1. ระบุ target path หรือ repo
2. ตรวจสอบเครื่องมือทีมี เช่น gitleaks, trufflehog
3. ตรวจสอบว่า repo มี git history

### 2. Scan Git History

> Goal: Scan Git History

1. รัน `gitleaks detect --source <path> -v`
2. หรือ `trufflehog git file://<path>`
3. บันทึกผลลัพธ์เป็น JSON หรือ CSV

### 3. Scan Filesystem

> Goal: Scan Filesystem

1. รัน `gitleaks detect --no-git --source <path>` ถ้าต้องการ scan ไฟล์ปัจจุบัน
2. ใช้ regex scan เสริมสำหรับ patterns เฉพาะ
3. กรอง false positives เช่น examples, test fixtures

### 4. Report

> Goal: Report

1. สรุป secrets ทีพบพร้อม commit hash, file, line
2. ระบุ severity: Critical/High/Medium/Low
3. แนะนำ next action: revoke, rotate, หรือ `git filter-repo`
4. หลังจากนั้น ใช้ `/follow-secret-manager` เพื่อ rotation และจัดการ secrets ใหม่ หรือ `/open-web-for-config-secret` เพื่อสร้าง API keys ใหม่

## Rules
### 1. No Expose

- ไม่แสดงค่า secret จริงใน report
- ไม่บันทึกผลลัพธ์ลง repo โดยไม่ได้ตรวจสอบ
- ใช้ environment variable สำหรับ scanner credentials

### 2. False Positives

- ตรวจสอบ patterns ก่อนแจ้ง
- ระบุ allowlist ถ้ามี
- แยก test data ออกจาก real secrets

- ใช้ /review-security ถ้าจำเป็น
- ใช้ /check-reference ถ้าจำเป็น

## Expected Outcome
- รายการ secrets ทีพบพร้อม location และ severity
- ไม่มี secret จริงรั่วไหลใน report
- แนวทาง remediation ชัดเจน
