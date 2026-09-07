---
name: follow-create-powershell-module
description: สร้าง PowerShell module/script ตามมาตรฐาน พร้อม manifest, functions และ Pester tests
argument-hint: "[module-name]"
related:
  - use-pwsh-shell
  - devin-scripts-toolkit
  - follow-my-tech-stack
  - review-techstack
  - follow-best-practice
  - run-test-unit
  - run-check
  - report
---

## Goal

สร้าง PowerShell module หรือ script project ที่ถูกต้องตาม best practices: module manifest (`.psd1`), script module (`.psm1`), public/private functions, comment-based help และ Pester tests

## Scope

- ใช้สำหรับสร้าง PowerShell module, script collection หรือ automation tooling บน Windows (รองรับ pwsh ข้าม platform)
- ครอบคลุม module layout, naming (Verb-Noun), parameter validation, pipeline support และ error handling
- ไม่ครอบคลุมการ publish ขึ้น PSGallery นอกเหนือ checklist พื้นฐาน

## Execute

### 1. Review Tech Stack

> Goal: เตรียม context ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อดูเครื่องมือที่ใช้
2. ทำ `/review-techstack` ถ้า module เกี่ยวข้องกับ project dependencies
3. ตรวจ PowerShell version ด้วย `$PSVersionTable.PSVersion` — target `pwsh` 7+ เป็น default

### 2. Gather Requirements

> Goal: รู้ว่า module ต้องทำอะไร

1. รับ `module-name` และ purpose จาก argument หรือถาม user
2. ระบุ functions หลักที่ต้อง export (ใช้ approved verbs: `Get-`, `Set-`, `New-`, `Remove-`, `Test-`, `Invoke-`)
3. ระบุ output type: objects สำหรับ pipeline หรือ formatted text
4. ระบุ platform: Windows-only หรือ cross-platform

### 3. Create Module Layout

> Goal: โครงสร้างตามมาตรฐาน PowerShell

1. สร้างโครงสร้าง:
   - `<ModuleName>/<ModuleName>.psd1` — manifest จาก `New-ModuleManifest`
   - `<ModuleName>/<ModuleName>.psm1` — root module ที่ dot-source functions
   - `<ModuleName>/Public/*.ps1` — functions ที่ export
   - `<ModuleName>/Private/*.ps1` — internal helpers
   - `<ModuleName>/Tests/*.Tests.ps1` — Pester tests
2. ใน `.psm1` dot-source `Public/*.ps1` แล้ว `Export-ModuleMember -Function` เฉพาะ public functions
3. ใน `.psd1` ระบุ `RootModule`, `ModuleVersion`, `GUID`, `Author`, `FunctionsToExport`

### 4. Write Functions

> Goal: functions ตาม PowerShell idioms

1. ทุก function ใช้ `[CmdletBinding()]` และ `param()` block
2. ใช้ parameter validation: `[Parameter(Mandatory)]`, `[ValidateSet]`, `[ValidateNotNullOrEmpty]`
3. รองรับ pipeline ด้วย `[Parameter(ValueFromPipeline)]` เมื่อเหมาะสม
4. ใช้ `Write-Verbose`, `Write-Warning`, `Write-Error` ไม่ใช่ `Write-Host` สำหรับ diagnostics
5. เพิ่ม comment-based help: `.SYNOPSIS`, `.DESCRIPTION`, `.PARAMETER`, `.EXAMPLE`
6. คืนค่าเป็น objects (`[PSCustomObject]`) ไม่ใช่ formatted strings

### 5. Add Tests

> Goal: test coverage ด้วย Pester

1. ติดตั้ง Pester ถ้ายังไม่มี: `Install-Module Pester -Scope CurrentUser -Force`
2. สร้าง `Tests/<Function>.Tests.ps1` ด้วย `Describe`, `Context`, `It`
3. ทดสอบ happy path, parameter validation และ error cases
4. ทำ `/run-test-unit` ด้วย `Invoke-Pester ./Tests`

### 6. Verify And Report

> Goal: module import และทำงานได้จริง

1. รัน `Import-Module ./<ModuleName> -Force` แล้ว `Get-Command -Module <ModuleName>`
2. รัน `Invoke-ScriptAnalyzer -Path ./<ModuleName> -Recurse` แล้วแก้ findings
3. ทำ `/run-check` ถ้า project มี lint pipeline
4. รายงานด้วย `/report`: functions, coverage, analyzer results

## Rules

- ชื่อ function ต้องเป็น `Verb-Noun` และใช้ approved verbs (`Get-Verb`)
- ทุก public function ต้องมี comment-based help และ Pester test
- ไม่ใช้ `Write-Host` สำหรับ output ที่ downstream ต้องใช้ต่อ
- ไม่ hardcode paths, credentials หรือ machine-specific values
- รองรับ `-WhatIf` และ `-Confirm` (`SupportsShouldProcess`) สำหรับ functions ที่เปลี่ยน state
- ตรวจ `PSScriptAnalyzer` ผ่านก่อน ship

- ใช้ /use-pwsh-shell ถ้าจำเป็น
- ใช้ /devin-scripts-toolkit ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น

## Expected Outcome

- Module import ได้และ `Get-Command` เห็น functions ที่ export
- Functions ตาม `Verb-Noun` พร้อม parameter validation และ comment-based help
- Pester tests ผ่านและ `Invoke-ScriptAnalyzer` ไม่มี findings สำคัญ
- พร้อมใช้งานหรือขยายต่อได้โดยไม่ต้อง restructure
