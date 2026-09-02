---
name: resolve-cicd
argument-hint: "[run-id-or-url-or-target]"
description: ติดตาม CI/CD pipeline จาก trigger จนผ่าน/live/healthy พร้อม resolve re-run re-deploy และลบ failed runs
related:
  - list-cicd-fails
  - delete-cicd-fails
  - watch-github-actions
  - watch-deploy
  - watch-release
  - list-ci-configs
  - run-deploy
  - run-release
  - deploy-to-cloudflare
  - deploy-to-vercel
  - deploy-to-railway
  - resolve-errors
  - report-table
  - suggest-next-action
---

## Usage

เรียก skill โดย `/resolve-cicd [run-id|url]` หรือรันด้วย helper script:

```bash
bun "%APPDATA%\devin\skills\resolve-cicd\scripts\resolve-cicd.ts" \
  [--run-id <id> | --url <url>] \
  [--max-retries 5] \
  [--no-retry]
```

- helper รองรับ GitHub Actions (CI) แบบเต็มรูปแบบ
- CD mode จะส่งต่อให้ `/watch-deploy`, `/watch-release` ตาม target

## Goal

ติดตาม CI/CD pipeline หลังจากถูก trigger ตรวจสอบวาผ่าน, live/healthy, หรือ release สำเร็จ ถ้าไม่ผ่านให้ resolve และ re-run/re-deploy จนกว่าจะผ่าน

## Scope

ใช้หลังจาก:
- push code
- `/run-deploy`, `/deploy-to-*`, `/ship`, `/run-release`
- หรือเมื่อได้รับ `run-id` หรือ `url-or-target` จาก argument

ครอบคลุม:
- CI: GitHub Actions, GitLab CI, Azure DevOps, CircleCI, Jenkins
- CD: Cloudflare Pages, Vercel, Railway, Render, Fly.io, Netlify, custom domain, release/tag

สำหรับ CI platform เฉพาะจะส่งต่อ `/watch-github-actions`
สำหรับ CD platform เฉพาะจะส่งต่อ `/watch-release`, `/watch-deploy`

ไม่รวม trigger ครั้งแรก — ต้องถูก trigger โดย `/run-deploy`, `/deploy-to-*`, `/run-release` หรือ push ก่อน

## Execute

### 1. Detect CICD Mode

> Goal: ระบุวาเป้น CI หรือ CD

1. ถ้าได้รับ `run-id` จาก argument → เป้น CI
2. ถ้าได้รับ `url-or-target` จาก argument → เป้น CD
3. ถ้าไม่มี argument → ค้นหาจาก:
   - environment variable `DEPLOY_URL`, `PREVIEW_URL`, `VERCEL_URL`, `CF_PAGES_URL`
   - CI/CD log ล่าสุดทีมี run ID หรือ URL
   - `references/targets.md` ใน `watch-deploy`
   - `references/runs.md` ใน `resolve-cicd`
4. ถ้ายังไม่ชัด → ทำ `/ask-me`

### 2. CI: Detect CI Platform

> Goal: ระบุ CI platform

1. ทำ `/list-ci-configs` เพื่อรายการ CI config files
2. เรียงตามลำดับ: GitHub Actions → GitLab CI → Azure DevOps → CircleCI → Jenkins
3. ถ้าไม่พบ config → ทำ `/review-delivery`, `/review-config`, `/review-test` หรือ `/ask-me`

### 3. CI: Verify CLI And Identify Run

> Goal: เตรียม CLI และ run ID

1. ตรวจ CLI: `gh`, `glab`, `az`, `circleci`, `jenkins-cli`
2. ถ้า `run-id` มาจาก argument → ใช้ค่านั้น
3. ถ้าไม่มี → หา run ล่าสุด:
   - GitHub Actions: `gh run list --limit 5`
   - GitLab CI: `glab pipeline list --limit 5`
   - Azure DevOps: `az pipelines runs list --top 5`
   - CircleCI: `circleci pipeline list`
   - Jenkins: latest build API
4. ถ้าไม่มี active run → report และ stop

### 4. CI: Watch Pipeline

> Goal: ติดตาม CI จนสิ้นสุด

1. ถ้า GitHub Actions → ทำ `/watch-github-actions [run-id]` แล้ว return ผล
2. GitLab CI: `glab pipeline trace <pipeline-id>`
3. Azure DevOps: `az pipelines runs show --id <run-id>` poll ทุก 10 วิ
4. CircleCI: poll API
5. Jenkins: poll build status
6. ถ้า pass → ไป Report
7. ถ้า fail, cancel, timeout → ไป Resolve

### 5. CD: Detect CD Target

> Goal: ระบุ deployment target และ URL

1. ใช้ `url-or-target` จาก argument ถ้ามี
2. ถ้าไม่มี → ค้นหาจาก env, deploy output, CI/CD log, `references/targets.md`
3. ถ้ายังไม่ชัด → ทำ `/ask-me`

### 6. CD: Determine Platform

> Goal: เลือก skill ทีเหมาะกับ CD target

1. Cloudflare Pages: URL มี `.pages.dev` หรือ `wrangler` ใน output → ดำเนินการใน skill นี้ (`/resolve-cicd`)
2. Release/tag: version tag, release name, GitHub release → `/watch-release`
3. Generic URL: Railway, Render, Fly.io, Netlify, custom domain → `/watch-deploy`

### 7. CD: Watch Until Healthy

> Goal: ติดตาม deployment จน live หรือ release สำเร็จ

1. เรียก skill ตาม platform
2. ถ้า success → ไป Report
3. ถ้า fail, timeout, unhealthy → ไป Resolve

### 8. Resolve And Retry

> Goal: แก้ไขปัญหาแล้ว trigger ใหม่

1. บันทึก `LAST_GREEN_SHA` ด้วย `git rev-parse HEAD` ถ้ายังไม่มี
2. ทำ `/resolve-errors` วิเคราะห์ logs, errors, config
3. ถ้า failure มาจาก code/config → แก้ไขน้อยทีสุด
4. ถ้า failure มาจาก workflow/CI setup → ทำ `/follow-tool-github-actions`, `/review-delivery`, `/review-config`, `/review-test` ตามลักษณะ
5. ถ้า failure มาจาก infra/secret/platform → ทำ `/review-deploy`, `/follow-secret-manager`, `/setup-cicd` ตามลักษณะ
6. ถ้าเป้น CI: commit/push หรือ re-trigger pipeline ตาม platform กลับไป Watch Pipeline
7. ถ้าเป้น CD: re-deploy ตาม platform:
   - Cloudflare → `/deploy-to-cloudflare`
   - Vercel → `/deploy-to-vercel`
   - Railway → `/deploy-to-railway` หรือ `/run-deploy`
   - Generic → `/run-deploy`
   - Release → `/run-release`
8. ถ้า re-run/re-deploy ไม่ได้ → stop และ report
9. กลับไป Watch Pipeline หรือ Watch Until Healthy
10. วนซ้ำสูงสุด 5 รอบ ถ้าเกิน → stop และ report

### 9. Report Result

> Goal: สรุปผล CI/CD

1. ถ้า success/healthy/release สำเร็จ → report platform, target, duration, status
2. ถ้าไม่ผ่าน → report failures ทีเหลือ, root cause, last green SHA, next step
3. ใช้ `/report-table` ด้วยคอลัมน์: No., Mode, Platform, Target, Status, Duration, Root Cause, Action
4. ทำ `/list-cicd-fails` เพื่อดู failures ทีค้างใน repo
5. ถ้า user ต้องการ cleanup → ทำ `/delete-cicd-fails` ก่อน next step
6. ทำ `/suggest-next-action`

## Rules

### 1. Mode Detection

- ถ้า argument เป็น run ID หรือมี CI config → เป้น CI
- ถ้า argument เป็น URL, version, หรือ deploy output → เป้น CD
- ถ้าไม่ชัด → ใช้ `/ask-me`

### 2. Platform Detection

- ตรวจหา CI/CD config หรือ URL pattern ก่อนเดา
- ถ้าไม่ชัด → ใช้ generic polling
- ถ้าเป็น release อย่างเดียว → ใช้ `/watch-release`

### 3. No Initial Deploy

- `resolve-cicd` ไม่ trigger ครั้งแรกเอง
- ต้องถูกเรียกหลัง trigger แล้ว
- ถ้ายังไม่มี trigger ให้ทำ `/run-deploy` หรือ push ก่อน

### 4. Resolve And Retry

- วน loop จนผ่านหรือถึงขีดจำกัด
- สูงสุด 5 รอบ ถ้าเกิน → stop และ report
- ถ้า failure เดิมซ้ำ 3 ครั้งขึ้นไป → circuit breaker, แนะนำ rollback

### 5. Safety

- บันทึก `LAST_GREEN_SHA` ก่อนแก้ไขทุกรอบ
- ถ้า fix สร้าง failure ใหม่หลัง 3 รอบ → แนะนำ revert กลับไป last green SHA
- ห้าม force-push หรือ rewrite history
- ห้าม re-run/re-deploy ซ้ำแบบไร้เงื่อนไข

### 6. Rollback Recommendation

- ถ้า timeout หรือไม่ผ่านหลัง 5 รอบ → แนะนำ rollback command ตาม platform
- ไม่ rollback อัตโนมัติ รอ user ตัดสินใจ
- ระบุ platform-specific rollback จาก `watch-deploy/references/targets.md`

### 7. Timeout

- `perRoundTimeout` = 300 วินาที สำหรับ resolve + re-run/re-deploy
- `ciWatchTimeout` = 900 วินาที สำหรับ pipeline ที่นาน
- `cdWatchTimeout` = 600 วินาที สำหรับ deployment ที่ช้า
- ถ้าเกิน timeout → stop และ report

### 8. Partial Commit

- ก่อน push fix ให้ stage เฉพาะไฟล์ที่เกี่ยวข้องกับ root cause
- ไม่ commit/push ไฟล์อื่นที่ไม่เกี่ยวข้อง

## Expected Outcome

- CI pipeline ผ่าน หรือ CD live/healthy หรือ release สำเร็จ
- รายงาน `/report-table` สมบูรณ์
- ระบุ next step ผ่าน `/suggest-next-action`
- ไม่มี auto-rollback โดยไม่แจ้ง user
- ถ้าไม่ผ่าน มี last green SHA และ rollback recommendation ชัดเจน