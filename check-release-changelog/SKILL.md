---
name: check-release-changelog
description: ดึง GitHub release diff ระหว่างสอง tags และสรุป changelog ดิบ
allowed-tools:
  - read
  - grep
  - glob
  - exec
  - mcp_call_tool
  - ask_user_question
triggers:
  - user
  - model
related:
  - report-release-changelog
  - learn-from-web
  - report-table
  - ask-me
---

## Goal

ดึงข้อมูล release diff ของ GitHub repository ระหว่างสอง tags เพื่อสรุปสิ่งที่เปลี่ยนแปลง

## Scope

ใช้กับ public หรือ private GitHub repo ที่ระบุ compare URL หรือ `owner/repo` พร้อม tags เป้าหมาย ผลลัพธ์ส่งต่อให้ `/report-release-changelog` เพื่อจัดรูปแบบ

## Execute

### 1. Identify Repo And Tags

ระบุ repository และ tags ที่ต้องเปรียบเทียบ

> Goal: รู้ `owner/repo` และ `from...to` tags ที่ชัดเจน

1. ถ้า user ให้ compare URL เช่น `https://github.com/moonrepo/moon/compare/v2.4.5...v2.4.6` → แยก `owner/repo`, `from`, `to`
2. ถ้า user ให้ `owner/repo` อย่างเดียว → หา latest release และก่อนหน้าผ่าน GitHub API
3. ถ้าไม่ชัด → `/ask-me` ก่อน

### 2. Fetch Compare Data

ดึงข้อมูล diff ระหว่าง tags

> Goal: มี commit list, PR list, และ release notes ดิบ

1. ทำ `mcp_call_tool` บน `github-mcp-server` เพื่อ compare ระหว่าง tags
2. ถ้าไม่มี GitHub MCP → ใช้ `curl`/`Invoke-RestMethod` กับ GitHub REST API: `GET /repos/{owner}/{repo}/compare/{from}...{to}`
3. ดึง release notes ของ `to` tag จาก `GET /repos/{owner}/{repo}/releases/tags/{to}`
4. เก็บ commits, files changed, additions, deletions, pull request numbers

### 3. Categorize Changes

จัดประเภท changes จาก commits

> Goal: แยกประเภทเพื่อ report อ่านง่าย

1. อ่าน commit messages ทั้งหมด และ pull request titles
2. จัดกลุ่มตาม conventional commits:
   - `BREAKING` — `!` หรือ `BREAKING CHANGE` footer
   - `feat` — features ใหม่
   - `fix` — bug fixes
   - `docs` — documentation
   - `chore` — build, ci, refactor
   - `perf` — performance
   - `security` — security fixes
3. ระบุ files ที่ impact มากที่สุด (sort ตาม `changes` count)

### 4. Pass To Report

ส่งข้อมูลไป format

> Goal: ให้ `/report-release-changelog` จัดรูปแบบ report

1. ทำ `/report-release-changelog` พร้อม raw data:
   - `repo`, `from`, `to`, `compareUrl`
   - `releaseNotes`
   - categorized `commits`
   - `filesChanged` summary
2. ถ้าไม่ต้องการ report → สรุปผลสั้นๆ ให้ user ทันที

## Rules

### 1. Input Validation

- ต้องได้ `owner/repo` และ `from`/`to` tags ก่อนเริ่ม
- ถ้า tag ไม่มีอยู่จริง → report ว่า `tag not found` และ stop

### 2. Data Source

- ใช้ GitHub API เป็นหลัก
- ถ้า repo private ต้องมี token เหมาะสม ถ้าไม่มี → `/ask-me`

### 3. Categorization

- ถ้า commit message ไม่ตรง conventional commits → จัดเป็น `chore`
- ดึง PR title มาประกอบถ้า PR number มีอยู่

## Expected Outcome

- ได้ owner/repo, from/to tags, compare URL, release notes, รายการ commits แยกประเภท
- ส่งต่อให้ `/report-release-changelog` หรือสรุปให้ user
