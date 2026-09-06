---
name: check-broken-symlinks
description: หา symlinks/junctions ที่ target ตาย — broken links ที่ทำ build/tools fail เงียบๆ
argument-hint: "[path]"
related:
  - check-dead-link
  - check-reference
  - list-file-structure
  - cleanup-files-in-computer
  - report-table
---

## Goal

หา symbolic links, junctions และ shortcuts ที่ชี้ไป target ที่ไม่มีอยู่แล้ว — broken links ที่ทำให้ tools, builds, scripts fail โดยไม่รู้ตัว

## Scope

- สแกน filesystem หา symlinks (Windows: `LinkType` attrs, `Get-Item -Attributes ReparsePoint`), junctions, `.lnk` shortcuts
- ครอบคลุม: broken targets, circular links, permission-blocked links, links ใน repos/node_modules
- Read-only: รายงาน — ลบ/แก้ผ่าน confirm

## Execute

### 1. Enumerate Links

> Goal: หา link objects ทั้งหมดใน scope

1. Windows: `Get-ChildItem -Recurse -Force -Attributes ReparsePoint` — symlinks, junctions, mount points
2. `.lnk` files: shortcuts ที่มี target path embedded
3. ข้าม system dirs (`AppData` junctions ของ Windows เอง — หลายอัน broken-by-design สำหรับ compat)

### 2. Resolve Targets

> Goal: เช็คว่า target มีจริงไหม

1. อ่าน `LinkTarget`/`Target` property ต่อ link
2. `Test-Path` target — แยก `missing` ออกจาก `exists`
3. ตรวจ circular links — link chains ที่ loop กลับมาหาตัวเอง
4. สำหรับ `.lnk`: parse target จาก binary format หรือใช้ `WScript.Shell` COM

### 3. Classify Findings

> Goal: แยกความรุนแรง

1. **Critical**: links ที่ build/tooling พึ่งพา — `node_modules` links, workspace links
2. **High**: repo symlinks ที่ target หาย — ใคร clone ใหม่จะพัง
3. **Medium**: utility links ที่ใช้น้อย
4. **Info**: Windows compat junctions (`Documents and Settings` → `Users`) ที่ broken-by-design — ข้าม
5. **Orphans**: links ที่ target หายและไม่มีใครใช้ — safe to clean

### 4. Report

> Goal: สรุป broken links พร้อม actions

1. ใช้ `/report-table`: `No.`, `Link`, `Target`, `Type`, `Severity`, `Action`
2. Actions: `repoint` (target ย้ายไปที่อื่น — หา new location), `remove` (orphan), `recreate` (target ถูกลบโดยไม่ตั้งใจ)
3. สำหรับ repoint: ค้น filesystem หา target ที่ย้ายไป — name/type เดียวกัน

## Rules

### 1. Evidence-Based

- resolve ทุก link จริง — ไม่ assume จากชื่อ
- ระบุ link type (symlink/junction/.lnk) — ต่างกันเรื่องการแก้

### 2. Read-Only

- ไม่ลบหรือแก้ links — รายงานให้ user เลือก action
- Windows compat junctions เป็น false positive ที่รู้จัก — filter ออก

### 3. Context Aware

- links ใน `node_modules`/package manager dirs มัก managed — flag แต่แนะนำ `install` ใหม่แทนแก้มือ
- repo links ที่ broken = contributor-facing issue — severity สูงกว่า local utility links

## Expected Outcome

- รายการ broken links พร้อม target และ severity
- แยก orphans ที่ลบได้ออกจาก links ที่ต้อง repoint/recreate
- ไม่มี silent broken links ที่ทำ tools fail โดยไม่รู้สาเหตุ
