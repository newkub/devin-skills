---
name: list-cicd-fails
description: สรุป CI/CD workflow runs ทีล้มเหลวใน repo ปัจจุบันหรือทีระบุ
argument-hint: "[workflow-or-limit]"
related:
  - resolve-cicd
  - delete-cicd-fails
  - list-github-actions-fails
  - list-deployment-fails
  - watch-github-actions
  - list-ci-configs
  - report-table
  - suggest-next-action
---

## Goal

สรุป CI/CD workflow runs ที conclusion เป้น failure ใน repo ปัจจุบันหรือ repo/workflow ทีระบุ

## Scope

ใช้สำหรับตรวจสอบ failed CI/CD runs โดยไม่แก้ไข ไม่ re-run และไม่ delete อะไร

## Execute

### 1. Verify Target

> Goal: ระบุ repo และ workflow ทีต้องตรวจ

1. รัน `gh auth status` เพื่อตรวจสอบ authentication
2. ถ้าไม่ authenticated → ทำ `/ask-me` ให้ user รัน `gh auth login`
3. ถ้ามี argument → ถือว่าเป้น `<workflow-name>` หรือ `<limit>`
4. ถ้าไม่มี argument → ใช้ repo ปัจจุบัน

### 2. Query Failed Runs

> Goal: ดึง failed runs

1. สร้าง base command:
   - `gh run list --status failure --json databaseId,name,headBranch,headSha,event,conclusion,displayTitle,createdAt,url --limit 50`
2. ถ้ามี `<workflow-name>` → เติม `--workflow <workflow-name>`
3. ถ้ามี `<limit>` → แทนที `--limit <limit>`
4. รัน command และบันทึกผล

### 3. Build Report

> Goal: สรุปผลเป้นตาราง

1. ใช้ `/report-table` คอลัมน์:
   - No.
   - Run ID
   - Workflow
   - Branch
   - Event
   - Conclusion
   - Created At
   - URL
2. เรียงตาม Created At ล่าสุด
3. ระบุจำนวน failed runs ทั้งหมด

### 4. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป

1. ถ้ามี failed runs → แนะนำ `/resolve-cicd`, `/watch-github-actions` หรือ `/delete-cicd-fails`
2. ถ้าไม่มี → รายงานว่าไม่มี failures

## Rules

### 1. Read Only

- ไม่ re-run, cancel, delete workflow run ใดๆ
- ไม่ push code หรือแก้ไข repo

### 2. Default Scope

- ถ้าไม่ระบุ repo → ใช้ repo ปัจจุบัน
- ถ้าต้องการ repo อื่น → ใช้ `--repo <owner/repo>`

### 3. Rate Limit

- ถ้า repo มากหรือข้อมูลเยอะ → ใช้ pagination หรือ `limit`
- ถ้า `gh` ถูก rate limit → รอและ retry

## Expected Outcome

- รายการ failed CI/CD runs ที sort ตามเวลาเกิดล่าสุด
- ตารางทีมี Run ID, workflow, branch, event, conclusion, created at, url
- ไม่มีการแก้ไข repo หรือ workflow ใดๆ
