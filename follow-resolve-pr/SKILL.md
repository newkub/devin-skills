---
name: follow-resolve-pr
description: Resolve pull request ด้วยการ merge, squash, หรือ rebase ตาม project conventions
---

## Goal

Resolve pull request ด้วยวิธีที่เหมาะสมตาม project conventions และตรวจสอบคุณภาพ

## Scope

- ตรวจสอบ PR ก่อน merge (CI checks, reviews, approvals)
- เลือก merge method ที่เหมาะสม (merge, squash, rebase)
- Merge PR และอัปเดต branch
- ปิด issue ที่เกี่ยวข้อง (ถ้ามี)
- ลบ branch ที่ merge แล้ว

## Execute

### 1. Verify PR Readiness
> Goal: Verify PR Readiness

1. ตรวจสอบว่า CI checks ผ่านทั้งหมด
2. ตรวจสอบว่ามี approvals จาก reviewers ที่จำเป็น
3. ตรวจสอบว่า review comments ถูก resolve แล้ว
4. ตรวจสอบว่าไม่มี conflicts
5. ตรวจสอบว่า branch ปัจจุบัน sync กับ remote

### 2. Review Changes
> Goal: Review Changes

1. อ่าน diff ของ PR อย่างละเอียด
2. ตรวจสอบว่า changes ตรงกับ description
3. ตรวจสอบว่าไม่มี unintended changes
4. ตรวจสอบว่า code quality ตาม standards
5. ตรวจสอบว่า tests ครอบคลุม

### 3. Choose Merge Method
> Goal: Choose Merge Method

เลือก merge method ตาม project conventions:

- Merge: สำหรับ PR ที่มี historical context สำคัญ
- Squash: สำหรับ PR ที่มีหลาย commits แต่ต้องการ clean history
- Rebase: สำหรับ linear history และ avoiding merge commits

### 4. Merge PR With MCP Tool
> Goal: Merge PR With MCP Tool

1. ใช้ `mcp3_merge_pull_request`
2. ระบุ owner, repo, pullNumber
3. เลือก merge_method (merge, squash, rebase)
4. เพิ่ม commit_title และ commit_message หากจำเป็น
5. ตรวจสอบว่า merge สำเร็จ

### 5. Post-Merge Actions
> Goal: Post-Merge Actions

1. ตรวจสอบว่า issue ถูกปิดอัตโนมัติ (ถ้ามี `Closes #issue`)
2. ลบ branch ที่ merge แล้ว (ทั้ง local และ remote)
3. อัปเดต changelog หากจำเป็น
4. สร้าง release notes หากจำเป็น
5. แจ้ง team ว่า PR ถูก merge แล้ว

## Rules

### 1. Merge Method Selection

ใช้ criteria ต่อไปนี้:

| Method | When to Use | Pros | Cons |
|--------|-------------|------|------|
| Merge | PR ที่มี historical context สำคัญ | Preserve history | Many merge commits |
| Squash | PR ที่มีหลาย commits แต่ต้องการ clean history | Clean linear history | Lose commit details |
| Rebase | Linear history และ avoiding merge commits | Clean history | Can cause conflicts |

### 2. Pre-Merge Checklist

ต้องตรวจสอบก่อน merge:

- [ ] All CI checks pass
- [ ] Required approvals received
- [ ] All review comments resolved
- [ ] No merge conflicts
- [ ] Branch synced with remote
- [ ] Changes match description
- [ ] Code quality meets standards
- [ ] Tests cover changes

### 3. Commit Message

เมื่อใช้ squash หรือ merge:

- ใช้ conventional commit format
- รวมรายละเอียดจาก PR description
- เพิ่ม issue reference ถ้าจำเป็น
- ตัวอย่าง: `feat(auth): add OAuth2 login support (#123)`

### 4. Branch Cleanup

หลังจาก merge:

- ลบ branch local: `git branch -d branch-name`
- ลบ branch remote: `git push origin --delete branch-name`
- หลีกเลี่ยงค้าง branch ที่ไม่ได้ใช้

### 5. Issue Resolution

เชื่อมโยง PR กับ issue:

- ใช้ `Closes #issue-number` ใน PR description
- หรือใช้ `Fixes #issue-number` สำหรับ bug fixes
- หรือใช้ `Refs #issue-number` สำหรับ tracking
- GitHub จะปิด issue อัตโนมัติเมื่อ PR merge

## Expected Outcome

- PR ถูก merge ด้วยวิธีที่เหมาะสม
- CI checks ผ่านทั้งหมด
- Review comments ถูก resolve แล้ว
- Issue ที่เกี่ยวข้องถูกปิด (ถ้ามี)
- Branch ที่ merge แล้วถูกลบ
- Team ได้รับ notification

## Common Mistakes

- Merge โดยไม่ตรวจสอบ CI checks
- เลือก merge method ที่ไม่เหมาะสม
- ไม่ลบ branch ที่ merge แล้ว
- ไม่ตรวจสอบ review comments ก่อน merge
- Merge โดยไม่มี approvals

## Anti-Patterns

- Force merge เมื่อ CI checks fail
- Merge โดยไม่มี review
- Merge โดยไม่ resolve conflicts
- ใช้ rebase บน shared branches
- Merge โดยไม่เชื่อมโยงกับ issue
