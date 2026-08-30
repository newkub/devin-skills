---
name: run-cleanup
description: Run Cleanup
related:
  - cleanup-files-in-computer
  - cleanup-files-in-project
  - cleanup-git-branch
  - run-check
  - run-verify
  - suggest-next-action
---

## Goal

รันการทำความสะอาด

## Scope

ใช้ `run-cleanup` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม

## Execute

run task มีปัญหา ต้อง cleanup file ต่างๆ เช่น node_modules, dist, .nuxt, target และอื่นๆ ที่อยู่ใน .gitignore ตามตามเหมาะสมและให้เข้ากับภาษา

## Rules

- Follow the project conventions and global rules
- Use the allowed tools only when needed

## Expected Outcome

Completed `run-cleanup` workflow with correct output
