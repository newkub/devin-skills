---
name: list-git-submodules
description: รายการ git submodules ใน repo พร้อม status
related:
  - list-project-git-in-computer
  - delete-git-submodules
  - convert-to-git-submodules
  - report-table
---

## Goal

แสดงรายการ git submodules ทั้งหมดใน repository พร้อม path, URL, branch, commit และสถานะ

## Scope

ใช้เมื่อต้องการตรวจสอบหรือรายงาน submodules ใน project

## Execute

### 1. List Submodules

> Goal: ได้รายการ submodules

1. รัน `git submodule status` หรือ `git submodule status --recursive`
2. บันทึก fields: `SHA`, `path`, `commit message`

### 2. Get URLs

> Goal: รู้ remote URL ของแต่ละ submodule

1. รัน `git config --file .gitmodules --get-regexp url`
2. map URL กับ path ตามชื่อ submodule

### 3. Get Branches

> Goal: รู้ branch ปัจจุบันของแต่ละ submodule

1. สำหรับแต่ละ path รัน `git -C <path> rev-parse --abbrev-ref HEAD`
2. ถ้าเป็น detached HEAD ให้ระบุ `detached`

### 4. Check Status

> Goal: รู้สถานะ working tree

1. สำหรับแต่ละ path รัน `git -C <path> status --porcelain`
2. ระบุ `clean` หรือ `dirty` พร้อมจำนวน modified/untracked

### 5. Report

> Goal: สรุปผล

1. ทำ `/report-table` คอลัมน์: Path, URL, Branch, Commit, Status
2. หรือสร้าง bullet list ถ้าจำนวนน้อย

## Rules

### 1. Safe Read-Only

- ไม่แก้ไข submodules
- ใช้ `git -C <path>` แทน `cd`

### 2. Handle Missing Submodules

- ถ้า submodule ไม่ถูก initialize → ระบุ `(not initialized)`
- ถ้า `.gitmodules` ไม่มี → รายงานว่าไม่มี submodules

## Expected Outcome

- ตาราง submodules ครบถ้วน
- รู้ path, URL, branch, commit, status
- ไม่มี side effects
