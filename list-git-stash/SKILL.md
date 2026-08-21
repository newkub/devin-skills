---
name: list-git-stash
description: แสดง stashes ทั้งหมดพร้อมข้อมูลและสถานะ
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - follow-git
  - report-table
  - list-git-branch
  - list-git-tags
---

## Goal

แสดงรายการ git stashes ทั้งหมดพร้อม metadata และสถานะการใช้งาน

## Scope

ใช้สำหรับดู stashes ใน local repository — ไม่รวมการ create, apply, drop (ใช้ `/follow-git` สำหรับ stash operations)

## Execute

### 1. List Stashes

> Goal: ดู stashes ทั้งหมดในเครื่อง
> Goal: รู้ stashes ที่มีและ metadata

1. รัน `git stash list` เพื่อดู stashes ทั้งหมด
2. ถ้าไม่มี stash → รายงาน "No stashes found" และจบ
3. ระบุจำนวน stashes ทั้งหมด

### 2. Collect Stash Details

> Goal: รวบรวมข้อมูลเพิ่มเติมของแต่ละ stash
> Goal: มีข้อมูลครบสำหรับรายงาน

1. รัน `git stash show stash@{n}` สำหรับแต่ละ stash เพื่อดูไฟล์ที่เก็บ
2. รัน `git stash show stash@{n} --stat` เพื่อดูสถิติ additions/deletions
3. รัน `git stash list --format="%gd|%gi|%gs"` เพื่อดู stash index, description และ date
4. ระบุ stash ที่เก่าเกิน 30 วัน (stale)

### 3. Analyze Stash Content

> Goal: วิเคราะห์เนื้อหาของแต่ละ stash
> Goal: เข้าใจสิ่งที่เก็บในแต่ละ stash

1. ระบุจำนวนไฟล์ในแต่ละ stash
2. ระบุ categories ของไฟล์: code, config, docs, test
3. ระบุ stash ที่มี conflicts potential โดยตรวจสอบไฟล์ที่เปลี่ยนตั้งแต่ stash
4. ระบุ stash ที่น่าจะใช้งานได้และที่น่าจะ stale

### 4. Format Output

> Goal: จัดรูปแบบผลลัพธ์เป็นตาราง
> Goal: รายงานอ่านง่าย ครบข้อมูล

1. ทำ `/report-table` เพื่อจัดรูปแบบเป็นตาราง
2. กำหนด columns:
   - No. ลำดับ
   - Stash stash@{n}
   - Description message ของ stash
   - Date วันที่สร้าง
   - Files จำนวนไฟล์
   - +/- additions/deletions
   - Stale ใช่ / ไม่ใช่
3. เรียงตามลำดับ stash index (0 ก่อน)

## Rules

### Read-Only

- ไม่ create, apply, drop หรือ clear stash — ใช้ `/follow-git` สำหรับ stash operations
- ไม่แก้ไข working directory
- รายงานเท่านั้น — read-only operation

### Output Format

- ทำ `/report-table` สำหรับจัดรูปแบบผลลัพธ์
- เรียงตาม stash index
- ชี้เน้น stale stashes ที่เก่าเกิน 30 วัน
- ชี้เน้น stashes ที่มีจำนวนไฟล์มาก

### High Impact Content

- ถ้าไม่มี stash → รายงานสั้นและจบ
- ถ้ามีมากกว่า 20 stashes → แสดงเฉพาะ 10 ล่าสุด
- ชี้เน้น stale stashes ที่ควร drop

### Non-Redundancy

- Stash operations อยู่ใน `/follow-git` แล้ว
- Branch listing อยู่ใน `/list-git-branch` แล้ว
- Tag listing อยู่ใน `/list-git-tags` แล้ว

## Expected Outcome

- รายการ stashes ทั้งหมดในตารางที่อ่านง่าย
- ข้อมูลครบ: stash index, description, date, files, additions/deletions, stale status
- ชี้เน้น stale stashes ที่ควร drop
- ไม่มีการแก้ไข stash ใดๆ — read-only report
