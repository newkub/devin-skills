---
name: create-github-pull-request
description: สร้าง pull request จาก current branch พร้อม title, body, labels, reviewers
related:
  - git-commit
  - git-push
  - run-check
  - run-test
  - merge-github-pull-request
  - implement-github-issue
  - open-github-pr
  - open-github-repo-personal
  - open-github-repo-org
---

## Goal

สร้าง pull request จาก branch ปัจจุบันพร้อม title, body, labels และ reviewers ตาม project conventions

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `implement-github-issue`, `open-github-pr`, `open-github-repo-personal`, `open-github-repo-org`

ใช้หลัง implement เสร็จและต้องการสร้าง PR เพื่อ merge เข้า base branch

## Execute

### 1. Prepare

> Goal: ตรวจสอบสถานะก่อนสร้าง PR

1. ตรวจสอบว่าอยู่ใน branch ทีถูกต้อง ไม่ใช่ `main`
2. รัน `git status --short` เพื่อดูไฟล์ทีเปลี่ยนแปลง
3. ถ้ามี uncommitted changes → ทำ `/git-commit` ก่อน
4. รัน `git log --oneline main..HEAD` เพื่อดู commits

### 2. Push Branch

> Goal: ส่ง branch ขึ้น remote

1. รัน `/git-push` หรือ `git push -u origin <branch>`
2. ตรวจสอบว่า branch ถูก push สำเร็จ

### 3. Run Checks

> Goal: ตรวจสอบคุณภาพก่อนสร้าง PR

1. ทำ `/run-check` (lint, typecheck, scan)
2. ทำ `/run-test` สำหรับ tests
3. ถ้าไม่ผ่าน → ทำ `/resolve-errors` ก่อน

### 4. Build PR Body

> Goal: สร้าง PR title และ body

1. สร้าง title จาก commit messages หรือ task ทีทำ
2. สร้าง body ประกอบด้วย:
   - Summary
   - Changes (bullet points)
   - Type of change (feat, fix, refactor, docs)
   - Breaking changes (ถ้ามี)
   - Testing done
   - Issue references (เช่น `Closes #<issue>`)
3. ถ้ามี project template → อ่าน `.github/pull_request_template.md`
4. ใช้ format มาตรฐานถ้าไม่มี template:
```markdown
## Summary
[อธิบาย changes อย่างกระชับ]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation
- [ ] Refactoring

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing done

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if needed)
```
5. ถ้าไม่ชัด → ทำ `/ask-me`

### 5. Create PR

> Goal: สร้าง PR

1. รัน `gh pr create --title "<title>" --body "<body>" --base <base-branch>`
2. เพิ่ม labels ด้วย `--label "<label>"`
3. เพิ่ม reviewers ด้วย `--reviewer <reviewer>`
4. เพิ่ม assignees ด้วย `--assignee <user>`
5. ถ้าเป็น draft → ใช้ `--draft`

### 6. Link Issue

> Goal: เชื่อมโยง issue

1. ถ้ามี issue number → เพิ่ม `Closes #<issue>` ใน body
2. ถ้าไม่ → ถาม user ว่าต้องการ link issue หรือไม่
3. ถ้ามี project board → ใช้ `gh project item-add`

### 7. Report

> Goal: สรุปผล

1. รายงาน PR number, URL, title
2. รายงาน status checks และ labels
3. ถ้าต้องการ merge ต่อ → ทำ `/merge-github-pull-request`

## Rules

- ต้องรัน checks ก่อนสร้าง PR
- branch ต้อง push ก่อนสร้าง PR
- ไม่สร้าง PR บน `main`
- ใช้ PR template ถ้ามี
- ระบุ `Closes #<issue>` ถ้าเกี่ยวข้อง
- ถ้า title/body ไม่ชัด → ถาม user

## Expected Outcome

- PR ถูกสร้างพร้อม title, body, labels
- Branch ถูก push แล้ว
- Checks ผ่านก่อนสร้าง PR
- Issue ถูก link (ถ้ามี)
