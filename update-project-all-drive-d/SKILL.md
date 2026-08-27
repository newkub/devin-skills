---
name: update-project-all-drive-d
description: อัปเดต project ทั้งหมดใน drive D โดย pull/fetch/sync submodules/อัปเดต project files ตาม state
argument-hint: "[filter]"
allowed-tools:
  - exec
  - find_file_by_name
  - ask_user_question
  - grep
  - read
related:
  - list-project-in-drive-d
  - search-project-in-drive-d
  - sync-drive-d-submodules
  - update-project
  - check-should-update
  - follow-parallel
  - use-subagents
  - report-table
  - ask-me
---

## Goal

อัปเดต project ทั้งหมดใน `D:\` ทีเป็น git repository ให้เป็นปัจจุบัน โดยปลอดภัย ครอบคลุม `git fetch`, `git pull --ff-only`, `git submodule update`, และ `/update-project` ตาม state

## Scope

ใช้เมื่อต้องการ sync/อัปเดตทุก project ใน `D:\` ในครั้งเดียว รองรับ `filter` ตามชื่อ/keyword จำกัดการเขียนเฉพาะ repositories ทีมีสิทธิ์ update โดยไม่ทำลายข้อมูล local

## Execute

### 1. List Target Projects

> Goal: ระบุ project ทีจะอัปเดต

1. ถ้า user ระบุ `filter` → ทำ `/search-project-in-drive-d <filter>` เพื่อกรอง project
2. ถ้าไม่ระบุ → ทำ `/list-project-in-drive-d` เพื่อรายการทั้งหมด
3. ตรวจสอบว่าได้รายการอย่างน้อย 1 project ถ้าไม่มี → stop และ report
4. ถาม user ด้วย `/ask-me` ว่าจะ update ทั้งหมดหรือเลือกบาง project

### 2. Choose Update Mode

> Goal: ระบุระดับการอัปเดต

1. ถาม user เลือก mode:
   - `quick` — `git fetch` + `git pull --ff-only` (default)
   - `submodules` — รวม `git submodule update --init --recursive`
   - `full` — รวม `/update-project` หลัง pull (เฉพาะ repo ทีมี `package.json`, `.devin` หรือ `AGENTS.md`)
2. ถ้า user ไม่ตอบ → ใช้ `quick` แล้ว report ให้ทราบ

### 3. Check Status Per Project

> Goal: ตรวจสอบสถานะก่อนอัปเดต

1. สำหรับแต่ละ project รัน `git status --porcelain` และ `git branch --show-current`
2. รัน `git rev-parse --abbrev-ref HEAD` เพื่อดู branch
3. รัน `git rev-list --left-right --count HEAD...@{upstream}` เพื่อดู behind/ahead
4. บันทึก: project, branch, dirty, behind, ahead

### 4. Pull Updates

> Goal: ดึง remote updates สำหรับ project ทีพร้อม

1. ข้าม project ที dirty (มี uncommitted changes) และ report
2. ข้าม project ทีไม่อยู่บน `main`, `master`, หรือ default branch ที่ user ระบุ
3. สำหรับ project ที clean และ behind:
   - รัน `git fetch --prune`
   - รัน `git pull --ff-only` หรือ `git merge --ff-only @{upstream}`
4. ถ้ามี conflicts → stop สำหรับ project นั้น report ให้ user แก้เอง

### 5. Sync Submodules (If Mode = submodules/full)

> Goal: อัปเดต submodules ให้เป็นปัจจุบัน

1. ถ้า project มี `.gitmodules` → รัน `git submodule update --init --recursive`
2. ถ้า project มี changes ใน submodules → ข้ามและ report
3. บันทึก status หลัง update

### 6. Run Project Update (If Mode = full)

> Goal: sync project docs/config/rules ตาม `/update-project`

1. ถ้า project มี `package.json` หรือ `.devin` หรือ `AGENTS.md` → ทำ `/update-project`
2. ถ้าไม่มี → ข้าม
3. บันทึกว่า project ได้รับ project update หรือไม่

### 7. Report Summary

> Goal: สรุปผลการอัปเดต

1. ใช้ `/report-table` คอลัมน์: No., Project, Path, Branch, Before, After, Action, Status
2. แสดง projects ที update สำเร็จ, skip, error
3. ระบุ count แต่ละประเภท
4. ทำ `/suggest-next-action`

## Rules

### 1. Drive D Scope Only

- ทำงานเฉพาะ paths ทีขึ้นต้นด้วย `D:\` หรือ `/mnt/d` (WSL)
- ไม่แตะ drives อื่นโดยไม่ได้รับอนุญาต
- ตรวจสอบ drive letter ก่อน execute ทุกครั้ง

### 2. Safety First

- ไม่ force pull หรือใช้ `git push --force`
- ไม่แก้ไข project ทีมี uncommitted changes
- ไม่แก้ไข project ทีไม่อยู่บน default branch โดยไม่ถาม user
- ถาม user ก่อน `full` mode เพราะอาจมีการแก้ไขไฟล์ project docs/config

### 3. Parallel Execution

- ถ้ามีมากกว่า 5 projects → ใช้ `/follow-parallel` หรือ `/use-subagents` เพื่อประมวลผลขนาน
- แต่ละ subagent รับผิดชอบ project หนึ่ง หรือกลุ่ม project
- รวมผลก่อน report

### 4. Idempotency

- รัน skill ซ้ำได้โดยไม่เกิด side effects เพิ่ม
- ถ้า project เป็น latest อยู่แล้ว → ไม่ต้อง pull

### 5. No Auto Commit

- skill นี้ ไม่ commit หรือ push ให้ user
- ถ้า project มี changes จาก pull → แจ้งให้ user ทราบ
- ถ้าต้องการ commit ให้ใช้ `/git-commit` หรือ `/ship` แยกต่อ project

## Expected Outcome

- รายการ project ใน `D:\` ถูก scan ครบ
- ทุก project ทีสะอาดและอยู่บน default branch ถูก pull ไปยัง latest remote
- submodules ถูก sync ถ้าเลือก mode `submodules` หรือ `full`
- project docs/config ถูก update ถ้าเลือก mode `full`
- ไม่มี project ที่มี uncommitted changes ถูกบังคับ update
- รายงานสรุป status ทุก project ด้วยตาราง
