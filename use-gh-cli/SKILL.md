---
name: use-gh-cli
description: ใช้ GitHub CLI (`gh`) สำหรับ repos, issues, PRs, CI runs และ API calls อย่างมีประสิทธิภาพ
argument-hint: "[command-or-scope]"
related:
  - follow-github
  - create-github-pr
  - implement-github-issue
  - resolve-cicd
  - resolve-github-actions-fails
  - use-github-ship-bots
  - resolve-errors
---

## Goal

ใช้ `gh` CLI สำหรับ GitHub operations ทั้งหมด — repos, issues, PRs, Actions runs, releases และ API โดยไม่ต้องเปิด browser

## Scope

ใช้เมื่อ task ต้อง interact กับ GitHub: ดู/สร้าง issues, PRs, ตรวจ CI status, review PRs, clone, หรือเรียก GitHub API — ไม่รวม git operations ปกติ (ใช้ `git` ตรงๆ)

## Execute

### 1. Verify Auth

> Goal: `gh` พร้อมใช้และ authenticated

1. `gh --version` ตรวจว่าติดตั้ง
2. `gh auth status` ตรวจ auth — ถ้าไม่ได้ login → แจ้ง user ให้ `gh auth login` (ห้าม login แทน user)
3. `gh repo view --json nameWithOwner` ตรวจ repo context ปัจจุบัน

### 2. Issues And PRs

> Goal: จัดการ issues และ PRs

```bash
gh issue list [--state open] [--assignee @me] [--label <label>]
gh issue view <number> [--comments]
gh issue create --title "..." --body "..."
gh pr list [--state open] [--author @me]
gh pr view <number> [--comments] [--json files,reviews]
gh pr create --title "..." --body "..."
gh pr diff <number>
gh pr checks <number>
gh pr merge <number> [--squash|--merge|--rebase]   # ต้อง user confirm
gh pr review <number> [--approve|--comment|--request-changes]
```

### 3. Actions And Runs

> Goal: ตรวจ CI/CD

```bash
gh run list [--workflow <name>] [--limit 10]
gh run view <run-id> [--log-failed]
gh run watch <run-id>
gh workflow list
gh workflow run <name>
```

### 4. API And JSON Output

> Goal: ใช้ API และ parse output แบบ machine-readable

```bash
gh api repos/{owner}/{repo}/<endpoint>
gh api graphql -f query='...'
gh <cmd> --json <fields> --jq '<expression>'     # filter ด้วย jq syntax
gh search issues "..." / gh search prs "..." / gh search code "..."
```

### 5. Report

> Goal: สรุปผล

1. แสดงผลด้วย `/report-table` (No., Item, State, URL)
2. ทำ `/suggest-next-action` ท้ายรายงาน

## Rules

### 1. Prefer gh Over Web

- ใช้ `gh` แทนการเปิด GitHub web UI เสมอเมื่อทำได้
- ใช้ `--json` + `--jq` สำหรับ output ที่ต้องประมวลผลต่อ — ไม่ parse text output

### 2. Read Before Write

- ตรวจ state ปัจจุบันก่อน (`view`, `list`) ก่อนสร้างหรือแก้ไข
- search ก่อนสร้าง issue/PR ใหม่ เพื่อหลีกเลี่ยง duplicate

### 3. Confirmation For Mutations

- merge PR, ปิด issue, ลบ branch หรือ release → ต้อง user confirm ก่อน
- ไม่ `gh pr merge --auto` โดยไม่ได้รับอนุญาต

### 4. Rate Limits

- ใช้ `--limit` เมื่อ list — ไม่ดึงทั้งหมดโดยไม่จำเป็น
- batch independent `gh` calls พร้อมกันได้

- ใช้ /follow-github ถ้าจำเป็น
- ใช้ /resolve-cicd ถ้าจำเป็น

## Expected Outcome

- GitHub operations ทำผ่าน `gh` ได้ครบโดยไม่ต้องเปิด browser
- output เป็น machine-readable เมื่อต้องใช้ต่อ
- mutations มี user confirmation เสมอ
- ไม่มี duplicate issues/PRs จากการไม่ search ก่อน
