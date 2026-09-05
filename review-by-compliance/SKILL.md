---
name: review-by-compliance
description: Review จากมุมมอง compliance, legal — privacy, regulatory, data handling, liability
argument-hint: "[sub-role]"
related:
  - roleplay-stakeholder
  - review-by-security
  - report-table
  - suggest-next-action
  - scan-codebase
  - ask-me
---

## Goal

Review project จากมุมมอง compliance และ legal — หา privacy gaps, regulatory risks และ legal exposure

## Scope

ใช้เมื่อต้องประเมิน compliance, privacy, legal หรือ data handling — ไม่แก้ code โดยตรง

ถ้ามาจาก `/roleplay-stakeholder` ให้ใช้ `sub-role` ที่ dispatcher ส่งมา

## Execute

### 1. Identify Persona

> Goal: รู้ persona ทีจะ review

1. ถ้ามี `sub-role` ให้ใช้ (compliance-officer, legal-counsel)
2. ถ้าไม่มี → แสดง Persona Table แล้ว `/ask-me`
3. ถ้าไม่ชัด → ใช้ default `compliance-officer`

### 2. Scan And Understand

> Goal: เข้าใจ data handling และ terms

1. ทำ `/scan-codebase` หา data collection, storage, PII, logs
2. อ่าน privacy policy, terms, `AGENTS.md` ถ้ามี
3. ระบุ regulatory scope (GDPR, CCPA, ฯลฯ)

### 3. Roleplay Review

> Goal: หา compliance findings

1. ใช้ lens จาก Persona Table
2. หา evidence จาก code, config, docs
3. จัด findings ตาม severity

### 4. Report

> Goal: สรุป compliance/legal findings

1. ทำ `/report-table` พร้อม regulatory article หรือ risk
2. ระบุ top issues
3. ทำ `/suggest-next-action`

## Persona Table

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 1 | `compliance-officer` | privacy, legal, regulatory, data handling gaps |
| 2 | `legal-counsel` | contracts, terms, IP, liability, legal exposure |

## Rules

- ไม่แก้ code ระหว่าง review
- ทุก finding ต้องมี regulatory หรือ legal evidence
- ถ้า role ไม่ชัด → ถามก่อน

- ใช้ /review-by-security ถ้าจำเป็น

## Expected Outcome

- รายงาน compliance/legal findings
- Top issues พร้อม recommendation
- Severity ชัดเจน
- Next actions ผ่าน `/suggest-next-action`
