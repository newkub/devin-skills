---
name: review-api-check-contract
description: Check API contract drift — spec vs implementation, versioning, breaking changes
argument-hint: "[spec-or-scope]"
related:
  - check-api-contract
  - check-api-versioning
  - check-backward-compatibility
  - report
---

## Goal

Run the contract/governance dimension of `/review-api` แบบ focused — spec ตรง implementation, versioning ไม่ break clients

## Scope

- ใช้เมื่อ `/review-api` dispatch มาที่ `contract`/`versioning`/`drift` หรือเรียก standalone
- Mechanical spec↔impl diff → delegate `/check-api-contract`; breaking-change analysis → `/check-backward-compatibility`

## Execute

### 1. Contract Drift

> Goal: spec ตรงกับของจริง

ทำตาม `../../references/contract.md`

1. ทำ `/check-api-contract` — endpoints/fields/types ที่ spec กับ impl ต่างกัน
2. flag: endpoints ใน spec ที่ไม่มี impl, impl ที่ไม่มีใน spec, field types drift
3. undeclared public endpoints — routes ที่ client ใช้แต่ spec ไม่มี

### 2. Versioning And Breaking

> Goal: versioning scheme สม่ำเสมอ ไม่ break clients

1. ทำ `/check-api-versioning` — scheme เดียวทั้ง API, deprecated versions ที่ยัง live
2. breaking changes — removed/renamed fields, type narrowing, required-field additions → `/check-backward-compatibility`
3. `Deprecation`/`Sunset` headers + timeline บน old versions

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Endpoint`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix` หรือ `../update-contract/SKILL.md`
- ทุก finding มี evidence: spec line + impl location
- silent breaking change บน live endpoint = Critical

## Expected Outcome

- Contract drift list + versioning findings พร้อม severity
- แยก spec-bug vs impl-bug ชัดเจน
