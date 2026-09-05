---
name: update-chezmoi
description: อัปเดต dotfiles ด้วย chezmoi รวมถึง chezmoi readd
argument-hint: "[scope]"
related:
  - follow-my-global-cli
  - git-commit
  - report-table
  - suggest-next-action
---

## Goal

อัปเดต dotfiles ใน chezmoi โดยเฉพาะการรัน `chezmoi readd` เมื่อมีการเปลี่ยนแปลงไฟล์ local และ sync กับ source state

## Scope

ใช้เมื่อต้องการ update chezmoi-managed dotfiles จาก local changes หรือ pull การเปลี่ยนแปลงล่าสุด

## Execute

### 1. Verify Chezmoi Installation

> Goal: ตรวจสอบ chezmoi

1. รัน `chezmoi --version`
2. ถ้าไม่มี → ทำ `/follow-my-global-cli` เพื่อติดตั้ง
3. รัน `chezmoi doctor` เพื่อตรวจสอบสถานะ
4. ระบุ source directory และ destination directory

### 2. Review Local Changes

> Goal: รู้ว่า local files เปลี่ยนแปลงอะไร

1. รัน `chezmoi status` เพื่อดู changes
2. รัน `chezmoi diff` เพื่อดูรายละเอียด
3. ระบุไฟล์ทีต้อง readd หรือ apply
4. ถ้ามี changes ทีไม่ต้องการ → ข้ามหรือ revert

### 3. Readd Changed Files

> Goal: นำ local changes กลับเข้า source state

1. รัน `chezmoi readd` สำหรับทุกไฟล์ทีมี local changes
2. หรือรัน `chezmoi readd <file>` เฉพาะไฟล์
3. ตรวจสอบ `chezmoi diff` หลัง readd
4. ถ้ามี new files ทีต้อง add → ใช้ `chezmoi add <file>`

### 4. Apply Updates

> Goal: sync dotfiles

1. รัน `chezmoi apply` เพื่อ apply source state ไปยัง destination
2. ถ้าต้องการ pull latest จาก remote → รัน `chezmoi update`
3. ตรวจสอบ `chezmoi status` อีกครั้ง
4. ถ้ามี conflict → resolve ตาม chezmoi docs

### 5. Commit And Report

> Goal: สรุปผล

1. รัน `chezmoi git status` หรือ `chezmoi cd` แล้ว `git status`
2. ทำ `/git-commit` ถ้ามี source dir repo
3. ใช้ `/report-table` แสดง: File, Action, Status
4. ทำ `/suggest-next-action`

## Rules

### 1. Readd Before Apply

- ถ้ามี local changes ทีต้องการเก็บ → `chezmoi readd` ก่อน
- ไม่ apply ทับ local changes โดยไม่สำรอง
- ถ้าไม่แน่ใจ → ให้ user confirm

### 2. No Data Loss

- สำรองไฟล์สำคัญก่อน readd/apply
- ตรวจ `chezmoi diff` ก่อน apply
- ไม่ลบ dotfiles โดยไม่ได้รับ approval

### 3. Deterministic

- รันคำสั่งตามลำดับ: status → diff → readd → apply → status
- ตรวจสอบทุกครั้งก่อนและหลัง
- ไม่ skip diff

## Expected Outcome

- local dotfiles changes ถูก readd เข้า source state
- source state sync กับ destination
- ไม่มี data loss
- รายงาน files ที่ readd/apply พร้อม status
