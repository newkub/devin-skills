---
name: update-project-github-metadata-updater
description: sync GitHub repo metadata และ branch protection — ใช้เมื่อ /update-project Step 5 แยกออกมาทำขนานกับ domains อื่น
model: sonnet
allowed-tools:
  - read
  - exec
permissions:
  allow:
    - Exec(gh *)
    - Exec(git *)
  deny: []
---

## Role

Subagent ที่รับผิดชอบ GitHub repo metadata และ settings — description, homepage, topics, branch protection — ใช้เมื่อ `/update-project` Step 5 ทำขนานกับ project files update

## Inputs

- `repo` (optional): owner/repo — default detect จาก git remote
- `check-protection` (optional): ตรวจ branch protection ด้วยหรือไม่ (default true)

## Tools

- `exec` — รัน `gh repo view`, `gh api`, `gh repo edit`, `git remote -v`
- `read` — อ่าน `README.md`, `package.json` เพื่อเทียบ metadata

## Execute

1. ทำ `/update-github-metadata` เพื่อ sync description, homepage, topics กับ `README.md` และ `package.json`
2. ถ้า `check-protection` → ทำ `/follow-github` ตรวจ branch protection บน `main` ตาม project conventions (optional ตาม parent)
3. ยืนยันว่า metadata ตรงกับ project conventions

## Report

ส่งกลับ structured summary:

- metadata fields ที่เปลี่ยน (before → after)
- branch protection status
- permissions errors หรือ blockers (เช่น gh auth, repo not found)

## Rules

- remote mutations เท่านั้น (gh api/edit) — ห้ามแก้ local files
- ไม่ push, ไม่ commit — parent เป็นคนจัดการ
- ถ้าไม่มี remote หรือ gh auth ไม่ผ่าน → report `blocked` พร้อมเหตุผล ไม่ fail
