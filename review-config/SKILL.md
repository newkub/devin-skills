---
name: review-config
description: Review config files หา drift, missing, duplicate, shared config และ dependencies catalog
argument-hint: "[path]"
related:
  - deep-review-then-fix
  - report-config-files
  - setup-cicd
  - setup-package
  - setup-release
  - follow-devin-global-skills
  - update-devin
  - follow-tool-mise
  - follow-tool-moonrepo
  - deep-validate
  - run-review
  - use-subagents
---

## See Also

- `check-secrets`
- `check-config-drift`

## Goal

Review ทุก configuration files ใน project หา drift, missing, duplicate, และโอกาสใช้ extends config หรือ dependencies catalog — domain checklist อยู่ใน `subagents/config-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

- ใช้กับ root project หรือ workspace ใดๆ
- ครอบคลุม tool configs, CI/CD, env, moon/turbo, editor, git hooks — focus config file drift/duplicates
- ไม่รวม manifest structure, dependency graph และ scripts readiness ของ workspace member → ใช้ `/review-workspace`
- ไม่แก้ไขไฟล์ ให้ report findings เป็น input สำหรับ `/update-config`

## Execute

### 1. Prepare And Baseline

> Goal: รวบรวม config files ทั้งหมดและเก็บ baseline

1. ใช้ `/report-config-files`
2. ทำตาม `subagents/config-reviewer/config-checks.md#discover-config-files`
3. จัดกลุ่มไฟล์ตาม category — ใช้ inventory เป็น findings-file ให้ subagent cross-check

### 2. Dispatch Config-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — `inventory`, `coverage`, `shared-config`, `security`, `versions`, `flags-secrets`; ไม่ระบุ → ทุก dimension ที่ apply
2. Spawn `subagents/config-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (inventory จาก step 1)
3. scope ใหญ่/หลาย workspace → spawn หลาย instance ทีละ scope ขนานกัน — dimensions ต่างกันใน scope เดียวรวมเป็น instance เดียว

### 3. Aggregate And Score

> Goal: findings รวมกันพร้อม severity + score

1. รวม findings จากทุก instance — dedup ตาม file:line + issue type
2. ทำ `/deep-validate`; ทำตาม `subagents/config-reviewer/scoring.md`
3. coverage เพิ่มเติมของ domain: feature-flag config drift ข้าม environments + stale flags; secret references hygiene — ไม่มี inline secrets, rotation path ชัด

### 4. Report

> Goal: สรุป findings สำหรับ update

1. ทำ `/report` ด้วย columns: Category, File, Status, Issue, Severity, Recommendation
2. ทำ `/report-file-structure` สำหรับ config tree
3. ระบุ next actions สำหรับ `/update-config`, `/setup-package`, `/setup-release`, `/setup-cicd`

### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `env`, `env-vars` — env parity, prefixes, leaks | `subskills/check-env/SKILL.md` |
| Setup env validation from zero — startup schema (user confirm) | `subskills/setup-env-validation/SKILL.md` |

## Rules

### 1. Read-Only Review

- ไม่แก้ไข config files
- ไม่ expose secrets
- ไม่ commit
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/config-reviewer/` เท่านั้น

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

- ใช้ /review-code-quality ถ้าจำเป็น
- ใช้ /review-security ถ้าจำเป็น
- ใช้ /review-workspace ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. env vars: เทียบ `.env.example` vs code usage — ครบ + ลบ unused
2. validation: schema ที่ startup, defaults ปลอดภัย, coercion ถูก
3. secrets/hardcode: ย้าย env/secret manager, prefix rules ถูก (client vs server)
4. drift: `/check-config-drift` report-drift subskill reconcile ข้าม envs; consolidate sprawl
5. verify: boot ทุก env ผ่าน + missing-var error ชัด

## References

- [Full-dimension checklist](subagents/config-reviewer/checklist.md)
- [Config checks](subagents/config-reviewer/config-checks.md)
- [Scoring](subagents/config-reviewer/scoring.md)
- ใช้ /run-review ถ้าจำเป็น

## Expected Outcome

- รายการ config files ทั้งหมดจัดกลุ่มตาม category
- ตาราง findings ด้วย severity และ recommendation
- รายการโอกาสใช้ extends config / dependencies catalog / shared config
- รายงาน security risks และ version inconsistencies
- รายการ config ที่สามารถ deduplicate หรือรวมเป็น shared/extends
- รายการ config ที่ควรมี schema หรือ comment
- input ที่ครบสำหรับ `/update-config`
