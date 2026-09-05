---
name: list-github-repo
description: รายการ remote repositories ทั้งหมดบน GitHub ที่ผู้ใช้เป้นเจ้าของ โดยกรอง fork และ archived ออก
argument-hint: "[owner]"
allowed-tools:
  - read
  - write
  - edit
  - exec
  - skill
  - report-table
  - suggest-next-action
  - ask_user_question
triggers:
  - user
  - model
related:
  - open-github-repo
  - open-github-repo-personal
  - open-github-repo-org
  - view-repo
  - all-github-repo
  - list-github-project
  - list-project-git-in-computer
  - list-github-star-latest
  - report-table
  - suggest-next-action
---

## Goal

รายการ remote repositories ทั้งหมดบน GitHub ที่ผู้ใช้เป้นเจ้าของ โดยกรอง fork และ archived ออก

## Scope

ใช้ `gh repo list --source` สำหรับ authenticated user หรือ owner ที่ระบุ แสดงเฉพาะ repo ต้นฉบับ (non-fork) ที่ user สร้างเอง

ดูเพิ่มเติม: /open-github-repo, /open-github-repo-personal, /open-github-repo-org, /list-github-project, /all-github-repo

## Execute

### 1. Get Owner

> Goal: รู้ว่าจะ list repo ของใคร

1. ถ้า user ระบุ owner จาก argument ให้ใช้ค่านั้น
2. ถ้าไม่ระบุ → ใช้ authenticated user จาก `gh api user -q '.login'`
3. ถ้าไม่สามารถหา owner ได้ → stop และ report ให้ login `gh` ก่อน

### 2. List Repositories

> Goal: ดึง repo ทั้งหมดที่ไม่ใช่ fork

1. รัน `gh repo list <owner> --source --no-archived --json name,description,primaryLanguage,stargazerCount,forkCount,updatedAt,visibility,url --limit 1000`
2. `--source` กรอง fork ออก
3. `--no-archived` กรอง archived ออก
4. ถ้า output มี 1000 รายการ → แจ้งเตือนว่าอาจมี repo เพิ่มเติม และทำ pagination ด้วย `--jq` หรือ `gh api` ถัดไป

### 3. Format Output

> Goal: นำเสนอผลลัพธ์ให้อ่านง่าย

1. เรียงตาม `updatedAt` ล่าสุดก่อน
2. แปลง `updatedAt` เป้น `YYYY-MM-DD`
3. ดึง `primaryLanguage.name` ถ้ามี ถ้าไม่มีให้แสดง `n/a`
4. ทำ `/report-table` ด้วยคอลัมน์:
   - No
   - Name
   - Description
   - Language
   - Stars
   - Forks
   - Updated
   - Visibility
   - URL
5. สรุปจำนวน repo ทั้งหมด

### 4. Suggest Next Steps

> Goal: แนะนำ action ถัดไป

1. ถ้าต้องการดู repo บนเครื่อง → ใช้ `/list-project-git-in-computer`
2. ถ้าต้องการดู starred ล่าสุด → ใช้ `/list-github-star-latest`
3. ถ้าต้องการดู metadata ของ repo ใด → ทำ `/view-repo <owner>/<name>`
4. ทำ `/suggest-next-action` เพื่อแนะนำเพิ่ม

## Rules

### 1. GitHub Only

- ใช้ `gh repo list` เป้นหลัก
- ถ้า `gh` ไม่ได้ authenticate ให้หยุดและแนะนำ `gh auth login`
- ไม่เดา owner ถ้าไม่พบ

### 2. Exclude Forks And Archived

- ใช้ `--source` เพื่อแสดงเฉพาะ repo ต้นฉบับ
- ใช้ `--no-archived` เพื่อซ่อน archived
- ถ้า user ต้องการรวม archived ให้ลบ flag `--no-archived`

### 3. Pagination

- ใช้ `--limit 1000` เป้น default
- ถ้า repo มากกว่า 1000 ให้แจ้งเตือนและขยายหรือทำ pagination ด้วย `gh api`/`graphql`

### 4. Output

- ใช้ `/report-table` เสมอ
- เรียงตาม `updatedAt` ล่าสุด
- ไม่แสดง secrets, tokens, หรือข้อมูล sensitive

## Expected Outcome

- รายการ repo ทั้งหมดที่ user เป้นเจ้าของบน GitHub ไม่รวม fork
- ข้อมูลครบถ้วน: name, description, language, stars, forks, updated, visibility, url
- พร้อม next action สำหรับ repo ที่เลือก
