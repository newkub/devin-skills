---
name: list-git-branch
description: แสดง branches ในเครื่องและ remote พร้อมข้อมูลล่าสุด
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

แสดงรายการ git branches ทั้งในเครื่องและ remote พร้อม metadata ที่สำคัญ

## Scope

ใช้สำหรับดู branches ใน local repository และ remote — ไม่รวม GitHub API (ใช้ `/list-github-branch` สำหรับ GitHub branches)

## Execute

### 1. List Local Branches

> Goal: ดู branches ในเครื่อง
> Goal: รู้ branches ในเครื่องและ metadata

1. รัน `git branch -v` เพื่อดู local branches พร้อม last commit
2. รัน `git branch -vv` เพื่อดู local branches พร้อม upstream tracking
3. ระบุ current branch จาก output (มี `*` นำหน้า)

### 2. List Remote Branches

> Goal: ดู branches บน remote
> Goal: รู้ remote branches ที่มี

1. รัน `git branch -r` เพื่อดู remote branches
2. รัน `git fetch --prune` ก่อนถ้าต้องการข้อมูลล่าสุด
3. ระบุ remote branches ที่ไม่มี local tracking branch

### 3. List All Branches

> Goal: ดู branches ทั้งหมด
> Goal: เห็นภาพรวมทั้ง local และ remote

1. รัน `git branch -a` เพื่อดู branches ทั้งหมด
2. รัน `git branch -a -v` เพื่อดูพร้อม last commit
3. ระบุ branches ที่มีเฉพาะใน local หรือ remote

### 4. Collect Branch Metadata

> Goal: รวบรวมข้อมูลเพิ่มเติมของแต่ละ branch
> Goal: มีข้อมูลครบสำหรับรายงาน

1. รัน `git log <branch> -1 --format="%H|%ci|%an|%s"` สำหรับแต่ละ branch เพื่อดู last commit info
2. ระบุ branches ที่ไม่ได้ merge กับ current branch ด้วย `git branch --no-merged`
3. ระบุ branches ที่ merge แล้วด้วย `git branch --merged`
4. ระบุ stale branches ที่ไม่มีการอัปเดตเกิน 30 วัน

### 5. Format Output

> Goal: จัดรูปแบบผลลัพธ์เป็นตาราง
> Goal: รายงานอ่านง่าย ครบข้อมูล

1. ทำ `/report-table` เพื่อจัดรูปแบบเป็นตาราง
2. กำหนด columns:
   - No. ลำดับ
   - Branch ชื่อ branch
   - Type local / remote / both
   - Last Commit SHA แบบสั้น
   - Date วันที่ commit ล่าสุด
   - Author ผู้ commit
   - Merged ✅ / ❌
   - Stale ใช่ / ไม่ใช่
3. จัดกลุ่มตาม type: local ก่อน แล้วตามด้วย remote-only

## Rules

### Read-Only

- ไม่สร้าง ไม่ลบ ไม่ switch branch — ใช้ `/follow-git` สำหรับ branch operations
- ไม่รัน `git fetch` โดย default — แค่อ่านข้อมูลที่มี
- ถ้าผู้ใช้ต้องการข้อมูลล่าสุด → ถามก่อน fetch

### Output Format

- ทำ `/report-table` สำหรับจัดรูปแบบผลลัพธ์
- เรียง local branches ก่อน แล้ว remote-only branches
- แสดง current branch ด้วย bold
- ใช้ symbols: ✅ merged, ❌ not merged

### High Impact Content

- ถ้ามีมากกว่า 50 branches → แสดงเฉพาะ top 20 ที่อัปเดตล่าสุด
- ชี้เน้น stale branches ที่ไม่อัปเดตเกิน 30 วัน
- ชี้เน้ม branches ที่ไม่ได้ merge

### Non-Redundancy

- GitHub branches อยู่ใน `/list-github-branch` แล้ว
- Branch operations อยู่ใน `/follow-git` แล้ว
- Stash listing อยู่ใน `/list-git-stash` แล้ว

## Expected Outcome

- รายการ branches ทั้ง local และ remote ในตารางที่อ่านง่าย
- ข้อมูลครบ: branch name, type, last commit, date, author, merged status, stale status
- ชี้เน้น stale branches และ branches ที่ไม่ได้ merge
- ไม่มีการแก้ไข branch ใดๆ — read-only report
