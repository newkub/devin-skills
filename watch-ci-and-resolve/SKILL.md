---
name: watch-ci-and-resolve
argument-hint: "[run-id]"
description: ติดตาม CI pipeline ทุก platform จนผ่าน และแก้ไข failures
related:
  - watch-github-actions
  - watch-build
  - watch-test
  - watch-lint
  - follow-tool-github-actions
  - review-delivery
  - review-config
  - review-deploy
  - review-test
  - resolve-errors
  - run-check
  - report-table
  - review-stability
  - suggest-next-action
---

## Goal

ติดตามสถานะ CI pipeline ตรวจจับ failures และแก้ไขจนกว่าจะผ่าน

## Scope

ใช้หลัง push code หรือเมื่อได้รับ `run-id` จาก argument ครอบคลุม GitHub Actions, GitLab CI, Azure DevOps, CircleCI, Jenkins ผ่าน CLI หรือ API

สำหรับ GitHub Actions จะส่งต่อไป `/watch-github-actions` โดยตรงเพื่อไม่ซ้ำซ้อนกับ skill นั้น

ไม่ครอบคลุม CD/deployment (เช่น Cloudflare, Vercel, release) — ใช้ `/watch-cd-and-resolve`
ไม่ครอบคลุม: การรัน local build/test watch mode เป็นระยะเวลานาน — ใช้ `/watch-build` หรือ `/watch-test` แทน

## Execute

### 1. Detect CI Platform

> Goal: ระบุ CI platform ของ repository ปัจจุบัน

1. ค้นหา config files:
   - GitHub Actions: `.github/workflows/*.yml`, `.github/workflows/*.yaml`
   - GitLab CI: `.gitlab-ci.yml`
   - Azure DevOps: `azure-pipelines.yml`
   - CircleCI: `.circleci/config.yml`
   - Jenkins: `Jenkinsfile`
2. ถ้าพบหลาย platform เลือกตามลำดับ: GitHub Actions → GitLab CI → Azure DevOps → CircleCI → Jenkins
3. ถ้าไม่พบ CI config → ทำ `/ask-me` ถาม user หรือ `/review-delivery`, `/review-config`, `/review-deploy`, `/review-test` เพื่อตรวจสอบ

### 2. Verify Required CLI

> Goal: ยืนยันว่า CLI ของ platform ติดตั้งและ authenticate

1. GitHub Actions: รัน `gh --version` และ `gh auth status`
2. GitLab CI: รัน `glab --version` และ `glab auth status`
3. Azure DevOps: รัน `az --version` และ `az account show`
4. CircleCI: รัน `circleci --version`
5. Jenkins: ตรวจหา `jenkins-cli` หรือ Jenkins URL ที่ตั้งค่าไว้
6. ถ้า CLI ไม่พร้อมหรือไม่ authenticate → stop และ report สิ่งที่ต้อง install หรือ login

### 3. Identify Latest Run

> Goal: หา CI run ล่าสุดที่จะติดตาม

1. ถ้าได้รับ `run-id` จาก argument → ใช้ค่านั้น
2. GitHub Actions: `gh run list --limit 5`
3. GitLab CI: `glab pipeline list --limit 5`
4. Azure DevOps: `az pipelines runs list --top 5`
5. CircleCI: `circleci pipeline list` หรือ API call
6. Jenkins: query latest build ผ่าน Jenkins API
7. ถ้าไม่มี active run → report และจบ task

### 4. Watch Pipeline Until Complete

> Goal: ติดตาม CI pipeline จนกว่าจะสิ้นสุด

1. ถ้าเป็น GitHub Actions → รัน `/watch-github-actions [run-id]` แล้ว return ผล
2. GitLab CI: `glab pipeline trace <pipeline-id>`
3. Azure DevOps: `az pipelines runs show --id <run-id>` และ poll ทุก 10 วินาที
4. CircleCI: `circleci workflow show` หรือ poll API
5. Jenkins: poll build status ผ่าน Jenkins API จนกว่าจะไม่ใช่ `building`
6. ถ้า pipeline ผ่าน → ไปขั้นตอน Report
7. ถ้า pipeline ล้มเหลว, ถูก cancel หรือ timeout → ไปขั้นตอน Analyze

### 5. Analyze Failure Logs

> Goal: ระบุ root cause ของ failure

1. GitHub Actions: `gh run view <run-id> --log-failed` หรือ `gh run view <run-id> --log`
2. GitLab CI: `glab pipeline logs <pipeline-id>`
3. Azure DevOps: `az pipelines runs show --id <run-id>` แล้วดู logs
4. CircleCI: `circleci job logs <job-number>`
5. Jenkins: ดึง console output ผ่าน `jenkins-cli` หรือ web UI
6. จัดกลุ่ม failure: syntax error, test failure, lint error, build error, dependency missing, timeout, auth error, missing secret
7. ถ้า failure มาจาก deploy step ของ CI/CD → บันทึก evidence แล้วส่งต่อ `/watch-cd-and-resolve`
8. บันทึก root cause และ file path, line number ถ้ามี

### 6. Fix And Re-trigger

> Goal: แก้ไข failure แล้ว trigger pipeline ใหม่

1. ทำ `/resolve-errors` ตาม root cause
2. ถ้า failure มาจาก workflow config หรือ CI setup → ทำ `/follow-tool-github-actions`, `/review-delivery`, `/review-config`, `/review-deploy` หรือ `/review-test` ตามลักษณะของ failure
3. ถ้า failure มาจาก code → ทำ `/watch-build`, `/watch-test` หรือ `/watch-lint`
4. ถ้า failure มาจาก deploy step → ส่งต่อ `/watch-cd-and-resolve`
5. แก้ไขน้อยที่สุด ไม่แตะ code ที่ไม่เกี่ยวข้อง
6. หลังแก้ไข: commit และ push หรือ re-trigger ตาม platform
7. กลับไปขั้นตอน 3 เพื่อติดตาม run ใหม่
8. วนซ้ำสูงสุด 5 รอบ ถ้าเกิน → stop และ report

### 7. Report Result

> Goal: สรุปผลของ CI pipeline

1. ถ้า pipeline ผ่าน → report platform, run ID, duration, final status
2. ถ้ายังไม่ผ่าน → report failures ที่เหลือ, root cause และ next step
3. ใช้ `/report-table` ด้วยคอลัมน์: No., Platform, Run ID, Status, Duration, Root Cause, Action
4. ทำ `/suggest-next-action` เพื่อแนะนำ next step

## Rules

### 1. Platform Detection

- ตรวจหา CI config files ก่อนเดา platform
- ถ้ามีหลาย platform ให้เรียงตามลำดับในขั้นตอน 1.2
- ถ้าไม่พบ → ใช้ `/ask-me` หรือ `/review-delivery`

### 2. CLI And Auth

- ยืนยัน CLI และ authentication ก่อน watch
- ถ้า CLI ไม่พร้อม → stop และ report ไม่ดำเนินการต่อ
- ห้าม hardcode secrets หรือ tokens ใน command

### 3. Loop Until Pass

- วน loop จนกว่า CI pipeline จะผ่านหรือถึงขีดจำกัดรอบ
- สูงสุด 5 รอบ ถ้าเกิน → stop และ report
- ถ้า failure เดิมเกิดซ้ำ 3 ครั้งขึ้นไป → หยุดเป็น circuit breaker

### 4. Fix Discipline

- แก้ที่ root cause ไม่ใช่ workaround
- ใช้ sub-skill ที่เหมาะสม: `/watch-build`, `/watch-test`, `/watch-lint`
- สำหรับ GitHub Actions ให้ใช้ `/watch-github-actions` แทนการ implement เอง
- ถ้า failure เกิดจาก deploy step ให้ส่งต่อ `/watch-cd-and-resolve`

### 5. Safety

- ก่อน push fix ให้บันทึก SHA ของ last green commit ด้วย `git rev-parse HEAD`
- ถ้า fix สร้าง failure ใหม่ใน pipeline ที่เคยผ่าน → revert ทันที
- ห้าม commit code ขณะที่ CI pipeline ยังไม่ผ่าน

### 6. Per-Round Timeout

- `perRoundTimeout` = 300 วินาที สำหรับ fix-and-retrigger
- `pipelineWatchTimeout` = 900 วินาที สำหรับ pipeline ทีนาน
- ถ้า pipeline ใช้เวลาเกิน timeout → stop และ report

### 7. Rollback Safety

- บันทึก last green SHA ก่อนแก้ไขแต่ละรอบ
- ถ้า fix สร้าง failure ใหม่หลัง 3 รอบ → `git revert` กลับไป last green SHA
- ห้าม force-push หรือ rewrite history โดยไม่มี dry run

### 8. Partial Commit And Push

- ก่อน push fix ให้ stage เฉพาะไฟล์ที่เกี่ยวข้องกับ root cause โดยใช้ `git add -p` หรือ `git add <path>`
- ไม่ commit/push ไฟล์อื่นที่ไม่เกี่ยวข้อง
- push ไป branch เดิม ไม่สร้าง PR ใหม่

## Expected Outcome

- CI pipeline ผ่านสำเร็จโดยไม่มี failure เหลือ
- รายงาน `/report-table` สมบูรณ์
- ระบุ next step ผ่าน `/suggest-next-action`
- ไม่มีการแก้ไข code ที่ไม่เกี่ยวข้องหรือ rewrite history
- ถ้า pipeline มี deploy step ทีล้มเหลว จะส่งต่อไป `/watch-cd-and-resolve` อย่างถูกต้อง
