---
name: create-github-issue
description: สร้างหรืออัปเดต GitHub issue พร้อม template, labels, assignees, milestones
related:
  - follow-github-issue-templates
  - implement-github-issue
  - create-github-pr
  - ask-me
  - open-github-issue
  - open-github-repo
  - open-github-repo-personal
  - open-github-repo-org
---

## Goal

สร้าง GitHub issue ใหม่ด้วยข้อมูลที่ครบถ้วนและเป็นระเบียบ

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `implement-github-issue`, `create-github-pr`, `open-github-issue`, `open-github-repo`, `open-github-repo-personal`, `open-github-repo-org`

- สร้าง issue ใน repository ที่ระบุ
- ตั้งค่า metadata (title, body, labels, assignees, milestones)
- เชื่อมโยง issue กับ issues อื่น (related, blocking, duplicate)

## Execute

### 1. Prepare Issue Information

> Goal: รวบรวมข้อมูล issue

1. รวบรวมข้อมูล issue: title, description, priority, type
2. ระบุ repository และ branch ที่เกี่ยวข้อง
3. กำหนด labels ตาม project conventions (bug, feature, enhancement, documentation)
4. ระบุ assignees หากมีผู้รับผิดชอบ
5. เชื่อมโยงกับ milestones หากมี roadmap
6. ถ้าไม่มีข้อมูลพอ → ทำ `/ask-me`

### 2. Check Duplicates

> Goal: ตรวจสอบ issue ซ้ำ

1. รัน `gh issue list --search "<title>" --limit 10`
2. ถ้ามี issue ซ้ำ → อัปเดต issue เดิมแทนการสร้างใหม่
3. ระบุ relation `duplicateOf` ถ้าเกี่ยวข้อง

### 3. Use Issue Template

> Goal: เขียน body ตามมาตรฐาน

1. ถ้า repo ยังไม่มี issue templates → ทำ `/follow-github-issue-templates` ก่อน
2. อ่าน `.github/ISSUE_TEMPLATE/*.md`
3. เลือกประเภท issue: bug, feature, plan, test, question, agents-task
4. เขียน title ที่ชัดเจนและกระชับ
5. เขียน description ประกอบด้วย:
   - Problem statement
   - Expected behavior
   - Actual behavior
   - Steps to reproduce
   - Environment details
   - Acceptance criteria
6. เพิ่ม screenshots หรือ logs ถ้าจำเป็น

### 4. Create Issue

> Goal: สร้าง issue บน GitHub

1. รัน `gh issue create --title "<title>" --body "<body>"`
2. เพิ่ม labels ด้วย `--label "<label>"`
3. เพิ่ม assignees ด้วย `--assignee <user>`
4. เพิ่ม milestone ด้วย `--milestone <milestone>`
5. ถ้าเป็น project item → ใช้ `gh project item-add <project-id>`
6. ถ้ามี MCP tool ที่ใช้งานได้ → ใช้ `mcp8_issue_write` หรือ equivalent

### 5. Update Existing Issue

> Goal: อัปเดต issue ที่มีอยู่

1. ถ้าต้องอัปเดต issue ที่มีอยู่ → รัน `gh issue view <number>` เพื่อยืนยัน repo และ issue number
2. แก้ไข title และ body ด้วย `gh issue edit <number>`
3. จัดการ labels ด้วย `--add-label` และ `--remove-label`
4. จัดการ assignees ด้วย `--add-assignee` และ `--remove-assignee`
5. อัปเดต milestone หรือ project ถ้าจำเป็น
6. ถ้ามี comments ใน body → ไม่เขียนทับโดยไม่ขอ user ยืนยันก่อน
7. ตรวจสอบ issue อีกครั้งด้วย `gh issue view <number>`

### 6. Verify And Ship

> Goal: ยืนยันและส่งมอบ

1. ตรวจสอบว่า issue ถูกสร้างสำเร็จ
2. ยืนยัน metadata ถูกต้อง
3. ทำ `/ship-ci`

## Rules

### 1. Issue Title

- ใช้ภาษาอังกฤษหรือตาม project conventions
- เริ่มต้นด้วยประเภท issue (Bug, Feature, Enhancement, Docs)
- ใช้ Title Case
- ไม่เกิน 80 ตัวอักษร
- ตัวอย่าง: `Bug: Login fails after timeout`

### 2. Issue Description

```markdown
## Problem
[อธิบายปัญหาอย่างชัดเจน]

## Expected Behavior
[ความคาดหวัง]

## Actual Behavior
[สิ่งที่เกิดขึ้นจริง]

## Steps to Reproduce
1. [step 1]
2. [step 2]

## Environment
- OS: [version]
- Version: [version]

## Acceptance Criteria
- [ ] criterion 1
- [ ] criterion 2
```

### 3. Labels Convention

| Category | Labels |
|----------|--------|
| Type | bug, feature, enhancement, documentation, refactor |
| Priority | critical, high, medium, low |
| Status | triage, in-progress, review, done |
| Component | frontend, backend, database, api, ui |

### 4. Issue Relations

- `blockedBy`: issue ที่ต้องแก้ก่อน
- `blocks`: issue ที่ถูกบล็อกโดย issue นี้
- `relatedTo`: issue ที่เกี่ยวข้องแต่ไม่บล็อก
- `duplicateOf`: issue ที่ซ้ำกับ issue นี้

### 5. Assignees

- กำหนด assignees หนึ่งคนเป็นหลัก
- หลีกเลี่ยง assign หลายคนเว้นจำเป็น
- ใช้ username ที่ถูกต้องใน GitHub

### 6. Update Existing Issues

- ห้ามเขียนทับ body โดยไม่ได้รับการยืนยันจากผู้ใช้ หากมี comments
- ใช้ `--add-label` และ `--remove-label` เพื่อจัดการ labels
- ใช้ `--add-assignee` และ `--remove-assignee` เพื่อจัดการ assignees
- แก้ไขให้กระชับและน้อยที่สุด
- ตรวจสอบ issue อีกครั้งหลังอัปเดต

## Expected Outcome

- Issue ถูกสร้างหรืออัปเดตด้วยข้อมูลครบถ้วน
- Title และ description ชัดเจนและเป็นมาตรฐาน
- Labels, assignees, milestones ถูกตั้งค่าอย่างถูกต้อง
- Issue เชื่อมโยงกับ issues ที่เกี่ยวข้อง
- การเปลี่ยนแปลง issue ผ่านการตรวจสอบและส่ง URL กลับ
- Team สามารถเข้าใจและดำเนินการได้ทันที

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
