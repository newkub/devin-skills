---
name: report-release-readiness
description: รายงานความพร้อมก่อน release — tests, changelog, version, migrations และ deploy readiness
argument-hint: "[version-or-tag]"
related:
  - follow-release
  - check-release-drift
  - verify-deploy
  - run-test-all
  - check-migrations
  - check-uncommit
  - check-unpush
  - report-table
---

## Goal

รายงานสถานะความพร้อมของ release แบบครบถ้วน — tests ผ่านไหม, version/changelog ตรง, migrations พร้อม, git state สะอาด — เป็น go/no-go checklist เดียว

## Scope

- ใช้ก่อน `tag`/`release`/`deploy` — checklist อัตโนมัติแทนเช็คมือ
- ครอบคลุม: git state, version consistency, tests, build, changelog, migrations, security checks, deploy prerequisites
- Read-only: รายงาน readiness — ไม่แก้หรือ release เอง

## Execute

### 1. Git State

> Goal: repo พร้อม release

1. ทำ `/check-uncommit` — ไม่มี uncommitted changes
2. ทำ `/check-unpush` — local commits push ครบ
3. ตรวจ branch ถูกต้อง (release จาก main/release branch ตาม convention) และ up-to-date กับ remote

### 2. Version Consistency

> Goal: version ตรงทุกที่

1. ทำ `/check-release-drift` — manifest version vs latest tag vs changelog
2. ตรวจ version bump เหมาะสม (semver ตาม changes ที่มี)
3. flag pre-release versions ถ้าตั้งใจ stable release

### 3. Quality Gates

> Goal: verification ครบก่อน release

1. `/run-test-all` — ผ่านทั้งหมด ไม่มี skipped/failed ที่ค้าง
2. `/run-build` — production build สำเร็จ
3. `/run-lint` + `/run-typecheck` — clean
4. `/run-audit` — ไม่มี critical vulnerabilities

### 4. Release Artifacts

> Goal: เอกสารและ data พร้อม

1. Changelog มี entry สำหรับ version นี้ — `/report-changelog` ดูว่าครบ
2. ทำ `/check-migrations` — pending migrations ระบุ deploy order ชัด
3. Docs/readme ตรงกับ release ถ้ามี user-facing changes
4. Breaking changes ถูก documented

### 5. Report Verdict

> Goal: go/no-go พร้อม blockers

1. ใช้ `/report-table` คอลัมน์: `No.`, `Check`, `Status`, `Detail`, `Blocker`
2. Verdict: `ready` / `ready-with-warnings` / `blocked` พร้อมรายการที่ต้องแก้
3. แนะนำ next steps: `/follow-release`, `/run-release` เมื่อ ready

## Rules

### 1. Evidence-Based

- ทุก check มีผลจริงจากการรัน/อ่านไฟล์ — ไม่ checkmark ลอยๆ
- ถ้าตรวจอะไรไม่ได้ → ระบุ `unknown` ไม่ใช่ assume pass

### 2. Read-Only

- ไม่แก้ findings และไม่ release — รายงานเท่านั้น
- blockers ต้องระบุ fix path ชัดเจน

### 3. Project Aware

- checks ที่ไม่ apply (ไม่มี DB → ข้าม migrations) ให้ข้ามพร้อมเหตุผล
- ใช้ release process ที่ project กำหนด (`.github`, `AGENTS.md`) ถ้ามี

## Expected Outcome

- Readiness checklist ครบทุกมิติพร้อมผลจริง
- Verdict ชัดเจน + blockers ที่ actionable
- มั่นใจได้ว่า release ไม่ลืมขั้นตอน
