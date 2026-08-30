---
name: follow-my-package-manager
description: เลือก package manager ทีเหมาะสมกับ OS, program, และ action
argument-hint: "[program-name] [install|list|uninstall]"
related:
  - use-pwsh-shell
  - download-program
  - list-program-in-computer
  - uninstall-program-in-computer
  - open-web
---

## Goal

เลือก package manager ทีเหมาะสมสำหรับ install, list หรือ uninstall program บน OS ปัจจุบัน

## Scope

- ตรวจสอบ OS และ package manager ที่ติดตั้ง
- ลำดับความเหมาะสมบน Windows: `mise` → `scoop` → `winget`
- รองรับ macOS: `mise` → `brew` (และ `port` ถ้ามี)
- รองรับ Linux: `mise` → `apt` → `pacman` → `yum` → `dnf`
- ใช้โดย skills อื่น: `download-program`, `list-program-in-computer`, `uninstall-program-in-computer`

## Execute

### 1. Detect OS

> Goal: ระบุ OS ปัจจุบัน

1. บน PowerShell: ใช้ `[System.Runtime.InteropServices.RuntimeInformation]::OSDescription`
2. ถ้าเจอ `Microsoft Windows` → ใช้ Windows package managers
3. ถ้าเจอ `Darwin` → ใช้ macOS package managers
4. ถ้าเจอ `Linux` → ใช้ Linux package managers
5. บันทึก OS เพื่อใช้เลือก package manager

### 2. Check Available Package Managers

> Goal: รู้ว่า package manager ใดพร้อมใช้

1. Windows:
   - `Get-Command mise -ErrorAction SilentlyContinue`
   - `Get-Command scoop -ErrorAction SilentlyContinue`
   - `Get-Command winget -ErrorAction SilentlyContinue`
2. macOS:
   - `Get-Command mise -ErrorAction SilentlyContinue`
   - `Get-Command brew -ErrorAction SilentlyContinue`
3. Linux:
   - `Get-Command mise -ErrorAction SilentlyContinue`
   - `Get-Command apt -ErrorAction SilentlyContinue`
   - `Get-Command pacman -ErrorAction SilentlyContinue`
   - `Get-Command yum -ErrorAction SilentlyContinue`
   - `Get-Command dnf -ErrorAction SilentlyContinue`
4. บันทึกรายการ package manager ทีพร้อมใช้

### 3. Determine Best Package Manager For Action

> Goal: เลือก package manager ตาม action

1. สำหรับ `install`:
   - ถ้า program เป็น dev tool / versioned tool → ลอง `mise` ก่อน
   - Windows:
     - `mise` → `scoop` → `winget`
   - macOS:
     - `mise` → `brew`
   - Linux:
     - `mise` → native package manager (`apt`/`pacman`/`yum`/`dnf`)
2. สำหรับ `list`:
   - query ทุก package manager ที่มีอยู่ และรวมผล
   - Windows: `mise`, `scoop`, `winget`
   - macOS: `mise`, `brew`
   - Linux: `mise`, native package manager
3. สำหรับ `uninstall`:
   - หา package manager ทีติดตั้ง program นี้ก่อน
   - ใช้ `list-program-in-computer` หรือคำสั่ง `list` ของ package manager แต่ละตัวเพื่อหา source
   - ถ้าไม่พบ → แจ้ง user

### 4. Search Program In Package Manager

> Goal: ยืนยันว่า package manager มี program

1. `mise`: `mise search <program>` หรือ `mise list-all <program>`
2. `scoop`: `scoop search <program>`
3. `winget`: `winget search <program>`
4. `brew`: `brew search <program>`
5. `apt`: `apt-cache search <program>`
6. `pacman`: `pacman -Ss <program>`
7. `yum`/`dnf`: `yum search <program>`
8. ถ้า package manager แรกไม่มี → ลองตัวถัดไปตามลำดับ

### 5. Return Recommendation

> Goal: ส่งมอบคำแนะนำทีชัดเจน

1. ระบุ package manager ทีควรใช้
2. ระบุ command สำหรับ action (install/list/uninstall)
3. ถ้าไม่มี package manager ใดทีมี program → แนะนำให้ใช้ `download-program` หรือ `/open-web`

## Rules

### 1. OS-Specific Order

- Windows: `mise` → `scoop` → `winget`
- macOS: `mise` → `brew`
- Linux: `mise` → native (`apt`, `pacman`, `yum`, `dnf`)
- ไม่กำหนด order ทีไม่เข้ากับ OS

### 2. No Hidden Install Of Package Manager

- ถ้า package manager ยังไม่มี → แจ้ง user หรือใช้ `download-program` ติดตั้ง
- ไม่ติดตั้ง package manager โดยไม่บอกกล่าว

### 3. Action-Aware

- `install`: เน้น package manager ทีสะดวกติดตั้งและจัดการ version
- `list`: query ทุก package manager
- `uninstall`: หา source จริงก่อนลบ

### 4. Idempotent

- ถ้า program ติดตั้งแล้ว ให้ `download-program` หรือ `uninstall-program-in-computer` ตรวจก่อน
- ไม่ติดตั้งซ้ำ/ลบซ้ำ

### 5. Output

- แสดง OS, package manager ทีเลือก, command, และเหตุผลสั้นๆ
- ถ้า program ไม่อยู่ใน package manager ใด ให้ระบุทางเลือก fallback

## Expected Outcome

- ได้ package manager ทีเหมาะสมสำหรับ OS และ action
- ได้ command ทีถูกต้องสำหรับ install, list หรือ uninstall
- ไม่ติดตั้ง package manager หรือ program โดยไม่ได้รับอนุญาติ
