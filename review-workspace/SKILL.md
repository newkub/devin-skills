---
name: review-workspace
description: Review workspace ใน monorepo หรือ project เดี่ยว ครอบคลุม manifest, dependencies, scripts, config
related:
  - check-monorepo
  - list-workspaces
  - scan-codebase
  - follow-package-manifest
  - check-unused-deps
  - run-audit
  - review-codebase-everything
  - run-verify
  - deep-validate
  - report-table
  - suggest-next-action
  - refactor-workspace
  - review-techstack
---

## Goal

Review workspace เดี่ยวใน monorepo หรือ project เดี่ยว ให้ครบถ้วนตามมาตรฐาน พร้อม review score และ actionable recommendations

## Scope

ใช้สำหรับ review workspace หนึ่ย โดย focus ที่ structure, package manifest, dependencies, scripts, และ config readiness ไม่รวม deep category reviews เช่น `/review-codebase-everything`

## Execute

### 1. Identify Workspace

> Goal: รู้ว่า review workspace ใด และอยู่ที่ไหน

ทำตาม references/identify-workspace.md

### 2. Analyze Manifest

> Goal: ตรวจสอบ manifest quality และ scripts

ทำตาม references/analyze-manifest.md

### 3. Review Structure

> Goal: โครงสร้าง workspace สอดคล้องกับ tech stack และ conventions

ทำตาม references/review-structure.md

### 4. Review Dependencies

> Goal: dependencies ถูกต้อง ไม่ซ้ำซ้อน ไม่ขาด ไม่เกิน

ทำตาม references/review-dependencies.md

### 5. Review Config Consistency

> Goal: config files สอดคล้องกับ root workspace และ project standards

ทำตาม references/review-config-consistency.md

### 6. Run Checks

> Goal: พบ runtime และ build issues ก่อน report

ทำตาม references/run-checks.md

### 7. Score And Report

> Goal: findings ถูกต้อง พร้อม review score และ recommendations

ทำตาม references/validate-findings-and-report.md และ references/scoring.md

- คำนวณ review score, dimension scores และ supplementary metrics
- ทำ `/report-table`
- ทำ `/suggest-next-action`

## Rules

1. Scope Boundary
   - review หนึ่ย workspace ต่อการเรียก
   - ไม่ duplicate กับ `/review-codebase-everything`
   - ปัญหานอก scope ระบุเป็น Info และอ้างอิง skill ที่เหมาะสม
2. Evidence Quality
   - ทุก finding ต้องมี file path, line number หรือ config evidence
   - ถ้า evidence ไม่เพียงพอให้ทำ `/scan-codebase` เพิ่มเติม
3. Monorepo Context
   - ถ้าเป็น monorepo ให้เปรียบเทียบกับ root workspace
   - ใช้ monorepo run command ที่เหมาะสม
4. Health Score
   - คำนวณ review score เป็น percentage 0-100 ตาม references/scoring.md
5. Formatting
   - ใช้ backticks สำหรับ paths, commands, skill names
   - ไม่ใช้ bold markers
   - รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- Review report ของ single workspace พร้อม review score
- Findings ที่มี severity, evidence, recommendations
- รายการ config drift, dependency issues, script gaps, SRP/size issues
- Review score ต่อ dimension และ overall
- คำแนะนำ action ถัดไป
