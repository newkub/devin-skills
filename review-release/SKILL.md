---
name: review-release
description: Review release readiness ก่อน publish
---

## Goal

Review release readiness ก่อนเริ่ม publish เพื่อยืนยันว่า version bump correctness, changelog completeness, breaking changes, semver compliance, platform targets, rollback plan, release notes และ license compliance ครบถ้วน

## Scope

ใช้ก่อนเรียก `run-release`, `ship-and-release`, `follow-release`, `follow-semantic-release`, `follow-changelogen`, `follow-changesets`, `follow-release-it`, `follow-release-npm`, `follow-release-crates`, `follow-release-docker`, `follow-release-vscode`, `follow-auto-it`, `update-changelog-md`, หรือ `update-release-md` — ตรวจ release readiness ครอบคลุม version, changelog, breaking changes, platform, rollback, release notes, license แล้วสรุป release readiness score พร้อม go/no-go checklist

## Execute

### 1. Prepare Context

> Goal: เข้าใจ release target และ project context

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ release config
2. ระบุ release platforms: npm, crates.io, VSCode Marketplace, Docker Hub, Chrome Web Store
3. ตรวจ release config files: `.releaseit.json`, `.autorc`, `release-plz.toml`, `.changeset/config.json`
4. ตรวจ `package.json`, `Cargo.toml`, `manifest.json`, `Dockerfile` สำหรับ release metadata
5. ถ้าไม่พบ release config → stop และ report

### 2. Check Version And Semver

> Goal: ตรวจ version bump correctness และ semver compliance

1. ตรวจ version ใน `package.json`, `Cargo.toml`, `manifest.json` สอดคล้องกัน
2. ตรวจ version bump ถูกต้องตาม conventional commits: `feat` → minor, `fix` → patch, `BREAKING` → major
3. ตรวจ semver compliance: `X.Y.Z` format
4. ตรวจ git tags ใช้ format `vX.Y.Z`
5. ดูรายละเอียดใน [references/version-semver.md](references/version-semver.md)

### 3. Check Changelog Completeness

> Goal: ตรวจ changelog completeness ก่อน publish

1. ตรวจ `CHANGELOG.md` มี entry สำหรับ version ที่จะ release
2. ตรวจ changelog ครอบคลุมทุก conventional commits ตั้งแต่ last release
3. ตรวจ changelog format: version, date, categories (feat, fix, breaking)
4. ตรวจ `RELEASE.md` มี release notes สำหรับ version ที่จะ release
5. ดูรายละเอียดใน [references/changelog.md](references/changelog.md)

### 4. Check Breaking Changes

> Goal: ระบุ breaking changes ก่อน publish

1. ตรวจ conventional commits มี `BREAKING CHANGE:` หรือ `feat!:`
2. ตรวจ API changes ที่อาจทำลาย backward compatibility
3. ตรวช migration notes สำหรับ breaking changes
4. ตรวช breaking changes บันทึกใน changelog และ release notes
5. ดูรายละเอียดใน [references/breaking-changes.md](references/breaking-changes.md)

### 5. Check Platform Targets And Rollback

> Goal: ตรวจ platform targets และ rollback plan

1. ตรวช platform config ครบ: npm (`private: false`), crates (`Cargo.toml`), vscode (`publisher`), docker (`Dockerfile`)
2. ตรวช authentication tokens ตั้งค่า: `NPM_TOKEN`, `CARGO_REGISTRY_TOKEN`, `VSCE_PAT`, `DOCKER_PASSWORD`
3. ตรวช rollback plan สำหรับแต่ละ platform
4. ตรวช platform-specific requirements ครบ
5. ดูรายละเอียดใน [references/platform-targets.md](references/platform-targets.md)

### 6. Check License And Release Notes

> Goal: ตรวจ license compliance และ release notes

1. ตรวช `LICENSE` file มีและถูกต้อง
2. ตรวช license ใน `package.json`, `Cargo.toml` สอดคล้องกับ `LICENSE` file
3. ตรวช release notes มีสำหรับ GitHub Release
4. ตรวช dependencies ไม่มี license conflicts

### 7. Score And Report

> Goal: สรุป release readiness score และ go/no-go checklist

1. คำนวณ release readiness score จาก [references/release-readiness-score.md](references/release-readiness-score.md)
2. ทำ `/report` พร้อม `/report-table`
3. สร้างตาราง Release Readiness Summary: Category, Status, Findings, Score
4. สร้างตาราง Go/No-Go Checklist: Item, Status, Action Required
5. สร้างตาราง Breaking Changes: Change, Impact, Migration Notes, Severity
6. แสดง go/no-go recommendation พร้อมเหตุผล
7. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Independence

- ทำ review เท่านั้น ไม่ publish ระหว่าง review
- ถ้าต้อง publish ให้ใช้ `run-release` หลัง review
- ทุก finding ต้องมี file path และ evidence

### 2. Evidence-Based Findings

- ใช้ `Grep` และ `scan-codebase` สำหรับ verification
- ตรวจ config files และ changelog แบบ cross-reference
- จัดลำดับตาม severity: Critical → High → Medium → Low

### 3. Scoring

- คะแนนต่อ category: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Release readiness score = (total score / total categories) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → No-Go แนะนำให้แก้ก่อน publish

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Release Readiness Summary พร้อม score และ grade
- รายงาน Go/No-Go Checklist พร้อม status
- รายงาน Breaking Changes พร้อม migration notes
- Go/no-go recommendation พร้อมเหตุผล
- Release readiness score พร้อม progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
