---
name: review-migration
description: Review migration plan พร้อม execution checklist และ verify ข้อมูลหลัง migrate
argument-hint: "[scope]"
related:
  - update-version-to-latest
  - follow-tool-renovate
  - check-migrations
  - report-table
  - report-before-after
  - suggest-next-action
  - scan-codebase
---

## Goal

Review migration plan ก่อน execution เพื่อยืนยันความพร้อมของ backward compatibility, data integrity, rollback, cutover, dependencies, framework, infrastructure, feature flags และ execution readiness

## Scope

ใช้ก่อน migration ด้วย `follow-tool-renovate`, `/update-version-to-latest` หรือ execution ตาม `references/migration-checklist.md` — ตรวจ migration plan ครอบคลุม backward compatibility, data integrity, rollback, cutover, dependencies, framework, infrastructure, feature flags แล้วสรุป migration risk score พร้อม go/no-go recommendation

## Execute

### 1. Prepare Context

> Goal: เข้าใจ migration scope และ project context

ทำตาม references/prepare-context.md

### 2. Check Backward Compatibility

> Goal: ตรวจ backward compatibility

ทำตาม references/backward-compat.md

### 3. Check Data Integrity

> Goal: ตรวจ data integrity และ migration scripts

ทำตาม references/data-integrity.md

### 4. Check Rollback And Cutover

> Goal: ตรวจ rollback strategy และ cutover plan

ทำตาม references/rollback-cutover.md

### 5. Check Migration Types

> Goal: ตรวจ migration coverage ครบทุกประเภท

- ตรวจ dependency migration: version, breaking changes, peer dependencies
- ตรวจ framework migration: API changes, config changes, codemods
- ตรวจ infrastructure migration: database, API server, external services
- ตรวจ feature flag migration: flag strategy, rollout plan, fallback

### 6. Check Migration Checklist

> Goal: ตรวจ execution readiness ก่อนลงมือ

ทำตาม references/migration-checklist.md

### 7. Score And Report

> Goal: สรุป migration risk score และ go/no-go

ทำตาม references/scoring.md

- คำนวณ migration risk score, level และ supplementary metrics
- สร้างตาราง Risk Summary, Breaking Changes, Rollback Plan
- แสดง go/no-go recommendation
- ทำ `/suggest-next-action`

## Rules

1. Review Independence
   - ทำ review เท่านั้น ไม่ execute migration ระหว่าง review
   - ถ้าต้อง migrate ให้ทำตาม `references/migration-checklist.md` หลัง review
   - ทุก finding ต้องมี file path และ evidence
2. Evidence-Based Findings
   - ใช้ `Grep` และ `scan-codebase` สำหรับ verification
   - ตรวจ changelogs และ migration guides
   - จัดลำดับตาม severity
3. Scoring
   - คะแนนต่อ category: ✅ = 1, ⚠️ = 0.5, ❌ = 0
   - Migration risk score = (total risk / total categories) × 100%
   - Risk level ตาม thresholds ใน references/scoring.md
   - Score < 70 → No-Go แนะนำให้ปรับ migration plan ก่อน
4. Formatting
   - ห้ามใช้ bold markers — ใช้ backticks
   - รายงานเป็นตารางด้วย `/report-table`

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/review`

Merged from: improve-migration

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test-unit` ถ้ามี แล้วสรุปผลด้วย `/report-before-after`

- `references/fix-improve-migration.md` — แก้ findings จาก review-migration ทั้ง schema safety, rollbacks, data migration และ deploy order

## Verify

> ทำ section นี้เมื่อต้องการ verify data integrity หลัง migration applied (merged from: verify-migration-data)

1. ทำตาม `references/verify-migration-data.md`
2. ใช้ `/check-migrations` ยืนยัน version ล่าสุด
3. ทำ `/report-before-after` เทียบ row counts/aggregates
4. ถ้า mismatch → ระบุ rows/columns ที่ต่าง และแนะนำ fix-forward หรือ rollback

## Expected Outcome

- รายงาน Migration Risk Summary พร้อม risk level
- รายงาน Breaking Changes พร้อม migration path
- รายงาน Rollback Plan พร้อม trigger และ verification
- รายงาน Migration Checklist สำหรับ execution readiness
- Go/no-go recommendation
- Migration risk score
- แนะนำ action ถัดไป
