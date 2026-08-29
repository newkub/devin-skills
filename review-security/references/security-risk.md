## Goal
ประเมิน security risk ของ codebase, dependencies, และ infrastructure ด้วย severity scoring

## Scope
- รวม SAST, dependency scan, misconfiguration
- ใช้ CVSS หรือ custom severity
- รองรับ web, cloud, library

## Execute
### 1. Scan

> Goal: Scan

1. รัน `semgrep --config=auto`
2. รัน `snyk test` หรือ `trivy fs`
3. ตรวจสอบ dependencies ด้วย `npm audit`, `cargo audit`, `pip-audit`
4. scan secrets ด้วย `gitleaks`

### 2. Assess

> Goal: Assess

1. รวบรวม findings ตาม category
2. ให้ severity: Critical/High/Medium/Low
3. ประเมิน likelihood และ impact
4. ระบุ affected components

### 3. Rank

> Goal: Rank

1. จัดลำดับตาม risk score
2. แยก remediable ง่าย vs ยาก
3. ระบุ quick wins

### 4. Report

> Goal: Report

1. สรุป risk matrix
2. แนะนำ top 5 ทีต้อง fix ก่อน
3. เชื่อมโยงกับ `check-secrets-leak` หรือ `analyze-attack-surface`

## Rules
### 1. No False Confidence

- แจ้งข้อจำกัดของ tools
- ไม่ claim ปลอดภัยถ้าไม่ได้ pentest
- ใช้ multiple scanners เพื่อลด false negatives

### 2. Evidence

- แสดง command output หรือ CVE
- ระบุ file/line ถ้ามี
- ไม่ expose secrets ใน report

## Expected Outcome
- risk matrix หรือ prioritized findings
- severity และ remediation ชัดเจน
- ไม่มี secret รั่วไหล
