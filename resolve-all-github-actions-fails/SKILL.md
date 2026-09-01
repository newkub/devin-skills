---
name: resolve-all-github-actions-fails
description: หาและ resolve GitHub Actions workflow runs ทีล้มเหลวทั้ง personal และ org repos
related:
  - list-github-action-fail
  - list-ci-configs
  - watch-github-actions
  - list-github-repo
  - resolve-errors
  - report-table
  - suggest-next-action
  - list-deployment-fails
  - ask-me
---

## Goal

List ทุก GitHub Actions workflow run ทีล้มเหลว แล้ว resolve ให้หมดใน scope ที user เข้าถึง

## Scope

ใช้สำหรับตรวจสอบและแก้ไข CI/CD failures ทั่วทุก personal repositories และ organization repositories ที user เป็นสมาชิก โดยใช้ `gh` CLI

## Execute

### 1. Verify gh CLI

> Goal: ยืนยันว่า `gh` ติดตั้งและ authenticated

1. รัน `gh --version` เพื่อตรวจสอบการติดตั้ง
2. รัน `gh auth status` เพื่อตรวจสอบ authentication
3. ถ้าไม่ authenticated → ทำ `/ask-me` เพื่อให้ user รัน `gh auth login`
4. ถ้าพร้อม → บันทึก username

### 2. List Repos

> Goal: รวบรวม repositories ทีต้องตรวจ

1. รัน `gh repo list --json nameWithOwner,updatedAt --limit 100`
2. รัน `gh org list` หรือ `gh api user/orgs --jq '.[].login'`
3. สำหรับแต่ละ org รัน `gh repo list <org> --json nameWithOwner,updatedAt --limit 100`
4. ข้าม archived repositories โดย default
5. บันทึกรายการ repo names

### 3. Query Failed Runs

> Goal: หา workflow runs ทีล้มเหลวในแต่ละ repo

1. สำหรับแต่ละ `owner/repo` รัน:
   `gh run list --repo <owner/repo> --json databaseId,name,headBranch,headSha,status,conclusion,event,startedAt,displayTitle,url --limit 20 --jq '.[] | select(.conclusion=="failure")'`
2. ถ้าไม่มี failure → ข้าม repo นั้น
3. บันทึก failed runs ทั้งหมด

### 4. Analyze Logs

> Goal: หา root cause ของแต่ละ failure

1. สำหรับแต่ละ failed run รัน:
   `gh run view <run-id> --repo <owner/repo> --log-failed`
2. หรือดู log จาก URL ทีได้
3. บันทึกข้อผิดพลาดหลักของแต่ละ run

### 5. Resolve Each Failure

> Goal: แก้ไข workflow failures

1. สำหรับแต่ละ failed run:
   - ถ้าเป็น transient/error เดิม → รัน `gh run rerun <run-id> --repo <owner/repo>`
   - ถ้าเป็น issue ที fix ได้ด้วย code change → ทำ `/resolve-errors` แล้วให้ user ตัดสินใจ commit/push
   - ถ้าเป็น config/secret issue → แนะนำให้ user ตรวจ `.github/workflows/` หรือ repository settings
2. รอผล rerun ถ้ามี และ recheck
3. ทำซ้ำสูงสุด 3 รอบต่อ run
4. ถ้า resolve ไม่ได้ → ทำเครื่องหมาย `manual-fix-required`

### 6. Build Report

> Goal: สรุปผลเป็นตาราง

1. รวมผลจากทุก repo
2. ใช้ `/report-table` คอลัมน์:
   - No.
   - Repo
   - Workflow
   - Branch
   - Commit
   - Event
   - Started At
   - Status After Resolve
   - Notes
3. เรียงตาม Started At ล่าสุด
4. ระบุสรุป: จำนวน failures ทั้งหมด, ที resolve ได้, ทีค้าง manual-fix-required

### 7. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป

1. ทำ `/suggest-next-action` เพื่อแนะนำ fix workflow, view logs, หรือ `watch-github-actions`

## Rules

### 1. Safety

- ถาม user ก่อน rerun ถ้าจำนวน failures เยอะหรือกระทบ production
- ไม่ push หรือ merge code โดยอัตโนมัติ
- ไม่แก้ไข workflow files โดยไม่ได้รับอนุญาต

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

- รายการ GitHub Actions runs ทีล้มเหลวพร้อมสถานะหลัง resolve
- ตารางที sort ตามวันที failure เกิด
- ข้อมูล repo, workflow, branch, commit, url, action taken พร้อม
- ไม่มีการ push/merge หรือแก้ไข repo โดยไม่ได้รับอนุญาต
