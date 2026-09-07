---
name: update-github-pr
description: แก้ไข title, body, labels, reviewers, base branch ของ GitHub pull request ด้วย `gh pr edit`
argument-hint: "[pr-number] [repo]"
related:
  - create-github-pr
  - merge-github-pr
  - resolve-github-pr
---

## Goal

แก้ไข GitHub pull request ที่มีอยู่ด้วย `gh pr edit`, `gh pr comment`, และ `gh api`

## Scope

- แก้ไข PR title, body, labels, reviewers, base branch, draft status
- เพิ่ม แก้ไข หรือตอบ comments
- รองรับ repo ปัจจุบัน หรือ `--repo owner/repo`

## Execute

### 1. Verify Target

> Goal: ยืนยัน PR ที่จะแก้ไข

1. รัน `gh auth status`
2. รัน `gh pr view <number> --repo <owner/repo> --json number,title,body,state,headRepositoryOwner,headRefName,baseRefName`
3. ตรวจสอบสิทธิ์ write บน PR
4. ถ้าไม่ระบุ repo ใช้ git remote ของ directory ปัจจุบัน

### 2. Update PR Body

> Goal: แก้ไขเนื้อหาหลักของ PR

1. อ่าน PR template จาก `.github/PULL_REQUEST_TEMPLATE.md` หรือ `create-github-pr/templates/pr.md` ถ้ามี
2. แทนที่ placeholders ด้วยข้อมูลใหม
3. บันทึกลง temp file
4. รัน `gh pr edit <number> --body-file <body.md>`
5. ถ้าต้องเปลี่ยน title รัน `gh pr edit <number> --title "<title>"`

### 3. Update PR Metadata

> Goal: แก้ไข labels, reviewers, base, และ draft status

1. เพิ่ม/ลบ labels: `gh pr edit <number> --add-label <label> --remove-label <label>`
2. เพิ่ม reviewers: `gh pr edit <number> --add-reviewer <user>`
3. เปลี่ยน base branch: `gh pr edit <number> --base <branch>`
4. เปลี่ยน draft status:
   - Mark as ready: `gh pr ready <number>`
   - Convert to draft: `gh pr ready <number> --undo`

### 4. Update Comments

> Goal: แก้ไขหรือเพิ่ม comments ใน PR

1. ดึง comment IDs ด้วย `gh pr view <number> --comments --json comments`
2. แก้ไข comment เก่า: `gh api -X PATCH /repos/<owner>/<repo>/issues/comments/<comment-id> -f body=@<comment.md>`
3. เพิ่ม comment ใหม: `gh pr comment <number> --body-file <comment.md>`
4. ตอบด้วย review comment: `gh pr review <number> --comment -b "<body>"`

### 5. Verify And Report

> Goal: ยืนยันว่าการแก้ไขสำเร็จ

1. รัน `gh pr view <number> --comments --json number,title,body,labels,reviewers`
2. ตรวจสอบ body และ comments
3. รายงาน PR URL กลับ

## Rules

### 1. Safety

- ถ้า PR มี comments จากคนอื่น อย่า overwrite PR body โดยไม่ขอ user confirmation
- ลบ ลบ comments หรือ force-push ต้องถาม user ก่อน
- ถ้าเปลี่ยน base branch จะทำให้เกิด conflicts ต้องแจ้ง user ก่อน

### 2. Templates

- ถ้าแก้ไข PR body ให้ใช้ repo PR template ก่อน
- ถ้าไม่มี template ให้ใช้ `create-github-pr/templates/pr.md` หรือสร้างใหม
- ถ้า PR เกี่ยวกับ `idea` features ให้ใช้ `create-github-issue/templates/idea.md` สำหรับ feature comments ถ้าจำเป็น

### 3. Review Workflow

- ขอ review ด้วย `gh pr edit <number> --add-reviewer <user>`
- resolve conversation ด้วย `gh pr review <number> --comment` หรือ `gh api`
- merge PR ให้ส่งต่อ `/merge-github-pr` หรือ `/resolve-github-pr`

## Expected Outcome

- PR title, body, labels, reviewers, base branch, draft status ถูกแก้ไขตาม request
- Comments เพิ่มหรือแก้ไขถูกต้อง
- รายงาน PR URL กลับ
- ไม่สูญเสียข้อมูลสำคัญระหว่าง update
