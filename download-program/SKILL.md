---
name: download-program
description: ค้นหาและติดตั้ง program บนเครื่องโดยใช้ package manager ทีเหมาะสม ถ้าไม่มีให้เปิดหน้า download
argument-hint: "[program-name]"
related:
  - follow-my-package-manager
  - use-pwsh-shell
  - open-web
  - search-in-github-star
  - search-files-patterns
  - follow-best-practice
  - enhance-prompt
---

## Goal

ช่วยค้นหาและติดตั้ง program บนเครื่อง โดยเลือก package manager ทีเหมาะสมผ่าน `/follow-my-package-manager` และ fallback ไปหน้า download ถ้าหาไม่เจอ

## Scope

- ใช้ได้ทุก OS โดย `/follow-my-package-manager` จะเลือก package manager ตาม OS
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

1. ใช้ `/follow-my-package-manager <program-name> install`
2. บันทึกลำดับ package manager ทีได้รับ เช่น `[mise, scoop, winget]`
3. บันทึก command template สำหรับ install ของแต่ละ package manager
4. ถ้า `follow-my-package-manager` ไม่พบ package manager ใดที่มี program → ข้ามไป fallback

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

1. ใช้ `/search-files-patterns` หรือ `/search-in-github-star` หาหน้า download หลักของ program
2. ถ้าเจอ GitHub repo → เปิด `https://github.com/<owner>/<repo>/releases`
3. ถ้าเจอ official website → ใช้ `/open-web` เปิดหน้า download
4. ถ้าหาไม่เจอ → ค้นหาในเว็บด้วย `google` หรือ `duckduckgo` แล้วเปิดผลลัพธ์แรก
5. รายงาน URL ทีเปิดไว้ พร้อมขั้นตอนทั่วไปในการติดตั้ง
6. หยุดและรอ user ดำเนินการเอง

## Rules

### 1. Delegate Package Manager Selection

- ใช้ `/follow-my-package-manager` เพื่อเลือก package manager เสมอ
- ไม่ hardcode ลำดับ package manager ใน skill
- ถ้า OS เปลี่ยน ให้ `follow-my-package-manager` จัดการ

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

## Expected Outcome

- Program ถูกติดตั้งผ่าน package manager ทีเหมาะสมถ้าหาเจอ
- ถ้าติดตั้งไม่ได้ จะเปิดหน้า download หลักให้ user ติดตั้งเอง
- ไม่มีการติดตั้งซ้ำถ้า program มีอยู่แล้ว
- ได้ report ครบถ้วนว่าใช้วิธีไหน, version เท่าไร, path ไหน หรือเปิด URL อะไร
