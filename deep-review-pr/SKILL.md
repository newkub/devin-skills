---
name: deep-review-pr
description: Review PR แบบลึก ตอบ comment, resolve conversations, ถาม user ก่อน merge
argument-hint: "[pr-number-or-url]"
related:
  - review-github-pr
  - merge-github-pr
  - review-correctness
  - review-architecture
  - review-quality
  - review-security
  - resolve-errors
  - git-push
  - open-web
  - ask-me
  - report
---

## Goal

Review PR แบบละเอียด ตอบ comments, resolve conversations, และถาม user ก่อน merge

## Scope

- ใช้กับ GitHub PR ทีต้อง deep review
- รองรับ code review, architecture review, security/quality review
- ไม่ merge เองยกเว้น user บอกชัด

## Execute

### 1. Fetch PR

> Goal: รู้ context ของ PR

1. ใช้ `gh pr view <pr-number>` หรือ URL
2. ดู diff ด้วย `gh pr diff <pr-number>`
3. ดู CI status ด้วย `gh pr checks <pr-number>`
4. ดู comments / review comments

### 2. Deep Review

> Goal: หา issues แบบลึก

1. ทำ `/review-correctness`
2. ทำ `/review-architecture`
3. ทำ `/review-quality` ถ้ามี code
4. ทำ `/review-security` ถ้าควร
5. บันทึก findings พร้อม severity

### 3. Reply To Comments

> Goal: ตอบ comments ใน PR

1. อ่านทุก comment ที่ยังไม่ resolve
2. ตอบตาม context:
   - ถ้า comment ถูก แก้ code แล้ว → comment สั้นๆ พร้อม commit SHA
   - ถ้า comment ต้องการอธิบาย → ตอบด้วย evidence
   - ถ้า comment เป็น false positive → ชี้แจง
3. ใช้ `gh pr review <pr-number> --comment` ตอบ
4. ใช้ `gh api repos/{owner}/{repo}/pulls/comments/{id}/replies` ถ้าจำเป็น

### 4. Resolve Findings

> Goal: แก้ issues ทีพบ

1. ถ้ามี changes ต้องทำ → implement ตาม severity
2. ทำ `/run-check`, `/run-test` หลังแก้
3. ทำ `/git-push` ไม่ force
4. เปิด web ให้ user ดู diff หรือ PR

### 5. Ask To Merge

> Goal: ให้ user ตัดสินใจ merge

1. สรุป findings + resolved comments
2. ทำ `/open-web` เปิด PR
3. ถาม user ว่าจะ merge ไหม
4. ถ้าใช่ → ทำ `/merge-github-pr` หรือ `gh pr merge`
5. ถ้าไม่ → report next actions

## Rules

- ไม่ merge เองถ้าไม่ได้ user บอก
- ต้อง resolve ทุก conversation ก่อน merge
- ต้องมี CI ผ่านก่อน merge
- ถ้ามี change ต้อง push กลับ PR branch
- ใช้ evidence ในการตอบ comment

## Expected Outcome

- PR ถูก review ละเอียด
- Comments ถูกตอบ/resolve ครบ
- User ตัดสินใจ merge
- รายงาน findings + next actions
