---
name: ship-cloud
description: Ship code ไปยัง cloud/CI ด้วย setup CI, verify, push, watch, fix และ optional release/deploy
related:
  - run-verify-fast
  - run-verify-cloud
  - setup-ci-cd
  - git-commit-and-push
  - resolve-errors
  - run-release
  - run-deploy
  - deep-ship
  - report-table
  - suggest-next-action
---

## Goal

Ship code ไปยัง cloud/CI ด้วยการ setup CI/CD ถ้าขาด, verify ใน local, commit/push, รัน verify บน cloud, แก้ไขจนกว่าจะผ่าน แล้ว optional release/deploy

## Scope

ใช้เมื่อต้องการส่งมอบงานผ่าน CI/CD pipeline บน cloud ไม่ใช่แค่ commit ใน local
ครอบคลุม GitHub Actions, GitLab CI, Azure DevOps, CircleCI, Jenkins, Cloudflare Pages, Vercel

ถ้าต้องการ commit ใน local เท่านั้น ให้ใช้ `/ship`

## Execute

### 1. Pre-flight

> Goal: เตรียม workspace ก่อน ship บน cloud

1. ทำ `git status`, `git branch --show-current`, `git remote -v`
2. ถ้าไม่มี remote → stop และ report ให้ setup remote ก่อน
3. ตรวจ `AGENTS.md`, `package.json`, `wrangler.toml`, `vercel.json` เพื่อรู้ target: verify only, release, หรือ deploy
4. บันทึก last green SHA ด้วย `git rev-parse HEAD`

### 2. Setup CI/CD If Missing

> Goal: ตั้งค่า CI/CD ถ้ายังไม่มี

1. ค้นหา CI/CD config files
2. ถ้าไม่พบ → ทำ `/setup-ci-cd`
3. ถ้า setup ไม่สำเร็จ → stop และ report
4. ถ้า CI/CD พร้อม → ไปขั้นตอนถัดไป

### 3. Run Local Verify

> Goal: ยืนยันว่า code ผ่าน local verify ก่อน push เพื่อประหยัด CI

1. ทำ `/run-verify-fast`
2. ถ้า fail → ทำ `/resolve-errors` แล้วรัน `/run-verify-fast` ซ้ำ — max 3 รอบ
3. ถ้ายังไม่ผ่าน → stop และ report

### 4. Commit And Push

> Goal: ส่ง code ขึ้น remote

1. ทำ `/git-commit-and-push`
2. ถ้า push ถูก reject → ทำ `/resolve-errors` หรือ pull/rebase ตามความเหมาะสม แล้ว push ใหม่
3. ไม่ force push
4. ถ้า push สำเร็จ → ไปขั้นตอนถัดไป

### 5. Run Cloud Verify

> Goal: รัน verify บน CI/CD

1. ทำ `/run-verify-cloud`
2. ถ้าผ่าน → ไปขั้นตอนถัดไป
3. ถ้า fail → วิเคราะห์ logs จาก `/run-verify-cloud` แล้วไปขั้นตอนถัดไป

### 6. Fix And Re-push

> Goal: แก้ไข failure จาก cloud verify แล้ว re-push

1. ทำ `/resolve-errors` ตาม root cause จาก cloud logs
2. ทำ `/git-commit-and-push` อีกครั้ง
3. ทำ `/run-verify-cloud` อีกครั้ง
4. วนซ้ำสูงสุด 5 รอบ ถ้ายังไม่ผ่าน → stop และ report
5. ถ้าผ่าน → ไปขั้นตอนถัดไป

### 7. Optional Release/Deploy

> Goal: release หรือ deploy ถ้า project กำหนดไว้

1. ถ้า `package.json` มี `version` และ `private: false` → ทำ `/run-release` หรือ `/release-package-to-registry`
2. ถ้ามี deploy config (`vercel.json`, `wrangler.toml`, `Dockerfile`, `railway.toml`) → ทำ `/run-deploy`, `/deploy-to-vercel`, `/deploy-to-cloudflare` ตาม platform
3. ถ้า `AGENTS.md` ระบุ deep ship → ทำ `/deep-ship`
4. ถ้าไม่มี release/deploy config → skip และ report

### 8. Report

> Goal: สรุปผลการ ship บน cloud

1. ใช้ `/report-table` สรุป: status, platform, run ID, commits, release/deploy, loop count
2. ทำ `/suggest-next-action`

## Rules

### 1. Local First

- ต้องผ่าน `/run-verify-fast` ก่อน push เสมอ
- ไม่ push code ไป cloud โดยไม่มี local verify

### 2. No Force Push

- ถ้า push ถูก reject → resolve หรือ rebase ก่อน
- ไม่ใช้ `--force` หรือ `--force-with-lease` โดยไม่ได้รับอนุญาต

### 3. Fix Loop

- วน fix + re-push สูงสุด 5 รอบ
- ถ้า failure เดิมเกิดซ้ำ 3 ครั้งขึ้นไป → stop และ report
- บันทึก last green SHA ก่อนแก้ไขแต่ละรอบ

### 4. Optional Release/Deploy

- ไม่ release หรือ deploy โดยอัตโนมัติถ้าไม่มี config
- ต้องอ่าน `AGENTS.md` หรือ package manifest ก่อนตัดสินใจ release/deploy
- ถ้าไม่ชัด → ทำ `/ask-me`

### 5. Safety

- ไม่ push secrets
- ไม่ skip git hooks
- ไม่ commit ถ้า CI ยังไม่ผ่าน

### 6. Setup Before Run

- ถ้า CI/CD config ไม่พร้อม → ต้อง `/setup-ci-cd` ก่อน
- ไม่รัน cloud verify ถ้าไม่มี CI/CD config

## Expected Outcome

- CI/CD config พร้อมใช้งาน
- Code ผ่าน local verify และ cloud verify
- Code ถูก commit และ push ไปยัง remote
- Failure จาก cloud ถูกแก้ไขจนผ่าน หรือ report สถานะถ้าเกิน loop limit
- Release/deploy เกิดขึ้นเฉพาะเมื่อมี config และผ่าน verify ทั้งหมด
- มีรายงานผล ship บน cloud ครบถ้วน
