---
name: check-shell-profile
description: ตรวจ shell profile ($PROFILE), PATH, aliases และ env หา config ที่ผิดพลาดหรือช้า
argument-hint: "[shell]"
related:
  - check-system-env
  - resolve-errors
  - report
---

## Goal

ตรวจสอบ shell startup profile และ environment config หา errors, duplicate PATH entries, broken aliases, missing tools และ startup slowdowns

## Scope

- ครอบคลุม PowerShell (`$PROFILE` ทุก host), NuShell (`env.nu`, `config.nu`), CMD (`AutoRun`), Git Bash และ WSL shells ที่พบบนเครื่อง
- ตรวจ PATH duplicates/dead entries, module imports ที่ fail, aliases ที่ชี้ไป target ไม่มีอยู่ และเวลา startup
- Read-only: ตรวจและรายงานเท่านั้น ไม่แก้ profile โดยไม่ได้รับคำสั่ง

## Execute

### 1. Detect Shells And Profiles

> Goal: รู้ว่าเครื่องใช้ shells อะไรและ profile อยู่ไหน

1. ทำ `/check-system-env` เพื่อดู shells ที่ติดตั้ง
2. PowerShell: อ่าน `$PROFILE` ทุก scope (`AllUsersAllHosts`, `CurrentUserAllHosts`, `CurrentUserCurrentHost`)
3. NuShell: `$nu.env-path` และ `$nu.config-path`
4. CMD: registry `HKCU\Software\Microsoft\Command Processor\AutoRun`
5. บันทึก profile files ที่มีอยู่จริง

### 2. Validate Profile Syntax

> Goal: profile parse ได้และไม่มี error ตอน startup

1. PowerShell: รัน `pwsh -NoProfile -Command "[System.Management.Automation.PSParser]::Tokenize((Get-Content $PROFILE -Raw), [ref]`$null)"` หรือ `Test-Path` + dot-source แบบ isolated
2. NuShell: รัน `nu --check-config` หรือ `nu -c "source $nu.env-path"` ใน subprocess
3. บันทึก syntax errors พร้อม line number

### 3. Check PATH Health

> Goal: PATH สะอาด ไม่มี duplicate หรือ dead entries

1. แยก PATH เป็น entries แล้ว `Test-Path` ทีละอัน
2. Flag: `dead` (directory ไม่มี), `duplicate` (ซ้ำ), `empty`
3. เทียบ Machine PATH vs User PATH หา shadowed entries
4. ตรวจ tools ที่ profile import ว่ามีจริง (`Get-Command <name>`)

### 4. Check Aliases And Functions

> Goal: aliases ชี้ไป target ที่มีจริง

1. `Get-Alias` และ `Get-Command -CommandType Function` จาก profile
2. ตรวจว่า target command มีอยู่ — flag `broken` ถ้าไม่มี
3. หา aliases ที่ shadow commands สำคัญ

### 5. Measure Startup Time

> Goal: รู้ว่า profile ทำให้ shell ช้าไหม

1. รัน `Measure-Command { pwsh -NoLogo -Command exit }` เทียบกับ `pwsh -NoProfile`
2. Flag `slow` ถ้า startup >2 วินาที โดย profile
3. ระบุส่วนของ profile ที่ช้า (module imports, network calls, prompt init)

### 6. Report

> Goal: สรุป findings พร้อม fix suggestion

1. ทำ `/report` คอลัมน์: `No.`, `Area`, `Finding`, `Severity`, `Location`, `Suggestion`
2. Severity: `error`, `warning`, `info`
3. ส่งต่อ `/resolve-errors` ถ้ามี errors

## Rules

### 1. Read-Only

- ไม่แก้ profile, PATH หรือ registry โดยไม่ได้รับคำสั่งชัดเจน
- ทุก suggestion ต้องมี evidence (file:line หรือ command output)

### 2. Isolated Execution

- ตรวจ profile ใน subprocess แยก — ห้าม dot-source เข้า session ปัจจุบัน
- ไม่รัน profile code ที่มี side effects ต่อระบบ

### 3. Coverage

- ตรวจทุก shell ที่พบ ไม่ใช่แค่ PowerShell
- รวม `mise` activation และ tool shims ใน PATH check

- ใช้ /check-system-env ถ้าจำเป็น
- ใช้ /check-system-env ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/review` (shell profile)

Merged from: optimize-terminal

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้ (shell profile)
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง (shell profile)
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test-unit` ถ้ามี แล้วสรุปผลด้วย `/report-before-after` (shell profile)

- `references/fix-optimize-terminal.md` — ลดเวลา shell startup — profile profiling, plugin audit และ lazy loading
## Expected Outcome

- รู้ว่า profile ไหนมี error, PATH entry ไหนตาย, alias ไหนขาด
- รู้ startup time และส่วนที่ทำให้ช้า
- Report prioritized พร้อม fix suggestion ต่อ finding
