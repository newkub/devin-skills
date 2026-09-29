---
name: review-release
description: Review release/deploy readiness ก่อน publish หรือ deploy และ verify หลัง deploy
argument-hint: "[scope]"
related:
  - test-release
  - run-release
  - ship
  - setup-release
  - run-deploy
  - watch-deploy
  - follow-deploy
  - review-code-quality
  - review-architecture
  - report
  - run-review
---

## Goal

Review release readiness ก่อนเริ่ม publish เพื่อยืนยันความถูกต้องของ version, changelog, breaking changes, semver, platform targets, rollback plan, release notes และ license — รวม deployment readiness (env, secrets, build, health, DNS/SSL, zero-downtime) และ post-deploy verify

## Scope

ใช้ก่อนเรียก `run-release`, `ship`, `setup-release`, `run-deploy`, `deploy-to-*`, `follow-deploy` หรือ release tooling อื่น — ตรวจ release readiness (version, changelog, breaking changes, platform, rollback, release notes, license) และ deployment readiness (env vars, secrets, build artifacts, health checks, DNS/CDN, SSL, migration scripts, zero-downtime) แล้วสรุป readiness score พร้อม go/no-go recommendation

## Execute

### 1. Prepare Context

> Goal: เข้าใจ release target และ project context

- ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ release config
- ระบุ release platforms: npm, crates.io, VSCode Marketplace, Docker Hub, ฯลฯ
- ตรวจ release config files และ package manifests
- ตรวจ deployment config files: `vercel.json`, `wrangler.jsonc`, `railway.json`, `Dockerfile`, `.github/workflows/deploy*.yml`
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

### 7. Check Deployment Readiness

> Goal: ตรวจ deployment readiness — ข้ามถ้า release นี้ไม่มี deploy step

1. ตรวจ env vars และ secrets ตาม `references/deploy-env-secrets.md`
2. ตรวจ build artifacts และ config ตาม `references/deploy-build-artifacts.md`
3. ตรวจ health checks และ rollback plan ตาม `references/deploy-health-rollback.md`
4. ตรวจ zero-downtime strategy และ migration scripts ตาม `references/deploy-zero-downtime.md`
5. คำนวณ deploy readiness score ตาม `references/deploy-readiness-score.md` และ `references/deploy-scoring.md`

### 8. Score And Report

> Goal: สรุป release readiness score และ go/no-go

ทำตาม references/scoring.md

- คำนวณ release readiness score, grade และ supplementary metrics
- ทำ `/report` สรุป category, status, findings, score
- สร้าง go/no-go checklist
- ทำ `/suggest-next-action`


### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `breaking`, `semver` — break detection + migration paths | `subskills/check-breaking/SKILL.md` |
| `changelog`, `notes` — completeness + format | `subskills/check-changelog/SKILL.md` |
| `readiness`, `report` — go/no-go checklist verdict | `subskills/report-readiness/SKILL.md` |

## Check: Release Drift


### Goal

ตรวจความสอดคล้องของ version ระหว่าง package manifest, git tags, GitHub releases และ changelog — หา drift เช่น manifest สูงกว่า tag ล่าสุด, tag ที่ไม่มี changelog entry, หรือ release ที่ไม่มี tag

### Scope

- Version sources: `package.json`/`Cargo.toml`/`pyproject.toml` version field, git tags (`v*`), GitHub releases, `CHANGELOG.md` headings
- รองรับ monorepo: ตรวจทุก package ใน workspace ถ้ามี version แยก
- Read-only: รายงาน drift อย่างเดียว

### Execute

#### 1. Collect Versions

> Goal: รวบรวม version จากทุก source

1. อ่าน version จาก package manifest(s) — ใช้ `/list-workspaces` ถ้าเป็น monorepo
2. รัน `git tag --sort=-creatordate` เพื่อดึง tags ล่าสุด
3. อ่าน `CHANGELOG.md` หา version headings ล่าสุด
4. ถ้ามี remote GitHub → `gh release list --limit 5` ดู releases

#### 2. Compare And Detect Drift

> Goal: หาความไม่ตรงกัน

1. `manifest > latest tag` → มี version bump ที่ยังไม่ tag/release
2. `latest tag > manifest` → tag เกิน version ใน manifest (ผิดปกติ)
3. Tag ที่ไม่มี changelog entry → changelog ขาด
4. Changelog entry ที่ไม่มี tag → entry เพี้ยนหรือ tag หาย
5. GitHub release ที่ไม่มี tag → release drift

#### 3. Report

> Goal: สรุป drift

1. ใช้ `/report` คอลัมน์: `No.`, `Source`, `Version`, `Expected`, `Drift Type`, `Fix`
2. สรุป recommended action: สร้าง tag, อัปเดต changelog, หรือสร้าง release
3. แนะนำ `/follow-release` หรือ `/gen-changelog-md` สำหรับการแก้ไข

### Rules

#### 1. Evidence-Based

- ทุก drift ต้องระบุค่าจริงที่พบในแต่ละ source
- ถ้า source ใดไม่มี (ไม่มี changelog/tags) → ระบุ `missing` ไม่ใช่เดา

#### 2. Read-Only

- ไม่สร้าง tag, release หรือแก้ changelog — แนะนำ skill ที่เกี่ยวข้อง

#### 3. Monorepo Aware

- ตรวจต่อ package ถ้า workspace มี independent versioning (changesets, lerna)
- ใช้ tag prefix convention ที่ repo ใช้จริง (เช่น `pkg-a@1.0.0`)

- ใช้ /follow-release สำหรับ release process
- ใช้ /gen-changelog-md สำหรับสร้าง changelog
- ใช้ /git-commit สำหรับ commit conventions
- ใช้ /run-release ถ้าจำเป็น

### Expected Outcome

- ตาราง version comparison ข้ามทุก source
- รายการ drift พร้อม recommended fix

## Check: Release Notes

### Goal

ดึง release notes ล่าสุดของ package/tool จาก GitHub Releases หรือ official website (blog/changelog/releases page) — สรุป latest version, release date, breaking changes และเทียบกับ version ที่ skill/document อ้างถึง

### Scope

- Target: package name (`vite`, `react`), repo (`owner/repo`), หรือ skill name (resolve package จาก `references/package-manifest.md`)
- Sources ตามลำดับ: GitHub Releases API → official changelog/releases page → official blog post → registry metadata
- Read-only — รายงาน findings; การแก้ไขทำโดย `/update-devin-global-skills` หรือ `/update-version-to-latest`
- ต่างจาก `/list-github-release` ที่ list releases ดิบ — skill นี้อ่าน notes content และเทียบกับ documented version

### Execute

#### 1. Resolve Package And Sources

> Goal: รู้ package, repo, และ official release channel

1. รับ target จาก argument; ถ้าเป็น skill name → อ่าน `references/package-manifest.md` หรือ `Latest:` line ใน SKILL.md
2. หา GitHub repo จาก manifest (`Repository` field) หรือ registry metadata
3. หา official release channel: `/releases`, `/changelog`, `/blog`, CHANGELOG.md

#### 2. Fetch Latest Release Notes

> Goal: ได้ version + notes จริงจาก official source

1. GitHub Releases (preferred): `gh release view --repo <owner/repo> --json tagName,publishedAt,body` หรือ GitHub MCP `list_releases`; registry fallback: `https://api.github.com/repos/<owner>/<repo>/releases/latest`
2. Official site: `webfetch` changelog/releases/blog page — หา release post ล่าสุด (เช่น `vite.dev/blog`, `react.dev/blog`)
3. Registry fallback: npm `https://registry.npmjs.org/<pkg>/latest` (version + time), crates.io `/api/v1/crates/<name>` — ได้ version/date แต่ไม่มี notes
4. บันทึก: `latest version`, `release date`, `breaking changes`, `new features`, `deprecations`, source URL

#### 3. Compare And Report

> Goal: รู้ว่า skill/document stale หรือไม่

1. หา documented version จาก SKILL.md (`Latest:` line), `references/package-manifest.md`, หรือ install commands ที่ pin version
2. เทียบ documented vs latest — classify: `current`, `patch-behind`, `minor-behind`, `major-behind`, `unknown`
3. Report ตาราง: No. | Package | Documented | Latest | Released | Drift | Breaking | Source

### Rules

#### 1. Official Sources First

- GitHub Releases / official changelog / official blog เท่านั้น — ไม่ใช้ third-party aggregators
- ระบุ source URL ในทุก finding; ถ้าหาไม่ได้ → `unknown` ไม่เดา

#### 2. Semver Drift

- เทียบ semver: major-behind = risk สูงสุด ต้องรายงาน breaking changes
- prerelease/alpha/beta/rc ไม่นับเป็น latest stable ยกเว้น package publish เฉพาะ prerelease

#### 3. Evidence

- ทุก version/date ต้องมาจาก source ที่ fetch จริง — ห้ามใช้ memory
- ถ้า notes ไม่ระบุ breaking → ระบุ "not stated" อย่า assume

- ใช้ /review-delivery ถ้าจำเป็น
- ใช้ `## Check: Release Notes` ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น
- ใช้ /review-docs ถ้าจำเป็น


### Expected Outcome

- รายงาน latest version + release date + breaking changes ต่อ package พร้อม source URL
- Drift classification ต่อ skill — พร้อมให้ `/update-devin-global-skills` หรือ `/update-version-to-latest` apply

## Domain Checks

> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg

| Scope | Section |
|-------|---------|
| `release-drift` | `## Check: Release Drift` |
| `release-notes` | `## Check: Release Notes` |

## Rules

1. Review Independence
   - ทำ review เท่านั้น ไม่ publish ระหว่าง review
   - ทุก finding ต้องมี file path และ evidence (release)
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
   - รายงานเป็นตารางด้วย `/report`

- ใช้ /test-release ถ้าจำเป็น
- ใช้ /review-code-quality ถ้าจำเป็น
- ใช้ /review-architecture ถ้าจำเป็น

- ถ้า pass → ทำ `/ship` หรือ release ถ้า fail → แก้ findings ก่อน release

## Verify

> ทำ section นี้เมื่อต้องการ verify deployment หลัง deploy เสร็จ

1. ทำตาม `references/deploy-verify.md`
2. ใช้ `/watch-deploy` ดู logs/error rate ช่วงแรก
3. ทำ `/deep-test api` สำหรับ endpoints สำคัญ
4. ทำ `/review-security` บน deployed URL
5. ใช้ `/report-before-after` หรือ `/report` สรุป pass/fail
6. ถ้า failed → แนะนำ rollback ด้วย `git revert <merge-commit>` หรือ redeploy version เดิม พร้อม evidence

## References

- [Full-dimension checklist](references/checklist.md)
- [Version and semver](references/version-semver.md)
- [Changelog](references/changelog.md)
- [Breaking changes](references/breaking-changes.md)
- [Platform targets](references/platform-targets.md)
- [Deploy env/secrets](references/deploy-env-secrets.md)
- [Deploy build artifacts](references/deploy-build-artifacts.md)
- [Deploy health/rollback](references/deploy-health-rollback.md)
- [Deploy zero-downtime](references/deploy-zero-downtime.md)
- [Deploy verify](references/deploy-verify.md)
- [Scoring](references/scoring.md)
- ใช้ /run-review ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. แก้ release blockers ตาม checklist: version drift → `/review-release`, changelog → `/gen-changelog-md`, tests fail → `/resolve-errors`
2. แก้ deploy step ที่ไม่พร้อม → `/follow-deploy` หรือ `/resolve-cicd`
3. verify: re-run readiness checks แล้วเทียบ go/no-go ก่อน-หลัง

## Expected Outcome

- รายงาน Release Readiness Summary พร้อม score และ grade
- รายงาน Deploy Readiness Summary ถ้ามี deploy step
- รายงาน Go/No-Go Checklist พร้อม status
- รายงาน Breaking Changes พร้อม migration notes
- Go/no-go recommendation
- Release readiness score พร้อม progress bar
- แนะนำ action ถัดไป
