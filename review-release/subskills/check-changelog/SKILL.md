---
name: review-release-check-changelog
description: Check changelog + release notes — completeness, format, links, contributor credit
argument-hint: "[version-or-scope]"
related:
  - review-release
  - review-release
  - review-release
  - gen-changelog-md
  - report
---

## Goal

Run the changelog dimension of `/review-release` แบบ focused — changelog ครบทุก change ที่ ship จริง

## Scope

- ใช้เมื่อ `/review-release` dispatch มาที่ `changelog`/`notes` หรือเรียก standalone
- ครอบคลุม: changelog completeness vs commits, release notes format, links/attribution, version consistency
- generate changelog → `/gen-changelog-md`; version drift → `/review-release`

## Execute

### 1. Changelog Checks

> Goal: changelog ตรง reality — parent Execute §3 + §6

ทำตาม `../../subagents/release-reviewer/changelog.md` + `../../subagents/release-reviewer/version-semver.md`

1. completeness — merged PRs/commits ตั้งแต่ tag ล่าสุดครบใน changelog (เทียบ `/review-release`)
2. format — Keep a Changelog categories (Added/Changed/Fixed/Removed/Security), dates, version headers
3. links — compare links, PR references, issue refs resolve
4. consistency — changelog version ↔ `package.json`/tag ↔ release notes ตรงกัน (`/review-release`)

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Section`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix` หรือ `/gen-changelog-md`
- ทุก gap มี evidence: missing commit/PR reference
- breaking change ไม่มีใน changelog = High (release blocker)

## Expected Outcome

- Changelog completeness report เทียบ actual commits
- Format/version-consistency findings พร้อม location
