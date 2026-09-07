---
name: resolve-cicd
argument-hint: "[--repo <owner/repo> | --run-id <id> | --url <url>]"
description: ติดตามและแก้ไข CI/CD pipeline สำหรับ repo ปัจจุบัน หรือ single run/URL ทีระบุ
related:
  - resolve-github-actions-fails
  - resolve-cloudflare-worker-fails
  - resolve-all-cloudflare-fails
  - search-project-in-drive-d
  - report-table
  - suggest-next-action
  - ask-me
---

## Usage

เรียก skill โดย `/resolve-cicd` ใน repo ปัจจุบันเพื่อ resolve repo-scoped CI/CD หรือระบุ:

- `/resolve-cicd --repo <owner/repo>`
- `/resolve-cicd --run-id <id>`
- `/resolve-cicd --url <url>`

สำหรับ single run ยังสามารถใช้ helper script:

```bash
bun "%APPDATA%\devin\skills\resolve-cicd\scripts\resolve-cicd.ts" \
  [--run-id <id> | --url <url>] \
  [--max-retries 5] \
  [--no-retry]
```

## Goal

ติดตามและแก้ไข CI/CD failures สำหรับ project/repo ทีระบุ หรือ single run/URL จนผ่าน/live/healthy

## Scope

- โหมด repo-scoped: resolve GitHub Actions และ Cloudflare Workers/Pages ทีตรงกับ repo
- โหมด single run: ติดตาม CI/CD pipeline หลัง trigger ด้วย run ID หรือ URL
- ไม่ trigger ครั้งแรกเอง

## Execute

### 1. Detect Mode

> Goal: ระบุวา resolve ทั้ง repo หรือ single run
1. ถ้ามี `--repo` หรือไม่มี argument แต่อยู่ใน git repo → repo-scoped
2. ถ้ามี `--run-id` หรือ `--url` → single-run
3. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Repo-Scoped Resolve

> Goal: แก้ไข CI/CD ของ repo
1. อ่านรายละเอียดจาก `references/repo-resolve.md`
2. เรียก `/resolve-github-actions-fails --repo <owner/repo>`
3. หา worker ทีตรงกับ repo name แล้วเรียก `/resolve-cloudflare-worker-fails --worker <worker>`
4. หรือหา Cloudflare Pages project แล้วเรียก `/resolve-all-cloudflare-fails --project <project>`
5. สรุปผลด้วย `/report-table`

### 3. Single-Run Resolve

> Goal: ติดตาม run ทีระบุ
1. อ่านรายละเอียดจาก `references/single-run.md`
2. ใช้ helper script `scripts/resolve-cicd.ts` หรือทำตามขั้นตอนใน reference
3. ถ้า fail → `/resolve-github-actions-fails` สำหรับ CI หรือ `/resolve-cloudflare-worker-fails` สำหรับ CD
4. สรุปผลด้วย `/report-table`

### 4. Report

> Goal: สรุปผลและ next step
1. ใช้ `/report-table` คอลัมน์: No., Mode, Repo/Run, CI Status, CD Status, Action Taken, Notes
2. ทำ `/suggest-next-action`

## Rules

### 1. Mode Priority
- repo-scoped เป้น default ถ้าอยู่ใน git repo
- single-run ถ้าระบุ `--run-id` หรือ `--url`

### 2. Repo Matching
- resolve เฉพาะ project/repo ทีตรงกับ repo ทีระบุ
- ใช้ `/search-project-in-drive-d` หา local project เมื่องานต้อง fix code

### 3. Safety
- ถาม user ก่อน rerun/deploy ถ้ากระทบ production
- ไม่ push/merge หรือ deploy อัตโนมัติ
- บันทึก `LAST_GREEN_SHA` ก่อนแก้ไข

### 4. Retry
- สูงสุด 5 รอบสำหรับ single-run
- สูงสุด 3 รอบต่อ worker สำหรับ repo-scoped
- ถ้า failure เดิมซ้ำ 3 ครั้ง → แนะนำ rollback

### 5. Timeout
- `perRoundTimeout` = 300 วินาที
- `ciWatchTimeout` = 900 วินาที
- `cdWatchTimeout` = 600 วินาที

## Expected Outcome

- Repo ทีระบุมี CI/CD ผ่าน หรือแต่ละ run/URL live/healthy
- รายงาน `/report-table` สมบูรณ์
- ระบุ next step ผ่าน `/suggest-next-action`
- ไม่มี auto-rollback โดยไม่แจ้ง user
