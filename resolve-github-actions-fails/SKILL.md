---
name: resolve-github-actions-fails
argument-hint: "[--repo <owner/repo>]"
description: ตรวจสอบและแก้ไข GitHub Actions workflow runs ทีล้มเหลวสำหรับ repo ปัจจุบันหรือ repo ทีระบุ
related:
  - resolve-cicd
  - resolve-all-github-actions-fails
  - resolve-all-cloudflare-fails
  - search-project-in-drive-d
  - resolve-errors
  - report-table
  - suggest-next-action
  - ask-me
---

## Goal

List GitHub Actions workflow runs ทีล้มเหลวสำหรับ project/repo ทีระบุ แล้ว resolve ให้หมด

## Scope

ใช้กับ repo ปัจจุบันหรือ repo ที user ระบุ ครอบคลุม public/private ตามสิทธิ์ `gh` token

## Execute

### 1. Verify gh CLI

> Goal: ยืนยันว่า `gh` พร้อมและ authenticated
1. รัน `gh --version`
2. รัน `gh auth status`
3. ถ้าไม่ authenticated → ทำ `/ask-me` เพื่อให้ user รัน `gh auth login`
4. บันทึก username

### 2. Identify Repo

> Goal: ระบุ repo ทีจะ resolve
1. ถ้ามี `--repo` → ใช้ค่านั้น
2. ถ้าไม่มี → ใช้ `gh repo view --json nameWithOwner` หรือ `git remote -v` จาก current directory
3. ถ้าหา repo ไม่พบ → ทำ `/ask-me` เพื่อให้ user ระบุ

### 3. List Failed Runs

> Goal: หา workflow runs ทีล้มเหลวใน repo นั้น
1. รัน `gh run list --repo <owner/repo> --status failure --limit 30`
2. รับรายการ: workflow, branch, commit, event, started at, url
3. ถ้าไม่มี failures → report ว่างานเสร็จแล้ว stop

### 4. Analyze Logs

> Goal: หา root cause ของแต่ละ failure
1. สำหรับแต่ละ failed run รัน `gh run view <run-id> --repo <owner/repo> --log-failed`
2. หรือดู log จาก URL ทีได้
3. บันทึกข้อผิดพลาดหลักของแต่ละ run

### 5. Resolve Each Failure

> Goal: แก้ไข workflow failures
1. ถ้าเป้น transient/error เดิม → รัน `gh run rerun <run-id> --repo <owner/repo>`
2. ถ้าเป้น issue ที fix ได้ด้วย code change → ทำ `/resolve-errors` แล้วให้ user ตัดสินใจ commit/push
3. หา local project ด้วย `/search-project-in-drive-d <repo-name>` ถ้าต้องการ code fix
4. ถ้าเป้น config/secret issue → แนะนำให้ user ตรวจ `.github/workflows/` หรือ repository settings
5. รอผล rerun ถ้ามี และ recheck
6. ทำซ้ำสูงสุด 3 รอบต่อ run
7. ถ้า resolve ไม่ได้ → ทำเครื่องหมาย `manual-fix-required`

### 6. Build Report

> Goal: สรุปผลเป็นตาราง
1. รวมผลจาก repo ทีระบุ
2. ใช้ `/report-table` คอลัมน์: No., Workflow, Branch, Commit, Event, Started At, Status After Resolve, Notes
3. เรียงตาม Started At ล่าสุด
4. ระบุสรุป: จำนวน failures ทั้งหมด, ที resolve ได้, ทีค้าง manual-fix-required

### 7. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป
1. ทำ `/suggest-next-action` เพื่อแนะนำ fix workflow, view logs, หรือ `resolve-cicd`

## Rules

### 1. Safety
- ถาม user ก่อน rerun ถ้าจำนวน failures เยอะหรือกระทบ production
- ไม่ push หรือ merge code โดยอัตโนมัติ
- ไม่แก้ไข workflow files โดยไม่ได้รับอนุญาต

### 2. Rate Limit And Scope
- ใช้ pagination `--limit` และ `--page`
- ถ้า `gh` ถูก rate limit → รอและ retry

### 3. Local Project Matching
- ใช้ `/search-project-in-drive-d` เมื่อต้องหา local repo เพื่อ code fix
- ถ้าไม่พบ local repo → แนะนำ user แก้ไขเอง

### 4. Privacy
- รองรับ public/private repositories ตามสิทธิ์ของ `gh` token
- ไม่ expose secrets หรือ tokens ใน output

### 5. Account-wide
- ถ้า user ต้องการ resolve ทั่วทุก repo ให้ส่งต่อไปยัง `/resolve-all-github-actions-fails`

## Expected Outcome

- รายการ GitHub Actions runs ทีล้มเหลวพร้อมสถานะหลัง resolve สำหรับ repo ทีระบุ
- ตารางที sort ตามวันที failure เกิด
- ข้อมูล workflow, branch, commit, url, action taken พร้อม
- ไม่มีการ push/merge หรือแก้ไข repo โดยไม่ได้รับอนุญาต
