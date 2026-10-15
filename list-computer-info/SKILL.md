---
name: list-computer-info
description: Show computer info such as OS, CPU, RAM, disk, GPU, and hostname
argument-hint: "[summary|full]"
related:
  - list-program-in-computer
  - deep-review-codebase
  - use-pwsh-shell
  - report
---

## Goal

Show computer information in brief or detailed form to inspect specs and environment

## Scope

- Primarily on Windows (macOS/Linux supported when detectable)
- Shows OS, version, CPU, RAM, disk, GPU, hostname, username
- Supports `summary` mode (key data) and `full` mode (detailed)
- Does not modify config or install programs

## Execute

### 1. Parse Argument

> Goal: determine the detail level

1. Take `mode` from the argument
2. If unspecified → default to `summary`
3. If `full` → show extra data such as GPU, serial, uptime, network adapter
4. Record the mode

### 2. Detect OS

> Goal: identify the current OS

1. On PowerShell: use `[System.Runtime.InteropServices.RuntimeInformation]::OSDescription`
2. On Windows: `Get-ComputerInfo` for `OsName`, `OsVersion`, `WindowsVersion`, `CsSystemType`
3. On macOS: use `sw_vers`, `uname -m`
4. On Linux: use `cat /etc/os-release`, `uname -a`
5. Record OS, version, architecture

### 3. Get CPU Info

> Goal: show CPU data

1. On Windows: `Get-WmiObject -Class Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed`
2. On macOS: `sysctl -n machdep.cpu.brand_string`, `sysctl -n hw.physicalcpu`, `sysctl -n hw.logicalcpu`
3. On Linux: `lscpu | grep -E 'Model name|CPU\(s\)|Thread|Core|MHz'`
4. Record CPU name, cores, threads, clock speed

### 4. Get RAM Info

> Goal: show RAM data

1. On Windows: `Get-CimInstance -ClassName Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum` or `Get-ComputerInfo`
2. On macOS: `system_profiler SPHardwareDataType | grep 'Memory'` or `sysctl -n hw.memsize`
3. On Linux: `free -h`
4. Record total RAM and available RAM (in full mode)

### 5. Get Disk Info

> Goal: show disk data

1. On Windows: `Get-Volume` or `Get-PSDrive`
2. On macOS: `df -h`
3. On Linux: `df -h`
4. Record drive, total, used, free, usage percent

### 6. Get GPU Info (Full Mode)

> Goal: show GPU data

1. On Windows: `Get-WmiObject -Class Win32_VideoController | Select-Object Name, AdapterRAM, VideoProcessor`
2. On macOS: `system_profiler SPDisplaysDataType`
3. On Linux: `lspci | grep -i vga` or `glxinfo` (when available)
4. Record GPU name, VRAM

### 7. Get System And User Info

> Goal: show system and user data

1. On Windows: `hostname`, `$env:USERNAME`, `$env:USERDOMAIN`
2. On macOS/Linux: `hostname`, `whoami`, `id`
3. Record hostname, username, domain
4. In full mode → add uptime (`uptime` or `Get-Date - (gcim Win32_OperatingSystem).LastBootUpTime`)

### 8. Format Output

> Goal: present readable output

1. Use `/report` to build the table
2. Summary columns: `Category`, `Value`
3. Full columns: `Category`, `Item`, `Value`
4. Order by category: OS, CPU, RAM, Disk, GPU, System
5. Use `deep-review-codebase` or `Get-Volume` for disk when comparison is wanted

## Rules

### 1. Read-Only

- Do not modify registry, config, or environment
- Do not install drivers or tools
- Only query and report

### 2. Cross-Platform

- Use each OS's native commands
- If a command is not found → skip that category
- Do not always assume a package manager

### 3. Safe Zone

- In `full` mode some data may expose serial numbers or UUIDs
- Skip or mask sensitive values
- Do not send data to external services

### 4. Performance

- Allow a 30-second timeout per command
- When a command is slow, skip it and report the timeout
- No need to wait for every command when the user wants a summary

### 5. Output

- Use `/report` or a markdown table
- Show units clearly (GB, MHz, cores)
- When a value is not found, mark `N/A`

- Use /list-program-in-computer if needed
- Use /use-pwsh-shell if needed

## Expected Outcome

- The machine info list per mode (summary/full)
- OS, CPU, RAM, disk, GPU (full) reported correctly
- hostname, username clearly stated
- No file or system modified
