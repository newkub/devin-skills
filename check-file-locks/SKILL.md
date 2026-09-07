---
name: check-file-locks
description: หาไฟล์ที่ถูก lock โดย process — สาเหตุ delete/move/build fail บน Windows
argument-hint: "[path-or-file]"
related:
  - report
---

## Goal

หาว่า process ไหน lock ไฟล์/directory ที่ทำให้ delete, move, rename, build หรือ git operations fail — โดยเฉพาะบน Windows ที่ file locking เข้มงวด

## Scope

- ใช้เมื่อ: "file in use", "access denied", `EBUSY`, `EPERM` ตอน delete/move/build, git checkout fail เพราะไฟล์ถูก lock
- ครอบคลุม: locked files, locked dirs (cwd ของ process), DLL/exe ที่ loaded, handles ที่ค้าง
- Read-only: ระบุ locker — kill/unlock ต้อง user confirm

## Execute

### 1. Identify The Locked Target

> Goal: ระบุ path ที่ถูก lock

1. จาก argument หรือ error message — path ที่ operation fail
2. ถ้าเป็น dir → หาไฟล์ย่อยที่ lock จริง หรือ process ที่ cwd อยู่ใน dir นั้น
3. ทดสอบ lock จริง: ลองเปิดไฟล์ด้วย write access — fail = confirmed locked

### 2. Find The Locking Process

> Goal: ระบุว่าใคร lock

1. Sysinternals handle: `handle.exe <path>` (ถ้ามี) — แม่นสุด
2. openfiles: `openfiles /query /v` (ต้องเปิด maintain objects list — ส่วนใหญ่ local only)
3. Process scan: `Get-Process | Where-Object { $_.Modules.FileName -like "*<name>*" }` สำหรับ loaded DLLs/exes
4. cwd check: processes ที่ working directory อยู่ใน target — PowerShell/WMI query
5. Resource Monitor: resmon → CPU → Associated Handles — manual fallback

### 3. Common Culprits

> Goal: ตรวจ suspects ที่เจอบ่อย

1. Dev servers: node/bun watch processes lock `dist/`, `node_modules`
2. Editors: VS Code language servers, file watchers
3. Antivirus: real-time scan ที่ lock ชั่วคราว — ตรวจ defender exclusions
4. Git: `index.lock` — stale lock files ใน `.git/`
5. Docker/WSL: mounts ที่ lock filesystem

### 4. Report And Options

> Goal: บอกว่าใคร lock + ทางเลือกปลด

1. ใช้ `/report`: `No.`, `Locked Path`, `Locking Process`, `PID`, `Type`, `Unlock Option`
2. Options per lock: `close app`, `kill PID <n>` (ต้อง confirm), `wait and retry` (transient locks), `exclude from AV`
3. ห้าม kill process เอง — เสนอให้ user ตัดสินใจ เว้นแต่เป็นตัวที่ user สั่งชัดเจน

## Rules

### 1. Evidence-Based

- ระบุ PID + process name จริง — ไม่เดาว่า "น่าจะ antivirus"
- แยก persistent locks (process จับจริง) จาก transient (AV/indexing)

### 2. No Force-Kill

- kill process = data loss risk — ต้อง user confirm เสมอ
- เสนอ graceful options ก่อน (close app, save and exit)

### 3. Transient Aware

- บาง lock เป็น momentary (AV scan, indexing) — เสนอ retry ก่อน force action
- Windows Search/Defender exclusions เป็น long-term fix สำหรับ recurring locks

## Expected Outcome

- ระบุได้ชัดว่า process ไหน lock path ไหน
- Unlock options เรียงตามความปลอดภัย
- Root cause fixes (exclusions, config) สำหรับ recurring issues
