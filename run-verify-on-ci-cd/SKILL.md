---
name: run-verify-on-ci-cd
description: Push branch ไปยัง remote และรัน verify แบบครบวงจรบน CI/CD แล้วรายงานผล
related:
  - ship-to-cloud
  - ship-release
  - setup-ci-cd
  - run-verify-on-local
  - run-test-all
  - run-build
  - watch-ci-cd
  - watch-github-actions
  - git-push
  - report-table
  - suggest-next-action
  - resolve-errors
---

## Goal

Push branch ปัจจุบันไปยัง remote แล้วรัน verify แบบครบวงจรบน CI/CD pipeline

## Scope

ใช้เมื่อต้องการ verify code บน environment จริงของ CI/CD โดยไม่ต้อง merge, release หรือ deploy
CI/CD จะรัน setup, scan, lint, typecheck, test ทุกประเภท, build และ deploy ไป staging ตาม config

ถ้าต้องการ commit/push/fix บน cloud ให้ใช้ `/ship-to-cloud`
ถ้าต้องการ full ship flow รวม release/deploy ให้ใช้ `/ship-release`

## Execute

### 1. Pre-flight

> Goal: ยืนยันว่าพร้อม push และ verify บน CI

1. ทำ `git branch --show-current`, `git status`, `git log origin/<branch>..HEAD`
2. ถ้าไม่มี remote → stop และ report
3. ถ้า working tree มี uncommitted changes → stop และ report ให้ทำ `/ship` ก่อน
4. ถ้าไม่มี commits ที่ยังไม่ push → report

### 2. Detect CI/CD Platform

> Goal: ระบุ platform และตรวจสอบ CI/CD config

1. ค้นหา config files: `.github/workflows/*.{yml,yaml}`, `.gitlab-ci.yml`, `azure-pipelines.yml`, `.circleci/config.yml`, `Jenkinsfile`, `wrangler.toml`, `vercel.json`
2. ถ้าไม่พบ CI/CD config → stop และ report ให้ใช้ `/setup-ci-cd` ก่อน
3. ถ้าพบหลาย platform → เรียงตามลำดับ: GitHub Actions → GitLab CI → Azure DevOps → CircleCI → Jenkins → Cloudflare → Vercel

### 3. Push And Trigger

> Goal: Push แล้วรอ pipeline ปรากฏ

1. ทำ `/git-push`
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

> Goal: รายงานผล verify บน CI

1. ใช้ `/report-table` สรุป: platform, run ID, status, duration, root cause, action
2. ถ้า fail → ชี้ไปยัง `/resolve-errors` หรือ `/ship-to-cloud`
3. ทำ `/suggest-next-action`

## Rules

### 1. Verify Only

- `run-verify-on-ci-cd` ทำเฉพาะ push branch และ verify บน CI
- ไม่ commit, ไม่ merge, ไม่ release, ไม่ deploy
- setup ทั้งหมดรันบน CI ไม่ใช่ locally

### 2. No Auto Fix

- ไม่แก้ source หรือ test โดยอัตโนมัติ
- ถ้า fail → report root cause และส่งต่อไป `/resolve-errors` หรือ `/ship-to-cloud`

### 3. Safety

- ไม่ force push
- ไม่ push secrets
- ไม่ push ถ้า working tree ไม่สะอาด
- บันทึก SHA ก่อน push

### 4. Platform CLI

- ยืนยันว่า CLI ของ platform ติดตั้งและ authenticate ก่อนรัน
- ถ้าไม่พร้อม → stop และ report

### 5. CI Runs Full Suite

- CI workflow ต้องรัน scan, lint, typecheck, test ทุกประเภท, build และ staging deploy ตาม config
- ถ้า CI config ไม่รัน full suite ให้ใช้ `/setup-ci-cd` เพื่ออัปเดต workflow

## Expected Outcome

- Branch ถูก push ไปยัง remote สำเร็จ
- CI/CD pipeline ถูก trigger และติดตามจนจบ
- มีรายงานผล verify บน CI/CD ชัดเจน
- ถ้า fail → มี root cause และ next action ชัดเจน
