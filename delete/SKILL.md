---
name: delete
description: alias → /apply delete (ลบไฟล์และโฟลเดอร์อย่างปลอดภัย — dry-run, confirm, update references)
argument-hint: "[scope]"
related:
  - apply
  - delete-cicd-fails
  - delete-git-branch
  - delete-git-submodules
  - delete-git-worktree
  - delete-projects
  - delete-project-temp
---

## Goal

Alias ของ `/apply` mode `delete` — ลบไฟล์หรือโฟลเดอร์ที่ระบุอย่างปลอดภัย โดยตรวจสอบ impact, ขอ confirm, backup ถ้าจำเป็น และ update references

## Scope

ใช้เมื่อ user เรียก `/delete` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `apply` (`### Mode: Delete`)

สำหรับ domain-specific deletes เรียก skill ตรง: `/delete-cicd-fails`, `/delete-git-branch`, `/delete-git-submodules`, `/delete-git-worktree`, `/delete-projects`, `/delete-project-temp`

## Execute

ทำ `/apply` mode `delete` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/apply` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `apply/SKILL.md` เสมอ

## Expected Outcome

- `/apply` mode `delete` ถูก execute ครบทุก step — targets ถูกลบ + ไม่มี broken refs + rollback ได้
