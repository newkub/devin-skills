---
name: view-repo
description: แสดง metadata, health และ summary ของ GitHub repository
argument-hint: "[owner/repo-or-url]"
allowed-tools:
  - read
  - write
  - edit
  - exec
  - skill
  - mcp_call_tool
  - ask_user_question
  - report
  - report-table
  - suggest-next-action
triggers:
  - user
  - model
related:
  - list-github-repo
  - open-github-repo
  - open-github-repo-personal
  - open-github-repo-org
  - update-github-metadata
  - ship-release
  - follow-github
  - report-release-changelog
  - resolve-errors
---

## Goal

แสดง metadata, health และ summary ของ GitHub repository โดยไม่เปิด web browser

## Scope

ใช้กับ public/private GitHub repos สำหรับดูข้อมูลสำคัญ: description, stars, forks, open issues, PRs, topics, license, latest release, languages, last update

## Execute

### 1. Resolve Repo

> Goal: รู้ว่าจะดู repo ของใคร

1. ถ้า user ระบุ `owner/repo` หรือ URL → ใช้ค่านั้น
2. ถ้าไม่ระบุ → ใช้ current git repo จาก `git remote -v`
3. ถ้าไม่พบ → ถาม user

### 2. Fetch Metadata

> Goal: ดึงข้อมูล repo

1. ใช้ `gh repo view <owner/repo> --json name,description,owner,stargazerCount,forkCount,openIssueCount,openPullRequestCount,topics,license,updatedAt,createdAt,defaultBranch,url`
2. ถ้าไม่มี `gh` หรือไม่ authenticate → ใช้ GitHub MCP (`mcp_call_tool` บน `github-mcp-server`)
3. ดึง languages ด้วย `gh api repos/<owner>/languages` หรือ MCP
4. ดึง latest release ด้วย `gh release view --repo <owner/repo>` หรือ MCP

### 3. Calculate Health

> Goal: ประเมินสุขภาพ repo

1. ตรวจ last update ภายใน 90 วันหรือไม่
2. ตรวจ open issues / PRs ratio
3. ตรวจ license
4. ตรวจ topics ว่าครบหรือไม่
5. ระบุ default branch

### 4. Report

> Goal: แสดงผลให้อ่านง่าย

1. ทำ `/report-table` สรุป metadata
2. ทำ `/report` สรุป health score และ next actions
3. ทำ `/suggest-next-action`

## Rules

### 1. Sources

- ใช้ `gh repo view` เป้นหลัก
- fallback ไป GitHub MCP ถ้า `gh` ไม่พร้อม
- ไม่ expose secrets หรือ tokens

### 2. Output

- แสดง url, stars, forks, open issues, open PRs
- แสดง languages ทีใช้
- แสดง license, last update
- แสดง health สรุป

### 3. Next Actions

- ถ้าต้องการ open browser → `/open-github-repo`
- ถ้าต้องการ list issues → `/list-github-issue`
- ถ้าต้องการ list PRs → `/list-github-pr`
- ถ้าต้องการ update metadata → `/update-github-metadata`

## Expected Outcome

- ได้ metadata ครบถ้วนของ repository
- รู้สุขภาพของ repo อย่างรวดเร็ว
- มี next actions สำหรับดำเนินการต่อ
