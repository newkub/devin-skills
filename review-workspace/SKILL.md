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
  - update-review-codebase-cli-and-run
  - run-verify-on-local
  - deep-validate
  - report-table
  - suggest-next-action
  - refactor-workspace
  - review-techstack
---

## Goal

Review workspace เดี่ยวใน monorepo หรือ project เดี่ยว ให้ครบถ้วนตามมาตรฐาน พร้อม review score และ actionable recommendations

## Scope

ใช้สำหรับ review workspace หนึ่ง โดย focus ที่ structure, package manifest, dependencies, scripts, และ config readiness ไม่รวม deep category reviews เช่น `/update-review-codebase-cli-and-run`

## Execute

### 1. Identify Workspace

> Goal: รู้ว่า review workspace ใด และอยู่ที่ไหน

1. ดูรายละเอียดใน [references/identify-workspace.md](references/identify-workspace.md)
2. บันทึก findings พร้อม severity และ evidence

### 2. Analyze Manifest

> Goal: ตรวจสอบ manifest quality และ scripts

1. ดูรายละเอียดใน [references/analyze-manifest.md](references/analyze-manifest.md)
2. บันทึก findings พร้อม severity และ evidence

### 3. Review Structure

> Goal: โครงสร้าง workspace สอดคล้องกับ tech stack และ conventions

1. ดูรายละเอียดใน [references/review-structure.md](references/review-structure.md)
2. บันทึก findings พร้อม severity และ evidence

### 4. Review Dependencies

> Goal: dependencies ถูกต้อง ไม่ซ้ำซ้อน ไม่ขาด ไม่เกิน

1. ดูรายละเอียดใน [references/review-dependencies.md](references/review-dependencies.md)
2. บันทึก findings พร้อม severity และ evidence

### 5. Review Config Consistency

> Goal: config files สอดคล้องกับ root workspace และ project standards

1. ดูรายละเอียดใน [references/review-config-consistency.md](references/review-config-consistency.md)
2. บันทึก findings พร้อม severity และ evidence

### 6. Run Checks

> Goal: พบ runtime และ build issues ก่อน report

1. ดูรายละเอียดใน [references/run-checks.md](references/run-checks.md)
2. บันทึก findings พร้อม severity และ evidence

### 7. Validate Findings And Report

> Goal: findings ถูกต้อง พร้อม review score และ recommendations

1. ดูรายละเอียดใน [references/validate-findings-and-report.md](references/validate-findings-and-report.md)
2. บันทึก findings พร้อม severity และ evidence

## Rules

### 1. Scope Boundary

- review หนึ่ง workspace ต่อการเรียก
- ไม่ duplicate กับ `/update-review-codebase-cli-and-run`
- ถ้าพบ issues นอก scope ให้ระบุเป็น Info และอ้างอิง skill ที่เหมาะสม

### 2. Evidence Quality

- ทุก finding ต้องมี file path, line number หรือ config evidence
- ไม่ report โดยไม่มี evidence
- ถ้า evidence ไม่เพียงพอให้ทำ `/scan-codebase` เพิ่มเติม

### 3. Monorepo Context

- ถ้าเป็น monorepo ให้เปรียบเทียบกับ root workspace
- ตรวจสอบ workspace dependencies ว่าถูกต้อง
- ใช้ monorepo run command ที่เหมาะสม เช่น `moon run <project>:<task>` หรือ `bun --filter <workspace> <script>`

### 4. Health Score

- คำนวณ review score เป็น percentage 0-100
- Critical=0, High=25, Medium=50, Low=75, Info=100
- แสดง overall score และ score ต่อ dimension

### 5. Formatting

- ใช้ backticks สำหรับ paths, commands, skill names
- ไม่ใช้ bold markers `**`
- รายงานเป็นตารางด้วย `/report-table`

### 6. Workspace Size And Responsibility

- single responsibility คือรวม code ที่เปลี่ยนด้วยกัน, deploy ด้วยกัน, test ด้วยกัน
- ถ้า workspace ทับซ้อนกับ workspace อื่น ให้พิจารณา merge หรือลบ
- ใช้ `/refactor-workspace` เมื่อต้อง split, merge, หรือ relocate packages/modules

## Expected Outcome

- Review report ของ single workspace พร้อม review score
- Findings ที่มี severity, evidence, และ recommendations
- รายการ config drift, dependency issues, script gaps, และ SRP/size issues
- คำแนะนำ `/refactor-workspace` ถ้า workspace ใหญ่เกินไป, เล็กเกินไป, หรือทำหลายสิ่ง
- Review score ต่อ dimension และ overall
- คำแนะนำ action ถัดไปผ่าน `/suggest-next-action`
