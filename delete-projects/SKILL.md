---
name: delete-projects
description: ลบ project ทั้ง local, remote repo, และ Cloudflare resources อย่างปลอดภัย
argument-hint: "[project-path-or-name]"
related:
  - delete
  - delete-git-branch
  - delete-git-worktree
  - follow-service-cloudflare
  - list-cloudflare-projects
  - update-references
  - ask-me
---

## Goal

ลบ project ออกจากทุกทีที่เกี่ยวข้อง: local directory, remote git repository, Cloudflare Workers/Pages/D1/KV/R2/Queues/secrets อย่างปลอดภัย

## Scope

- ใช้เมือต้องการถอน project ออกจากเครื่องและ services ทั้งหมด
- ครอบคลุม local working directory, git remotes, GitHub repo, Cloudflare resources
- ไม่ใช้สำหรับลบไฟล์ธรรมดาโดยไม่มี context ของ project

## Execute

### 1. Identify Project

> Goal: ระบุ project และ resources ที่ต้องลบ

1. รับ project path หรือ project name จาก user
2. ตรวจสอบ local path ว่ามีอยู่จริง
3. รัน `git remote -v` เพื่อหา remote URL
4. ตรวจหา Cloudflare config: `wrangler.toml`, `wrangler.jsonc`, `wrangler.json`, `wrangler.config.ts`
5. ระบุ git branches, worktrees, submodules ที่เกี่ยวข้อง

### 2. Dry Run Discovery

> Goal: แสดงรายการสิ่งที่จะลบก่อนจริง

1. สรุป local directory และขนาดรวม
2. สรุป remote repository (owner/name) จาก remote URL
3. สรุป Cloudflare resources ที่อาจเกี่ยวข้อง:
   - Worker name จาก wrangler config
   - Pages project
   - D1 database, KV namespace, R2 bucket, Queue, secrets
4. สรุป git branches และ worktrees
5. แสดง report ด้วย table

### 3. Confirm With User

> Goal: ได้รับ explicit confirmation ก่อนลบ

1. ถาม user ว่าต้องการลบ local, remote, Cloudflare หรือทั้งหมด
2. ถ้า remote หรือ Cloudflare มี production data → double confirm
3. ถ้า local มี uncommitted changes → แจ้งและถามว่าจะ backup หรือยกเลิก
4. ห้ามดำเนินการต่อถ้าไม่ได้คำตอบชัดเจน

### 4. Backup Local

> Goal: สำรองข้อมูลก่อนลบถ้าจำเป็น

1. ถ้า local มี uncommitted/untracked changes → สำรองไปยัง `%TEMP%/<project-name>-backup-<timestamp>` หรือ `.trash/`
2. บันทึก backup path
3. ถ้า local ถูก track โดย git และสะอาดแล้ว → ไม่ต้อง backup เพิ่ม

### 5. Delete Cloudflare Resources

> Goal: ลบ resources บน Cloudflare ที่เกี่ยวข้อง

1. ตรวจสอบ `wrangler` CLI และ authentication ด้วย `wrangler whoami`
2. ลบ secrets ด้วย `wrangler secret delete <name>` ตามลิสต์
3. ลบ cron triggers ด้วย `wrangler triggers delete`
4. ลบ queues ด้วย `wrangler queues delete <queue>`
5. ลบ D1 database ด้วย `wrangler d1 delete <database>`
6. ลบ KV namespace ด้วย `wrangler kv namespace delete`
7. ลบ R2 bucket ด้วย `wrangler r2 bucket delete <bucket>`
8. ลบ Pages project ด้วย `wrangler pages project delete <project>`
9. ลบ Worker ด้วย `wrangler delete`
10. ถ้า command ใดไม่ผ่าน → หยุดและ report

### 6. Delete Remote Repository

> Goal: ลบ remote git repository

1. ตรวจสอบ `gh` CLI ด้วย `gh --version`
2. รัน `gh auth status` เพื่อตรวจสอบ login
3. รัน `gh repo delete <owner>/<repo> --confirm` ถ้า user ยืนยัน
4. หรือใช้ `git push origin --delete <branch>` เฉพาะ branches ถ้าไม่ต้องการลบทั้ง repo
5. บันทึก remote URLs ที่ลบ

### 7. Delete Local Directory

> Goal: ลบ local project อย่างปลอดภัย

1. ถ้า local path อยู่ใน system paths เช่น `C:\Windows`, `C:\Program Files`, `~` → หยุดและถาม
2. รัน `Remove-Item -Recurse -Force "<path>"` บน Windows หรือ `rm -rf "<path>"` บน macOS/Linux
3. หรือใช้ `git worktree remove` ถ้าเป็น worktree
4. ตรวจสอบว่า directory ถูกลบ

### 8. Cleanup References

> Goal: แก้ไข references ที่ชี้ไปยัง project

1. ใช้ `/update-references` สำหรับไฟล์ใน workspace ที่อ้างอิง project นี้
2. ลบ git remote ออกจาก project อื่นที่อาจชี้มา
3. อัปเดต `AGENTS.md` หรือ `README.md` ถ้ามีลิงก์

### 9. Validate And Report

> Goal: ตรวจสอบว่าลบสมบูรณ์

1. ตรวจสอบว่า local directory ถูกลบ
2. ตรวจสอบว่า remote repo ไม่เข้าถึงได้ (หรือหายไป)
3. ตรวจสอบ Cloudflare resources ด้วย `wrangler list` commands
4. รายงานสิ่งที่ลบ, backup path, และสิ่งที่ค้าง

## Rules

### 1. Never Delete Without Confirmation

- ต้อง dry run และ explicit user confirm เสมอ
- ไม่ลบ system paths, home directory, หรือ `.git` ของ repo อื่น
- ไม่ลบ production resources โดยไม่ double confirm

### 2. Safety First

- สำรอง uncommitted changes ก่อนลบ
- ไม่ลบ files ที่มี secrets, API keys, credentials โดยไม่ตรวจสอบ
- ถ้าไม่แน่ใจ → หยุดและใช้ `/ask-me`

### 3. Tool Availability

- ต้องมี `wrangler` สำหรับ Cloudflare
- ต้องมี `gh` สำหรับ GitHub
- ถ้าไม่มี tools → แจ้ง user และ stop

### 4. Reversibility

- บันทึก backup path ทุกครั้ง
- บันทึกรายการ resources ที่ลบ
- ถ้าลบผิดพลาด → แจ้ง user และระบุขั้นตอนกู้คืน

- ใช้ /delete-git-branch ถ้าจำเป็น
- ใช้ /delete-git-worktree ถ้าจำเป็น
- ใช้ /follow-service-cloudflare ถ้าจำเป็น
- ใช้ /list-cloudflare-projects ถ้าจำเป็น

## Expected Outcome

- Local directory ถูกลบ
- Remote git repository ถูกลบ (ถ้าขอ)
- Cloudflare resources ถูกลบตาม scope ที่ยืนยัน
- ไม่มี uncommitted changes สูญหาย
- มีรายงานการลบและ backup path
