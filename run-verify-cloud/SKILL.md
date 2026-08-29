---
name: run-verify-cloud
description: Push branch ไปยัง remote และรัน verify บน CI/CD แล้วรายงานผล
related:
  - ship-cloud
  - setup-ci-cd
  - watch-ci-cd
  - watch-github-actions
  - git-push
  - git-commit-and-push
  - report-table
  - suggest-next-action
  - resolve-errors
---

## Goal

Push branch ไปยัง remote แล้วรัน verify บน CI/CD pipeline จากนั้นเก็บ logs และรายงานผล

## Scope

ใช้เมื่อต้องการ verify code บน environment จริงของ CI/CD โดยไม่ต้อง merge, release หรือ deploy
ครอบคลุม GitHub Actions, GitLab CI, Azure DevOps, CircleCI, Jenkins, Cloudflare Pages, Vercel

ถ้าต้องการ commit/push/fix/release/deploy ทั่วทั้ง flow ให้ใช้ `/ship-cloud`

## Execute

### 1. Pre-flight

> Goal: ยืนยันว่าพร้อม push และ verify บน cloud

1. ทำ `git branch --show-current`, `git status`, และ `git log origin/<branch>..HEAD`
2. ถ้าไม่มี remote → stop และ report ให้ตั้งค่า remote หรือใช้ `/git-push`
3. ถ้า working tree มี uncommitted changes → stop และ report ให้ commit ก่อนหรือใช้ `/ship-cloud`
4. ถ้าไม่มี commits ทียังไม่ได้ push → ทำ `/git-push` แล้วไปขั้นตอนถัดไป

### 2. Detect CI/CD Platform

> Goal: ระบุ platform และตรวจสอบ CI/CD config

1. ค้นหา config files: `.github/workflows/*.{yml,yaml}`, `.gitlab-ci.yml`, `azure-pipelines.yml`, `.circleci/config.yml`, `Jenkinsfile`, `wrangler.toml`, `vercel.json`
2. ถ้าไม่พบ CI/CD config → stop และ report ให้ใช้ `/setup-ci-cd` หรือ `/ship-cloud` ก่อน
3. ถ้าพบหลาย platform → เรียงตามลำดับ: GitHub Actions → GitLab CI → Azure DevOps → CircleCI → Jenkins → Cloudflare → Vercel

### 3. Push And Trigger

> Goal: Push แล้วรอ pipeline ปรากฏ

1. ทำ `/git-push` เพื่อ push unpushed commits ไปยัง remote
2. ถ้า push ถูก reject → stop และ report โดยไม่ force push
3. รอ pipeline run ปรากฏ โดย polling ผ่าน CLI ของ platform (เช่น `gh run list --limit 5`) สูงสุด 60 วินาที
4. ถ้าไม่มี run ปรากฏ → stop และ report

### 4. Watch Pipeline

> Goal: ติดตาม pipeline จนจบ

1. ถ้าเป็น GitHub Actions → ทำ `/watch-github-actions`
2. ถ้าเป็น platform อื่น → ทำ `/watch-ci-cd`
3. ถ้า pipeline ผ่าน → ไปขั้นตอน Report
4. ถ้า pipeline ล้มเหลว → ไปขั้นตอน Analyze

### 5. Analyze Failure

> Goal: เก็บ logs และ root cause แต่ไม่แก้ไข

1. ดึง logs ที่ failed จาก platform CLI (เช่น `gh run view <run-id> --log-failed`)
2. จำแนก failure: lint, typecheck, test, build, dependency, auth, timeout, missing secret
3. บันทึก root cause, file path, line number ถ้ามี
4. ถ้า root cause ไม่ชัด → ทำ `/deep-review` หรือ `/ask-me`

### 6. Report

> Goal: รายงานผล verify บน cloud

1. ใช้ `/report-table` สรุป: platform, run ID, status, duration, root cause, action
2. ถ้า fail → ชี้ไปยัง `/resolve-errors` หรือ `/ship-cloud` เพื่อแก้ไข
3. ทำ `/suggest-next-action`

## Rules

### 1. Verify Only

- `run-verify-cloud` ทำเฉพาะ push branch และ verify บน CI
- ไม่ commit, ไม่ merge, ไม่ release, ไม่ deploy
- ถ้าต้องการ full ship flow ให้ใช้ `/ship-cloud`

### 2. No Auto Fix

- ไม่แก้ source หรือ test โดยอัตโนมัติ
- ถ้า fail → report root cause และส่งต่อไป `/resolve-errors` หรือ `/ship-cloud`
- ถ้าต้องการ fix loop บน cloud ให้ใช้ `/ship-cloud`

### 3. Safety

- ไม่ force push
- ไม่ push secrets
- ไม่ push ถ้า working tree ไม่สะอาด
- บันทึก SHA ก่อน push
- ถ้า CI/CD config ไม่มี → stop ให้ setup ก่อน

### 4. Platform CLI

- ยืนยันว่า CLI ของ platform ติดตั้งและ authenticate ก่อนรัน
- ถ้าไม่พร้อม → stop และ report

## Expected Outcome

- Branch ถูก push ไปยัง remote สำเร็จ
- CI/CD pipeline ถูก trigger และติดตามจนจบ
- มีรายงานผล verify บน cloud ชัดเจน
- ไม่มีการแก้ไข code โดยอัตโนมัติ
- ถ้า fail → มี root cause และ next action ชัดเจน
