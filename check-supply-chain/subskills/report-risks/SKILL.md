---
name: check-supply-chain-report-risks
description: สร้าง supply chain risk report — findings matrix + hardening roadmap (SBOM-style)
argument-hint: "[scope]"
related:
  - report
  - create-report-in-dot-devin
  - review-dependencies
---

## Goal

รวม findings จากทุก domain ของ `/check-supply-chain` เป็น risk report — SBOM-style inventory + severity + hardening steps

## Scope

- ใช้เมื่อ `/check-supply-chain` dispatch มาที่ `report`/`risks` หรือ domain subskills emit findings
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin` (เช่น สำหรับ audit trail)

## Execute

### 1. Aggregate Domain Findings

> Goal: รวม findings จาก lockfile/typosquat/install-scripts/pinning

1. รวม findings จาก domain subskills ที่รัน พร้อม domain tag
2. normalize severity: `critical` (suspicious install script, registry hijack), `high` (unpinned, git deps), `medium` (missing integrity, loose ranges)
3. dedupe findings ที่ package เดียวกัน

### 2. Build Risk Report

> Goal: report ที่ compliance/audit ใช้ได้

1. ตาราง: `No.`, `Finding`, `Package/Location`, `Domain`, `Severity`, `Evidence`, `Fix`
2. Inventory summary: total deps, direct vs transitive, sources breakdown
3. เรียง critical ก่อน — group by domain ถ้า findings เยอะ

### 3. Hardening Roadmap

> Goal: next steps เรียงตาม risk-reduction

1. แนะนำ: SBOM generation (CycloneDX/SPDX), hash pinning, registry allowlist, `--frozen-lockfile` ใน CI
2. เรียงเป็น staged steps — ไม่ทำ workflow พัง
3. ถ้าต้องเก็บถาวร → ทำ `/create-report-in-dot-devin`

## Rules

- ทุก finding มี artifact evidence — lockfile line, script content, registry metadata
- แยก "น่าสงสัย" จาก "ผิดปกติแต่ปกติใน context" (internal registry, known build scripts)
- remediation ชี้ไป `/review-dependencies` — report ไม่แก้เอง

## Expected Outcome

- Risk report พร้อม inventory summary + findings matrix + hardening roadmap
