---
name: list-github-actions-fails
description: สรุป GitHub Actions runs ทีล้มเหลว — repo ปัจจุบัน/--repo หรือทั้ง account ด้วย --all
argument-hint: "[--repo <owner/repo> | --all] [limit]"
related:
  - list-ci-configs
  - watch-github-actions
  - list-github-repo
  - resolve-github-actions-fails
  - list-deployment-fails
  - report-table
  - suggest-next-action
  - ask-me

---

## Goal

สรุป GitHub Actions workflow runs ที conclusion=failure หรือ status ล้มเหลว ทั้งหมดที user เข้าถึงบน GitHub

## Scope

ใช้สำหรับตรวจสอบ CI/CD failures โดยใช้ `gh` CLI โดยไม่แก้ไข repo หรือ workflow — รองรับ 2 modes:

- repo-scoped (default ถ้าอยู่ใน git repo): ตรวจ repo ปัจจุบันหรือ `--repo <owner/repo>`
- account-wide: ระบุ `--all` เพื่อตรวจทุก personal และ org repositories ที user เป็นสมาชิก

ดูเพิ่มเติม: /list-ci-configs, /list-github-repo, /list-deployment-fails

## Execute

### 1. Verify gh CLI

> Goal: ยืนยันว่า `gh` ติดตั้งและ authenticated

1. รัน `gh --version` เพื่อตรวจสอบการติดตั้ง
2. รัน `gh auth status` เพื่อตรวจสอบ authentication
3. ถ้าไม่ authenticated → ทำ `/ask-me` เพื่อให้ user รัน `gh auth login`
4. ถ้าพร้อม → บันทึก username

### 2. Detect Mode And List Repos

> Goal: เลือก scope — repo เดียวหรือทั้ง account

1. ถ้ามี `--repo <owner/repo>` → repo-scoped กับ repo นั้น
2. ถ้าไม่มี `--all` และอยู่ใน git repo → repo-scoped กับ repo ปัจจุบัน (`gh repo view --json nameWithOwner` หรือ `git remote -v`)
3. ถ้ามี `--all` หรือไม่อยู่ใน git repo → account-wide:
   - รัน `gh repo list --json nameWithOwner,updatedAt --limit 100`
   - รัน `gh org list` หรือ `gh api user/orgs --jq '.[].login'`
   - สำหรับแต่ละ org รัน `gh repo list <org> --json nameWithOwner,updatedAt --limit 100`
   - ข้าม archived repositories โดย default
4. บันทึกรายการ repo names ทีต้องตรวจ

### 3. Query Failed Runs

> Goal: หา workflow runs ทีล้มเหลวในแต่ละ repo

1. สำหรับแต่ละ `owner/repo` รัน:
   `gh run list --repo <owner/repo> --json databaseId,name,headBranch,headSha,status,conclusion,event,startedAt,displayTitle,url --limit 20 --jq '.[] | select(.conclusion=="failure")'`
2. ถ้าบาง repo ไม่มี GitHub Actions หรือไม่มี failure → ข้าม
3. บันทึก failed runs ทั้งหมด

### 4. Aggregate And Build Report

> Goal: สรุปผลเป็นตาราง

1. รวม failed runs จากทุก repo
2. ใช้ `/report-table` คอลัมน์:
   - No.
   - Repo
   - Workflow
   - Branch
   - Commit
   - Event
   - Started At
   - URL
3. เรียงตาม Started At ล่าสุด
4. ระบุสรุปจำนวน repos ทีมี failure และจำนวน failed runs

### 5. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป

1. ทำ `/suggest-next-action` เพื่อแนะนำ fix workflow, view logs, `watch-github-actions` หรือ `resolve-github-actions-fails`

## Rules

### 1. Read Only

- ไม่ re-run, cancel, delete workflow run ใดๆ
- ไม่ push code หรือแก้ไข repo

### 2. Rate Limit And Scope

- ถ้า repo จำนวนมาก → จำกัดเฉพาะ repos ทีอัปเดตล่าสุด หรือกรองตาม `limit`
- ใช้ pagination ตาม `--limit` และ `--page`
- ถ้า `gh` ถูก rate limit → รอและ retry ตาม header หรือ report

### 3. Skip Archived

- ข้าม archived repositories โดย default
- ถ้าต้องการรวม archived ให้ user ระบุ

### 4. Privacy

- รองรับ public/private repositories ตามสิทธิ์ของ `gh` token
- ไม่ expose secrets หรือ tokens ใน output

## Expected Outcome

- รายการ GitHub Actions runs ทีล้มเหลวทั่ว personal/org repos
- ตารางที sort ตามวันที failure เกิด
- ข้อมูล repo, workflow, branch, commit, event, url พร้อม
- ไม่มีการแก้ไข repo หรือ workflow ใดๆ

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: list-github-action-fail, list-cicd-fails)
