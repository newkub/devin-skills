---
name: create-github-issue
description: สร้าง GitHub issue ใหม่พร้อม template, labels, assignees, และ milestones
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

สร้าง GitHub issue ใหม่ด้วยข้อมูลที่ครบถ้วนและเป็นระเบียบ

## Scope

- สร้าง issue ใน repository ที่ระบุ
- ตั้งค่า metadata (title, body, labels, assignees, milestones)
- เชื่อมโยง issue กับ issues อื่น (related, blocking, duplicate)

## Execute

### 1. Prepare Issue Information

1. รวบรวมข้อมูล issue: title, description, priority, type
2. ระบุ repository และ branch ที่เกี่ยวข้อง
3. กำหนด labels ตาม project conventions (bug, feature, enhancement, documentation)
4. ระบุ assignees หากมีผู้รับผิดชอบ
5. เชื่อมโยงกับ milestones หากมี roadmap

### 2. Write Issue Template

1. ใช้ issue template ตาม project standards
2. เขียน title ที่ชัดเจนและกระชับ
3. เขียน description ด้วยรูปแบบมาตรฐาน:
   - Problem statement
   - Expected behavior
   - Actual behavior
   - Steps to reproduce
   - Environment details
4. เพิ่ม screenshots หรือ logs หากจำเป็น

### 3. Create Issue With MCP Tool

1. ใช้ `mcp8_issue_write` ด้วย method `create`
2. ระบุ owner, repo, title, body
3. ตั้งค่า labels, assignees, milestones
4. เชื่อมโยงกับ issues อื่น (blockedBy, blocks, relatedTo, duplicateOf)
5. ตั้งค่า priority และ state

### 4. Verify Issue Creation

1. ตรวจสอบว่า issue ถูกสร้างสำเร็จ
2. ยืนยันว่า metadata ถูกต้อง (labels, assignees, milestones)
3. ตรวจสอบความสมบูรณ์ของ description
4. ทดสอบการเชื่อมโยงกับ issues อื่น

## Rules

### 1. Issue Title

- ใช้ภาษาอังกฤษเสมอ
- เริ่มต้นด้วยประเภท issue (Bug, Feature, Enhancement, Docs)
- ใช้ Title Case
- ไม่เกิน 80 ตัวอักษร
- ตัวอย่าง: `Bug: Login fails after timeout`

### 2. Issue Description

ใช้ template มาตรฐาน:

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
3. [step 3]

## Environment
- OS: [version]
- Version: [version]
```

### 3. Labels Convention

ใช้ labels ตามประเภท:

| Category | Labels |
|----------|--------|
| Type | bug, feature, enhancement, documentation, refactor |
| Priority | critical, high, medium, low |
| Status | triage, in-progress, review, done |
| Component | frontend, backend, database, api, ui |

### 4. Issue Relations

ใช้ relations อย่างเหมาะสม:

- `blockedBy`: issue ที่ต้องแก้ก่อน
- `blocks`: issue ที่ถูกบล็อกโดย issue นี้
- `relatedTo`: issue ที่เกี่ยวข้องแต่ไม่บล็อก
- `duplicateOf`: issue ที่ซ้ำกับ issue นี้

### 5. Assignees

- กำหนด assignees หนึ่งคนเป็นหลัก
- หลีกเลี่ยง assign หลายคนเว้นจำเป็น
- ใช้ username ที่ถูกต้องใน GitHub

## Expected Outcome

- Issue ถูกสร้างด้วยข้อมูลครบถ้วน
- Title และ description ชัดเจนและเป็นมาตรฐาน
- Labels, assignees, milestones ถูกตั้งค่าอย่างถูกต้อง
- Issue เชื่อมโยงกับ issues ที่เกี่ยวข้อง
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
