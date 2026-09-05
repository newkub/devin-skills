---
name: list-system-env
description: แสดงรายการ OS, shell, environment variables และ global root paths
argument-hint: "[scope]"
related:
  - check-system-env
  - follow-best-practice
  - suggest-next-action
  - report-table
---

## Goal

แสดงรายการ system environment ของ Windsurf รวมถึง OS, shell, environment variables และ global root paths

## Scope

แสดงรายการ:
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

### 1. List Operating System

> Goal: List Operating System

แสดงข้อมูล OS ที่ใช้:

1. รัน `$PSVersionTable.OS` เพื่อแสดง OS version
2. รัน `[System.Environment]::OSVersion.VersionString` เพื่อแสดง OS version string

```powershell
# List OS
$PSVersionTable.OS
[System.Environment]::OSVersion.VersionString
```

### 2. List Shell Information

> Goal: แสดงข้อมูล shell type และ version

1. รัน `$PSVersionTable.PSVersion` เพื่อแสดง PowerShell version
2. รัน `$PSVersionTable.PSEdition` เพื่อแสดง shell type

```powershell
# List PowerShell version
$PSVersionTable.PSVersion

# List shell type
$PSVersionTable.PSEdition
```

### 3. List Environment Variables

> Goal: แสดง environment variables ที่สำคัญ

1. รัน `$env:PATH -split ';'` เพื่อแสดง PATH
2. รัน `$env:USERPROFILE` เพื่อแสดง user profile path
3. รัน `$env:HOME` เพื่อแสดง home path
4. รัน `$env:CODEIUM_HOME` เพื่อแสดง Codeium home
5. รัน `$env:WINDSURF_HOME` เพื่อแสดง Windsurf home

```powershell
# List PATH
$env:PATH -split ';'

# List HOME/USERPROFILE
$env:USERPROFILE
$env:HOME

# List Windsurf specific
$env:CODEIUM_HOME
$env:WINDSURF_HOME
```

### 4. List Global Root Paths

> Goal: List Global Root Paths

แสดง global root paths ของ Windsurf:

1. แสดง `$env:USERPROFILE\.codeium\windsurf\global_workflows`
2. แสดง `$env:USERPROFILE\.codeium\windsurf\skills`
3. แสดง `$env:USERPROFILE\.codeium\windsurf\global_rules`
4. แสดง `$env:USERPROFILE\.codeium\windsurf\mcp_config.json`

```powershell
# List global workflows path
$env:USERPROFILE\.codeium\windsurf\global_workflows

# List global skills path
$env:USERPROFILE\.codeium\windsurf\skills

# List global rules path
$env:USERPROFILE\.codeium\windsurf\global_rules

# List MCP config path
$env:USERPROFILE\.codeium\windsurf\mcp_config.json
```

### 5. List MCP Configuration

> Goal: แสดง MCP configuration

1. รัน `Get-Content $env:USERPROFILE\.codeium\windsurf\mcp_config.json` เพื่อแสดง MCP config

```powershell
# List MCP config
Get-Content $env:USERPROFILE\.codeium\windsurf\mcp_config.json
```

### 6. List Global Workflows

> Goal: แสดงรายการ global workflows ที่มี

1. รัน `Get-ChildItem $env:USERPROFILE\.codeium\windsurf\global_workflows -Filter "*.md"` เพื่อแสดงรายการ workflows

```powershell
# List global workflows
Get-ChildItem $env:USERPROFILE\.codeium\windsurf\global_workflows -Filter "*.md"
```

### 7. List Global Skills

> Goal: List Global Skills

แสดงรายการ global skills ที่มี:

1. รัน `Get-ChildItem $env:USERPROFILE\.codeium\windsurf\skills -Recurse -Filter "*.md"` เพื่อแสดงรายการ skills

```powershell
# List global skills
Get-ChildItem $env:USERPROFILE\.codeium\windsurf\skills -Recurse -Filter "*.md"
```

### 8. List Global Rules

> Goal: แสดงรายการ global rules ที่มี

1. รัน `Get-ChildItem $env:USERPROFILE\.codeium\windsurf\global_rules -Filter "*.md"` เพื่อแสดงรายการ rules

```powershell
# List global rules
Get-ChildItem $env:USERPROFILE\.codeium\windsurf\global_rules -Filter "*.md"
```

### 9. List CLI Programs Inventory

> Goal: แสดง CLI programs ที่มีในเครื่อง

1. รัน `Get-Command git, npm, bun, pnpm, yarn, docker, node, python, rust, go, cargo -ErrorAction SilentlyContinue` เพื่อแสดง CLI tools ที่สำคัญ
2. รัน `where.exe git npm bun pnpm yarn docker node python 2>$null` เพื่อแสดง paths ของ CLI tools
3. รัน `npm list -g --depth=0 2>$null` เพื่อแสดง global npm packages
4. รัน `bun pm ls -g 2>$null` เพื่อแสดง global bun packages
5. รัน `pip list 2>$null` เพื่อแสดง Python packages

```powershell
# List CLI tools
Get-Command git, npm, bun, pnpm, yarn, docker, node, python, rust, go, cargo -ErrorAction SilentlyContinue | Select-Object Name, Source

# List CLI tool paths
where.exe git npm bun pnpm yarn docker node python 2>$null

# List global npm packages
npm list -g --depth=0 2>$null

# List global bun packages
bun pm ls -g 2>$null

# List Python packages
pip list 2>$null
```

### 10. List Browser History Analysis

> Goal: List Browser History Analysis

แสดง browser history paths และสถานะ:

1. ตรวจสอบ `$env:LOCALAPPDATA\Google\Chrome\User Data\Default\History` (Chrome)
2. ตรวจสอบ `$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\User Data\Default\History` (Brave)
3. ตรวจสอบ `$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\History` (Edge)
4. ตรวจสอบ `$env:APPDATA\Mozilla\Firefox\Profiles` (Firefox)

```powershell
# List browser history paths
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

แสดงข้อมูล OS อย่างถูกต้อง:
- Windows: ใช้ PowerShell commands
- macOS/Linux: ใช้ bash commands
- แสดง OS version และ architecture

### 2. Shell Detection

แสดงข้อมูล shell type:
- PowerShell (Core/Desktop)
- Bash/Zsh (macOS/Linux)
- Shell version และ edition

### 3. Path Validation

แสดง paths ว่ามีอยู่จริง:
- Global workflows path
- Global skills path
- Global rules path
- MCP config path

### 4. Report Format

รายงานในรูปแบบตารางตาม `/report-table`:
- ใช้คอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ...
- ใช้ headers ชัดเจน
- ใช้ alignment ที่เหมาะสม
- ใช้ symbols (✅, ❌, ⚠️) สำหรับ status

- ใช้ /check-system-env ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น
## Expected Outcome

- รายงาย OS, shell, environment variables ในตาราง
- รายงาย global root paths ในตาราง
- รายงาย MCP configuration ในตาราง
- รายงาย global workflows/skills/rules ในตาราง
- รายงาย CLI programs inventory ในตาราง
- รายงาย browser history analysis ในตาราง
- รายงาย user behavior analysis ในตาราง
- รายงาย development environment ในตาราง