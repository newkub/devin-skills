---
name: list-all-github-issue
description: รายการ issues ทั้งหมดของ user ส่วนตัวและ organizations ที user เป้นสมาชิก
argument-hint: "[owner...] [--state open|closed] [--label <label>]"
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
  - cleanup-github-issue
  - list-github
  - list-github-issue
  - open-github
  - report
  - resolve-github-issue-by-me
  - review-github-issue
  - suggest-next-action
---

## Goal

รวมรายการ issues จาก repository ทั้งหมดของ user ส่วนตัวและ organizations ที user เป้นสมาชิก มาแสดงเป้นตารางเดียว เรียงตาม updatedAt ล่าสุด

## Scope

ใช้ `gh search issues --owner <owner>,<owner>` ดึงผลข้าม repo ทั้งหมดของ owner ใน call เดียว ไม่ต้อง list repo ก่อน — ค่า default คืนเฉพาะ issues ไม่รวม PR (`--include-prs` จึงจะรวม) ต่างจาก `/list-github-issue` ที่เจาะจงทีละ repo

ดูเพิ่มเติม: /list-github (dispatcher), /list-github-issue, /all-github-repo, /cleanup-github-issue, /open-github

## Execute

### 1. Resolve Owners

> Goal: รู้ owner ทั้งหมดทีจะ list (personal + orgs)

1. ถ้า user ระบุ `owner` จาก argument ให้ใช้ค่านั้น
2. ถ้าไม่ระบุ ให้รัน `gh api user --jq .login` เป้น `user_login`
3. รัน `gh api user/orgs --jq '.[].login'` เพื่อหา organizations ที user เป้นสมาชิก
4. รวมเป้นรายการ `owners` เดียว เช่น `newkub,wrikka` (comma-separated)
5. ถ้า `gh api user` fail ให้ stop แล้วแนะนำ `gh auth login`

### 2. List Issues

> Goal: ดึง issue จากทุก repo ของ owner เหล่านั้น

1. รัน command หลัก (ครอบคลุมทัง personal และ org ใน call เดียว):

   ```bash
   gh search issues --owner <owners> --state open \
     --sort updated --order desc --limit 200 \
     --json repository,number,title,author,state,labels,assignees,commentsCount,updatedAt,url
   ```

2. `--owner` รับ comma-separated values — ไม่ต้อง วนลูป per owner
3. ไม่ใส่ `--state` เมื่อต้องการทัง open และ closed
4. ใช้ `--include-prs` เมื่อต้องการรวม pull requests ในผลด้วย (default คืนเฉพาะ issue)
5. ใช้ `--author <user>` / `--involves <user>` / `--assignee <user>` เพื่อแคบเหลือเฉพาะ issue ที user เขียน มีส่วนร่วม หรือได้รับมอบหมาย
6. ใช้ `--label <label>`, `--no-label`, `--no-assignee`, `--milestone`, `--project` เพื่อกรองตามงาน
7. ตัวกรองอื่นเลือกได้ตาม context: `--mentions`, `--commenter`, `--comments`, `--reactions`, `--created`, `--updated`, `--repo`, `--visibility`

### 3. Merge And Format

> Goal: นำเสนอผลลัพธ์ให้อ่านง่ายเป้นตารางเดียว

1. รวมผลจากทุก query เป้น JSON array เดียวด้วย `jq -s 'add'` หรือรัน query เดียวถ้าทำได้
2. ลบรายการซ้ำด้วย `unique_by(.url)`
3. เรียงตาม `updatedAt` ล่าสุดก่อน แปลงเป้น `YYYY-MM-DD`
4. ดึง `repository.nameWithOwner` เป้นคอลัมน์ Repo, `author.login` เป้น Author, join `labels[].name` ด้วย `,`
5. ทำ `/report` ด้วยคอลัมน์:
   - No.
   - Repo (`owner/name`)
   - Number
   - Title
   - Author
   - Assignees
   - Labels
   - State
   - Comments
   - Updated
   - URL
6. สรุปจำนวน issue ทั้งหมด, จำนวนต่อ owner, และจำนวน issue ทีไม่มี assignee หรือ label

### 4. Suggest Next Steps

> Goal: แนะนำ action ถัดไป

1. ถ้าต้องการล้าง issue ที่ค้าง → ทำ `/cleanup-github-issue <repo>`
2. ถ้าต้องการประเมินว่า issue พร้อมทำหรือยัง → ทำ `/review-github-issue <number-or-url>` ใน repo นั้น
3. ถ้าต้องการแก้ issue ที่รับผิดชอบ → ทำ `/resolve-github-issue-by-me <filter>`
4. ถ้าต้องการดู issue ของ repo เดียว → ทำ `/list-github-issue <owner>/<repo>`
5. ถ้าต้องการเปิดหน้า issue บน browser → ทำ `/open-github issue <owner>/<repo> <number>`
6. ถ้าต้องการรายการ repo เพื่อขยาย scope → ทำ `/all-github-repo`
7. ทำ `/suggest-next-action` เพื่อแนะนำเพิ่ม

## Rules

### 1. GitHub Authentication

- ต้อง login ด้วย `gh auth login` ก่อน; ถ้า `gh api user` คืน error ให้ stop และแนะนำ login
- ไม่เดา owner หรือ repo ถ้าหาไม่ได้จริง

### 2. Scope: Personal And Org

- default ครอบคลุมเฉพาะ repo ที owner เป็นเจ้าของ (repo ของ user ส่วนตัว + repo ของแต่ละ org ในรายการ)
- issue ใน repo ของคนอื่นที user ไปเปิดไว้ → ต้องเปลี่ยนจาก `--owner` เป้น `--author <user>` แทน
- org ที API คืน 403/404 ให้ข้าม org นั้นและบันทึกเหตุผลไว้

### 3. Search API Limits

- GitHub Search API คืนผลสูงสุด 1,000 รายการต่อ query — ถ้า `--limit` ชนขอบนี้ ให้แจ้งเตือนและแคบ scope ด้วย `--updated`/`--created` หรือ split per owner
- owners เยอะ → รัน per-owner query แยกกันแล้วรวมผล เพื่อบังคับขอบเขตผลต่อ owner
- `gh search issues` คืนเฉพาะ issue เท่านั้น เว้นแต่ใส่ `--include-prs`; ถ้าต้องแยก PR/issue จากผลรวม ให้เช็ค field `isPullRequest`

### 4. Output

- ใช้ `/report` เสมอ; คอลัมน์ No. เป้นคอลัมน์แรก เรียง 1, 2, 3, ...
- ไม่ใส่ `--json body` ในผลลัพธ์ (เนื้อหาอาจยาวและเป้นข้อมูลภายใน)
- ระบุ scope ทีใช้ (owners, state filter, จำนวน) ทุกครั้ง

## Expected Outcome

- รายการ issue ทั้งหมดของ user ส่วนตัวและ organizations ที user เป้นสมาชิก ในตารางเดียว
- ข้อมูลครบถ้วน: repo, number, title, author, assignees, labels, state, comments, updated, url
- แยกจำนวนต่อ owner พร้อม next action สำหรับ issue ทีเลือก
