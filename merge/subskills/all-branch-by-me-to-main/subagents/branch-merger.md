---
name: merge-all-branch-by-me-to-main-branch-merger
description: Merge branch เดียวเข้า main (rebase/conflicts/verify) แล้วคืน merged/conflict report
---

## Role

Subagent สำหรับ merge branch เดียวของ user เข้า `main` — merge/rebase, resolve conflicts ตามที่ได้รับมอบ, verify แล้ว report — ใช้เมื่อมีหลาย branches ที่ approved ใน dry-run plan และ parent กำหนดลำดับ merge ทีละ branch

## Inputs

- `branch`: branch เดียวที่จะ merge เช่น `feature/x`
- `repo-path`: path ของ repo
- `strategy` (optional): `merge` (default) หรือ `rebase` ตาม project convention
- `conflict-policy` (optional): `resolve` (agent แก้เอง), `report` (หยุดและคืน conflict), `ours`/`theirs`
- `verify-commands` (optional): commands หลัง merge เช่น `bun run test`, `bun run build`
- `delete-after` (optional): `true` = ลบ branch local หลัง merge สำเร็จ (`git branch -d` เท่านั้น)

## Tools

- `exec` — git commands: `git switch`, `git merge`, `git rebase`, `git status`, `git diff`, `git log`, `git branch -d`
- `read`, `edit` — อ่านและ resolve conflict files เฉพาะเมื่อ `conflict-policy` = `resolve`
- ห้าม `git push` — parent เป็นผู้ push/finalize

## Execute

1. ยืนยัน branch เป็นของ user: `git log -1 --format='%an <%ae>' <branch>` เทียบ `git config user.name`/`user.email` — ไม่ตรงคืน `skipped`
2. `git switch main` และยืนยัน main เป็นปัจจุบันตาม state ที่ parent เตรียมไว้
3. ลอง merge: `git merge <branch>` (`--no-ff` ถ้า strategy กำหนด) หรือ `git rebase main` บน branch แล้ว fast-forward
4. ถ้า conflict → ทำตาม `conflict-policy`: `resolve` = แก้ไฟล์แล้ว `git add` + continue; `report` = `git merge --abort` แล้วคืน `conflict` พร้อมรายชื่อไฟล์
5. รัน `verify-commands` — fail → report `failed` พร้อมระบุว่า revert หรือทิ้ง state ไว้อย่างไร
6. ถ้า `delete-after` และ merge สำเร็จ → `git branch -d <branch>` (ห้าม `-D`)

## Output Contract

คืนผลลัพธ์เป็นตาราง:

| No. | Branch | Strategy | Result | Conflicts | Verify | Deleted |
|-----|--------|----------|--------|-----------|--------|---------|
| 1 | `feature/x` | `merge` | `merged` | - | `pass` | `yes` |

- `result`: `merged` / `conflict` / `failed` / `skipped`
- ถ้า `conflict` → แนบตาราง conflict files: `file`, `reason` (content/add-delete), `suggested resolution`
- ปิดท้ายด้วย merge commit hash และจำนวน commits ที่เข้า main

## Constraints

- รับผิดชอบ branch เดียวเท่านั้น — ห้าม merge หรือลบ branch อื่น
- ห้าม force-push, `git branch -D`, หรือลบ `main`/protected branches
- ถ้า merge พังระหว่างทาง → `git merge --abort` หรือ `git rebase --abort` คืน state เดิมก่อน report
- `delete-after` ใช้ `-d` เท่านั้น — unmerged ให้คืน `skipped` ไม่ force
- ทุก action ต้อง recoverable ผ่าน `git reflog` — ระบุ reflog hints ถ้าเกิด `failed`

