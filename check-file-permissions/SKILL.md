---
name: check-file-permissions
description: Audit ACLs/permissions บน sensitive files — .env, keys, configs ที่ควรจำกัดสิทธิ์
argument-hint: "[path-or-file]"
related:
  - check-secrets-leak
  - review-security
  - check-shell-profile
  - check-hardcoded-values
  - report-table
---

## Goal

ตรวจ file permissions/ACLs บนไฟล์ที่ sensitive — `.env`, private keys, credentials, configs — ว่าจำกัดสิทธิ์เหมาะสมไหม (owner-only บน Unix, ไม่มี Everyone/Users write บน Windows)

## Scope

- ตรวจ ACLs (Windows) และ mode bits (Unix/WSL) บน sensitive paths
- ครอบคลุม: `.env*`, `*.pem`, `*.key`, `id_rsa*`, credentials stores, config ที่มี secrets, `.ssh/`, `.gnupg/`
- Read-only: รายงาน — แก้ permissions ต้อง user confirm

## Execute

### 1. Find Sensitive Files

> Goal: รวบรวมไฟล์ที่ต้องจำกัดสิทธิ์

1. ค้น patterns: `.env*`, `*.pem`, `*.key`, `*.pfx`, `id_rsa*`, `*credential*`, `*secret*`, `.ssh/`, `.aws/`, `.gnupg/`
2. เพิ่มจาก project context: config ที่มี tokens, service account keys
3. ทำ `/check-secrets-leak` ร่วมถ้าต้องหา secrets ที่ไม่รู้ตำแหน่ง

### 2. Audit Permissions

> Goal: ตรวจ ACLs/modes ต่อไฟล์

1. **Windows**: `Get-Acl <path>` — ดู Access rules, flag `Everyone`, `BUILTIN\Users` ที่มี Write/FullControl
2. **Unix/WSL**: `stat -c %a <path>` — flag perms กว้างกว่า `600`/`400` สำหรับ secrets, `700` สำหรับ dirs
3. **Inheritance**: Windows inherited ACLs ที่ permissive กว่าที่ตั้งใจ
4. `.ssh/` specifics: `id_rsa` ต้อง owner-only, `authorized_keys`/`config` จำกัด, SSH refuse keys ที่ permissive

### 3. Classify Findings

> Goal: แยกตาม risk

1. **Critical**: secrets readable โดย Everyone/ทุก user — credentials exposure
2. **High**: writable โดย non-owner — tamper risk
3. **Medium**: permissive dirs ที่อนุญาต listing (`755` บน `.ssh/`)
4. **Info**: restrictive เกินจน tools fail (read-only `.env` ที่ app ต้องเขียน)

### 4. Report

> Goal: สรุป permission findings พร้อม fixes

1. ใช้ `/report-table`: `No.`, `Path`, `Current Perms`, `Expected`, `Risk`, `Fix Command`
2. ระบุ exact fix commands:
   - Windows: `icacls <path> /inheritance:r /grant:r "$env:USERNAME:F"`
   - Unix: `chmod 600 <path>`
3. แนะนำ broader fixes: `.gitignore` secrets, credential managers, secret stores

## Rules

### 1. Evidence-Based

- อ่าน ACL/mode จริงต่อไฟล์ — ไม่ assume defaults
- ระบุ user/group ที่มี access ชัดเจน ไม่ใช่แค่ mode number

### 2. Read-Only

- ไม่แก้ permissions — รายงาน fix commands ให้ user รันเอง
- permission changes ทำ tools/apps fail ได้ — ต้อง confirm

### 3. Platform Aware

- Windows ACLs ≠ Unix modes — ตรวจตาม platform จริง
- WSL files ที่ access ผ่าน Windows = dual permissions model — ระบุ caveat

## Expected Outcome

- รายการ sensitive files พร้อม permission posture
- Critical exposures (world-readable secrets) ที่ต้องแก้ด่วน
- Exact fix commands ต่อ platform
