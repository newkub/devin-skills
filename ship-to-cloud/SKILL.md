---
name: ship-to-cloud
description: Push current branch ไปยัง remote แล้วรัน cloud verify แก้ไขจนผ่าน โดยไม่ release/deploy
related:
  - ship
  - follow-git-flow
  - follow-github
  - run-verify
  - setup-ci-cd
  - resolve-errors
  - report-table
  - suggest-next-action
---

## Goal

Push branch ปัจจุบันไปยัง remote แล้วรัน verify บน cloud/CI จนผ่าน
`/ship-to-cloud` ทำเฉพาะ commit (ถ้ามี), push, cloud verify และ fix loop
ไม่ merge, ไม่ promote, ไม่ release, ไม่ deploy

## Scope

ใช้เมื่อต้องการส่ง branch ปัจจุบันขึ้น remote เพื่อรัน CI/CD
รองรับ GitHub Actions, GitLab CI, Azure DevOps, CircleCI, Jenkins, Cloudflare Pages, Vercel

ถ้าต้องการ commit ใน local เท่านั้น → ใช้ `/ship`
ถ้าต้องการ release/deploy บน main → ใช้ `/ship-release`
ถ้าต้องการทำงานตาม issue ทั่งหมด → ใช้ `/ship-github-issue`

## Execute

### 1. Pre-flight

> Goal: เตรียม workspace ก่อน push

1. ทำ `git status --porcelain`, `git branch --show-current`, `git remote -v`
2. ถ้าไม่มี remote → stop และ report ให้ setup remote ก่อน
3. ตรวจ CI/CD config files: `.github/workflows/*.{yml,yaml}`, `.gitlab-ci.yml`, `azure-pipelines.yml`, `.circleci/config.yml`, `Jenkinsfile`, `wrangler.toml`, `vercel.json`
4. ถ้าไม่พบ CI/CD config → ทำ `/setup-ci-cd`
5. บันทึก last green SHA ด้วย `git rev-parse HEAD`

### 2. Commit If Needed

> Goal: commit ใน local ก่อน push ถ้ามี uncommitted changes

1. ถ้า `git status --porcelain` ไม่ว่าง → ทำ `/ship`
2. ถ้า `/ship` ไม่ผ่าน → stop และ report
3. ถ้าไม่มี uncommitted changes → ไปขั้นตอนถัดไป

### 3. Push

> Goal: push current branch ไปยัง remote

1. ทำ `git push -u origin <current-branch>`
2. ถ้า push ถูก reject → resolve หรือ pull/rebase ตามความเหมาะสม แล้ว push ใหม่
3. ไม่ force push
4. ถ้า push สำเร็จ → ไปขั้นตอนถัดไป

### 4. Run Cloud Verify

> Goal: รัน verify บน CI/CD

1. ทำ `/run-verify --ci`
2. ถ้าผ่าน → ไปขั้นตอน Report
3. ถ้า fail → วิเคราะห์ logs แล้วไปขั้นตอนถัดไป

### 5. Fix And Re-push

> Goal: แก้ไข failure จาก cloud verify แล้ว re-push

1. ทำ `/resolve-errors` ตาม root cause จาก cloud logs
2. ถ้ามี changes หลังแก้ไข → ทำ `/ship` แล้ว `git push`
3. ถ้าไม่มี changes → ทำ `git push` เพื่อ re-trigger pipeline
4. ทำ `/run-verify --ci` อีกครั้ง
5. วนซ้ำสูงสุด 5 รอบ ถ้ายังไม่ผ่าน → stop และ report
6. ถ้าผ่าน → ไปขั้นตอน Report

### 6. Report

> Goal: สรุปผลการ push และ cloud verify

1. ใช้ `/report-table` สรุป: status, branch, platform, run ID, commits, loop count
2. ทำ `/suggest-next-action`

## Rules

### 1. Commit First

- ถ้ามี uncommitted changes ต้องทำ `/ship` ก่อน push
- ถ้าไม่มี uncommitted changes ให้ push unpushed commits ได้เลย
- ไม่ push code ไป cloud โดยไม่ผ่าน verify

### 2. No Force Push

- ถ้า push ถูก reject → resolve หรือ rebase ก่อน
- ไม่ใช้ `--force` หรือ `--force-with-lease` โดยไม่ได้รับอนุญาต

### 3. Fix Loop

- วน fix + re-push สูงสุด 5 รอบ
- ถ้า failure เดิมเกิดซ้ำ 3 ครั้งขึ้นไป → stop และ report
- บันทึก last green SHA ก่อนแก้ไขแต่ละรอบ

### 4. No Release/Deploy

- `/ship-to-cloud` ไม่ทำ release, deploy, merge หรือ promote
- ถ้าต้องการ release → ใช้ `/ship-release` หลังจาก branch ผ่าน verify
- ถ้าต้องการ deploy เท่านั้น → ให้ `/ship-release` skip release และทำ deploy

### 5. Safety

- ไม่ push secrets
- ไม่ skip git hooks
- ไม่ force push
- ไม่ทำ `git init` หรือ `git config --global`

### 6. Setup CI/CD If Missing

- ถ้าไม่พบ CI/CD config → `/setup-ci-cd` ก่อน
- ถ้า setup ไม่สำเร็จ → stop และ report

## Expected Outcome

- Current branch ถูก push ไปยัง remote
- CI/CD config พร้อมใช้งาน
- Cloud verify ผ่าน หรือ report สถานะถ้าเกิน loop limit
- ไม่มี merge, promote, release หรือ deploy
- มีรายงานผลการ push และ verify ครบถ้วน
