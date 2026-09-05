---
name: resolve-all-github-actions-fails
argument-hint: "[--repo <owner/repo>]"
description: ตรวจสอบและแก้ไข GitHub Actions workflow runs ทีล้มเหลวทั่วทุก repo ทีเข้าถึงได้
related:
  - resolve-all-cloudflare-fails
  - search-project-in-drive-d
  - resolve-errors
  - report-table
  - suggest-next-action
  - ask-me
---

## Goal

หา GitHub Actions runs ทีล้มเหลวทั่วทุก repo ใน scope ที user เข้าถึง วิเคราะห์ logs หา root cause แก้ไข code/config แล้ว rerun จนกว่าจะผ่าน

## Scope

ใช้กับ personal repositories, organization repositories หรือ repo เดียวถ้าระบุ `--repo` ครอบคลุม public/private ตามสิทธิ์ `gh` token

## Execute

### 1. Verify gh CLI

> Goal: ยืนยันว่า `gh` พร้อมและ authenticated
1. รัน `gh --version`
2. รัน `gh auth status`
3. ถ้าไม่ authenticated → ทำ `/ask-me` เพื่อให้ user รัน `gh auth login`
4. บันทึก username และ account

### 2. List Failed Runs

> Goal: รวบรวม failures
1. ถ้ามี `--repo` → รัน `gh run list --repo <owner/repo> --status failure --limit 30`
2. ถ้าไม่มี → รัน `gh repo list --limit 100` แล้ว loop แต่ละ repo รัน `gh run list --repo <repo> --status failure --limit 10`
3. ข้าม archived repositories โดย default
4. สร้าง list: repo, run ID, workflow, branch, commit, event, started at, url

### 3. Analyze Each Run

> Goal: หา root cause
1. รัน `gh run view <run-id> --repo <owner/repo> --log-failed`
2. บันทึก error สำคัญ, step ที fail, exit code
3. ถ้าเป้น transient (network, timeout) → ไปขั้นตอน 4.1
4. ถ้าเป้น code/config issue → ไปขั้นตอน 4.2

### 4. Resolve

> Goal: แก้ไขแล้ว retry
1. Transient: รัน `gh run rerun <run-id> --repo <owner/repo>` รอ 10 วินาที แล้ว `gh run view` recheck
2. Code/config: หา local project ด้วย `/search-project-in-drive-d <repo-name>` ถ้าไม่พบ → ทำเครื่องหมาย `manual-fix-required`
3. ถ้าพบ local: `git status`, `git pull`, ใช้ `/resolve-errors` วิเคราะห์แล้ว fix code/config
4. หลัง fix → commit/push หรือ `gh run rerun` ตามลักษณะ
5. ทำซ้ำสูงสุด 3 รอบต่อ run

### 5. Build Report

> Goal: สรุปผล
1. ใช้ `/report-table` คอลัมน์: No., Repo, Workflow, Branch, Commit, Event, Started At, Status After Resolve, Notes
2. เรียงตาม Started At ล่าสุด
3. สรุป: จำนวนทั้งหมด, resolve ได้, ค้าง manual-fix-required

### 6. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป
1. ทำ `/suggest-next-action` เพื่อแนะนำ rerun ทีเหลือ, watch logs, หรือ `resolve-all-cloudflare-fails`

## Rules

### 1. Safety
- ถาม user ก่อน rerun ถ้า failures จำนวนมากหรือกระทบ production
- ไม่ push หรือ merge code โดยอัตโนมัติ
- ไม่แก้ไข workflow files โดยไม่ได้รับอนุญาต

### 2. Rate Limit
- ถ้า `gh` ถูก rate limit ให้รอและ retry
- ใช้ pagination `--limit` ตามจำนวน repo

### 3. Local Project Matching
- ใช้ `/search-project-in-drive-d` ด้วย repo name หรือ owner/name pattern
- ถ้าไม่พบ local repo → แนะนำให้ user แก้ไขเอง

### 4. Secret
- ไม่ expose tokens หรือ secrets ใน output

## Expected Outcome

- รายการ failed runs ทั้งหมดใน scope
- ที resolve ได้ผ่าน rerun หรือ code fix
- ทีค้าง `manual-fix-required` พร้อมเหตุผล
- ตารางสรุปครบถ้วน
