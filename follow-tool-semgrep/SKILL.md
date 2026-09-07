---
name: follow-tool-semgrep
description: ใช้ Semgrep สแกน code patterns และ security rules ที่ linter/ast-grep ไม่ครอบ
argument-hint: "[ruleset-or-path]"
related:
  - use-astgrep
  - report-table
---

## Goal

ใช้ Semgrep ติดตั้งและรัน pattern-based scanning — security rules, custom rules และ registry rulesets — เมื่อต้องการ semantic analysis ที่เกิน text/AST matching ธรรมดา

## Scope

- ใช้เมื่อ: security scanning (`p/security-audit`, `p/owasp-top-ten`), framework-specific rules, custom org rules, taint tracking
- เปรียบเทียบ: `use-astgrep` เหมาะกับ structural patterns ง่ายๆ, Semgrep เหมาะกับ dataflow/taint และ rulesets สำเร็จรูป
- Scan-only ใน skill นี้ — fix ผ่าน `/improve-security` หรือ `/fix`

## Execute

### 1. Ensure Semgrep Available

> Goal: มี semgrep พร้อมใช้

1. เช็ค `semgrep --version` — ถ้าไม่มีติดตั้ง: `pipx install semgrep`, `mise use -g semgrep` หรือ `brew install semgrep`
2. หรือรันผ่าน container/CI image ถ้าไม่อยากติดตั้ง local

### 2. Choose Rules

> Goal: เลือก ruleset ตามเป้าหมาย

1. Registry rulesets: `p/default`, `p/security-audit`, `p/owasp-top-ten`, `p/<language>`, `p/<framework>`
2. Custom rules: `.semgrep/` หรือ `semgrep.yml` ใน repo — เขียน YAML rules สำหรับ project-specific patterns
3. เลือกให้แคบพอ — `p/default` อาจ noisy; เริ่มจาก ruleset เฉพาะทาง

### 3. Run Scan

> Goal: สแกนพร้อม config ที่ถูก

1. `semgrep --config=<ruleset> <path>` — เช่น `semgrep --config=p/security-audit src/`
2. Output options: `--json` สำหรับ processing, `--sarif` สำหรับ CI/GitHub code scanning
3. ใช้ `--exclude`/`--include` จำกัด scope — ข้าม tests, generated, vendored
4. `--baseline` สำหรับ existing codebases — เห็นเฉพาะ findings ใหม่

### 4. Triage Findings

> Goal: จัดการผลลัพธ์

1. จัดกลุ่มตาม rule severity และ confidence — semgrep มีทั้ง false positives
2. ใช้ `// nosemgrep` สำหรับ intentional patterns พร้อม comment เหตุผล
3. ใช้ `/report-table` คอลัมน์: `No.`, `Rule`, `File:Line`, `Severity`, `Confidence`, `Action`
4. ส่งต่อ `/improve-security` หรือ `/fix` สำหรับ remediation

### 5. Integrate (ถ้าต้องการถาวร)

> Goal: ทำ semgrep เป็นส่วนของ workflow

1. CI step หรือ pre-commit hook (`/follow-tool-githooks`)
2. Commit custom rules ใน `.semgrep/` พร้อม tests (`semgrep --test`)
3. Baseline strategy สำหรับ legacy code

## Rules

### 1. Right Tool For Job

- structural patterns ง่ายๆ → `use-astgrep` ก่อน (เร็วกว่า ไม่ต้อง install)
- ใช้ semgrep เมื่อต้องการ dataflow/taint หรือ rulesets สำเร็จรูป

### 2. Noise Management

- ไม่ dump findings ดิบทั้งหมด — triage severity/confidence ก่อน
- baseline สำหรับ legacy — อย่าให้ signal จมใน noise

### 3. Versioned Config

- custom rules ต้องอยู่ใน repo พร้อม tests
- pin ruleset versions ใน CI — ruleset เปลี่ยน = findings เปลี่ยน

## Expected Outcome

- Scan สำเร็จพร้อม findings ที่ triaged
- Custom rules ใน `.semgrep/` ถ้าสร้าง
- CI/pre-commit integration ถ้า user ต้องการ
