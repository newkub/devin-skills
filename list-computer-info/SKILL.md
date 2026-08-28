---
name: list-computer-info
description: แสดงข้อมูลเครื่องคอมพิวเตอร์ เช่น OS, CPU, RAM, disk, GPU, และ hostname
argument-hint: "[summary|full]"
related:
  - list-program-in-computer
  - check-size
  - use-pwsh-shell
  - report-table
---

## Goal

แสดงข้อมูลเครื่องคอมพิวเตอร์ในรูปแบบย่อหรือละเอียด เพื่อตรวจสอบ spec และ environment

## Scope

- ใช้บน Windows เป็นหลัก (รองรับ macOS/Linux หาก detect ได)
- แสดง OS, version, CPU, RAM, disk, GPU, hostname, username
- รองรับโหมด `summary` (ข้อมูลหลัก) และ `full` (ละเอียด)
- ไม่แก้ไข config หรือติดตั้ง program

## Execute

### 1. Parse Argument

> Goal: ระบุระดับความละเอียด

1. รับ `mode` จาก argument
2. ถ้าไม่ระบุ → ค่าเริ่มต้น `summary`
3. ถ้า `full` → แสดงข้อมูลเพิ่มเติมเช่น GPU, serial, uptime, network adapter
4. บันทึก mode

### 2. Detect OS

> Goal: ระบุ OS ปัจจุบัน

1. บน PowerShell: ใช้ `[System.Runtime.InteropServices.RuntimeInformation]::OSDescription`
2. บน Windows: `Get-ComputerInfo` เพื่อดู `OsName`, `OsVersion`, `WindowsVersion`, `CsSystemType`
3. บน macOS: ใช้ `sw_vers`, `uname -m`
4. บน Linux: ใช้ `cat /etc/os-release`, `uname -a`
5. บันทึก OS, version, architecture

### 3. Get CPU Info

> Goal: แสดงข้อมูล CPU

1. บน Windows: `Get-WmiObject -Class Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed`
2. บน macOS: `sysctl -n machdep.cpu.brand_string`, `sysctl -n hw.physicalcpu`, `sysctl -n hw.logicalcpu`
3. บน Linux: `lscpu | grep -E 'Model name|CPU\(s\\)|Thread|Core|MHz'`
4. บันทึก CPU name, cores, threads, clock speed

### 4. Get RAM Info

> Goal: แสดงข้อมูล RAM

1. บน Windows: `Get-CimInstance -ClassName Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum` หรือ `Get-ComputerInfo`
2. บน macOS: `system_profiler SPHardwareDataType | grep 'Memory'` หรือ `sysctl -n hw.memsize`
3. บน Linux: `free -h`
4. บันทึก total RAM และ available RAM (ถ้า full)

### 5. Get Disk Info

> Goal: แสดงข้อมูล disk

1. บน Windows: `Get-Volume` หรือ `Get-PSDrive`
2. บน macOS: `df -h`
3. บน Linux: `df -h`
4. บันทึก drive, total, used, free, usage percent

### 6. Get GPU Info (Full Mode)

> Goal: แสดงข้อมูล GPU

1. บน Windows: `Get-WmiObject -Class Win32_VideoController | Select-Object Name, AdapterRAM, VideoProcessor`
2. บน macOS: `system_profiler SPDisplaysDataType`
3. บน Linux: `lspci | grep -i vga` หรือ `glxinfo` (ถ้ามี)
4. บันทึก GPU name, VRAM

### 7. Get System And User Info

> Goal: แสดงข้อมูลระบบและผู้ใช้

1. บน Windows: `hostname`, `$env:USERNAME`, `$env:USERDOMAIN`
2. บน macOS/Linux: `hostname`, `whoami`, `id`
3. บันทึก hostname, username, domain
4. ถ้า full mode → เพิ่ม uptime (`uptime` หรือ `Get-Date - (gcim Win32_OperatingSystem).LastBootUpTime`)

### 8. Format Output

> Goal: แสดงผลอ่านง่าย

1. ใช้ `/report-table` สร้างตาราง
2. คอลัมน์ summary: `Category`, `Value`
3. คอลัมน์ full: `Category`, `Item`, `Value`
4. เรียงตาม category: OS, CPU, RAM, Disk, GPU, System
5. ใช้ `check-size` หรือ `Get-Volume` สำหรับ disk ถ้าต้องการเปรียบเทียบ

## Rules

### 1. Read-Only

- ไม่แก้ไข registry, config, หรือ environment
- ไม่ติดตั้ง driver หรือ tool
- แค่ query และรายงาน

### 2. Cross-Platform

- ใช้ native command ของแต่ละ OS
- ถ้า command ไม่เจอ → ข้าม category นั้น
- ไม่ assume package manager เสมอ

### 3. Safe Zone

- ถ้าเป็น `full` mode บางข้อมูลอาจเปิดเผย serial number หรือ UUID
- ถ้าเป็น sensitive ให้ข้ามหรือ mask
- ไม่ส่งข้อมูลไปยังภายนอก

### 4. Performance

- รองรับ timeout 30 วินาทีต่อ command
- ถ้า command ช้าให้ข้ามและรายงาน timeout
- ไม่ต้องรอทุก command ถ้า user ต้องการ summary

### 5. Output

- ใช้ `/report-table` หรือ markdown table
- แสดง unit ชัดเจน (GB, MHz, cores)
- ถ้า value ไม่พบ ให้ระบุ `N/A`

## Expected Outcome

- รายการข้อมูลเครื่องตาม mode (summary/full)
- OS, CPU, RAM, disk, GPU (full) ถูกต้อง
- hostname, username ระบุชัดเจน
- ไฟล์/ระบบไม่ถูกแก้ไข
