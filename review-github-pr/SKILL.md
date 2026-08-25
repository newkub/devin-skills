---
name: review-github-pr
description: Review pull request ทั้งหมดก่อน merge โดยตรวจสอบ diff, commits, PR metadata, CI และ code changes
argument-hint: "[pr-number]"
---

## Goal

Review pull request ทั้งหมดก่อน merge โดยตรวจสอบ diff, commits, PR metadata, CI และ code changes

## Scope

ใช้สำหรับ review pull request ก่อน merge — ทำงานบน PR จาก GitHub หรือ local branch diff — ไม่แก้ไข code โดยไม่ได้รับอนุญาต

## Execute

### 1. Fetch PR Context

> Goal: รวบรวมข้อมูล PR ทั้งหมด

1. ถ้ามี PR number → รัน `gh pr view <pr>` และ `gh pr diff <pr>` — ถ้าไม่มี → รัน `git diff <base>..<head>` และ `git log --oneline <base>..<head>`
2. บันทึกข้อมูล: title, description, author, base branch, commits, files changed, additions/deletions, labels, checks
3. ระบุ domain ของ PR: frontend, backend, infrastructure, docs, config, test, library
4. ถ้าใช้ GitHub → รัน `gh pr checks <pr>` เพื่อดูสถานะ CI

### 2. Review PR Metadata

> Goal: ตรวจสอบ metadata ของ PR

1. ตรวจ title ตาม conventional commit format (`<type>: <subject>`)
2. ตรวจ description มี context, linked issue, และ changes summary
3. ตรวจ base branch ถูกต้อง
4. ตรวจขนาด PR: small (<10 files), medium (<30 files), large (>30 files) — แนะนำ split ถ้าใหญ่
5. ตรวจ merge conflicts, draft status, required reviews
6. ตรวจ commits messages ตาม conventional commits และไม่มี WIP หรือ fixup commits

### 3. Review Code Changes

> Goal: ตรวจสอบ code changes ของ PR

1. ทำ /run-check เพื่อรัน lint, typecheck, scan — ถ้า fail ให้รายงานก่อน continue
2. ทำ /review-codebase บน files ที่เปลี่ยนแปลง
3. ทำ /review-codebase สำหรับ security-sensitive changes
4. ทำ /review-codebase สำหรับ test coverage และ test quality
5. ทำ /review-codebase สำหรับ docs, changelog, versioning, git hygiene
6. ถ้า PR เป็น frontend → ทำ /review-codebase
7. ถ้า PR เป็น backend → ทำ /review-codebase
8. ถ้า PR เป็น API → ทำ /review-codebase
9. ถ้า PR เป็น auth → ทำ /review-codebase

### 4. Validate Findings

> Goal: ตรวจสอบ findings ก่อน report

1. ทำ /deep-validate เพื่อ validate findings หลายมิติ
2. ทำ /validate เพื่อ validate issues แต่ละอย่าง
3. จัดลำดับ severity: Critical → High → Medium → Low
4. ระบุ findings ที่เป็น false positive

### 5. Report And Recommend

> Goal: สร้างรายงานและแนะนำ action

1. ทำ /report พร้อม /report-table
2. สร้างตาราง PR Checklist: Title, Description, Size, Conflicts, Conventional Commits, Tests, CI
3. สร้างตาราง Findings: Category, Severity, Location, Recommendation
4. ระบุ merge readiness: ready, needs changes, needs discussion
5. ทำ /suggest-next-action

## Rules

### 1. Scope And Focus

- Review เท่านั้น ไม่แก้ source โดยไม่ได้รับอนุญาต
- Focus บน changed files ไม่ต้อง review ทั้ง codebase
- ถ้า PR ใหญ่ → แนะนำ split ก่อน review ละเอียด

### 2. Conventional Commits

- Title และ commits ต้องตาม `<type>: <subject>`
- ไม่ขึ้นต้นด้วยตัวพิมพ์ใหญ่หรือจบด้วยจุด
- ไม่มี WIP, fixup!, squash! commits

### 3. Evidence

- ทุก finding ต้องมี file path, line number, หรือ commit reference
- ไม่เดา findings โดยไม่มี evidence
- ใช้ `gh` หรือ `git diff` เพื่อ verify

### 4. Severity

- Critical: blocking merge, security risk, broken build, data loss
- High: significant quality issue, missing tests, breaking change
- Medium: minor issue, style, naming, minor refactor
- Low: nit, suggestion, cosmetic

## Expected Outcome

- PR metadata review: title, description, size, commits, conflicts
- Findings จาก code, security, test, delivery, domain reviews
- Merge readiness verdict พร้อมเหตุผล
- Recommended actions ถัดไป
