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
  - list-projects-git-in-drive-d
  - search
  - sync-drive-d-submodules
  - update-project
  - check-should-update
  - follow-parallel
  - use-subagents
  - report
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
2. ถ้าไม่ระบุ → ทำ `/list-projects-git-in-drive-d` เพื่อรายการทั้งหมด
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

1. ใช้ `/report` คอลัมน์: No., Project, Path, Branch, Before, After, Action, Status
2. แสดง projects ที update สำเร็จ, skip, error
3. ระบุ count แต่ละประเภท
4. ทำ `/suggest-next-action`

### Subagents

> Goal: parallelize updates เมื่อ projects เยอะ

- ใช้ profile `project-updater` (ดู `## Subagents` ด้านล่าง) เมื่อมีมากกว่า 5 projects ที่ independent กัน — spawn ทีละ project ผ่าน `/use-subagents` โดยส่ง `project-path` และ `mode` เดียวกัน แล้วรวม update reports ก่อน summary

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
- ถ้าต้องการ commit ให้ใช้ `/git-commit` หรือ `/ship-to-dev-branch` แยกต่อ project

- ใช้ /sync-drive-d-submodules ถ้าจำเป็น
- ใช้ /check-should-update ถ้าจำเป็น

## Subagents

> Goal: งานอิสระที่ spawn ทำขนานได้ — profile อยู่ใน section นี้เลย ไม่ต้องมีไฟล์แยก

### project-updater — อัปเดต project dir เดียวใน drive D (pull, submodules, checks) แล้วคืน update report

- **Inputs**: `project-path` (absolute path ของ project เช่น `D:\projects\my-app`), `mode` (`quick` = fetch+pull / `submodules` = รวม submodule sync / `full` = รวม `/update-project`), `default-branch` (optional — branch ที่อนุญาตให้ pull default `main`/`master`)
- **Tools**: `exec` — git commands `git status --porcelain`, `git fetch --prune`, `git pull --ff-only`, `git submodule update --init --recursive`, `git rev-list`, `git branch --show-current`, `git rev-parse`; `read`/`find_file_by_name` — ตรวจ `package.json`, `.gitmodules`, `.devin`, `AGENTS.md`
- **Execute**:
  1. ตรวจว่า `project-path` ขึ้นต้นด้วย `D:\` และเป็น git repo — ถ้าไม่ใช่คืน `skipped`
  2. รัน `git status --porcelain` และ `git branch --show-current` — บันทึก dirty state และ branch
  3. รัน `git rev-list --left-right --count HEAD...@{upstream}` — บันทึก behind/ahead
  4. ถ้า dirty หรือไม่อยู่บน default branch → ข้าม pull และคืน `skipped` พร้อมเหตุผล
  5. ถ้า clean และ behind → `git fetch --prune` แล้ว `git pull --ff-only`; conflicts → คืน `error` ให้ user แก้เอง
  6. mode `submodules`/`full` และมี `.gitmodules` → `git submodule update --init --recursive`
  7. mode `full` และมี `package.json`/`.devin`/`AGENTS.md` → ทำ `/update-project`
  8. บันทึก before/after commit hash
- **Output**: ตาราง field ต่อ project เดียว `| Field | Value |` — Project, Path, Branch, Before, After, Action (`pull`/`pull+submodules`/`pull+update-project`/`skipped`), Status (`updated`/`skipped`/`error`/`already-latest`); ระบุเหตุผลเมื่อ `skipped` หรือ `error`
- **Constraints**: Scope `D:\` เท่านั้น — ห้ามแตะ drives อื่น; ไม่ force pull, ไม่ `git push --force`, ห้าม `git push`/`git reset --hard`/`git clean`, ไม่ commit หรือ push ให้ user; ไม่แตะ project ที่ dirty หรืออยู่นอก default branch; รับผิดชอบ project เดียว — ห้ามแตะ project อื่น; Idempotent — project ที่ latest อยู่แล้วคืน `already-latest` ไม่ทำอะไรเพิ่ม

## Expected Outcome

- รายการ project ใน `D:\` ถูก scan ครบ
- ทุก project ทีสะอาดและอยู่บน default branch ถูก pull ไปยัง latest remote
- submodules ถูก sync ถ้าเลือก mode `submodules` หรือ `full`
- project docs/config ถูก update ถ้าเลือก mode `full`
- ไม่มี project ที่มี uncommitted changes ถูกบังคับ update
- รายงานสรุป status ทุก project ด้วยตาราง

