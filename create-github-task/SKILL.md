---
name: create-github-task
description: Create draft tasks in GitHub Projects
argument-hint: "[title]"
---

## Goal

สร้าง draft items/tasks ใน GitHub Project ผ่าน `gh project`

## Scope

ใช้เมื่อเพิ่ม work items ใน GitHub Project โดยไม่มี issue หรือ PR

## Execute

### 1. Verify project

> Goal: verify project

1. Run gh project list
1. Get project number and owner

### 2. Create task

> Goal: create task

1. Run gh project item-create with title and body
1. Capture item ID

### 3. Set fields

> Goal: set fields

1. Use gh project item-edit to set status, priority, assignee
1. Verify with gh project item-list

### 4. Report

> Goal: report

1. Return task ID and project URL

### Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship-code`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

- Requires project scope token
- Use owner and project number consistently
- Set meaningful status field values

## Expected Outcome

- Draft task created in project
- Fields set correctly