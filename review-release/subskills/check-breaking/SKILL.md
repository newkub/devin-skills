---
name: review-release-check-breaking
description: Check breaking changes — API/schema/behavior diffs, migration paths, semver impact
argument-hint: "[version-or-diff]"
related:
  - review-release
  - review-api
  - review-api
  - report
---

## Goal

Run the breaking-changes dimension of `/review-release` แบบ focused — release นี้ break consumers ไหม และมี migration path ครบ

## Scope

- ใช้เมื่อ `/review-release` dispatch มาที่ `breaking`/`semver` หรือเรียก standalone บน release diff
- ครอบคลุม: API contract breaks, schema changes, behavior changes, dependency breaks, semver correctness

## Execute

### 1. Breaking Checks

> Goal: ทุก break detected ก่อน ship — parent Execute §4

ทำตาม `../../references/breaking-changes.md` + `../../references/version-semver.md`

1. API breaks — removed/renamed endpoints, field type changes, required-field additions → `/review-api` diff หรือ `/review-api`
2. schema breaks — DB/config/storage format changes ที่ต้อง migration
3. behavior breaks — defaults change, removed flags, timing/order changes ที่ client พึ่งพา
4. semver — bump level ตรง actual changes (breaking → major)

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Change`, `Type`, `Severity`, `Migration Path`, `Evidence`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix` (changelog, version bump, migration docs)
- ทุก break มี evidence: diff location + affected consumers
- undocumented breaking change ใน minor/patch = Critical release blocker

## Expected Outcome

- Breaking changes list พร้อม type + migration path status
- Semver verdict: bump level ตรง changes ไหม
