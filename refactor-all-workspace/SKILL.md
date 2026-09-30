---
name: refactor-all-workspace
description: Refactor ทุก workspace ใน monorepo จนครบ — ตาม dependency order พร้อม verify ต่อตัว
argument-hint: "[scope]"
related:
  - refactor
  - all-workspace
  - refactor-all-files-in-workspace
  - refactor-workspace
  - follow-monorepo
  - deep-review
  - update-references
  - run-verify
  - run-test-all
  - resolve-errors
  - use-subagents

---

## Goal

Refactor ทุก workspace ใน monorepo อย่างเป็นระบบตาม dependency order — foundation ก่อน dependents ทีหลัง — โดย dispatch `/refactor` ต่อ workspace จนครบและ verify ต่อตัว

## Scope

ใช้เมื่อ context คือ "refactor ทั้ง monorepo/ทุก workspace" หรือ `/refactor` dispatch มา — ทุกไฟล์ใน workspace เดียว → `/refactor-all-files-in-workspace`; workspace boundaries (split/merge members) → `/refactor-workspace`

## Execute

### 1. Discover Workspaces

> Goal: ได้รายการและลำดับ workspaces ทั้งหมด

1. ทำ `/check-monorepo` + `/deep-analyze` เพื่อดู workspace configuration ทั้งหมด
2. อ่าน root manifest (`package.json` workspaces / `Cargo.toml` members / `moon.yml` / `pnpm-workspace.yaml`) — list members
3. จัดลำดับตาม dependency graph: foundation (shared packages, utilities) ก่อน → dependents → applications ทีหลัง; ห้ามสร้าง circular dependencies
4. เก็บ baseline ต่อ workspace ด้วย `/check-long-files` + `/deep-review` — เลือก priority ตาม severity

### 2. Refactor Each Workspace

> Goal: ทุก workspace ผ่าน refactor scope ที่เหมาะจนครบ

1. ทำทีละ workspace ตามลำดับ dependency — foundation ก่อนเสมอ
2. เลือก scope ต่อ workspace:
   - restructure members/boundaries → ทำ `/refactor-workspace`
   - refactor ทุกไฟล์ใน workspace → ทำ `/refactor-all-files-in-workspace`
   - architecture pattern → `/refactor` architecture scope → `/follow-architecture` (หลาย `apps/*` unified + `packages/`/`crates/` → clean, app เดียว → layered)
   - extract shared code ข้าม packages → ทำ `/refactor-to-packages-shared`
3. workspace อิสระกันจำนวนมาก → ทำ `/use-subagents` dispatch ทีละ workspace/batch ขนานกัน; workspaces ที่แก้ shared refs ชนกัน → sequential
4. หลังแต่ละ workspace → `/update-references` + `/run-check` ก่อน workspace ถัดไป; `/git-commit` checkpoint ทุก workspace

### 3. Update References

> Goal: ไม่มี broken references ข้าม workspaces

1. ทำ `/update-references` สำหรับ cross-workspace imports/aliases ที่เปลี่ยน
2. ถ้า structure/layout เปลี่ยน → ทำ `/update-agents-md` ให้ตรง structure ใหม่
3. ถ้า broken → ทำ `/resolve-errors`

### 4. Verify

> Goal: monorepo ผ่าน verify รวม

1. ทำ `/run-verify` แบบ monorepo (`moon run`, `turbo run`, `pnpm --recursive`, `bun run --filter` ตามที่ตรวจพบ) + `/run-test-all` ถ้ามี test suites
2. ตรวจไม่มี workspace ถูกข้ามหรือปัญหาค้าง — เทียบ baseline จาก step 1
3. ไม่ผ่าน → กลับแก้ที่ workspace ที่ fail (max 3 รอบ → stop + report)

## Rules

### 1. Dependency Order

- Foundation workspace members ไม่พึ่งใคร — refactor ก่อนเสมอ; dependents ทีหลัง; ห้ามสร้าง circular dependencies

### 2. One Workspace At A Time

- verify + commit ต่อ workspace — ห้ามทำหลาย workspace ชนกันถ้าแชร์ refs; subagents เฉพาะชุดที่อิสระจริง

### 3. Safety And Minimal

- `/dont-over-engineer` — ไม่สร้าง micro-workspace members; preserve public API/behavior เดิม
- destructive/high-risk → dry run + confirm; ย้าย/ลบ → `/update-references` ทุกครั้ง
- บันทึก workspaces ที่มีปัญหา → `/resolve-errors`; เกิน 3 รอบ → stop + report

## Expected Outcome

- ทุก workspace ใน monorepo ผ่าน refactor ครบตาม dependency order
- Boundaries ชัด ไม่มี circular dependencies หรือ broken references
- ผ่าน `/run-verify` และ `/run-test-all`; รายงาน before/after ต่อ workspace ครบ
