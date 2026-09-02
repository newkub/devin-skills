---
name: create-github-issue
description: ใช้ `gh issue` สร้าง ดู แก้ไข ปิด ลบ และจัดการ issues ของ repository ผ่าน CLI
argument-hint: "[action] [repo]"
related:
  - follow-github-issue-templates
  - implement-github-issue
  - create-github-pr
  - ask-me
  - open-github-issue
  - open-github-pr
  - list-github-issue
  - view-issue
  - open-github-repo
  - open-github-repo-personal
  - open-github-repo-org
---

## Goal

ใช้ `gh issue` สร้าง ค้นหา ดู แก้ไข ปิด เปิด ลบ และจัดการ issues ของ repository ผ่าน CLI ทั้ง interactive และ scripted

## Scope

- สำหรับ skills ที่เกี่ยวข้อง: `open-github-issue`, `open-github-pr`, `list-github-issue`, `view-issue`, `follow-github-issue-templates`, `create-github-pr`, `review-github-issue`
- รองรับ repo ปัจจุบันหรือ `--repo owner/repo`
- ไม่ project management ขั้นสูง

## Execute

### 1. Verify Repository And Auth

> Goal: ยืนยันเป้าหมาย repo

1. รัน `gh auth status`
2. รัน `gh repo view` เพื่อดู repo ปัจจุบัน
3. ถ้าอยู่นอก repo ใช้ `--repo owner/repo` ทุกคำสั่ง
4. ตรวจสิทธิ์เขียน issue

### 2. List And View Issues

> Goal: ค้นหาและดูรายละเอียด

1. `gh issue list --state all --limit 50` สำหรับ open/closed
2. `gh issue list --label <label> --assignee <user>` เพื่อกรอง
3. `gh issue view <number>` สำหรับรายละเอียด
4. `gh issue view <number> --comments` สำหรับ comments
5. `gh issue view <number> --web` เปิด browser

### 3. Check Duplicates

> Goal: ตรวจสอบ issue ซ้ำก่อนสร้าง

1. `gh issue list --search "<title>" --limit 10`
2. ถ้าซ้ำ → อัปเดต issue เดิม ระบุ `duplicateOf`
3. ถ้าไม่ซ้ำ → ไปสร้างใหม่

### 4. Use Issue Template

> Goal: เขียน body ตามมาตรฐาน

1. ถ้า repo ยังไม่มี templates → `/follow-github-issue-templates`
2. อ่าน `.github/ISSUE_TEMPLATE/*.md`
3. เลือกประเภท: bug, feature, plan, test, question, agents-task
4. เขียน title, description ด้วยภาษาอังกฤษ
5. description ประกอบด้วย: Problem, Expected, Actual, Steps, Environment, Acceptance Criteria

### 5. Create Issue

> Goal: สร้าง issue บน GitHub

1. `gh issue create` แบบ interactive
2. หรือ `gh issue create --title "<title>" --body "<body>"`
3. หรือ `gh issue create -F body.md` เพื่ออ่าน body จากไฟล์
4. เพิ่ม `--label`, `--assignee`, `--milestone`, `--project`, `--type`, `--parent`
5. ถ้าเป็น project item → `gh project item-add <project-id>`
6. ใช้ `--web` เปิดหน้า create ใน browser

### 6. Update And Edit Issues

> Goal: อัปเดต metadata และเนื้อหา

1. `gh issue edit <number> --title "<title>" --body "<body>"`
2. `gh issue edit <number> --add-label bug --remove-label duplicate`
3. `gh issue edit <number> --add-assignee <user> --remove-assignee <user>`
4. `gh issue edit <number> --add-project "<title>" --remove-project <id>`
5. `gh issue edit <number> --milestone "v1.0"` หรือ `--remove-milestone`
6. `gh issue edit <number> --type Bug --parent <number>`

### 7. Manage Issue Lifecycle

> Goal: ปิด เปิด คอมเมนต์ ย้าย ลบ

1. `gh issue close <number>` หรือ `gh issue reopen <number>`
2. `gh issue comment <number> --body "<comment>"`
3. `gh issue pin <number>` / `gh issue unpin <number>`
4. `gh issue lock <number>` / `gh issue unlock <number>` ด้วยความระมัดระวัง
5. `gh issue transfer <number> <owner/repo>` เพื่อย้าย
6. `gh issue delete <number> --yes` ต้องถาม user ก่อน ใช้แทน `close` ถ้าต้องการลบจริง

### 8. Verify And Report

> Goal: ยืนยันผลและส่งมอบ

1. ตรวจสอบ issue ถูกสร้าง/แก้ไขสำเร็จ
2. `gh issue view <number>` เพื่อตรวจสอบครั้งสุดท้าย
3. รายงาน URL ของ issue กลับ

## Rules

### 1. Repository Target

- `gh issue` ใช้ repo จาก git remote ของ current directory
- ใช้ `--repo owner/repo` หรือ `-R` สำหรับ repo อื่น

### 2. Language

- เขียน title และ description ด้วยภาษาอังกฤษทั้งหมด
- ยกเว้น technical terms, project/skill names, paths, commands, และ repo conventions ที่กำหนดภาษาอื่น
- ถ้า repo conventions ไม่ระบุภาษา ใช้ภาษาอังกฤษเป็นค่าเริ่มต้น

### 3. Issue Title

- เริ่มต้นด้วยประเภท issue (Bug, Feature, Enhancement, Docs)
- ใช้ Title Case
- ไม่เกิน 80 ตัวอักษร
- ตัวอย่าง: `Bug: Login fails after timeout`

### 4. Issue Description

```markdown
## Problem
[Describe the problem clearly]

## Expected Behavior
[What you expected to happen]

## Actual Behavior
[What actually happened]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]

## Environment
- OS: [version]
- Version: [version]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

### 5. Labels Convention

| Category | Labels |
|----------|--------|
| Type | bug, feature, enhancement, documentation, refactor |
| Priority | critical, high, medium, low |
| Status | triage, in-progress, review, done |
| Component | frontend, backend, database, api, ui |

### 6. Issue Relations

- `blockedBy`: issue ที่ต้องแก้ก่อน
- `blocks`: issue ที่ถูกบล็อกโดย issue นี้
- `relatedTo`: issue ที่เกี่ยวข้องแต่ไม่บล็อก
- `duplicateOf`: issue ที่ซ้ำกับ issue นี้

### 7. Assignees

- กำหนด assignees หนึ่งคนเป็นหลัก
- หลีกเลี่ยง assign หลายคนเว้นจำเป็น
- ใช้ username ที่ถูกต้องใน GitHub

### 8. Update Existing Issues

- ห้ามเขียนทับ body โดยไม่ได้รับการยืนยันจากผู้ใช้ หากมี comments
- ใช้ `--add-label` และ `--remove-label`
- ใช้ `--add-assignee` และ `--remove-assignee`
- ตรวจสอบ issue อีกครั้งหลังอัปเดต

### 9. Safety

- คำสั่ง `delete`, `close`, `lock`, `transfer` เป็น destructive ต้องถาม user ก่อน
- ตรวจสอบ issue number/repo ก่อนเปลี่ยนสถานะ
- ใช้ `gh issue close` แทน `delete` ถ้าต้องการปิดเท่านั้น

### 10. Interactive And Script Mode

- ใน TTY `gh issue create` ถาม title/body ถ้าขาด flags
- ใน scripts/CI ให้ระบุ flags ครบถ้วนเพื่อหลีกเลี่ยง interactive
- ใช้ `--json` หรือ `--jq` เพื่อรับ output เป็น JSON
- ใช้ `--template` เพื่อจัดรูปแบบ output

### 11. CLI Reference

| Command | Description | Common Options |
|---------|-------------|----------------|
| `gh issue list` | List issues | `-R`, `--state`, `--label`, `--assignee`, `--limit` |
| `gh issue view <id>` | View issue | `-R`, `--comments`, `--json`, `--web` |
| `gh issue create` | Create issue | `-R`, `--title`, `--body`, `--label`, `--assignee`, `--milestone`, `--project`, `--type`, `--parent`, `--web` |
| `gh issue edit <id>` | Edit issue | `-R`, `--title`, `--body`, `--add-label`, `--remove-label`, `--add-assignee`, `--remove-assignee`, `--add-project`, `--remove-project`, `--milestone`, `--type`, `--parent` |
| `gh issue close <id>` | Close issue | `-R`, `--comment`, `--reason` |
| `gh issue reopen <id>` | Reopen issue | `-R`, `--comment` |
| `gh issue comment <id>` | Comment | `-R`, `--body`, `--edit-last` |
| `gh issue delete <id>` | Delete issue | `-R`, `--yes` |

## Expected Outcome

- สามารถสร้าง ค้นหา ดู แก้ไข และจัดการ lifecycle ของ issues ผ่าน `gh issue` ได้
- ใช้งานได้ทั้ง interactive และ scripted
- Issues เชื่อมโยงกับ project/labels/assignees/milestones ถูกต้อง
- ไม่มี issue ถูกลบ/ย้าย/ปิดโดยไม่ได้รับอนุญาต
- Team เข้าใจและดำเนินการได้ทันที

## Common Mistakes

- ไม่ใช้ template ทำให้ข้อมูลไม่ครบ
- Title ไม่ชัดเจนหรือยาวเกินไป
- ไม่ระบุ environment details
- ไม่เชื่อมโยงกับ issues ที่เกี่ยวข้อง
- ใช้ labels ที่ไม่ตรงกับ conventions

## Anti-Patterns

- สร้าง issue ที่กว้างเกินไป (should be split)
- สร้าง issue ที่ไม่มี action items
- สร้าง issue โดยไม่มี steps to reproduce
- ใช้ description สั้นเกินไปไม่มี context
