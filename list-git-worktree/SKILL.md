---
name: list-git-worktree
description: รายการ git worktrees ใน repo พร้อม branch และ status
related:
  - use-git-worktrees
  - cleanup-worktree
  - report-table
---

## Goal

แสดงรายการ git worktrees ทั้งหมดของ repository พร้อม path, branch, commit และสถานะ

## Scope

ใช้เมื่อต้องการตรวจสอบ worktrees ที่มีอยู่

## Execute

### 1. List Worktrees

> Goal: ได้รายการ worktrees

1. รัน `git worktree list`
2. หรือ `git worktree list --porcelain` เพื่อ parse ง่าย

### 2. Parse Details

> Goal: ดึงข้อมูลแต่ละ worktree

1. สำหรับแต่ละ worktree บันทึก:
   - `Path`
   - `Branch` (หรือ `detached`)
   - `Commit SHA`
   - `Status` (e.g., `locked`, `prunable`, `bare`)

### 3. Check Branch Status

> Goal: รู้สถานะ branch

1. รัน `git branch --all --contains <commit>` ถ้าจำเป็น
2. ระบุว่า branch ถูก checkout อยู่หรือไม่

### 4. Report

> Goal: สรุปผล

1. ทำ `/report-table` คอลัมน์: Path, Branch, Commit, Status
2. หรือ bullet list ถ้าน้อย

## Rules

### 1. Read-Only

- ไม่สร้าง ลบ หรือแก้ไข worktree
- ไม่ checkout branch โดยไม่จำเป็น

### 2. Handle Bare Repos

- ถ้า repo เป็น bare ให้ระบุ worktree path ตาม bare structure

## Expected Outcome

- ตาราง worktrees ครบถ้วน
- รู้ path, branch, commit, status
- ไม่มี side effects
