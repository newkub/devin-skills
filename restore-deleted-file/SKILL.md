---
name: restore-deleted-file
description: กู้ไฟล์ที่ถูกลบ — จาก recycle bin, git history หรือ editor backups
argument-hint: "<path-or-name>"
related:
  - restore-from-git-log
---

## Goal

กู้คืนไฟล์ที่ถูกลบโดยไม่ตั้งใจ — ลองหลายช่องทางตามลำดับ: recycle bin, git history, editor/IDE local history, backup — จนกว่าจะได้ไฟล์กลับหรือยืนยันว่าหายจริง

## Scope

- ใช้เมื่อไฟล์ถูกลบและต้องการกลับคืน — ทั้งที่เคย commit และที่ไม่เคย commit
- ช่องทางตามลำดับความน่าจะเป็น: recycle bin → git history → editor local history → backups → undelete tools (last resort)
- ไม่ครอบคลุม filesystem-level recovery (photorec ฯลฯ) — แนะนำแยกถ้าจำเป็น

## Execute

### 1. Gather Facts

> Goal: เข้าใจว่าไฟล์หายไปยังไง

1. ระบุ path/name จาก argument หรือถาม user
2. เช็ค: เคย commit เข้า git ไหม, ลบเมื่อไหร่, ลบผ่านอะไร (shell, IDE, git clean, script)
3. หมายเหตุ: `Shift+Delete`/shell `rm` ข้าม recycle bin — git คือหวังหลักถ้าเคย track

### 2. Try Recycle Bin

> Goal: ช่องทางง่ายสุดก่อน

1. ค้น recycle bin หาไฟล์: PowerShell `(New-Object -ComObject Shell.Application).NameSpace(0xA)` enumerate items
2. ถ้าพบ → restore กลับ path เดิม
3. ถ้าไม่พบ → ขั้นต่อไป

### 3. Try Git History

> Goal: กู้จาก git objects

1. ทำ `/restore-from-git-log` — ค้น commit ที่ไฟล์ยังมี: `git log --all --diff-filter=D -- <path>` หรือ `-- "**/<name>"`
2. `git show <commit>:<path>` restore content หรือ `git checkout <commit>~1 -- <path>`
3. เช็ค stash และ reflog ด้วย — `git stash list`, `git fsck --unreachable` สำหรับ dangling objects
4. ถ้าไฟล์ไม่เคย commit → ขั้นต่อไป

### 4. Try Editor Local History

> Goal: กู้จาก IDE/editor backups

1. VS Code local history: `%APPDATA%\Code\User\History` — ค้นหาชื่อไฟล์ใน entries
2. JetBrains Local History: ใน IDE — Local History เก็บ per-file
3. Auto-save/temp files: `*.tmp`, `~*`, `.bak`, swap files ใน dir เดิม
4. Cloud sync: OneDrive/Dropbox version history ถ้า dir อยู่ใน sync folder

### 5. Try Backups / Last Resort

> Goal: ช่องทางสุดท้าย

1. Windows: Previous Versions (shadow copies) — คลิกขวา properties หรือ `vssadmin list shadows`
2. `.devin/` artifacts: bug captures, reports ที่อาจมี content ค้าง
3. ถ้าทุกช่องทางไม่ได้ → รายงาน honesty: ไฟล์หายถาวร + แนะนำ filesystem recovery tools เป็นทางเลือกสุดท้าย พร้อม warning ว่าความสำเร็จต่ำหลังเวลาผ่านไป

### 6. Verify And Report

> Goal: ยืนยันไฟล์ที่กู้ได้ใช้งานได้

1. เช็ค content สมบูรณ์ — ไม่ใช่เวอร์ชันเก่า/truncated
2. รายงาน: source ที่กู้ได้, เวอร์ชันวันที่, path ที่ restore
3. แนะนำป้องกัน: commit บ่อยขึ้น, backup policy, `git add` ไฟล์สำคัญแม้ยังไม่ commit

## Rules

### 1. Fastest Path First

- ลองช่องทางตามลำดับ: recycle → git → editor → backup — หยุดเมื่อได้แล้ว
- แต่ละช่องทางต้อง verify จริงก่อนบอกว่า "ไม่มี"

### 2. No False Hope

- ถ้ากู้ไม่ได้ให้บอกตรงๆ — ไม่แนะนำ undelete tools เป็นคำตอบหลัก (reliability ต่ำมาก)
- ระบุเวอร์ชัน/วันที่ของไฟล์ที่กู้ได้ — อาจไม่ใช่ล่าสุด

### 3. Verify Content

- ไฟล์ที่กู้ได้ต้องเช็ค content — partial recovery ต้องบอก
- restore ไป path เดิม เว้นแต่ user ระบุ

## Expected Outcome

- ไฟล์กลับมาจากช่องทางที่เหมาะสมที่สุด หรือยืนยันว่าหายถาวร
- รายงานช่องทางที่ลองและผลลัพธ์
- คำแนะนำป้องกันการสูญหายในอนาคต
