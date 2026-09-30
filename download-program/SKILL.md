---
name: download-program
description: ค้นหาและติดตั้ง program บนเครื่องโดยใช้ package manager ทีเหมาะสม ถ้าไม่มีให้เปิดหน้า download
argument-hint: "[program-name]"
related:
  - update-all-program-in-computer
  - use-pwsh-shell
  - open
  - search
  - follow-best-practice
  - enhance-prompt
  - run-program
---

## Goal

ช่วยค้นหาและติดตั้ง program บนเครื่อง โดยเลือก package manager ทีเหมาะสมผ่าน `workflows/package-manager` และ fallback ไปหน้า download ถ้าหาไม่เจอ

## Scope

- ใช้ได้ทุก OS โดย `workflows/package-manager` จะเลือก package manager ตาม OS
- รองรับ `mise`, `scoop`, `winget` บน Windows และ `mise`, `brew`, `apt`, `pacman`, `yum`, `dnf` บน Unix
- ถ้าไม่มี package manager ใดที่มี program → เปิดหน้า download หลักให้ user ติดตั้งเอง
- ไม่รับประกันว่า program ทุกตัวจะติดตั้งได้โดยอัตโนมัติ

## Execute

### 1. Identify Program

> Goal: ระบุ program ที่ต้องการติดตั้ง

1. รับ `program-name` จาก argument หรือ user
2. ถ้าชื่อกำกวม → ใช้ `/enhance-prompt` หรือ `/ask-me`
3. ปรับชื่อให้ normalized (lowercase, ไม่มี version ถ้าไม่ระบุ)
4. ใช้ `/follow-best-practice` เพื่อดูชื่อทางการหรือ alias ของ program

### 2. Check Already Installed

> Goal: ไม่ติดตั้งซ้ำถ้ามีอยู่แล้ว

1. รัน `Get-Command <program>` ใน PowerShell หรือ `which <program>` บน Unix
2. ถ้าเจอ → บันทึก path และ version (`<program> --version`)
3. รายงานว่าติดตั้งแล้ว พร้อม version และ path
4. ถ้ายังไม่มี → ไปขั้นตอนถัดไป

### 3. Select Package Manager

> Goal: รับลำดับ package manager ทีเหมาะสม

1. ทำตาม `workflows/package-manager/SKILL.md` ด้วย `<program-name> install`
2. บันทึกลำดับ package manager ทีได้รับ เช่น `[mise, scoop, winget]`
3. บันทึก command template สำหรับ install ของแต่ละ package manager
4. ถ้า workflow ไม่พบ package manager ใดที่มี program → ข้ามไป fallback

### 4. Install Through Recommended Package Manager

> Goal: ติดตั้ง program ตามลำดับทีได้รับ

1. สำหรับแต่ละ package manager ในลำดับ:
   - ตรวจสอบว่า package manager ติดตั้งแล้ว (`Get-Command <manager>`)
   - ถ้ายังไม่มี → ใช้ `/download-program <manager>` ติดตั้ง package manager นั้น หรือข้ามไปตัวถัดไป
   - ค้นหา program ในบน package manager (ดู command ด้านล่าง)
   - ถ้าเจอ → ติดตั้งด้วย command ทีถูกต้อง
   - ตรวจสอบ `Get-Command <program>` หลังติดตั้ง
   - ถ้าสำเร็จ → รายงาน package manager, path, version
2. ถ้าทุก package manager ล้มเหลว → ไป fallback

#### Install Commands by Manager

- `mise`: `mise search <program>` แล้ว `mise use -g <program>`
- `scoop`: `scoop search <program>` แล้ว `scoop install <program>`
- `winget`: `winget search <program>` แล้ว `winget install --id <package-id> --accept-package-agreements --accept-source-agreements`
- `brew`: `brew search <program>` แล้ว `brew install <program>`
- `apt`: `apt-cache search <program>` แล้ว `sudo apt install <program>`
- `pacman`: `pacman -Ss <program>` แล้ว `sudo pacman -S <program>`
- `yum`/`dnf`: `yum search <program>` แล้ว `sudo yum install <program>`

### 5. Fallback to Manual Download

> Goal: เปิดหน้า download ให้ user ติดตั้งเองถ้า package manager หมดทาง

1. ใช้ `/search-files-patterns` หรือ `/search-github-star` หาหน้า download หลักของ program
2. ถ้าเจอ GitHub repo → เปิด `https://github.com/<owner>/<repo>/releases`
3. ถ้าเจอ official website → ใช้ `/open-web` เปิดหน้า download
4. ถ้าหาไม่เจอ → ค้นหาในเว็บด้วย `google` หรือ `duckduckgo` แล้วเปิดผลลัพธ์แรก
5. รายงาน URL ทีเปิดไว้ พร้อมขั้นตอนทั่วไปในการติดตั้ง
6. หยุดและรอ user ดำเนินการเอง

## Rules

### 1. Delegate Package Manager Selection

- ใช้ `workflows/package-manager` เพื่อเลือก package manager เสมอ
- ไม่ hardcode ลำดับ package manager ใน skill
- ถ้า OS เปลี่ยน ให้ workflow จัดการ

### 2. OS Awareness

- รองรับ Windows, macOS, Linux
- ใช้ `Get-Command` บน PowerShell, `which` บน Unix
- ใช้ command ของ package manager ตาม OS ที detect

### 3. No Untrusted Sources

- ไม่ติดตั้งจากแหล่งทีไม่น่าเชื่อถือ
- ถ้าไม่แน่ใจให้เปิด official website หรือ GitHub release มากกว่าติดตั้งอัตโนมัติ
- ไม่รัน script install จาก URL โดยไม่ตรวจสอบ checksum หรือ signature

### 4. Idempotent

- ตรวจสอบก่อนว่า program ติดตั้งแล้วหรือยัง
- ถ้าติดตั้งแล้ว รายงาน version และ path แล้วหยุด
- ไม่ติดตั้งซ้ำโดยไม่จำเป็น

### 5. Output

- รายงาน package manager ทีใช้ติดตั้ง
- รายงาน version และ path หลังติดตั้ง
- ถ้าเปิดหน้า download ให้รายงาน URL พร้อมวิธีติดตั้งทั่วไป

- ใช้ /use-pwsh-shell ถ้าจำเป็น
- ใช้ /run-program ถ้าจำเป็น

- ใช้ /update-all-program-in-computer ถ้าจำเป็น

## Merged Details

### package-manager

##### Goal

เลือก package manager ทีเหมาะสมสำหรับ install, list หรือ uninstall program บน OS ปัจจุบัน —

##### Scope

- ตรวจสอบ OS และ package manager ที่ติดตั้ง
- ลำดับความเหมาะสมบน Windows: `mise` → `scoop` → `winget`
- รองรับ macOS: `mise` → `brew` (และ `port` ถ้ามี)
- รองรับ Linux: `mise` → `apt` → `pacman` → `yum` → `dnf`
- ใช้โดย parent และ siblings: `download-program`, `list-program-in-computer`, `uninstall-program-in-computer`, `update-all-program-in-computer`

##### Execute

###### 1. Detect OS

> Goal: ระบุ OS ปัจจุบัน

1. บน PowerShell: ใช้ `[System.Runtime.InteropServices.RuntimeInformation]::OSDescription`
2. ถ้าเจอ `Microsoft Windows` → ใช้ Windows package managers
3. ถ้าเจอ `Darwin` → ใช้ macOS package managers
4. ถ้าเจอ `Linux` → ใช้ Linux package managers
5. บันทึก OS เพื่อใช้เลือก package manager

###### 2. Check Available Package Managers

> Goal: รู้ว่า package manager ใดพร้อมใช้

1. Windows: `Get-Command mise/scoop/winget -ErrorAction SilentlyContinue`
2. macOS: `Get-Command mise/brew -ErrorAction SilentlyContinue`
3. Linux: `Get-Command mise/apt/pacman/yum/dnf -ErrorAction SilentlyContinue`
4. บันทึกรายการ package manager ทีพร้อมใช้

###### 3. Determine Best Package Manager For Action

> Goal: เลือก package manager ตาม action

1. `install`: dev tool / versioned tool → ลอง `mise` ก่อน แล้วตาม OS order (Windows: `scoop` → `winget`, macOS: `brew`, Linux: native)
2. `list`: query ทุก package manager ที่มีอยู่ และรวมผล
3. `uninstall`: หา package manager ทีติดตั้ง program นี้ก่อน ด้วย `list-program-in-computer` หรือ `list` ของแต่ละตัว — ถ้าไม่พบ → แจ้ง user

###### 4. Search Program In Package Manager

> Goal: ยืนยันว่า package manager มี program

1. `mise`: `mise search <program>` หรือ `mise list-all <program>`
2. `scoop`: `scoop search <program>`
3. `winget`: `winget search <program>`
4. `brew`: `brew search <program>`
5. `apt`: `apt-cache search <program>`; `pacman`: `pacman -Ss <program>`; `yum`/`dnf`: `yum search <program>`
6. ถ้า package manager แรกไม่มี → ลองตัวถัดไปตามลำดับ

###### 5. Return Recommendation

> Goal: ส่งมอบคำแนะนำทีชัดเจน

1. ระบุ package manager ทีควรใช้ + command สำหรับ action (install/list/uninstall)
2. ถ้าไม่มี package manager ใดทีมี program → แนะนำให้ใช้ `download-program` fallback หรือ `/open-web`

##### Rules

###### 1. OS-Specific Order

- Windows: `mise` → `scoop` → `winget`; macOS: `mise` → `brew`; Linux: `mise` → native
- ไม่กำหนด order ทีไม่เข้ากับ OS

###### 2. No Hidden Install Of Package Manager

- ถ้า package manager ยังไม่มี → แจ้ง user หรือใช้ `download-program` ติดตั้ง
- ไม่ติดตั้ง package manager โดยไม่บอกกล่าว

###### 3. Action-Aware

- `install`: เน้นตัวที่จัดการ version ดี; `list`: query ทุกตัว; `uninstall`: หา source จริงก่อนลบ

###### 4. Idempotent

- ถ้า program ติดตั้งแล้ว ให้ `download-program` หรือ `uninstall-program-in-computer` ตรวจก่อน — ไม่ติดตั้งซ้ำ/ลบซ้ำ

###### 5. Output

- แสดง OS, package manager ทีเลือก, command, และเหตุผลสั้นๆ + fallback ถ้าหาไม่เจอ

- ใช้ /use-pwsh-shell ถ้าจำเป็น
- ใช้ /run-install ถ้าจำเป็น

##### Expected Outcome

- ได้ package manager ทีเหมาะสมสำหรับ OS และ action พร้อม command ทีถูกต้อง
- ไม่ติดตั้ง package manager หรือ program โดยไม่ได้รับอนุญาติ

## Expected Outcome

- Program ถูกติดตั้งผ่าน package manager ทีเหมาะสมถ้าหาเจอ
- ถ้าติดตั้งไม่ได้ จะเปิดหน้า download หลักให้ user ติดตั้งเอง
- ไม่มีการติดตั้งซ้ำถ้า program มีอยู่แล้ว
- ได้ report ครบถ้วนว่าใช้วิธีไหน, version เท่าไร, path ไหน หรือเปิด URL อะไร
