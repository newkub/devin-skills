---
name: review-release
description: Review release readiness ก่อน publish
related:
  - test-release
  - run-release
  - ship
  - setup-release
  - review-correctness
  - review-architecture
  - report-table
---

## Goal

Review release readiness ก่อนเริ่ม publish เพื่อยืนยันความถูกต้องของ version, changelog, breaking changes, semver, platform targets, rollback plan, release notes และ license

## Scope

ใช้ก่อนเรียก `run-release`, `ship`, `setup-release` หรือ release tooling อื่น ตรวจ release readiness ครอบคลุม version, changelog, breaking changes, platform, rollback, release notes, license แล้วสรุป release readiness score พร้อม go/no-go recommendation

## Execute

### 1. Prepare Context

> Goal: เข้าใจ release target และ project context

- ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ release config
- ระบุ release platforms: npm, crates.io, VSCode Marketplace, Docker Hub, ฯลฯ
- ตรวจ release config files และ package manifests
- ถ้าไม่พบ release config → stop และ report

### 2. Check Version And Semver

> Goal: ตรวจ version bump correctness และ semver compliance

ทำตาม references/version-semver.md

### 3. Check Changelog Completeness

> Goal: ตรวจ changelog completeness ก่อน publish

ทำตาม references/changelog.md

### 4. Check Breaking Changes

> Goal: ระบุ breaking changes ก่อน publish

ทำตาม references/breaking-changes.md

### 5. Check Platform Targets And Rollback

> Goal: ตรวจ platform targets และ rollback plan

ทำตาม references/platform-targets.md

### 6. Check License And Release Notes

> Goal: ตรวจ license compliance และ release notes

- ตรวจ `LICENSE` file มีและถูกต้อง
- ตรวจ license ใน manifests สอดคล้องกับ `LICENSE` file
- ตรวจ release notes สำหรับ GitHub Release
- ตรวจ dependencies ไม่มี license conflicts

### 7. Score And Report

> Goal: สรุป release readiness score และ go/no-go

ทำตาม references/scoring.md

- คำนวณ release readiness score, grade และ supplementary metrics
- ทำ `/report-table` สรุป category, status, findings, score
- สร้าง go/no-go checklist
- ทำ `/suggest-next-action`

## Rules

1. Review Independence
   - ทำ review เท่านั้น ไม่ publish ระหว่าง review
   - ทุก finding ต้องมี file path และ evidence
2. Evidence-Based Findings
   - ใช้ `Grep` และ `scan-codebase` สำหรับ verification
   - จัดลำดับตาม severity: Critical → High → Medium → Low
3. Scoring
   - คะแนนต่อ category: ✅ = 1, ⚠️ = 0.5, ❌ = 0
   - Release readiness score = (total score / total categories) × 100%
   - Grade A-F ตาม thresholds ใน references/scoring.md
   - Score < 70 → No-Go แนะนำให้แก้ก่อน publish
4. Formatting
   - ห้ามใช้ bold markers — ใช้ backticks
   - รายงานเป็นตารางด้วย `/report-table`

- ใช้ /test-release ถ้าจำเป็น
- ใช้ /review-correctness ถ้าจำเป็น
- ใช้ /review-architecture ถ้าจำเป็น

## Expected Outcome

- รายงาน Release Readiness Summary พร้อม score และ grade
- รายงาน Go/No-Go Checklist พร้อม status
- รายงาน Breaking Changes พร้อม migration notes
- Go/no-go recommendation
- Release readiness score พร้อม progress bar
- แนะนำ action ถัดไป
