---
name: review-workspace
description: Review workspace ใน monorepo หรือ project เดี่ยว ครอบคลุม manifest, dependencies, scripts, config
argument-hint: "[scope]"
related:
  - check-monorepo
  - list-workspaces
  - scan-codebase
  - follow-tasks
  - check-repo-hygiene
  - run-audit
  - deep-review
  - run-verify
  - deep-validate
  - report
  - suggest-next-action
  - refactor-workspace
  - review-dependencies
  - run-review
---

## Goal

Review workspace เดี่ยวใน monorepo หรือ project เดี่ยว ให้ครบถ้วนตามมาตรฐาน พร้อม review score และ actionable recommendations

## Scope

ใช้สำหรับ review workspace หนึ่ย โดย focus ที่ structure, package manifest, dependencies, scripts, และ config readiness ไม่รวม deep category reviews เช่น `/deep-review`

ไม่รวม: config file drift/duplicates โดยละเอียด (ใช้ `/review-config`) และ dependency health audit — outdated, vulnerabilities, unused (ใช้ `/review-dependencies`); skill นี้ตรวจ manifest/deps เฉพาะระดับ structure + readiness

ดูเพิ่มเติม: /deep-review

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

### 7. Graph Hygiene

> Goal: coverage เพิ่มเติมของ domain

1. circular dependencies ระหว่าง packages
2. orphan packages — ไม่มี consumers แต่ยังอยู่ใน workspace

### 8. Score And Report

> Goal: findings ถูกต้อง พร้อม review score และ recommendations

ทำตาม references/validate-findings-and-report.md และ references/scoring.md

- คำนวณ review score, dimension scores และ supplementary metrics
- ทำ `/report`
- ทำ `/suggest-next-action`

### Subagents

> Goal: parallelize review เมื่อ workspace ใหญ่และแบ่ง areas ได้

- ใช้ `subagents/area-reviewer.md` เมื่อ workspace มีหลาย dirs/packages ที่ review แยกกันได้ (เช่น `src/api/`, `src/ui/`, `packages/*`) — spawn ทีละ area ผ่าน `/use-subagents` แล้ว merge findings ทุก area ก่อน score/report ใน Step 7
- ถ้า workspace เล็กหรือ areas แชร์ files กันมาก → review เองไม่ spawn


### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| Apply workspace findings — repo bloat, task graph, cache (user confirm) | `subskills/optimize-workspace/SKILL.md` |

## Rules

1. Scope Boundary
   - review หนึ่ย workspace ต่อการเรียก
   - ไม่ duplicate กับ `/deep-review`
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
   - รายงานเป็นตารางด้วย `/report`

- ใช้ /check-monorepo ถ้าจำเป็น
- ใช้ /list-workspaces ถ้าจำเป็น
- ใช้ /follow-tasks ถ้าจำเป็น
- ใช้ /check-repo-hygiene unused ถ้าจำเป็น
- ใช้ /run-audit ถ้าจำเป็น
- ใช้ /run-verify ถ้าจำเป็น
- ใช้ /deep-validate ถ้าจำเป็น
- ใช้ /refactor-workspace ถ้าจำเป็น
- ใช้ /review-dependencies ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. จัดลำดับ findings ตาม severity — canonical steps ที่ `../shared/review-fix.md`
2. แก้ตาม finding — git repo bloat (history, large objects, gc, LFS) และ monorepo task graph (affected-only runs, remote cache, pipeline tuning) (workspace)
3. preserve behavior + verify + report — canonical ที่ `../shared/review-fix.md`

## References

- [Full-dimension checklist](references/checklist.md)
- [Identify workspace](references/identify-workspace.md)
- [Analyze manifest](references/analyze-manifest.md)
- [Review structure](references/review-structure.md)
- [Review dependencies](references/review-dependencies.md)
- [Config consistency](references/review-config-consistency.md)
- [Run checks](references/run-checks.md)
- [Scoring](references/scoring.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /run-test-all ถ้าจำเป็น

## Expected Outcome

- Review report ของ single workspace พร้อม review score
- Findings ที่มี severity, evidence, recommendations
- รายการ config drift, dependency issues, script gaps, SRP/size issues
- Review score ต่อ dimension และ overall
- คำแนะนำ action ถัดไป
