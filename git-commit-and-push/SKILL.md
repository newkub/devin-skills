---
name: git-commit-and-push
description: Alias for git-commit and-push — commit, push และ resolve CI/CD ในคำสั่งเดียว
argument-hint: "[scope]"
related:
  - git-commit
  - git-push
  - resolve-cicd
  - refactor-commit
  - update-references
  - follow-monorepo
---

## Goal

Skill นี้เป็น alias ของ `/git-commit and-push` — ใช้ `git-commit/subskills/and-push` เป็น canonical workflow

## Scope

ใช้เมื่อ caller เรียกชื่อ top-level `git-commit-and-push` — forward ทั้งหมดไปยัง canonical subskill

## Execute

1. ทำ `/git-commit and-push` ตามขอบเขตและ workflow เดิมทั้งหมด — commit ตาม conventional commits, push ไปยัง remote (root และ submodules), แล้ว resolve CI/CD จนกว่าจะผ่าน

## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical subskill `git-commit/subskills/and-push/SKILL.md` เท่านั้น
- รักษา backward compatibility ของชื่อ alias
- ถ้า push ถูก reject ให้หยุดและแจ้งผู้ใช้ ไม่ force push

## Expected Outcome

- ผลลัพธ์เหมือน `/git-commit and-push` — changes ถูก commit และ push, CI/CD ผ่าน หรือมี rollback recommendation ชัดเจน
