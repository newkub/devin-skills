---
name: check-git-logs
description: ดูประวัติไฟล์จาก git log ไล่เช็คทีละ commit จนกว่าจะเจอเงื่อนไข รองรับ local/remote
related:
  - git-debug
  - git-file-history
  - restore-from-git-log
  - restore-from-my-dotfiles
  - deep-debug
  - report-table
  - suggest-next-action
---

## Goal

หาประวัติการเปลี่ยนแปลงของไฟล์ทีระบุ โดยไล่ดู `git log` จากล่าสุดถอยหลังไปจนกว่าจะเจอเงื่อนไขที user ต้องการ (เช่น ไฟล์ไม่ว่าง, มีค่าบางอย่าง, ถูกแก้โดยคนใดคนหนึ่ง) รองรับทั้ง local repo และ remote repo บน GitHub

## Scope

- ระบุไฟล์เป้าหมายและเงื่อนไขทีต้องการหา
- รองรับ local git repo และ remote GitHub repo
- แสดง commit ทีตรงเงื่อนไขพร้อมเนื้อหาไฟล์ใน commit นั้น
- ใช้เป็นเครื่องมือตัวช่วยใน `/deep-debug` และ `/git-debug`

## Execute

### 1. Identify Target And Condition

> Goal: รู้ว่าจะหาอะไร

1. รับ file path จาก argument หรือ context
2. รับ repo source: local path หรือ `owner/repo` บน GitHub
3. รับ condition จาก user เช่น:
   - "ไฟล์ไม่ว่าง" (`mcpServers` มี key)
   - "มีบรรทัดที contains X"
   - "ไฟล์ถูกลบ"
   - "ไฟล์ถูกแก้โดย author Y"
4. ถ้าไม่มี condition → แสดง history ทั้งหมด

### 2. Local Repo

> Goal: ใช้ git log กับ local repo

1. รัน `git log --all --pretty=format:"%H %ad %an %s" --date=iso <file>` เพื่อดู commits ทีเกี่ยวข้อง
2. ถ้า file ถูก rename → เพิ่ม `--follow`
3. สำหรับแต่ละ commit จากใหม่ไปเก่า:
   - รัน `git show <sha>:<file>` เพื่อดู content
   - ตรวจ condition
   - ถ้าตรง → stop และ report
4. ถ้าไม่เจอ → report ว่าไม่มี commit ไหนตรงเงื่อนไข

### 3. Remote Repo

> Goal: ใช้ GitHub API กับ remote repo

1. ใช้ `gh repo view <owner/repo>` ยืนยัน repo
2. ใช้ `gh api repos/<owner>/<repo>/commits?path=<file>&per_page=100` ดึง commits
3. สำหรับแต่ละ commit จากใหม่ไปเก่า:
   - ใช้ `gh api repos/<owner>/<repo>/contents/<file>?ref=<sha>` ดึง content (base64)
   - decode base64
   - ตรวจ condition
   - ถ้าตรง → stop และ report
4. ถ้าไม่เจอ → ทำ pagination ด้วย `page` parameter

### 4. Report

> Goal: สรุปผล

1. ทำ `/report-table` แสดง: No, Commit SHA, Date, Author, Message, Match
2. ถ้าเจอ condition → แสดง content ของไฟล์ใน commit นั้น (ถ้าไม่ sensitive)
3. ถ้าไม่เจอ → ระบุว่าไม่พบ
4. ทำ `/suggest-next-action` เช่น กู้คืน, bisect, หรือดู commit ก่อนหน้า

## Rules

### 1. Local And Remote

- local ใช้ `git log` + `git show`
- remote ใช้ `gh api`
- ถ้า repo ไม่ได้ระบุ → ใช้ local repo ปัจจุบัน

### 2. Condition Parsing

- รองรับ condition เชิงเนื้อหา: `contains`, `not-empty`, `empty`, `equals`, `size-gt`
- ถ้า condition เป็น string → ใช้ `contains` ใน content
- ถ้า condition เป็น JSON path → ใช้ `jq` หรือ Python ตรวจสอบ

### 3. Safety

- ไม่ทำการแก้ไขไฟล์หรือ repo
- ไม่ expose secrets ใน report
- ถ้า content มี sensitive data → redact ก่อนแสดง

### 4. Stop Condition

- หยุดทันทีเมื่อเจอ commit แรกทีตรงเงื่อนไข (ล่าสุดทียังตรง)
- ถ้า user ต้องการ list ทั้งหมด → ให้ระบุ explicitly

- ใช้ /restore-from-git-log ถ้าจำเป็น

## Expected Outcome

- หา commit ทีตรงเงื่อนไขได้
- รายงาน commit SHA, date, author, message และ content
- รองรับทั้ง local และ remote repo
- ใช้งานได้กับ `/deep-debug` และ `/git-debug`
