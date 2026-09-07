---
name: open-github
description: เปิดหน้า GitHub บน browser — repo, issue, PR, secrets หรือ repo ของ org/personal
argument-hint: "[repo|issue|pr|secrets|org|personal] [owner/repo] [#n]"
related:
  - list-github-repo
  - all-github-repo
---

## Goal

เปิดหน้า GitHub บน browser ด้วย native OS command ตาม target ที่ระบุ — repo, issue, pull request, secrets settings หรือ repo ของ org/personal account

## Scope

- `repo` (default): เปิด `/tree/<current-branch>` ของ repo
- `issue <n>` / `pr <n>`: เปิด issue หรือ pull request ที่ระบุ
- `secrets`: เปิดหน้า settings/secrets ของ repo
- `org` / `personal`: เปิด repo ใน org หรือ personal account ตาม context
- ไม่แก้ไข repo ใด ๆ

ดูเพิ่มเติม: /all-github-repo, /list-github-repo

## Execute

### 1. Resolve Target And Repo

> Goal: ได้ owner, repo, target type และหมายเลขที่ถูกต้อง

1. อ่าน target จาก argument แรก (`repo`, `issue`, `pr`, `secrets`, `org`, `personal`) — default `repo`
2. ถ้าระบุ `owner/repo` → ใช้ค่านั้น
3. ถ้าไม่ระบุ → รัน `git remote get-url origin` แล้ว parse เป็น `owner/repo` (`https://` หรือ `git@` form)
4. รัน `git branch --show-current` สำหรับ repo target
5. ถ้าไม่อยู่ใน git worktree และไม่มี argument → ถาม user

### 2. Build URL

> Goal: สร้าง URL ตาม target type

- `repo` → `https://github.com/<owner>/<repo>/tree/<branch>`
- `issue` → `https://github.com/<owner>/<repo>/issues/<n>`
- `pr` → `https://github.com/<owner>/<repo>/pull/<n>`
- `secrets` → `https://github.com/<owner>/<repo>/settings/secrets/actions`
- `org` → `https://github.com/orgs/<org>/repositories` หรือ repo ที่ระบุใน org context
- `personal` → `https://github.com/<owner>/<repo>` บน personal account
- URL-encode branch/params ที่มี special characters

### 3. Open In Browser

> Goal: เปิด URL ด้วย OS default browser

1. Windows: `start <url>`; macOS: `open <url>`; Linux: `xdg-open <url>`
2. รายงาน URL ที่เปิดใน chat

## Rules

- เปิดผ่าน OS native command เท่านั้น ไม่ใช้ `webfetch` แทน
- ถ้า build URL ไม่ได้ → ถาม user แทนการเดา
- รายงาน URL เสมอหลังเปิด

## Expected Outcome

- หน้า GitHub ที่ต้องการเปิดใน browser เรียบร้อย

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: open-github-issue, open-github-pr, open-github-repo, open-github-repo-org, open-github-repo-personal)
