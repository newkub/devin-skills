---
name: review-security-report-vulns
description: สร้าง vulnerability report — severity/CVE matrix, exploit paths, fix mapping
argument-hint: "[scope]"
related:
  - report
  - create-report-in-dot-devin
  - run-audit
---

## Goal

แปลง findings ของ `/review-security` เป็น vulnerability report — severity matrix + exploit path + fix mapping ที่ทีม security ใช้ได้

## Scope

- ใช้เมื่อ `/review-security` dispatch มาที่ `report`/`vulns` หรือเรียก standalone กับ findings ที่มีอยู่
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Organize Findings

> Goal: findings เป็น vulns ที่ตัดสินใจได้

1. รวม findings ตาม OWASP categories + secrets + dependency vulns (จาก `/run-audit` ถ้ามี)
2. ต่อ vuln: severity, affected location, exploit path สั้นๆ, CVE/GHSA ถ้าเป็น dep
3. flag vulns ที่ exploit ได้จริง vs theoretical

### 2. Build Vuln Matrix

> Goal: matrix ที่ triage ได้ทันที

1. ตาราง: `No.`, `Vuln`, `Severity`, `Location`, `Exploit Path`, `Fix`, `Subskill`
2. คอลัมน์ `Subskill` ชี้ `fix-*` ที่รับผิดชอบ (`fix-secrets`, `fix-headers`, `fix-vuln-deps`)
3. เรียง Critical → Low — exploitable ก่อน theoretical

### 3. Summarize Posture

> Goal: security posture ในบรรทัดเดียว

1. Verdict: counts ต่อ severity + posture (`critical-risk`/`needs-work`/`acceptable`/`good`)
2. สิ่งที่ทำดีอยู่แล้ว (headers, auth, validation ที่ครบ)
3. ถ้าต้องเก็บถาวร → ทำ `/create-report-in-dot-devin`

## Rules

- ทุก vuln มี exploit path หรือ tag `theoretical`
- secrets ใน findings → mask ตาม rules ของ `/check-secrets`
- report นี้อาจมี sensitive info — persistent artifact ต้องอยู่ใน `.devin/` เท่านั้น ห้าม commit ไป repo สาธารณะ

## Expected Outcome

- Vuln matrix พร้อม severity + exploit path + fix subskill mapping
- Posture verdict
