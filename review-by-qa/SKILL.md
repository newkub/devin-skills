---
name: review-by-qa
description: Review จากมุมมอง QA — edge cases, boundary conditions, test scenarios, regressions
argument-hint: "[sub-role]"
related:
  - roleplay-stakeholder
  - review-by-stakeholder
  - review-by-engineer
  - review-correctness
  - review-stability
  - run-test
  - improve-test-coverage
  - improve-correctness
  - improve-stability
  - report-table
  - suggest-next-action
  - scan-codebase
  - ask-me
---

## Goal

Review project จากมุมมอง QA — หา edge cases, boundary conditions, missing test scenarios และ regression risks

## Scope

ใช้เมื่อต้องประเมิน test coverage และ robustness ก่อน release — ไม่แก้ code โดยตรง

ถ้ามาจาก `/roleplay-stakeholder` ให้ใช้ `sub-role` ที่ dispatcher ส่งมา

## Execute

### 1. Identify Persona

> Goal: รู้ persona ทีจะ review

1. ถ้ามี `sub-role` ให้ใช้ (qa-tester, tester)
2. ถ้าไม่มี → แสดง Persona Table แล้ว `/ask-me`
3. ถ้าไม่ชัด → ใช้ default `qa-tester`

### 2. Scan And Understand

> Goal: เข้าใจ test context

1. ทำ `/scan-codebase` หา tests, test data, mocks, coverage
2. อ่าน `README.md`, `AGENTS.md`, `package.json` scripts ถ้ามี
3. ระบุ critical paths และ features ที่ต้อง cover

### 3. Roleplay Review

> Goal: หา QA findings

1. ใช้ lens จาก Persona Table
2. หา evidence จาก test files, code, configs
3. จัด findings ตาม severity

### 4. Report

> Goal: สรุป QA findings

1. ทำ `/report-table` พร้อม test scenario gaps
2. ระบุ top issues
3. ทำ `/suggest-next-action`

## Persona Table

| No. | Role | Lens / Questions |
|----:|------|------------------|
| 1 | `qa-tester` | edge cases, boundary conditions, test scenarios, regressions |

## Rules

- ไม่แก้ code ระหว่าง review
- ทุก finding ต้องมี test/code evidence
- ถ้า role ไม่ชัด → ถามก่อน

- ใช้ /run-test ถ้าจำเป็น
- ใช้ /improve-test-coverage ถ้าจำเป็น
- ใช้ /review-by-engineer ถ้าจำเป็น

## Expected Outcome

- รายงาน QA findings
- Top test gaps พร้อม recommendation
- Severity ชัดเจน
- Next actions ผ่าน `/suggest-next-action`
