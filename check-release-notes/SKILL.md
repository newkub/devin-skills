---
name: check-release-notes
description: อ่าน release notes ล่าสุดจาก GitHub releases หรือ official site/blog เทียบ version ใน skill
argument-hint: "[package-or-repo]"
related:
  - list-github-release
  - check-all-routes
  - check-release-drift
  - update-devin-global-skills
  - update-version-to-latest
  - report
---

## Goal

ดึง release notes ล่าสุดของ package/tool จาก GitHub Releases หรือ official website (blog/changelog/releases page) — สรุป latest version, release date, breaking changes และเทียบกับ version ที่ skill/document อ้างถึง

## Scope

- Target: package name (`vite`, `react`), repo (`owner/repo`), หรือ skill name (resolve package จาก `references/package-manifest.md`)
- Sources ตามลำดับ: GitHub Releases API → official changelog/releases page → official blog post → registry metadata
- Read-only — รายงาน findings; การแก้ไขทำโดย `/update-devin-global-skills` หรือ `/update-version-to-latest`
- ต่างจาก `/list-github-release` ที่ list releases ดิบ — skill นี้อ่าน notes content และเทียบกับ documented version

## Execute

### 1. Resolve Package And Sources

> Goal: รู้ package, repo, และ official release channel

1. รับ target จาก argument; ถ้าเป็น skill name → อ่าน `references/package-manifest.md` หรือ `Latest:` line ใน SKILL.md
2. หา GitHub repo จาก manifest (`Repository` field) หรือ registry metadata
3. หา official release channel: `/releases`, `/changelog`, `/blog`, CHANGELOG.md

### 2. Fetch Latest Release Notes

> Goal: ได้ version + notes จริงจาก official source

1. **GitHub Releases** (preferred): `gh release view --repo <owner/repo> --json tagName,publishedAt,body` หรือ GitHub MCP `list_releases`; registry fallback: `https://api.github.com/repos/<owner>/<repo>/releases/latest`
2. **Official site**: `webfetch` changelog/releases/blog page — หา release post ล่าสุด (เช่น `vite.dev/blog`, `react.dev/blog`)
3. **Registry fallback**: npm `https://registry.npmjs.org/<pkg>/latest` (version + time), crates.io `/api/v1/crates/<name>` — ได้ version/date แต่ไม่มี notes
4. บันทึก: `latest version`, `release date`, `breaking changes`, `new features`, `deprecations`, source URL

### 3. Compare And Report

> Goal: รู้ว่า skill/document stale หรือไม่

1. หา documented version จาก SKILL.md (`Latest:` line), `references/package-manifest.md`, หรือ install commands ที่ pin version
2. เทียบ documented vs latest — classify: `current`, `patch-behind`, `minor-behind`, `major-behind`, `unknown`
3. Report ตาราง: No. | Package | Documented | Latest | Released | Drift | Breaking | Source

## Rules

### 1. Official Sources First

- GitHub Releases / official changelog / official blog เท่านั้น — ไม่ใช้ third-party aggregators
- ระบุ source URL ในทุก finding; ถ้าหาไม่ได้ → `unknown` ไม่เดา

### 2. Semver Drift

- เทียบ semver: major-behind = risk สูงสุด ต้องรายงาน breaking changes
- prerelease/alpha/beta/rc ไม่นับเป็น latest stable ยกเว้น package publish เฉพาะ prerelease

### 3. Evidence

- ทุก version/date ต้องมาจาก source ที่ fetch จริง — ห้ามใช้ memory
- ถ้า notes ไม่ระบุ breaking → ระบุ "not stated" อย่า assume

## Expected Outcome

- รายงาน latest version + release date + breaking changes ต่อ package พร้อม source URL
- Drift classification ต่อ skill — พร้อมให้ `/update-devin-global-skills` หรือ `/update-version-to-latest` apply
