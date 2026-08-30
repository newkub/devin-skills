---
name: ship-review
description: Ship workspace ผ่าน branch, review, issue, และ PR โดยไม่ merge เอง รอ human merge
related:
  - ship
  - ship-github-issue
  - ship-release
  - review-correctness
  - review-architecture
  - create-github-issue
  - create-github-pr
  - unified-review-and-merge-pr
  - watch-cicd-and-resolve
  - run-verify
  - git-commit
  - git-push
---

## Goal

Ship การเปลี่ยนแปลงโดยสร้าง branch, รัน verify, review, สร้าง issue + PR, และรอ human merge

## Scope

ใช้เมื่องานใน workspace เสร็จสมบูรณ์ แต่ต้องการ human-in-the-loop ก่อน merge เข้า `main`/`master`
- ใช้แทน `/ship-ci` เมื่อไม่ต้องการ push ตรง `main`
- ใช้เมื่อต้องการ review ก่อน merge
- ไม่ merge เอง สิ้นสุดที PR ทีพร้อมให้ human merge

## Execute

### 1. Update AGENTS.md

> Goal: `AGENTS.md` เป็นปัจจุบันก่อน ship

1. ถ้า `AGENTS.md` ไม่มีหรือไม่อัปเดต → ทำ `/update-agents-md`
2. ตรวจสอบว่า `AGENTS.md` มี sections ครบ
3. ถ้า `AGENTS.md` ไม่พร้อมใช้ → stop และ report

### 2. Create Review Branch

> Goal: แยกการทำงานออกจาก `main`

1. รัน `git branch --show-current` และ `git status --porcelain`
2. ถ้าอยู่บน `main`/`master` → สร้าง branch ใหม่ เช่น `ship/review-<timestamp>` หรือ `ship/<topic>-<timestamp>`
3. ถ้าอยู่บน branch อื่นอยู่แล้ว → ใช้ branch นั้นได้เลย
4. รัน `git checkout -b <branch-name>`
5. ถ้ามี uncommitted changes → ทำ `/git-commit` หรือ `/git-commit` ก่อน

### 3. Verify

> Goal: ตรวจสอบความพร้อมก่อน review

1. ทำ `/run-verify`
2. ทำ `/run-test-all` ถ้ามี test suites
3. ทำ `/deep-validate` เบื้องต้น
4. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry

### 4. Review Codebase

> Goal: รีวิวคุณภาพก่อนสร้าง PR

1. ทำ `/review-correctness`
2. ทำ `/review-architecture`
3. บันทึก findings และ severity
4. ถ้ามี Critical findings → แก้ไขก่อนสร้าง issue/PR หรือระบุใน issue

### 5. Commit

> Goal: commit การเปลี่ยนแปลงบน review branch

1. รัน `git status --short`
2. ถ้ามี uncommitted changes → ทำ `/git-commit`
3. ถ้าไม่มี changes → stop และ report

### 6. Create Tracking Issue

> Goal: สร้าง issue สำหรับ track review + implementation

1. ตรวจว่า repo มี labels `review` และ `implement` ไหม ถ้าไม่มี → สร้างด้วย:
   - `gh label create review --description "Needs review" --color FF0000` หรือ `--color ff0000`
   - `gh label create implement --description "Implementation work" --color 0E8A16`
2. สร้าง issue ด้วย `/create-github-issue` หรือ:
   - title: `[Review+Implement] <summary>`
   - body: สรุปสิ่งทีทำ, findings จาก review, acceptance criteria
   - labels: `review,implement`
3. บันทึก issue number

### 7. Push Branch

> Goal: ส่ง branch ขึ้น remote

1. รัน `/git-push` หรือ `git push -u origin <branch-name>`
2. ไม่ force push

### 8. Create Pull Request

> Goal: สร้าง PR พร้อม link กลับ issue

1. ทำ `/create-github-pr` หรือ `gh pr create`
2. ใส่ `Closes #<issue-number>` หรือ `Relates to #<issue-number>` ใน PR body
3. ใส่ labels `review` และ `implement`
4. ถ้าต้องการให้ human ตรวจก่อน → สร้างเป็น draft หรือ assign reviewer
5. ไม่ merge เอง

### 9. Watch CI (Optional)

> Goal: ตรวจสอบ CI บน PR

1. รอ CI รันบน PR
2. ทำ `/watch-cicd-and-resolve` หรือ `/watch-github-actions` ถ้า CI fail
3. ถ้า CI ไม่ผ่าน → แก้ไขบน branch, commit, push

### 10. Report

> Goal: สรุปผล

1. รายงาน branch, issue number, PR number, URL
2. รายงาน review findings สั้นๆ
3. รายงาน CI status
4. ทำ `/suggest-next-action` เพื่อแนะนำ next step (เช่น เรียก `/unified-review-and-merge-pr`)

## Rules

### 1. No Direct Push to Main

- ห้าม push `main`/`master` โดยตรง
- ต้องผ่าน branch + PR

### 2. No Auto-Merge

- `ship-review` สิ้นสุดที PR ทีพร้อม review
- ไม่ merge เอง
- ถ้าต้องการ merge ต่อ → ใช้ `/unified-review-and-merge-pr`

### 3. Review First

- ต้อง review ก่อนสร้าง issue/PR
- ถ้า findings Critical ต้องแก้ไขหรืออธิบายใน issue ก่อน

### 4. Labels

- ใช้ labels `review` และ `implement` เสมอ
- ถ้า labels ไม่มีต้องสร้างก่อน

### 5. No Force Push

- ไม่ใช้ `--force` หรือ `--force-with-lease`

### 6. Issue-PR Link

- PR ต้อง link กลับ issue เสมอ
- ใช้ `Closes #<issue>` หรือ `Relates to #<issue>`

## Expected Outcome

- `AGENTS.md` อัปเดตและถูกต้อง
- Review branch ถูกสร้างและ push
- Verify ผ่าน
- GitHub issue ถูกสร้างด้วย labels `review` และ `implement`
- GitHub PR ถูกสร้างด้วย link กลับ issue
- CI บน PR ผ่านหรือมี root cause + next action ชัดเจน
- ไม่มี direct push ไป `main`/`master`
- ไม่มี auto-merge
