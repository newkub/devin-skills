---
name: git-submodule
description: จัดการ git submodules — add/init/update/sync และ pin commits อย่างถูกต้อง
argument-hint: "[add|init|update|status] [path]"
related:
  - convert-git-submodules
  - delete-git-submodules
  - git-push
  - git-commit
  - resolve-errors
---

## Goal

จัดการ submodules ให้ clone/init/update ถูกต้อง — pin commits ชัดเจน, superproject pointer ไม่ drift

## Scope

- `git submodule add`, `init`, `update`, `status`, `sync`, `foreach`
- workflows: clone repo ที่มี submodules, เพิ่ม submodule ใหม่, update pin, แก้ drift
- convert skills repo เป็น submodule → `/convert-git-submodules`; ลบ → `/delete-git-submodules`

## Execute

### 1. Assess State

> Goal: รู้ว่า submodules อยู่ state ไหน

1. `git submodule status` — `-` prefix = ยังไม่ init, `+` = HEAD ไม่ตรง pin, ` ` = ตรง
2. `cat .gitmodules` — ดู path/url mappings
3. ถ้า submodule มี changes ค้าง → จัดการในนั้นก่อน (มันเป็น repo ของตัวเอง)

### 2. Init And Update

> Goal: submodules checkout ตรง pin ของ superproject

```bash
git submodule update --init --recursive   # clone ครั้งแรก / หลัง pull
git submodule update --remote <path>      # ไป remote tip (เปลี่ยน pin)
git submodule foreach 'git status'        # เช็คทุกตัว
```

1. หลัง clone/pull เสมอ: `git submodule update --init --recursive`
2. `--remote` = เปลี่ยน pin เป็น remote tip — เป็นการตัดสินใจ ไม่ใช่ sync; commit pointer ใน superproject หลังจากนั้น

### 3. Add Submodule

> Goal: submodule ใหม่ถูก track ถูกต้อง

1. `git submodule add <url> <path>` — ตรวจ `.gitmodules` + `.git/modules/` ถูกสร้าง
2. commit ทั้ง `.gitmodules` และ gitlink (directory entry) พร้อมกัน — ห้ามแยก
3. URL ใช้แบบที่ collaborators เข้าถึงได้ (HTTPS สำหรับ public, SSH ตาม convention repo)

### 4. Work Inside Submodule

> Goal: แก้ใน submodule แล้ว superproject pin ถูกอัปเดต

1. `cd <submodule>` → มันคือ repo อิสระ: branch, commit, push ตามปกติ
2. กลับ superproject: `git add <submodule>` เพื่อ pin commit ใหม่ แล้ว commit
3. push ลำดับ: submodule ก่อน → superproject — superproject pointer ชี้ commit ที่ remote ไม่มี = clone พัง

## Rules

- push submodule ก่อน superproject เสมอ — pointer ต้องชี้ commit ที่ push แล้ว
- superproject เก็บแค่ commit sha — "update submodule" = commit pointer ใหม่ใน superproject
- changes ใน submodule ไม่ขึ้น superproject diff จนกว่าจะ `git add` ตัวมัน
- ห้ามแก้ submodule แล้วลืม push — `git push --recurse-submodules=check` กันลืม
- ใช้ /resolve-errors ถ้าจำเป็น

## Expected Outcome

- Submodules init/update ตรง pin ไม่มี drift (`status` ไม่มี `+`/`-`)
- เพิ่ม/แก้ submodule แล้ว pointer ถูก commit ใน superproject ถูกลำดับ
