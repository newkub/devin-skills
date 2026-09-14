---
name: roleplay-quality
description: Roleplay quality personas — qa, test, code-review, debug, security, performance
argument-hint: "<role> [scope]"
related:
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
  - suggest-next-action
---

## Goal

รับบท quality persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

## Scope

ใช้เมื่อต้องการมุมมอง quality — ส่งต่อจาก `/roleplay-by-all-stakeholder` หรือเรียกตรงด้วย `/roleplay-quality <role>`

## Execute

### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Subskill |
|------|-------|----------|
| qa-engineer | critical path coverage, edge cases, regression risk | `subskills/qa-engineer/SKILL.md` |
| test-engineer | test strategy, test types, flake risk, infra | `subskills/test-engineer/SKILL.md` |
| code-reviewer | readability, conventions, bug-prone patterns | `subskills/code-reviewer/SKILL.md` |
| debugger | error handling, logging context, failure paths | `subskills/debugger/SKILL.md` |
| security-engineer | OWASP, secrets, injection, auth surface | `subskills/security-engineer/SKILL.md` |
| performance-engineer | hot paths, N+1, bundle, memory, latency | `subskills/performance-engineer/SKILL.md` |

2. อ่าน `subskills/<role>/SKILL.md` ของ role ที่เลือก

### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ subskill — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

## Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

## Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations
