---
name: download-program-package-manager
description: เลือก package manager ทีเหมาะสมกับ OS, program, และ action
argument-hint: "[program-name] [install|list|uninstall]"
related:
  - use-pwsh-shell
  - list-program-in-computer
  - uninstall-program-in-computer
  - open-web
  - run-install
---

## Goal

เลือก package manager ทีเหมาะสมสำหรับ install, list หรือ uninstall program บน OS ปัจจุบัน — merged from `follow-my-package-manager`

## Scope

- ตรวจสอบ OS และ package manager ที่ติดตั้ง
- ลำดับความเหมาะสมบน Windows: `mise` → `scoop` → `winget`
- รองรับ macOS: `mise` → `brew` (และ `port` ถ้ามี)
- รองรับ Linux: `mise` → `apt` → `pacman` → `yum` → `dnf`
- ใช้โดย parent และ siblings: `download-program`, `list-program-in-computer`, `uninstall-program-in-computer`, `update-all-program-in-computer`

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

1. Windows: `Get-Command mise/scoop/winget -ErrorAction SilentlyContinue`
2. macOS: `Get-Command mise/brew -ErrorAction SilentlyContinue`
3. Linux: `Get-Command mise/apt/pacman/yum/dnf -ErrorAction SilentlyContinue`
4. บันทึกรายการ package manager ทีพร้อมใช้

### 3. Determine Best Package Manager For Action

> Goal: เลือก package manager ตาม action

1. `install`: dev tool / versioned tool → ลอง `mise` ก่อน แล้วตาม OS order (Windows: `scoop` → `winget`, macOS: `brew`, Linux: native)
2. `list`: query ทุก package manager ที่มีอยู่ และรวมผล
3. `uninstall`: หา package manager ทีติดตั้ง program นี้ก่อน ด้วย `list-program-in-computer` หรือ `list` ของแต่ละตัว — ถ้าไม่พบ → แจ้ง user

### 4. Search Program In Package Manager

> Goal: ยืนยันว่า package manager มี program

1. `mise`: `mise search <program>` หรือ `mise list-all <program>`
2. `scoop`: `scoop search <program>`
3. `winget`: `winget search <program>`
4. `brew`: `brew search <program>`
5. `apt`: `apt-cache search <program>`; `pacman`: `pacman -Ss <program>`; `yum`/`dnf`: `yum search <program>`
6. ถ้า package manager แรกไม่มี → ลองตัวถัดไปตามลำดับ

### 5. Return Recommendation

> Goal: ส่งมอบคำแนะนำทีชัดเจน

1. ระบุ package manager ทีควรใช้ + command สำหรับ action (install/list/uninstall)
2. ถ้าไม่มี package manager ใดทีมี program → แนะนำให้ใช้ `download-program` fallback หรือ `/open-web`

## Rules

### 1. OS-Specific Order

- Windows: `mise` → `scoop` → `winget`; macOS: `mise` → `brew`; Linux: `mise` → native
- ไม่กำหนด order ทีไม่เข้ากับ OS

### 2. No Hidden Install Of Package Manager

- ถ้า package manager ยังไม่มี → แจ้ง user หรือใช้ `download-program` ติดตั้ง
- ไม่ติดตั้ง package manager โดยไม่บอกกล่าว

### 3. Action-Aware

- `install`: เน้นตัวที่จัดการ version ดี; `list`: query ทุกตัว; `uninstall`: หา source จริงก่อนลบ

### 4. Idempotent

- ถ้า program ติดตั้งแล้ว ให้ `download-program` หรือ `uninstall-program-in-computer` ตรวจก่อน — ไม่ติดตั้งซ้ำ/ลบซ้ำ

### 5. Output

- แสดง OS, package manager ทีเลือก, command, และเหตุผลสั้นๆ + fallback ถ้าหาไม่เจอ

- ใช้ /use-pwsh-shell ถ้าจำเป็น
- ใช้ /run-install ถ้าจำเป็น

## Expected Outcome

- ได้ package manager ทีเหมาะสมสำหรับ OS และ action พร้อม command ทีถูกต้อง
- ไม่ติดตั้ง package manager หรือ program โดยไม่ได้รับอนุญาติ
