---
name: list-git-release
description: รายการ git tags และ releases จาก local repo พร้อม version, date, notes
related:
  - list-git-branch
  - list-git-commit
  - list-git-stash
  - report-table
---

## Goal

แสดงรายการ git tags และ releases ใน local repository พร้อม version, date, message และ release notes

## Scope

ใช้สำหรับ repository ที่ใช้ git tags เป็น version รองรับทั้ง annotated tags และ lightweight tags

## Execute

### 1. Ensure Git Repository

> Goal: ตรวจสอบว่าอยู่ใน git repository

1. รัน `git rev-parse --is-inside-work-tree`
2. ถ้าไม่ใช่ git repo → stop และ report
3. ระบุ current branch และ HEAD

### 2. List Tags

> Goal: ดึงรายการ tags ทั้งหมด

1. รัน `git tag --list` เพื่อ list tags ตามตัวอักษร
2. รัน `git for-each-ref --sort=-creatordate --format '%(refname:short)|%(objectname:short)|%(taggerdate:short)|%(subject)' refs/tags` เพื่อ list ตามวันทีสร้าง
3. ระบุ annotated vs lightweight tags จาก output
4. ถ้าต้องการ filter → ใช้ `git tag --list 'v*'` หรือ pattern ที่ต้องการ

### 3. Extract Release Notes

> Goal: แสดง notes สำหรับแต่ละ tag

1. รัน `git tag -n10 <tag>` เพื่อดู annotated tag message
2. ถ้ามี `CHANGELOG.md` → อ่าน sections ตาม version
3. ถ้ามี `RELEASE.md` หรือ `CHANGES.md` → อ่าน release notes
4. ใช้ `git show <tag> --quiet` เพื่อดู commit ที่ tag ชี้

### 4. Find Latest Release

> Goal: ระบุ release ล่าสุด

1. รัน `git describe --tags --abbrev=0` เพื่อหา latest tag
2. ถ้าไม่มี tags → report ว่ายังไม่มี release
3. แสดง latest release พร้อม date, author, notes

### 5. Report

> Goal: แสดงผลในรูปแบบทีอ่านง่าย

1. ใช้ `/report-table` คอลัมน์: No, Tag, Commit, Date, Author, Notes Preview
2. เรียงตามวันทีสร้างจากใหม่ไปเก่า
3. ระบุ latest release และ upcoming changes จาก `CHANGELOG.md` ถ้ามี

## Rules

### 1. Read Only

- ไม่สร้าง ลบ หรือแก้ไข tags โดยไม่ได้รับ instruction
- ใช้ `git tag`, `git for-each-ref`, `git show` เท่านั้น

### 2. Tag Types

- Annotated tag: มี tagger, date, message
- Lightweight tag: ไม่มีข้อมูลเพิ่มเติม ใช้ commit date แทน
- ระบุชนิด tag ใน report

### 3. Notes Priority

1. `CHANGELOG.md` section สำหรับ version
2. Annotated tag message (`git tag -n`)
3. Commit subject (`git show --quiet`)

- ใช้ /list-git-branch ถ้าจำเป็น
- ใช้ /list-git-commit ถ้าจำเป็น
- ใช้ /list-git-stash ถ้าจำเป็น

## Expected Outcome

- รายการ tags/releases ใน repo
- ข้อมูล version, date, author, notes preview
- ระบุ latest release และ release ทีกำลังจะมาถ้า `CHANGELOG.md` มีข้อมูล
