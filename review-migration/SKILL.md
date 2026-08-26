---
name: review-migration
description: Review migration plan พร้อม execution checklist ก่อนลงมือ
---

## Goal

Review migration plan ก่อน execution เพื่อยืนยันว่า backward compatibility, data integrity, rollback strategy, cutover plan, dependency migration, framework migration, infrastructure migration, feature flag migration และ execution readiness ครบถ้วน

## Scope

ใช้ก่อน migration ด้วย `follow-tool-renovate`, `update-dependencies-latest` หรือ execution ตาม `references/migration-checklist.md` — ตรวจ migration plan ครอบคลุม backward compatibility, data integrity, rollback, cutover, dependency, framework, infrastructure, feature flag, execution readiness แล้วสรุป migration risk score พร้อม go/no-go recommendation

## Execute

### 1. Prepare Context

> Goal: เข้าใจ migration scope และ project context

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ dependencies
2. ระบุ migration type: dependency, framework, database, API, infrastructure
3. ตรวจ migration plan หรือ migration scripts ที่มีอยู่
4. ถ้า project มี `AGENTS.md` ให้อ่านและทำตาม
5. ถ้าไม่พบ migration plan → stop และ report

### 2. Check Backward Compatibility

> Goal: ตรวจ backward compatibility ก่อน migration

1. ตรวจ breaking changes ใน dependency หรือ framework version ใหม่
2. ตรวจ API changes ที่อาจทำลาย existing consumers
3. ตรวจ config format changes ที่ต้อง migrate
4. ตรวจ backward compatibility strategy: expand-contract, versioned API
5. ดูรายละเอียดใน [references/backward-compat.md](references/backward-compat.md)

### 3. Check Data Integrity

> Goal: ตรวจ data integrity และ migration scripts

1. ตรวจ migration scripts มีสำหรับ database schema changes
2. ตรวจ data transformation rules ระบุชัดเจน
3. ตรวจ data backup strategy มีก่อน migration
4. ตรวจ data integrity validation หลัง migration
5. ดูรายละเอียดใน [references/data-integrity.md](references/data-integrity.md)

### 4. Check Rollback And Cutover

> Goal: ตรวจ rollback strategy และ cutover plan

1. ตรวจ rollback strategy ชัดเจนและ test แล้ว
2. ตรวจ cutover plan มี timeline และ steps ชัดเจน
3. ตรวจ deployment strategy: phased, canary, blue-green
4. ตรวจ rollback trigger criteria ระบุชัดเจน
5. ดูรายละเอียดใน [references/rollback-cutover.md](references/rollback-cutover.md)

### 5. Check Migration Types

> Goal: ตรวจ migration coverage ครบทุกประเภท

1. ตรวจ dependency migration: version compatibility, breaking changes, peer dependencies
2. ตรวจ framework migration: API changes, config changes, codemods
3. ตรวจ infrastructure migration: database, API server, external services
4. ตรวจ feature flag migration: flag strategy, rollout plan, fallback

### 6. Check Migration Checklist

> Goal: ตรวจสอบ execution readiness ก่อนลงมือ

1. ดู `references/migration-checklist.md` สำหรับ assessment, preparation, code transformation, testing, deployment, cleanup
2. ตรวจสอบว่า rollback plan, backup, staging environment, monitoring พร้อม
3. ยืนยันว่า migration scripts, codemods, data validation ครบถ้วน
4. ตรวจสอบ documentation, runbooks และ communication plan

### 7. Score And Report

> Goal: สรุป migration risk score และ go/no-go recommendation

1. คำนวณ migration risk score จาก [references/migration-risk-score.md](references/migration-risk-score.md)
2. ทำ `/report` พร้อม `/report-table`
3. สร้างตาราง Migration Risk Summary: Category, Status, Findings, Risk Level
4. สร้างตาราง Breaking Changes: Change, Impact, Migration Path, Severity
5. สร้างตาราง Rollback Plan: Step, Trigger, Action, Verification
6. แสดง go/no-go recommendation พร้อมเหตุผล
7. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Independence

- ทำ review เท่านั้น ไม่ execute migration ระหว่าง review
- ถ้าต้อง migrate ให้ทำตาม `references/migration-checklist.md` หลัง review
- ทุก finding ต้องมี file path และ evidence

### 2. Evidence-Based Findings

- ใช้ `Grep` และ `scan-codebase` สำหรับ verification
- ตรวจ changelogs และ migration guides ของ dependencies
- จัดลำดับตาม severity: Critical → High → Medium → Low

### 3. Scoring

- คะแนนต่อ category: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Migration risk score = (total risk / total categories) × 100%
- Risk level: Low (90+), Medium (70-89), High (50-69), Critical (<50)
- Score < 70 → No-Go แนะนำให้ปรับ migration plan ก่อน

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Migration Risk Summary พร้อม risk level
- รายงาน Breaking Changes พร้อม migration path
- รายงาน Rollback Plan พร้อม trigger และ verification
- รายงาน Migration Checklist สำหรับ execution readiness
- Go/no-go recommendation พร้อมเหตุผล
- Migration risk score พร้อม progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
