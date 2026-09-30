---
name: ship-release
description: Ship ถึง main แล้ว release ต่อ — /ship-to-main-branch → /run-release → watch จน live
argument-hint: "[scope] [dont-ask-me]"
related:
  - ship-verify
  - ship-to-main-branch
  - ship-to-dev-branch
  - run-release
  - watch-deploy
  - deep-review
  - gen-changelog-md
  - resolve-errors
  - report
  - suggest-next-action

---

## Goal

Orchestrate ship + release เป็นคำสั่งเดียว — `/ship-to-main-branch` จน merge เข้า `main` สำเร็จ แล้ว `/run-release` publish artifacts และ watch จน live บน target platforms — ship เองไม่รัน release (canonical boundary)

## Scope

ใช้เมื่อต้องการ ship แล้ว release ต่อทันที — project ที่ publish ไป npm/crates/vscode/webstore/docker หรือ deploy targets

- `/ship-to-main-branch` = dev → merge เข้า `main` เท่านั้น ไม่รัน release เอง
- `/run-release` = release mechanics (platforms, prerelease, notes, changelog)
- `dont-ask-me` argument → ทุก confirmation ถูกแทนด้วย `/follow-your-suggestion` + safe default

## Execute

### 1. Ship To Main

> Goal: code merged เข้า `main` ก่อนปล่อย release

1. ทำ `/ship-to-main-branch` ครบ chain — dev validated → PR review gate ผ่าน → merge เข้า `main` สำเร็จ
2. ถ้า ship fail → หยุดและ report — ห้าม release บน main ที่ไม่ผ่าน
3. เก็บ merge commit hash + version ก่อน release (rollback target)

### 2. Prepare Release

> Goal: release config พร้อมและ tag ถูกต้อง

1. ถ้า project ยังไม่มี release config (workflows, tokens, manifest fields) → ตั้งค่าครั้งเดียวก่อน: เลือก release tool (`/follow-tool-changesets`, `/follow-tool-changelogen`, `/follow-tool-semantic-release` หรือ `/follow-tool-release-it`) + สร้าง `.github/workflows/release.yml` trigger บน tag `v*` ผ่าน `/setup-cicd`
2. สร้าง/ตรวจ tag `v*` ตาม project conventions — `/run-release` ต้องอยู่บน tag `v*` หรือ `main`
3. ทำ `/run-release --dry-run` ตรวจ platform detection + config + secrets — แสดงผลให้ user (ยกเว้น `dont-ask-me` → ใช้ safe default)

### 3. Release

> Goal: publish ไปยัง platforms ที่ detect ได้

1. user confirm แล้ว → ทำ `/run-release` — ครอบ prerelease build, smoke test artifact, publish, release notes, `CHANGELOG.md` (`/gen-changelog-md`)
2. ถ้า release fail → แก้ตาม `/resolve-errors` แล้ว retry สูงสุด 3 รอบ — ยังไม่ผ่าน → stop แล้ว report

### 4. Watch Until Live

> Goal: ยืนยัน artifacts live จริง

1. Poll registry/tag จน version ใหม่ live — `npm view <pkg>@<ver>`, `https://crates.io/api/v1/crates/<pkg>/<ver>`, `docker pull <image>:<tag>`, VS Code Marketplace API, `gh release view <tag>` — interval 30s, timeout 600s
2. ถ้า release รวม deploy → ทำ `/watch-deploy` กับ deploy URL + health/smoke checks
3. partial live → ระบุ artifact ไหนขาด พร้อม pending CI vs fail จริง

### 5. Report And Handoff

> Goal: สรุป ship+release status

1. ทำ `/report` — ตาราง `No.`, `Artifact`, `Expected`, `Actual`, `Status` + verdict `released`/`partial`/`not-released`
2. ถ้า project ใช้ task queue (`QUEUE.md`) → แนะนำ `/run-task-all` เฝ้า/รันงานค้างต่อเนื่องหลัง release
3. ทำ `/suggest-next-action`

## Rules

- `/ship-to-main-branch` ต้องผ่านครบก่อน release เสมอ — ห้าม release บน unshipped/broken main
- release/publish → user confirm เสมอ (ยกเว้น `dont-ask-me` mode → safe default + บันทึกใน report)
- `CHANGELOG.md` gen ผ่าน `/gen-changelog-md` เท่านั้น ห้ามแก้มือ
- ห้าม re-release version เดิม — fail ให้แก้ root cause แล้ว bump
- ใช้ /watch-deploy ถ้าจำเป็น

## Expected Outcome

- `/ship-to-main-branch` สำเร็จ: merged เข้า main, CI ผ่าน, rollback path พร้อม
- Release artifacts live บนทุก platform ที่ detect — verified ผ่าน registry/tag polling + `/watch-deploy`
- `CHANGELOG.md` + release notes ถูก gen อัตโนมัติ
- verdict ชัดเจนพร้อม artifacts ที่ขาด (ถ้า partial)
