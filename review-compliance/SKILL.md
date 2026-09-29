---
name: review-compliance
description: Review compliance ครอบคลุม GDPR, CCPA, HIPAA, PCI-DSS, SOC2, PDPA, consent, DSAR, audit, retention
argument-hint: "[scope]"
related:
  - review-security
  - review-business
  - scan-codebase
  - deep-analyze
  - deep-validate
  - report
  - suggest-next-action
  - run-review
  - use-subagents
---
## Goal

Review compliance ทุก dimension พร้อม aggregate findings และ review score — domain checklist อยู่ใน `subagents/compliance-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

compliance review สำหรับ GDPR, CCPA, HIPAA, PCI-DSS, SOC2, PDPA (Thailand), consent management, DSAR, audit trails, data retention, cross-border transfer, privacy by design — checklist ต่อ dimension อยู่ที่ `subagents/compliance-reviewer/`

ไม่รวม `/review-security` และ `/review-business`

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ compliance setup ใน codebase และเก็บ baseline

1. ทำ `/scan-codebase` เพื่อ map data handling, privacy controls, และ compliance tooling
2. ระบุ applicable regulations และ data classification (PII, PHI, payment, sensitive, public)
3. ระบุ consent tool, retention policy, และ audit logging setup
4. ทำ `/deep-analyze` และ `/run-review` เก็บ analyzer baseline (ใช้เป็น findings-file ให้ subagent cross-check)

### 2. Dispatch Compliance-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — ไม่ระบุ → ทุก dimension ที่ apply: `gdpr`, `ccpa`, `hipaa`, `pci-dss`, `soc2`, `pdpa`, `consent`, `dsar`, `audit-trail`, `data-retention`, `cross-border`, `privacy-design`
2. Spawn `subagents/compliance-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (baseline จาก step 1)
3. scope ใหญ่/หลาย jurisdiction → spawn หลาย instance ทีละ regulation group ขนานกัน — dimensions ต่างกันใน scope เดียวรวมเป็น instance เดียว

### 3. Aggregate And Score

> Goal: findings รวมกันพร้อม severity + score ต่อ dimension

1. รวม findings จากทุก instance — dedup ตาม file:line + requirement type
2. ทำ `/deep-validate` สำหรับทุก finding; จัดลำดับตาม `../shared/review-rules.md` Severity Classification และ `subagents/compliance-reviewer/rules.md`
3. คำนวณ per-dimension และ overall score ตาม `subagents/compliance-reviewer/scoring.md`

### 4. Report

> Goal: รายงานครบทุก regulation พร้อม next actions

1. ทำ `/report` — ตาราง No./Dimension/Severity/File/Finding/Suggestion + score ต่อ dimension และ overall
2. ทำ `/suggest-next-action`


### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `privacy`, `gdpr`, `pdpa` — consent, DSAR, retention | `subskills/check-privacy/SKILL.md` |
| `breach`, `incident` — detection, notification, audit trail | `subskills/check-breach/SKILL.md` |
| `report`, `matrix` — regulation x requirement matrix | `subskills/report-compliance/SKILL.md` |

## Rules

- สร้าง backup branch ก่อน review
- ใช้ evidence-based findings พร้อม file path และ regulation อ้างอิง
- ไม่แก้ไข code ระหว่าง review
- ดูรายละเอียด severity, formatting, และ independence rules ใน `subagents/compliance-reviewer/rules.md`
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/compliance-reviewer/` เท่านั้น
- รายงานผลด้วย `/report` และ `/suggest-next-action`

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. จัดลำดับ findings ตาม severity — canonical steps ที่ `../shared/review-fix.md`
2. แก้ตาม finding — licenses, privacy, audit และ data handling (compliance)
3. preserve behavior + verify + report — canonical ที่ `../shared/review-fix.md`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก compliance section
- รายงาน recommended actions พร้อม priority (compliance)
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
