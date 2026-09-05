---
name: all-github-repo
description: รายการ GitHub repositories ทั้งหมดของ user และ organizations ที user เป้นสมาชิก
argument-hint: "[username]"
allowed-tools:
  - read
  - exec
  - report-table
  - suggest-next-action
  - ask_user_question
triggers:
  - user
  - model
related:
  - list-github-repo
  - open-github-repo-personal
  - open-github-repo-org
  - view-repo
  - report-table
  - suggest-next-action
---

## Goal

รายการ GitHub repositories ทั้งหมดของ user ส่วนตัวและ organizations ที user เป้นสมาชิก โดยกรอง fork และ archived ออก

## Scope

ใช้ `gh` CLI ดึง repo จาก user และแต่ละ org แล้วรวมเป้นตารางเดียว เรียงตาม updatedAt ล่าสุด

ดูเพิ่มเติม: /list-github-repo, /open-github-repo-personal, /open-github-repo-org, /view-repo

## Execute

### 1. Get User And Organizations

> Goal: รู้ owner ทั้งหมดทีจะ list

1. ถ้ามี `username` จาก argument ให้ใช้เป้น `user_login`
2. ถ้าไม่มี ให้รัน `gh api user --jq .login` เพื่อหา authenticated user
3. ถ้า `gh` ไม่ได้ login ให้ stop แล้วแนะนำ `gh auth login`
4. รัน `gh api user/orgs --jq '.[].login'` เพื่อหา organizations ที user เป้นสมาชิก
5. รวม `user_login` และ org logins ไว้ในรายการ `owners`

### 2. List Personal Repositories

> Goal: ดึง repo ของ user ส่วนตัว

1. รัน `gh repo list <user_login> --source --no-archived --json name,description,primaryLanguage,stargazerCount,forkCount,updatedAt,visibility,url --limit 1000`
2. ถ้าผลลัพธ์มี 1000 รายการ ให้แจ้งเตือนว่าอาจต้อง pagination
3. บันทึกผลลัพธ์เป็น JSON array โดยเพิ่มฟิลด์ `owner` คือ `<user_login>`

### 3. List Organization Repositories

> Goal: ดึง repo ของแต่ละ org

1. สำหรับแต่ละ `org` ในรายการ `owners` ทีไม่ใช่ `user_login`:
   - รัน `gh repo list <org> --source --no-archived --json name,description,primaryLanguage,stargazerCount,forkCount,updatedAt,visibility,url --limit 1000`
   - บันทึกผลลัพธ์เป็น JSON array โดยเพิ่มฟิลด์ `owner` คือ `<org>`
2. ถ้า org มี repo มากกว่า 1000 ให้แจ้งเตือนและทำ pagination ถัดไป
3. ถ้า API คืน 403 หรือ 404 สำหรับ org ใด ให้ข้าม org นั้นและบันทึกเหตุผล

### 4. Merge And Format

> Goal: นำเสนอผลลัพธ์ให้อ่านง่าย

1. รวม JSON arrays ทั้งหมดด้วย `jq -s 'add'` หรือ script ทีเทียบเท่า
2. เรียงตาม `updatedAt` ล่าสุดก่อน
3. แปลง `updatedAt` เป้น `YYYY-MM-DD`
4. ดึง `primaryLanguage.name` ถ้าไม่มีให้แสดง `n/a`
5. ทำ `/report-table` ด้วยคอลัมน์:
   - No.
   - Owner
   - Name
   - Description
   - Language
   - Stars
   - Forks
   - Updated
   - Visibility
   - URL
6. สรุปจำนวน repo ทั้งหมด และจำนวน repo ต่อ owner

### 5. Suggest Next Steps

> Goal: แนะนำ action ถัดไป

1. ถ้าต้องการดู metadata ของ repo ใด ให้ทำ `/view-repo <owner>/<name>`
2. ถ้าต้องการเปิดหน้า repo บน browser ให้ทำ `/open-github-repo`
3. ถ้าต้องการดู repo ของ user ส่วนตัวอย่างเดียว ให้ทำ `/list-github-repo`
4. ทำ `/suggest-next-action` เพื่อแนะนำเพิ่ม

## Rules

### 1. GitHub Authentication

- ต้อง login ด้วย `gh auth login` ก่อน
- ถ้า `gh api user` คืน error ให้ stop และแนะนำ login

### 2. Exclude Forks And Archived

- ใช้ `--source` เพื่อกรอง fork ออก
- ใช้ `--no-archived` เพื่อกรอง archived ออก
- ถ้า user ต้องการรวม archived ให้ลบ `--no-archived`

### 3. Pagination

- ใช้ `--limit 1000` เป้น default
- ถ้า repo มากกว่า 1000 ต่อ owner ให้แจ้งเตือนและใช้ `gh api`/`graphql` ทำ pagination

### 4. Output

- ใช้ `/report-table` เสมอ
- คอลัมน์ No. ต้องเป้นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ...
- ไม่แสดง secrets, tokens หรือข้อมูล sensitive
- ระบุสรุปจำนวน repo ทั้งหมดและต่อ owner

## Expected Outcome

- รายการ repo ทั้งหมดของ user และ organizations ที user เป้นสมาชิก
- ข้อมูลครบถ้วน: owner, name, description, language, stars, forks, updated, visibility, url
- ไม่รวม fork และ archived
- พร้อม next action สำหรับ repo ทีเลือก
