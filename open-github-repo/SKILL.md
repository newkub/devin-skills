---
name: open-github-repo
description: เปิด GitHub repo บน website ที branch ปัจจุบัน
argument-hint: "[owner/repo]"
related:
  - open-github-repo-personal
  - open-github-repo-org
  - open-github-issue
  - open-github-pr
  - open-web
  - explore-github-trending
---

## Goal

เปิด GitHub repo บน website ที branch ปัจจุบัน (`/tree/<branch>`) ด้วย native OS command

## Scope

- เปิด repo ที `/tree/<current-branch>` แทน root ของ repo
- ถ้าอยู่ใน git worktree → อ่าน remote และ branch ปัจจุบันอัตโนมัติ
- ถ้าระบุ `owner/repo` → ใช้ branch ปัจจุบันของ worktree ถ้าตรงกัน หรือ default เป้น `main`
- ไม่แก้ไข repo

## Execute

### 1. Resolve Repo And Branch

> Goal: ได้ owner, repo, และ branch ทีถูกต้อง

1. ถ้า user ระบุ `owner/repo` → ใช้ค่านั้น
2. ถ้าไม่ระบุ → ตรวจสอบ git worktree ปัจจุบัน:
   - รัน `git remote get-url origin` แล้ว parse ออกมาเป้น `owner/repo`
     - `https://github.com/<owner>/<repo>.git`
     - `git@github.com:<owner>/<repo>.git`
   - รัน `git branch --show-current` เพื่อได้ branch
3. ถ้าไม่อยู่ใน git worktree และไม่มี argument → ถาม user สำหรับ `owner/repo`
4. ถ้ามี `owner/repo` แต่ไม่มี branch → ใช้ `main` เป้น default หรือถาม user

### 2. Build URL

> Goal: สร้าง URL ทีชี้ไป branch ปัจจุบัน

1. สร้าง URL:
   ```
   https://github.com/<owner>/<repo>/tree/<branch>
   ```
2. ถ้า branch เป้น `main` หรือ `master` ก็ยังเปิด `/tree/<branch>` ตามหลักการ
3. URL-encode branch name ถ้ามี special characters

### 3. Open In Browser

> Goal: เปิด URL ใน browser

1. ตรวจสอบ URL ว่าถูกต้อง
2. เปิดด้วย native OS command:
   - Windows: `start <url>`
   - macOS: `open <url>`
   - Linux: `xdg-open <url>`
3. หรือทำ `/open-web <url>` เป้น fallback
4. แจ้ง user URL ทีเปิด

## Rules

### 1. Branch First

- เปิดที `/tree/<branch>` เสมอ ไม่ใช่ root `/`
- ถ้า branch ไม่ระบุ default เป้น `main`

### 2. No Arguments In Git Worktree

- ถ้าอยู่ใน git worktree ทีมี GitHub remote ให้ detect อัตโนมัติ ไม่ต้องถาม
- ถ้ามีหลาย remotes ให้ถาม user เลือก

### 3. URL Parsing

- รองรือทั้ง `https` และ `git@` formats
- ตัด `.git` ออกถ้ามี

### 4. Open Method

- ใช้ native OS command ก่อน
- `/open-web` เป้น fallback
- `browser_preview` ถ้า user ต้องการ integrated browser

## Expected Outcome

- Browser เปิด `https://github.com/<owner>/<repo>/tree/<branch>`
- ใช้ branch ปัจจุบันโดยอัตโนมัติ
- ไม่เกิด error ถ้าอยู่ใน git worktree ที่ถูกต้อง
