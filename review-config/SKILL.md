---
name: review-config
description: Review config files หา drift, missing, duplicate, shared config และ dependencies catalog
argument-hint: "[path]"
related:
  - report-config-files
  - setup-cicd
  - setup-package
  - setup-release
  - follow-devin-global-skills
  - update-devin-global-subagents
  - follow-tool-mise
  - follow-tool-moonrepo
  - deep-validate
---

## See Also

- `check-env-vars`
- `check-config-drift`
- `check-hardcoded-values`

## Goal

Review ทุก configuration files ใน project หา drift, missing, duplicate, และโอกาสใช้ extends config หรือ dependencies catalog

## Scope

- ใช้กับ root project หรือ workspace ใดๆ
- ครอบคลุม package manifest, tool configs, CI/CD, env, moon/turbo, editor, git hooks
- ไม่แก้ไขไฟล์ ให้ report findings เป็น input สำหรับ `/update-config`

## Execute

### 1. Discover Config Files

> Goal: รวบรวม config files ทั้งหมด

1. ใช้ `/report-config-files`
2. ทำตาม `references/config-checks.md#discover-config-files`
3. จัดกลุ่มไฟล์ตาม category

### 2. Analyze Config Coverage

> Goal: ระบุ config ที่มี, ขาด, หรือซ้ำซ้อน

1. ทำตาม `references/config-checks.md#analyze-config-coverage`

### 3. Check Shared Config Opportunities

> Goal: หาโอกาสรวม config ด้วย extends / catalog

1. ทำตาม `references/config-checks.md#check-shared-config-opportunities`

### 4. Review Security And Secrets

> Goal: ตรวจ config ด้านความปลอดภัย

1. ทำตาม `references/config-checks.md#review-security-and-secrets`

### 5. Check Tool Versions And Consistency

> Goal: ให้ tool versions สอดคล้องกัน

1. ทำตาม `references/config-checks.md#check-tool-versions-and-consistency`

### 6. Generate Report

> Goal: สรุป findings สำหรับ update

1. ทำตาม `references/scoring.md`
2. ทำ `/report` ด้วย columns: Category, File, Status, Issue, Severity, Recommendation
3. ทำ `/report-file-structure` สำหรับ config tree
4. ระบุ next actions สำหรับ `/update-config`, `/setup-package`, `/setup-release`, `/setup-cicd`

## Rules

### 1. Read-Only Review

- ไม่แก้ไข config files
- ไม่ expose secrets
- ไม่ commit

### 2. Ecosystem Aware

- ใช้ conventions ตาม tech stack
- ใช้ `/follow-devin-global-skills` เพื่อหา config-related skills
- ถ้า monorepo → ใช้ `/follow-tool-moonrepo`

### 3. Comprehensive Coverage

- ตรวจทั้ง root และ workspaces
- ตรวจ package config, tool config, CI/CD, editor, env, git
- ไม่ละเว้น config ที่ไม่ใช่ code

### 4. Prioritize

- เรียง severity: security > consistency > duplication > missing
- ระบุ quick wins และ high-impact changes

### 5. Shared Config And Deduplication

- ถ้า pattern คล้ายกันระหว่าง workspaces ให้ใช้ shared config หรือ `extends`
- พยายามสร้าง schema สำหรับ config ที่ซับซ้อน
- ไม่เขียน config ที่ซ้ำกับ default
- เขียนเฉพาะสิ่งที่ต่างจาก default พร้อม comment
- เก็บเฉพาะ config หลักๆ ที่มีผลต่อ project

- ใช้ /update-devin-global-subagents ถ้าจำเป็น (config\SKILL.md)
- ใช้ /follow-tool-mise ถ้าจำเป็น
- ใช้ /deep-validate ถ้าจำเป็น

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/review` (config)

Merged from: optimize-mcp

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้ (config)
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง (config)
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test-unit` ถ้ามี แล้วสรุปผลด้วย `/report-before-after` (config)

- `references/fix-optimize-mcp.md` — ลด MCP context overhead — ปิด servers ที่ไม่ใช้, prune tools และ audit config
## Expected Outcome

- รายการ config files ทั้งหมดจัดกลุ่มตาม category
- ตาราง findings ด้วย severity และ recommendation
- รายการโอกาสใช้ extends config / dependencies catalog / shared config
- รายงาน security risks และ version inconsistencies
- รายการ config ที่สามารถ deduplicate หรือรวมเป็น shared/extends
- รายการ config ที่ควรมี schema หรือ comment
- input ที่ครบสำหรับ `/update-config`
