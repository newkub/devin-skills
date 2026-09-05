---
name: review-by-security
description: Review จากมุมมอง security — threat model, attack surface, vulnerabilities, incident response
argument-hint: "[sub-role]"
related:
  - roleplay-stakeholder
  - review-security
  - improve-security
  - review-by-engineer
  - report-table
  - suggest-next-action
  - scan-codebase
  - ask-me
---

## Goal

Review project จากมุมมอง security — หา vulnerabilities, attack surface และ defensive gaps

## Scope

ใช้เมื่อต้องประเมิน security posture จากมุมมอง attacker หรือ security architect — ไม่แก้ code โดยตรง

ถ้ามาจาก `/roleplay-stakeholder` ให้ใช้ `sub-role` ที่ dispatcher ส่งมา

## Execute

### 1. Identify Persona

> Goal: รู้ persona ทีจะ review

1. ถ้ามี `sub-role` ให้ใช้ (attacker, security-architect, incident-commander)
2. ถ้าไม่มี → แสดง Persona Table แล้ว `/ask-me`
3. ถ้าไม่ชัด → ใช้ default `security-architect`

### 2. Scan And Understand

> Goal: เข้าใจ attack surface

1. ทำ `/scan-codebase` หา endpoints, auth, secrets, deps
2. อ่าน `README.md`, `AGENTS.md`, security docs ถ้ามี
3. ระบุ trust boundaries และ sensitive data flows

### 3. Roleplay Review

> Goal: หา security findings

1. ใช้ lens จาก Persona Table
2. หา evidence จาก code, config, dependencies
3. จัด findings ตาม severity

### 4. Report

> Goal: สรุป security findings

1. ทำ `/report-table` พร้อม attack path และ mitigation
2. ระบุ top risks
3. ทำ `/suggest-next-action`

## Persona Table

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 1 | `attacker` | vulnerabilities, attack surface, exploit paths |
| 2 | `security-architect` | threat model, defense in depth, design security |
| 3 | `incident-commander` | incident response, runbooks, communication, detection |

## Rules

- ไม่ exploit หรือ test บน production จริง
- ทุก finding ต้องมี evidence
- ถ้าพบ critical → แนะนำ `/improve-security`
- ถ้า role ไม่ชัด → ถามก่อน

- ใช้ /review-security ถ้าจำเป็น
- ใช้ /review-by-engineer ถ้าจำเป็น

## Expected Outcome

- รายงาน security findings
- Top risks พร้อม mitigation
- Severity ชัดเจน
- Next actions ผ่าน `/suggest-next-action`
