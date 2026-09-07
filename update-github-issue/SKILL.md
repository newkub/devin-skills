---
name: update-github-issue
description: แก้ไข title, body, comments, labels, assignees, metadata ของ GitHub issue ด้วย `gh issue edit`
argument-hint: "[issue-number] [repo]"
related:
  - create-github-issue
  - ask-me
---

## Goal

แก้ไข GitHub issue ที่มีอยู่ด้วย `gh issue edit`, `gh issue comment --edit-last`, และ `gh api` สำหรับ comment เก่า

## Scope

- แก้ไข issue title, body, labels, assignees, milestone, project, type, parent
- เพิ่มหรือแก้ไข comments
- ใช้ `create-github-issue/templates/<type>.md` ถ้าต้อง reformat body หรือ comment
- รองรับ repo ปัจจุบัน หรือ `--repo owner/repo`

## Execute

### 1. Verify Target

> Goal: ยืนยัน issue ที่จะแก้ไข

1. รัน `gh auth status`
2. รัน `gh issue view <number> --repo <owner/repo> --json number,title,body,comments`
3. ตรวจสอบสิทธิ์ write บน issue
4. ถ้าไม่ระบุ repo ใช้ git remote ของ directory ปัจจุบัน

### 2. Update Issue Body

> Goal: แก้ไขเนื้อหาหลักของ issue

1. เลือก template จาก `create-github-issue/templates/<type>.md`
2. แทนที่ placeholders ด้วยข้อมูลใหม
3. บันทึกลง temp file
4. รัน `gh issue edit <number> --body-file <body.md>`
5. ถ้าต้องเปลี่ยน title รัน `gh issue edit <number> --title "<title>"`

### 3. Update Comments

> Goal: แก้ไขหรือเพิ่ม comments

1. ดึง comment IDs ด้วย `gh issue view <number> --comments --json comments`
2. แก้ไข comment ล่าสุด: `gh issue comment <number> --edit-last --body-file <comment.md>`
3. แก้ไข comment เก่า: `gh api -X PATCH /repos/<owner>/<repo>/issues/comments/<comment-id> -f body=@<comment.md>`
4. เพิ่ม comment ใหม: `gh issue comment <number> --body-file <comment.md>`
5. ลบ comment: `gh api -X DELETE /repos/<owner>/<repo>/issues/comments/<comment-id>` (ถาม user ก่อน)

### 4. Update Metadata

> Goal: แก้ไข labels, assignees, milestones

1. เพิ่ม/ลบ labels: `gh issue edit <number> --add-label <label> --remove-label <label>`
2. เพิ่ม/ลบ assignees: `gh issue edit <number> --add-assignee <user> --remove-assignee <user>`
3. เปลี่ยน milestone: `gh issue edit <number> --milestone "<milestone>"` หรือ `--remove-milestone`
4. เพิ่ม/ลบ project: `gh issue edit <number> --add-project "<project>" --remove-project <id>`
5. เปลี่ยน type หรือ parent: `gh issue edit <number> --type <type> --parent <number>`

### 5. Verify And Report

> Goal: ยืนยันว่าการแก้ไขสำเร็จ

1. รัน `gh issue view <number> --comments --json number,title,body,labels,assignees`
2. ตรวจสอบ body และ comments ให้ตรงกับ template
3. รายงาน issue URL กลับ

## Rules

### 1. Safety

- ถ้า issue มี comments จากคนอื่น อย่า overwrite body โดยไม่ขอ user confirmation
- ลบ ลบ labels หรือ close ต้องถาม user ก่อน
- ปิด issue ใช้ `gh issue close` ไม่ใช่ delete

### 2. Templates

- ถ้าแก้ไข body หรือ comment ของ `idea` issue ใช้ `create-github-issue/templates/idea.md`
- ตารางต้องเป็น `| Feature | Type | Why | Benefit | Impact | Phase | Effort | MVP Score | Risk |`
- Todo ต้องเป็นตาราง `Action | Files | Dependencies | Workspace`
- UX/UI Sketch ต้องเป็น ANSI art จาก project analysis จริง หัวข้อต้องไม่มี `(ANSI)`

### 3. Reformat Existing Issues

- ถ้า user ขอแก้ไข issue ที่สร้างโดย skill เก่า อ่าน issue ปัจจุบันแล้ว reformat ด้วย template ใหม
- ถ้ามีหลาย comments ใช้ script อัปเดตทีละอัน
- ถ้า type ไม่ชัด ใช้ `/ask-me`

## Expected Outcome

- Issue body และ comments ถูกอัปเดตตาม template ใหม
- Metadata (labels, assignees, milestone, project) ถูกต้อง
- รายงาน issue URL กลับ
- ไม่สูญเสียข้อมูลสำคัญระหว่าง update
