---
name: review-migration
description: Review migration safety: framework, database, schema, data, rollback, and data integrity
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - validate
  - suggest-next-action
---

## Goal

Review migration safety ครอบคลุม framework migrations, database migrations, schema changes, data migrations, rollback strategy, และ data integrity พร้อม review score

## Scope

ใช้สำหรับ review migrations ใน project — อยู่ภายใต้ `/review-codebase` เมื่อ review backend ทั้งหมด — database schema design อยู่ใน `/review-codebase`, config migration อยู่ใน `/review-codebase`

## Execute

### 1. Gather Context

รวบรวม context ก่อน review migrations

> Goal: เข้าใจ migration history, tools, และ patterns

1. ทำ `/scan-codebase` เพื่อหา migration files, scripts, versioning
2. ระบุ migration tools: `Drizzle`, `Prisma`, `TypeORM`, custom scripts
3. ระบุ environments: dev, staging, prod

### 2. Identify Migrations

หา migrations ทั้งหมด

> Goal: มี inventory ครบ

1. ตรวจสอบ migration files ทั้งหมด: database, schema, framework, data
2. ตรวจสอบ migration ordering, version control
3. ตรวจสอบ migration metadata: author, timestamp, description

### 3. Safety Analysis

วิเคราะห์ migration safety

> Goal: migrations ปลอดภัยและ backwards compatible

1. ตรวจสอบ destructive operations: `DROP`, `DELETE`, `ALTER` ที่ทำให้ data loss
2. ตรวจสอบ backwards compatibility: rolling updates, blue/green deployments
3. ตรวจสอบ transaction boundaries และ error handling
4. ตรวจสอบ data integrity constraints ระหว่าง migrations

### 4. Rollback and Recovery

ตรวจสอบ rollback และ recovery

> Goal: สามารถ rollback ได้หาก migration ล้มเหลว

1. ตรวจสอบ rollback scripts สำหรับแต่ละ migration
2. ตรวจสอบ rollback testing, dry-run capability
3. ตรวจสอบ recovery procedures และ RTO/RPO
4. ทำ `/run-review` เพื่อดึง migration metrics

### 5. Validate and Report

ตรวจสอบและรายงาน migration findings

> Goal: รายงาน migration findings

1. ทำ `/deep-validate`
2. ทำ `/validate`
3. ให้ severity, คำนวณ review score
4. ทำ `/report` พร้อม `/report-table`
5. ทำ `/suggest-next-action`

## Rules

### 1. Scope

- ไม่ review database schema design — ใช้ `/review-codebase`
- ไม่ review config changes — ใช้ `/review-codebase`
- อยู่ภายใต้ `/review-codebase` เมื่อ review backend ทั้งหมด

### 2. Severity

- Critical: migration ทำให้ data loss โดยไม่มี backup, no rollback, destructive operation บน production
- High: missing transaction, missing rollback, untested migration, breaking change โดยไม่มี migration guide
- Medium: missing migration metadata, incomplete data integrity check
- Low: documentation gap, naming inconsistency

### 3. Evidence

- ทุก finding ต้องมี migration file path
- ระบุ operation ที่เสี่ยง

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน migration findings
- Review score
- Rollback readiness assessment
- Next actions

