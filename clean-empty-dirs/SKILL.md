---
name: clean-empty-dirs
description: ลบ empty directory trees พร้อม dry-run preview และ git-aware detection
argument-hint: "[path] [--dry-run]"
related:
  - delete
  - report
---

## Goal

หาและลบ directories ที่ว่างเปล่า — รวม nested empty trees — ด้วย dry-run ก่อนลบจริง เพื่อ repo/filesystem ที่สะอาด

## Scope

- สแกน directory trees หา empty dirs (ไม่มีไฟล์เลย รวม recursive)
- Git-aware: ระวัง dirs ที่ git ไม่ track แต่จำเป็น (เช่น `logs/` ที่ app สร้างเอง) — flag แยกจาก empty ธรรมดา
- Default: dry-run เสมอ — ลบจริงต้อง confirm

## Execute

### 1. Scan For Empty Dirs

> Goal: หา dirs ที่ว่างเปล่าทั้งหมด

1. สแกน recursive จาก path — dir ว่าง = ไม่มีไฟล์เลย (subdirs ที่ว่างก็นับ)
2. รวม nested empty trees — ถ้าลบลูกแล้วแม่จะว่างด้วย
3. ข้าม hidden/system dirs (`.git`, `node_modules`) เว้นแต่ระบุ

### 2. Classify Before Delete

> Goal: แยก empty dirs ที่ปลอดภัยจากที่อาจจำเป็น

1. Safe to delete: dirs ว่างที่ไม่มี purpose marker
2. Suspicious: dirs ที่ code อาจ expect (`logs/`, `tmp/`, `uploads/`, `data/`) — ค้น code ว่ามี reference ถึง path ไหม
3. Git-ignored: dirs ใน `.gitignore` — อาจตั้งใจให้ว่าง (git ไม่ track empty dirs)
4. Keep markers: dirs ที่มี `.gitkeep`/`.keep` = ตั้งใจเก็บ — ไม่ลบ

### 3. Preview

> Goal: แสดงรายการก่อนลบ

1. ใช้ `/report`: `No.`, `Path`, `Depth`, `Classification`, `Action`
2. สรุป counts: safe to delete vs flagged vs kept
3. ถาม user confirm — dry-run เป็น default

### 4. Delete (Confirmed Only)

> Goal: ลบเฉพาะที่ confirm

1. ลบลึกสุดก่อน (children ก่อน parents) — nested empty trees หายหมดในคราวเดียว
2. ลบเฉพาะที่ classify `safe` — flagged ต้อง user เลือกเอง
3. รายงานจำนวนที่ลบจริง

## Rules

### 1. Dry-Run Default

- แสดง preview เสมอ — ลบเฉพาะเมื่อ user confirm
- ไม่ลบ flagged dirs โดยไม่ได้เลือกชัดเจน

### 2. Purpose Aware

- dirs ที่ code reference (log dirs, upload targets) ต้อง flag — ลบแล้ว app อาจพัง
- `.gitkeep`/`.keep` = สัญญาณตั้งใจ — เคารพเสมอ

### 3. No Partial Deletes

- ลบเป็น all-or-nothing ต่อ tree — ไม่ลบบางส่วนจน parent เหลือ half-empty แบบแปลก
- Windows: ระวัง locked dirs — skip พร้อม note ไม่ fail ทั้ง batch

## Expected Outcome

- รายการ empty dirs พร้อม classification
- ลบเฉพาะที่ปลอดภัยและ confirmed
- Filesystem สะอาดโดยไม่ทำลาย dirs ที่จำเป็น
