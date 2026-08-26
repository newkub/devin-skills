---
name: check-system-env
description: ตรวจสอบ OS, shell, environment variables และ global root paths
---

## Goal

ตรวจสอบ system environment ของ Windsurf รวมถึง OS, shell, environment variables และ global root paths

## Scope

ตรวจสอบ:
- Operating System (OS)
- Shell type และ version
- Environment variables ที่สำคัญ
- Global root paths (workflows, skills, rules)
- MCP configuration
- CLI programs inventory
- Browser history analysis
- User behavior analysis
- Development environment

## Execute

### 1. Check Operating System

> Goal: Check Operating System

ตรวจสอบ OS ที่ใช้:

1. รัน `$PSVersionTable.OS` เพื่อแสดง OS version
2. รัน `[System.Environment]::OSVersion.VersionString` เพื่อแสดง OS version string

```powershell
# Check OS
$PSVersionTable.OS
[System.Environment]::OSVersion.VersionString
```

### 2. Check Shell Information

> Goal: ตรวจสอบ shell type และ version

1. รัน `$PSVersionTable.PSVersion` เพื่อแสดง PowerShell version
2. รัน `$PSVersionTable.PSEdition` เพื่อแสดง shell type

```powershell
# Check PowerShell version
$PSVersionTable.PSVersion

# Check shell type
$PSVersionTable.PSEdition
```

### 3. Check Environment Variables

> Goal: ตรวจสอบ environment variables ที่สำคัญ

1. รัน `$env:PATH -split ';'` เพื่อแสดง PATH
2. รัน `$env:USERPROFILE` เพื่อแสดง user profile path
3. รัน `$env:HOME` เพื่อแสดง home path
4. รัน `$env:CODEIUM_HOME` เพื่อแสดง Codeium home
5. รัน `$env:WINDSURF_HOME` เพื่อแสดง Windsurf home

```powershell
# Check PATH
$env:PATH -split ';'

# Check HOME/USERPROFILE
$env:USERPROFILE
$env:HOME

# Check Windsurf specific
$env:CODEIUM_HOME
$env:WINDSURF_HOME
```

### 4. Check Global Root Paths

> Goal: Check Global Root Paths

ตรวจสอบ global root paths ของ Windsurf:

1. ตรวจสอบ `$env:USERPROFILE\.codeium\windsurf\global_workflows`
2. ตรวจสอบ `$env:USERPROFILE\.codeium\windsurf\skills`
3. ตรวจสอบ `$env:USERPROFILE\.codeium\windsurf\global_rules`
4. ตรวจสอบ `$env:USERPROFILE\.codeium\windsurf\mcp_config.json`

```powershell
# Global workflows path
$env:USERPROFILE\.codeium\windsurf\global_workflows

# Global skills path
$env:USERPROFILE\.codeium\windsurf\skills

# Global rules path
$env:USERPROFILE\.codeium\windsurf\global_rules

# MCP config path
$env:USERPROFILE\.codeium\windsurf\mcp_config.json
```

### 5. Check MCP Configuration

> Goal: ตรวจสอบ MCP configuration

1. รัน `Get-Content $env:USERPROFILE\.codeium\windsurf\mcp_config.json` เพื่อแสดง MCP config

```powershell
# Read MCP config
Get-Content $env:USERPROFILE\.codeium\windsurf\mcp_config.json
```

### 6. Check Global Workflows

> Goal: ตรวจสอบ global workflows ที่มี

1. รัน `Get-ChildItem $env:USERPROFILE\.codeium\windsurf\global_workflows -Filter "*.md"` เพื่อแสดงรายการ workflows

```powershell
# List global workflows
Get-ChildItem $env:USERPROFILE\.codeium\windsurf\global_workflows -Filter "*.md"
```

### 7. Check Global Skills

> Goal: Check Global Skills

ตรวจสอบ global skills ที่มี:

1. รัน `Get-ChildItem $env:USERPROFILE\.codeium\windsurf\skills -Recurse -Filter "*.md"` เพื่อแสดงรายการ skills

```powershell
# List global skills
Get-ChildItem $env:USERPROFILE\.codeium\windsurf\skills -Recurse -Filter "*.md"
```

### 8. Check Global Rules

> Goal: ตรวจสอบ global rules ที่มี

1. รัน `Get-ChildItem $env:USERPROFILE\.codeium\windsurf\global_rules -Filter "*.md"` เพื่อแสดงรายการ rules

```powershell
# List global rules
Get-ChildItem $env:USERPROFILE\.codeium\windsurf\global_rules -Filter "*.md"
```

### 9. Check CLI Programs Inventory

> Goal: ตรวจสอบ CLI programs ที่มีในเครื่อง

1. รัน `Get-Command git, npm, bun, pnpm, yarn, docker, node, python, rust, go, cargo -ErrorAction SilentlyContinue` เพื่อแสดง CLI tools ที่สำคัญ
2. รัน `where.exe git npm bun pnpm yarn docker node python 2>$null` เพื่อแสดง paths ของ CLI tools
3. รัน `npm list -g --depth=0 2>$null` เพื่อแสดง global npm packages
4. รัน `bun pm ls -g 2>$null` เพื่อแสดง global bun packages
5. รัน `pip list 2>$null` เพื่อแสดง Python packages

```powershell
# Check CLI tools
Get-Command git, npm, bun, pnpm, yarn, docker, node, python, rust, go, cargo -ErrorAction SilentlyContinue | Select-Object Name, Source

# Check CLI tool paths
where.exe git npm bun pnpm yarn docker node python 2>$null

# Check global npm packages
npm list -g --depth=0 2>$null

# Check global bun packages
bun pm ls -g 2>$null

# Check Python packages
pip list 2>$null
```

### 10. Check Browser History Analysis

> Goal: Check Browser History Analysis

ตรวจสอบ browser history paths และสถานะ:

1. ตรวจสอบ `$env:LOCALAPPDATA\Google\Chrome\User Data\Default\History` (Chrome)
2. ตรวจสอบ `$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\User Data\Default\History` (Brave)
3. ตรวจสอบ `$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\History` (Edge)
4. ตรวจสอบ `$env:APPDATA\Mozilla\Firefox\Profiles` (Firefox)

```powershell
# Check browser history paths
Write-Output "Chrome: $env:LOCALAPPDATA\Google\Chrome\User Data\Default\History"
Write-Output "Brave: $env:LOCALAPPDATA\BraveSoftware\Brave-Browser\User Data\Default\History"
Write-Output "Edge: $env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\History"
Write-Output "Firefox: $env:APPDATA\Mozilla\Firefox\Profiles"

# Check if history files exist
Test-Path "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\History"
Test-Path "$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\User Data\Default\History"
Test-Path "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\History"
Test-Path "$env:APPDATA\Mozilla\Firefox\Profiles"
```

## Rules

### 1. OS Detection

ตรวจสอบ OS อย่างถูกต้อง:
- Windows: ใช้ PowerShell commands
- macOS/Linux: ใช้ bash commands
- ระบุ OS version และ architecture

### 2. Shell Detection

ตรวจสอบ shell type:
- PowerShell (Core/Desktop)
- Bash/Zsh (macOS/Linux)
- Shell version และ edition

### 3. Path Validation

ตรวจสอบ paths ว่ามีอยู่จริง:
- Global workflows path
- Global skills path
- Global rules path
- MCP config path

### 4. Report Format

รายงานในรูปแบบตารางตาม `/report-markdown-table`:
- ใช้ numbered columns
- ใช้ headers ชัดเจน
- ใช้ alignment ที่เหมาะสม
- ใช้ symbols (✅, ❌, ⚠️) สำหรับ status

## Expected Outcome

- รายงาน OS, shell, environment variables ในตาราง
- รายงาน global root paths ในตาราง
- รายงาน MCP configuration ในตาราง
- รายงาน global workflows/skills/rules ในตาราง
- รายงาน CLI programs inventory ในตาราง
- รายงาน browser history analysis ในตาราง
- รายงาน user behavior analysis ในตาราง
- รายงาน development environment ในตาราง