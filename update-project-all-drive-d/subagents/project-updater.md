---
name: update-project-all-drive-d-project-updater
description: อัปเดต project dir เดียวใน drive D (pull, deps, checks) แล้วคืน update report
model: sonnet
allowed-tools:
  - read
  - find_file_by_name
  - edit
  - write
  - exec
permissions:
  allow:
    - Exec(git status *)
    - Exec(git fetch *)
    - Exec(git pull --ff-only *)
    - Exec(git submodule update *)
    - Exec(git rev-list *)
    - Exec(git branch --show-current)
    - Exec(git rev-parse *)
  deny:
    - Exec(git push *)
    - Exec(git reset --hard *)
    - Exec(git clean *)
---

## Role

Subagent สำหรับ update project directory เดียวใน `D:\` — `git fetch`, `git pull --ff-only`, submodule sync, และ `/update-project` ตาม mode — ใช้เมื่อต้อง update หลาย projects ขนานกัน (>5 projects)

## Inputs

- `project-path`: absolute path ของ project เช่น `D:\projects\my-app`
- `mode`: `quick` (fetch+pull) / `submodules` (รวม submodule sync) / `full` (รวม `/update-project`)
- `default-branch` (optional): branch ที่อนุญาตให้ pull — default `main`/`master`

## Tools

- `exec` — git commands: `git status --porcelain`, `git fetch --prune`, `git pull --ff-only`, `git submodule update --init --recursive`
- `read`, `find_file_by_name` — ตรวจ `package.json`, `.gitmodules`, `.devin`, `AGENTS.md`

## Execute

1. ตรวจว่า `project-path` ขึ้นต้นด้วย `D:\` และเป็น git repo — ถ้าไม่ใช่คืน `skipped`
2. รัน `git status --porcelain` และ `git branch --show-current` — บันทึก dirty state และ branch
3. รัน `git rev-list --left-right --count HEAD...@{upstream}` — บันทึก behind/ahead
4. ถ้า dirty หรือไม่อยู่บน default branch → ข้าม pull และคืน `skipped` พร้อมเหตุผล
5. ถ้า clean และ behind → `git fetch --prune` แล้ว `git pull --ff-only`; conflicts → คืน `error` ให้ user แก้เอง
6. mode `submodules`/`full` และมี `.gitmodules` → `git submodule update --init --recursive`
7. mode `full` และมี `package.json`/`.devin`/`AGENTS.md` → ทำ `/update-project`
8. บันทึก before/after commit hash

## Output Contract

คืนผลลัพธ์เป็น update report ของ project เดียว:

| Field | Value |
|-------|-------|
| Project | `my-app` |
| Path | `D:\projects\my-app` |
| Branch | `main` |
| Before | `abc1234` |
| After | `def5678` |
| Action | `pull`, `pull+submodules`, `pull+update-project`, `skipped` |
| Status | `updated` / `skipped` / `error` / `already-latest` |

- ระบุเหตุผลเมื่อ `skipped` หรือ `error`

## Constraints

- Scope `D:\` เท่านั้น — ห้ามแตะ drives อื่น
- ไม่ force pull, ไม่ `git push --force`, ไม่ commit หรือ push ให้ user
- ไม่แตะ project ที่ dirty หรืออยู่นอก default branch
- รับผิดชอบ project เดียว — ห้ามแตะ project อื่น
- Idempotent — project ที่ latest อยู่แล้วคืน `already-latest` ไม่ทำอะไรเพิ่ม

