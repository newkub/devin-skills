---
name: list-all-github-pr
description: รายการ pull requests ทั้งหมดของ user ส่วนตัวและ organizations ที user เป้นสมาชิก
argument-hint: "[owner...] [--state open|closed] [--author <user>]"
allowed-tools:
  - read
  - exec
  - report
  - suggest-next-action
  - ask_user_question
triggers:
  - user
  - model
related:
  - all-github-repo
  - list-github
  - list-github-pr
  - open-github
  - report
  - resolve-github-pr
  - review-github-pr
  - suggest-next-action
---

## Goal

รวมรายการ pull requests จาก repository ทั้งหมดของ user ส่วนตัวและ organizations ที user เป้นสมาชิก มาแสดงเป้นตารางเดียว เรียงตาม updatedAt ล่าสุด

## Scope

ใช้ `gh search prs --owner <owner>,<owner>` ดึงผลข้าม repo ทั้งหมดของ owner ใน call เดียว ไม่ต้อง list repo ก่อน ต่างจาก `/list-github-pr` ที่เจาะจงทีละ repo

ดูเพิ่มเติม: /list-github (dispatcher), /list-github-pr, /all-github-repo, /open-github, /review-github-pr

## Execute

### 1. Resolve Owners

> Goal: รู้ owner ทั้งหมดทีจะ list (personal + orgs)

1. ถ้า user ระบุ `owner` จาก argument ให้ใช้ค่านั้น
2. ถ้าไม่ระบุ ให้รัน `gh api user --jq .login` เป้น `user_login`
3. รัน `gh api user/orgs --jq '.[].login'` เพื่อหา organizations ที user เป้นสมาชิก
4. รวมเป้นรายการ `owners` เดียว เช่น `newkub,wrikka` (comma-separated)
5. ถ้า `gh api user` fail ให้ stop แล้วแนะนำ `gh auth login`

### 2. List Pull Requests

> Goal: ดึง PR จากทุก repo ของ owner เหล่านั้น

1. รัน command หลัก (ครอบคลุมทัง personal และ org ใน call เดียว):

   ```bash
   gh search prs --owner <owners> --state open \
     --sort updated --order desc --limit 200 \
     --json repository,number,title,author,state,isDraft,commentsCount,updatedAt,url
   ```

2. `--owner` รับ comma-separated values — ไม่ต้อง วนลูป per owner
3. ไม่ใส่ `--state` เมื่อต้องการทัง open และ closed; ใช้ `--merged` เพื่อเฉพาะ PR ที merge แล้ว
4. ใช้ `--author <user>` เมื่อต้องการเฉพาะ PR ที user เขียน
5. ใช้ `--involves <user>` เมื่อต้องการ PR ที user มีส่วนร่วม (เขียน หรือ review หรือ assign)
6. กรอง bot ออกจากผลลัพธ์ทีหลังด้วย `--jq '[.[] | select(.author.is_bot | not)]'` (เช่น `renovate[bot]`)
7. ตัวกรองอื่นเลือกได้ตาม context: `--label`, `--base`, `--head`, `--review`, `--draft`, `--repo`, `--visibility`, `--created`, `--updated`

### 3. Merge And Format

> Goal: นำเสนอผลลัพธ์ให้อ่านง่ายเป้นตารางเดียว

1. รวมผลจากทุก query เป้น JSON array เดียวด้วย `jq -s 'add'` หรือรัน query เดียวถ้าทำได้
2. ลบรายการซ้ำด้วย `unique_by(.url)`
3. เรียงตาม `updatedAt` ล่าสุดก่อน แปลงเป้น `YYYY-MM-DD`
4. ดึง `repository.nameWithOwner` เป้นคอลัมน์ Repo และ `author.login` เป้นคอลัมน์ Author
5. ทำ `/report` ด้วยคอลัมน์:
   - No.
   - Repo (`owner/name`)
   - Number
   - Title
   - Author
   - State (`open`/`closed`/`merged`/`draft`)
   - Comments
   - Updated
   - URL
6. สรุปจำนวน PR ทั้งหมด และจำนวนต่อ owner/Repo

### 4. Suggest Next Steps

> Goal: แนะนำ action ถัดไป

1. ถ้าต้องการ review PR ใด → ทำ `/review-github-pr <number>` ใน repo นั้น
2. ถ้าต้องการจัดการ PR ที่ค้างหรือ CI fail → ทำ `/resolve-github-pr`
3. ถ้าต้องการดู PR ของ repo เดียวแบบมี branch metadata → ทำ `/list-github-pr <owner>/<repo>`
4. ถ้าต้องการเปิดหน้า PR บน browser → ทำ `/open-github pr <owner>/<repo> <number>`
5. ถ้าต้องการรายการ repo เพื่อขยาย scope → ทำ `/all-github-repo`
6. ทำ `/suggest-next-action` เพื่อแนะนำเพิ่ม

## Rules

### 1. GitHub Authentication

- ต้อง login ด้วย `gh auth login` ก่อน; ถ้า `gh api user` คืน error ให้ stop และแนะนำ login
- ไม่เดา owner หรือ repo ถ้าหาไม่ได้จริง

### 2. Scope: Personal And Org

- default ครอบคลุมเฉพาะ repo ที owner เป็นเจ้าของ (repo ของ user ส่วนตัว + repo ของแต่ละ org ในรายการ)
- PR ใน repo ของคนอื่นที user ไปด้วย → ต้องเปลี่ยนจาก `--owner` เป้น `--author <user>` แทน
- org ที API คืน 403/404 ให้ข้าม org นั้นและบันทึกเหตุผลไว้

### 3. Search API Limits

- GitHub Search API คืนผลสูงสุด 1,000 รายการต่อ query — ถ้า `--limit` ชนขอบนี้ ให้แจ้งเตือนและแคบ scope ด้วย `--updated`/`--created` หรือ split per owner
- ถ้า org เป็นสมาชิกเยอะ ให้รัน per-owner query แยกกันแล้วรวมผล เพื่อบังคับขอบเขตผลต่อ owner
- ไม่ใส่ `--state` = ทัง open และ closed; `merged` ไม่ใช่ state ของ search ให้ใช้ `--merged` แทน

### 4. Output

- ใช้ `/report` เสมอ; คอลัมน์ No. เป้นคอลัมน์แรก เรียง 1, 2, 3, ...
- ไม่แสดง body หรือข้อมูล sensitive จาก `--json body`
- ระบุ scope ทีใช้ (owners, state filter, จำนวน) ทุกครั้ง

## Expected Outcome

- รายการ PR ทั้งหมดของ user ส่วนตัวและ organizations ที user เป้นสมาชิก ในตารางเดียว
- ข้อมูลครบถ้วน: repo, number, title, author, state, comments, updated, url
- แยกจำนวนต่อ owner พร้อม next action สำหรับ PR ทีเลือก
