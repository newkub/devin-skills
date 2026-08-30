---
name: create-github-pr
description: สร้าง pull request จาก current branch พร้อม title, body, labels, reviewers
related:
  - git-commit
  - git-push
  - run-check
  - run-test
  - merge-github-pr
  - implement-github-issue
  - open-github-pr
  - open-github-repo
  - open-github-repo-personal
  - open-github-repo-org
---

## Goal

สร้าง pull request จาก branch ปัจจุบันพร้อม title, body, labels และ reviewers ตาม project conventions

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `implement-github-issue`, `open-github-pr`, `open-github-repo`, `open-github-repo-personal`, `open-github-repo-org`

ใช้หลัง implement เสร็จและต้องการสร้าง PR เพื่อ merge เข้า base branch

## Execute

### 1. Prepare

> Goal: ตรวจสอบสถานะก่อนสร้าง PR

1. ตรวจสอบว่าอยู่ใน branch ที่ถูกต้อง ไม่ใช่ `main`
2. รัน `git status --short` เพื่อดูไฟล์ที่เปลี่ยนแปลง
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

> Goal: สร้าง PR title และ body ในรูปแบบ feature-based พร้อมหลักฐาน

1. สร้าง title จาก commit messages หรือ task ที่ทำ
2. ถ้า PR ประกอบด้วยหลาย feature หรือ change ที่แยกออกเป็นส่วนได้ → แบ่ง body เป็นหลาย section โดยแต่ละ section เป็น 1 feature:
   - ใช้ heading ชัดเจนระบุชื่อ feature เช่น `## Feature: <ชื่อ>`
   - ภายใต้แต่ละ feature ให้ใช้ตาราง 1 row ที่มี 5 คอลัมน์:
     | Description | Benefit | Why | File Change | Image/Video |
   - `Description`: อธิบายว่า feature/change นี้ทำอะไร
   - `Benefit`: value ที่ได้รับจาก change นี้
   - `Why`: เหตุผลที่ต้องทำหรือปัญหาที่แก้
   - `File Change`: ไฟล์หรือ path หลักที่เปลี่ยนแปลง
   - `Image/Video`: หลักฐาน screenshot หรือ video ที่บันทึกจาก `/record-video-terminal` หรือ `/capture-terminal` เท่านั้น
3. ห้ามใช้ mockup, placeholder หรือ image/video ที่ไม่ใช่หลักฐานจริงใน column Image/Video
4. ถ้า PR ไม่ใช่ลักษณะ feature → ใช้รูปแบบมาตรฐาน:
   - Summary
   - Changes (bullet points)
   - Type of change
   - Breaking changes (ถ้ามี)
   - Testing done
   - Issue references (เช่น `Closes #<issue>`)
5. ถ้ามี project template → อ่าน `.github/pull_request_template.md`
6. ใช้ format มาตรฐานถ้าไม่มี template:
```markdown
## Summary
[อธิบาย changes อย่างกระชับ]

## Feature: <feature-name>
| Description | Benefit | Why | File Change | Image/Video |
|---|---|---|---|---|
| [อธิบาย feature] | [value ที่ได้] | [เหตุผล/ปัญหา] | `path/to/file` | ![evidence](path/to/screenshot.png) หรือ [video](path/to/video.cast) |

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
7. ถ้าไม่ชัด → ทำ `/ask-me`

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
3. ถ้าต้องการ merge ต่อ → ทำ `/merge-github-pr`

## Rules

- ต้องรัน checks ก่อนสร้าง PR
- branch ต้อง push ก่อนสร้าง PR
- ไม่สร้าง PR บน `main`
- ใช้ PR template ถ้ามี
- ระบุ `Closes #<issue>` ถ้าเกี่ยวข้อง
- ห้ามใช้ mockup หรือ placeholder สำหรับ image/video ในตาราง feature ต้องเป็นหลักฐานจริงจาก `/record-video-terminal` หรือ `/capture-terminal`
- ถ้า title/body ไม่ชัด → ถาม user

## Expected Outcome

- PR ถูกสร้างพร้อม title, body ในรูปแบบ feature-based, labels
- แต่ละ feature มี heading และตาราง 5 คอลัมน์ (Description, Benefit, Why, File Change, Image/Video)
- Image/Video ในตารางเป็นหลักฐานจริงจาก `/record-video-terminal` หรือ `/capture-terminal` ห้าม mockup
- Branch ถูก push แล้ว
- Checks ผ่านก่อนสร้าง PR
- Issue ถูก link (ถ้ามี)
