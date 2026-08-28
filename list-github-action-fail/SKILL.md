---
name: list-github-action-fail
description: ดู GitHub Actions workflow runs ทีล้มเหลวทั้ง personal และ org repos
related:
  - watch-github-actions
  - list-github-repo
  - report-table
  - suggest-next-action
---

## Goal

สรุป GitHub Actions workflow runs ที conclusion=failure หรือ status ล้มเหลว ทั้งหมดที user เข้าถึงบน GitHub

## Scope

ใช้สำหรับตรวจสอบ CI/CD failures ทั่วทุก personal repositories และ organization repositories ที user เป็นสมาชิก โดยใช้ `gh` CLI

## Execute

### 1. Verify gh CLI

> Goal: ยืนยันว่า `gh` ติดตั้งและ authenticated

1. รัน `gh --version` เพื่อตรวจสอบการติดตั้ง
2. รัน `gh auth status` เพื่อตรวจสอบ authentication
3. ถ้าไม่ authenticated → ทำ `/ask-me` เพื่อให้ user รัน `gh auth login`
4. ถ้าพร้อม → บันทึก username

### 2. List Personal Repos

> Goal: รวบรวม repositories ของ user

1. รัน `gh repo list --json nameWithOwner,updatedAt --limit 100`
2. ถ้ามีมากกว่า 100 ให้ paginate ด้วย `--page`
3. บันทึกรายการ repo names

### 3. List Organization Repos

> Goal: รวบรวม repositories ของ organizations ที user เป็นสมาชิก

1. รัน `gh org list` หรือ `gh api user/orgs --jq '.[].login'`
2. สำหรับแต่ละ org รัน `gh repo list <org> --json nameWithOwner,updatedAt --limit 100`
3. บันทึกรายการ repo names

### 4. Query Failed Runs Per Repo

> Goal: หา workflow runs ทีล้มเหลวในแต่ละ repo

1. สำหรับแต่ละ `owner/repo` รัน:
   `gh run list --repo <owner/repo> --json databaseId,name,headBranch,headSha,status,conclusion,event,startedAt,displayTitle,url --limit 20 --jq '.[] | select(.conclusion=="failure")'`
2. ถ้าบาง repo ไม่มี GitHub Actions หรือไม่มี failure → ข้าม
3. บันทึก failed runs ทั้งหมด

### 5. Aggregate And Build Report

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

### 6. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป

1. ทำ `/suggest-next-action` เพื่อแนะนำ fix workflow, view logs, หรือ `watch-github-actions`

## Rules

### 1. Read Only

- ไม่ re-run, cancel, delete workflow run ใดๆ
- ไม่ push code หรือแก้ไข repo

### 2. Rate Limit And Scope

- ถ้า repo จำนวนมาก → จำกัดเฉพาะ repos ทีอัปเดตล่าสุด หรือกรองตาม argument
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
