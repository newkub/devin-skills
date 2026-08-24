---
name: run-cleanup
description: Run Cleanup
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
---

## Goal

Run Cleanup

## Scope

Use `run-cleanup` for the specific tasks and workflows it covers

## Execute

run task มีปัญหา ต้อง cleanup file ต่างๆ เช่น node_modules, dist, .nuxt, target และอื่นๆ ที่อยู่ใน .gitignore ตามตามเหมาะสมและให้เข้ากับภาษา

## Rules

- Follow the project conventions and global rules
- Use the allowed tools only when needed

## Expected Outcome

Completed `run-cleanup` workflow with correct output
