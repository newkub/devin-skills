---
name: create-github-pr
description: สร้าง pull request ใหม่จาก branch ปัจจุบัน พร้อม description และ reviewers
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

สร้าง pull request ใหม่ด้วยข้อมูลที่ครบถ้วนและเป็นระเบียบ

## Scope

- สร้าง PR จาก branch ปัจจุบันไปยัง base branch
- เขียน description ด้วย template มาตรฐาน
- ระบุ reviewers และเชื่อมโยงกับ issues
- ตั้งค่า metadata (labels, milestones, draft mode)

## Execute

### 1. Prepare Branch

1. ตรวจสอบว่า branch ปัจจุบันสะอาดและ sync กับ remote
2. ทำ `/run-lint` เพื่อตรวจสอบ code quality
3. ทำ `/run-test` เพื่อตรวจสอบว่า tests ผ่าน
4. ทำ `/run-build` เพื่อตรวจสอบว่า build สำเร็จ
5. Commit changes ด้วย conventional commit format

### 2. Link To Issue

1. ระบุ issue ที่เกี่ยวข้อง (ถ้ามี)
2. ใช้ format `Closes #issue-number` หรือ `Fixes #issue-number` ใน commit message
3. อัปเดต issue ด้วย link ไปยัง PR

### 3. Write PR Description

1. ใช้ PR template ตาม project standards
2. เขียน title ที่ชัดเจนและกระชับ
3. เขียน description ด้วยรูปแบบมาตรฐาน:
   - Summary of changes
   - Type of change (feat, fix, refactor, docs, etc.)
   - Breaking changes (ถ้ามี)
   - Testing done
   - Screenshots (ถ้ามี UI changes)
4. เพิ่ม checklist สำหรับ review

### 4. Create PR With MCP Tool

1. ใช้ `mcp3_create_pull_request`
2. ระบุ owner, repo, title, body
3. ตั้งค่า head (current branch) และ base (target branch)
4. ระบุ reviewers หากจำเป็น
5. ตั้งค่า draft mode หากยังไม่พร้อม review

### 5. Verify PR Creation

1. ตรวจสอบว่า PR ถูกสร้างสำเร็จ
2. ยืนยันว่า CI checks รันอัตโนมัติ
3. ตรวจสอบว่า issue ถูกเชื่อมโยงอย่างถูกต้อง
4. ทดสอบว่า reviewers ได้รับ notification

## Rules

### 1. PR Title

- ใช้ conventional commit format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Scope: component หรือ module ที่เกี่ยวข้อง
- Description: กระชับ ใช้ present tense
- ตัวอย่าง: `feat(auth): add OAuth2 login support`

### 2. PR Description

ใช้ template มาตรฐาน:

```markdown
## Summary
[อธิบาย changes อย่างกระชับ]

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (improving code quality without changing functionality)

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing done

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if needed)
```

### 3. Branch Naming

ใช้ convention มาตรฐาน:

- `type/issue-number-description`
- ตัวอย่าง: `feat/123-add-oauth-login`
- Types: feat, fix, docs, refactor, test, chore
- ใช้ kebab-case สำหรับ description

### 4. Reviewers

- เลือก reviewers ที่มีความเชี่ยวชาญในส่วนที่เปลี่ยน
- หลีกเลี่ยง reviewers มากเกินไป (2-3 คนเหมาะสม)
- ระบุ reviewers ที่เกี่ยวข้องกับ code ownership

### 5. Draft Mode

ใช้ draft mode เมื่อ:

- PR ยังไม่พร้อมสำหรับ review
- ต้องการ feedback จาก team ก่อน
- กำลังทำงานบน large PR
- ต้องการ tracking แต่ยังไม่ต้องการ review

## Expected Outcome

- PR ถูกสร้างด้วยข้อมูลครบถ้วน
- Title และ description ชัดเจนและเป็นมาตรฐาน
- Branch ถูกตั้งชื่อตาม convention
- CI checks รันอัตโนมัติ
- Issue ถูกเชื่อมโยงอย่างถูกต้อง
- Reviewers ได้รับ notification

## Common Mistakes

- ไม่ใช้ conventional commit format ใน title
- Description สั้นเกินไปไม่มี context
- ไม่เชื่อมโยงกับ issue ที่เกี่ยวข้อง
- ไม่รัน tests ก่อนสร้าง PR
- ไม่ตั้งค่า reviewers

## Anti-Patterns

- สร้าง PR ที่ใหญ่เกินไป (should be split)
- สร้าง PR โดยไม่มี description
- สร้าง PR จาก branch ที่ไม่ sync
- ใช้ title ที่ไม่ชัดเจนหรือยาวเกินไป
