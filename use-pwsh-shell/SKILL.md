---
name: use-pwsh-shell
description: ใช้ PowerShell สำหรับ shell commands, scripting, และ automation
argument-hint: "[command]"
---

## Goal

ใช้ PowerShell หรือ PowerShell Core (`pwsh`) สำหรับ shell commands, scripting, และ automation อย่างมีประสิทธิภาพ

## Scope

ใช้สำหรับ Windows system administration, file operations, automation, และ cross-platform scripting ด้วย `pwsh`

## Execute

### 1. Check Pwsh Installation

> Goal: ตรวจสอบและติดตั้ง pwsh

1. รัน `pwsh --version` เพื่อตรวจสอบ PowerShell Core
2. ถ้าไม่มา ให้ติดตั้ง:
   - Windows: `winget install --id Microsoft.PowerShell`
   - macOS: `brew install --cask powershell`
   - Linux: ติดตั้งตาม distro ตาม official docs
3. ถ้าไม่สามารถติดตั้ง `pwsh` ได้ ให้ fallback ไป `powershell` หรือ `cmd` ตาม context

### 2. Run Commands With Pwsh

> Goal: รันคำสั่งด้วย pwsh

1. คำสั่งเดี่ยว: `pwsh -Command '<command>'`
2. สคริปต์: `pwsh -File script.ps1`
3. ใช้ `Get-Command <cmd>` เพื่อตรวจสอบ command availability
4. ใช้ `Get-Help <cmd>` เพื่อดู help
5. ตรวจสอบ exit code ด้วย `$LASTEXITCODE`

### 3. Use Pwsh For File Operations

> Goal: จัดการไฟล์และโฟลเดอร

1. สร้าง directory: `New-Item -ItemType Directory -Path <path>`
2. คัดลอกไฟล์: `Copy-Item -Path <src> -Destination <dst>`
3. ย้ายไฟล์: `Move-Item -Path <src> -Destination <dst>`
4. ลบไฟล์: `Remove-Item -Path <path> -Recurse -Force` (ระวัง destructive)
5. อ่านไฟล์: `Get-Content -Path <file>`
6. เขียนไฟล์: `Set-Content -Path <file> -Value <content>`
7. แสดงรายการ: `Get-ChildItem -Path <path>`

### 4. Write Pwsh Scripts

> Goal: เขียนสคริปต์สำหรับ automation

1. ใช้ `param` block สำหรับ parameters
2. ใช้ `try/catch/finally` สำหรับ error handling
3. ใช้ `Write-Output`, `Write-Verbose`, `Write-Error` ตามลักษณะ
4. ใช้ `Select-String` สำหรับ text search แทน grep บน Windows
5. ใช้ `Where-Object`, `ForEach-Object`, `Sort-Object` สำหรับ pipelines
6. ใช้ `ConvertFrom-Json`, `ConvertTo-Json` สำหรับ JSON
7. เก็บ script ไว้ใน `.devin/scripts/` ถ้าใช้ซ้ำ หรือ `temp/` ถ้าชั่วคราวตาม `/use-scripts`

### 5. Integrate With Use Scripts

> Goal: เชื่อมต่อกับ `/use-scripts`

1. ใช้ pwsh สำหรับ Windows-specific หรือ .NET integration
2. ตั้ง `dryRun` option ในทุก script
3. ระบุเหตุผลถ้าเลือก pwsh แทน shell อื่น
4. อ้างอิง `/use-scripts` สำหรับการตัดสินใจเลือก shell

## Rules

### 1. When To Use Pwsh

- Windows system administration, registry, WMI, COM
- .NET API calls
- Complex error handling ด้วย try-catch
- Environments ที่ pwsh ติดตั้งอยู่แล้ว
- คำสั่งที่ต้องการ PowerShell syntax

### 2. Cross-Platform Considerations

- `pwsh` รองรับ Windows, macOS, Linux
- `powershell` บน Windows คือ Windows PowerShell (legacy)
- ตรวจสอบ `$PSVersionTable.PSVersion` ถ้าจำเป็น
- ใช้ `Join-Path` แทน hardcoded path separators

### 3. Safety

- ตรวจสอบ paths ก่อน `Remove-Item -Recurse -Force`
- ใช้ `-WhatIf` สำหรับ dry run เมื่อรัน commands เสี่ยง
- ไม่สร้างไฟล์ `.ps1` ชั่วคราวเพื่อรัน command; ถ้าจำเป็นให้ลบทิ้งหลังรัน
- ไม่ expose credentials ใน scripts
- ใช้ `Set-ExecutionPolicy` อย่างระมัดระวัง

### 4. Script Location

- ใช้ `.devin/scripts/` สำหรับ permanent scripts
- ใช้ `temp/` หรือ `.devin/scripts/temp/` สำหรับ throwaway scripts
- ใช้ `.ps1` สำหรับ PowerShell scripts

## Expected Outcome

- `pwsh` ติดตั้งและใช้งานได้
- คำสั่งรันด้วย pwsh ถูกต้อง
- Scripts อยู่ใน location ถูกต้อง
- ไม่เกิด destructive operations โดยไม่ได้ตั้งใจ
- Error handling ครอบคลุม
