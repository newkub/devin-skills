---
name: download-program
description: ค้นหาและติดตั้ง program บน Windows โดยลองผ่าน mise, scoop, winget ก่อน ถ้าไม่มีให้เปิดหน้า download
argument-hint: "[program-name]"
related:
  - use-mise
  - use-scoop
  - use-pwsh-shell
  - open-web
  - search-in-github-star
  - search-files-patterns
  - follow-best-practice
---

## Goal

ช่วยค้นหาและติดตั้ง program บนเครื่องให้เร็วที่สุด โดยลอง package manager ตามลำดับทีเหมาะสม และ fallback ไปหน้า download ถ้าหาไม่เจอ

## Scope

- ใช้บน Windows เป็นหลัก (หาก OS อื่นให้ปรับ package manager ตาม context)
- รองรับ `mise`, `scoop`, `winget` ตามลำดับความเหมาะสม
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

1. รัน `Get-Command <program>` ใน PowerShell
2. ถ้าเจอ → บันทึก path และ version (`<program> --version`)
3. รายงานว่าติดตั้งแล้ว พร้อม version และ path
4. ถ้ายังไม่มี → ไปขั้นตอนถัดไป

### 3. Try Mise

> Goal: ติดตั้งด้วย mise ถ้าเป็นไปได้

1. ตรวจสอบว่า `mise` ติดตั้งแล้วหรือยัง (`Get-Command mise`)
2. ถ้า `mise` ยังไม่มี → ทำ `/download-program mise` เพื่อติดตั้ง mise ก่อน หรือข้ามไป package manager อื่น
3. รัน `mise search <program>` หรือ `mise list-all <program>`
4. ถ้าเจอ → ติดตั้ง global ด้วย `mise use -g <program>`
5. ตรวจสอบ `Get-Command <program>` หลังติดตั้ง
6. ถ้าสำเร็จ → รายงาน path และ version

### 4. Try Scoop

> Goal: ติดตั้งด้วย scoop ถ้า mise ไม่ได้

1. ตรวจสอบว่า `scoop` ติดตั้งแล้วหรือยัง (`Get-Command scoop`)
2. ถ้า `scoop` ยังไม่มี → ทำ `/download-program scoop` หรือข้ามไป winget
3. รัน `scoop search <program>`
4. ถ้าเจอ → ติดตั้งด้วย `scoop install <program>`
5. ตรวจสอบ `Get-Command <program>` หลังติดตั้ง
6. ถ้าสำเร็จ → รายงาน path และ version

### 5. Try Winget

> Goal: ติดตั้งด้วย winget ถ้า package manager ก่อนหน้าไม่สำเร็จ

1. ตรวจสอบว่า `winget` ติดตั้งแล้วหรือยัง (`Get-Command winget`)
2. รัน `winget search <program>`
3. ถ้าเจอ → เลือก package id ทีถูกต้อง
4. ติดตั้งด้วย `winget install --id <package-id> --accept-package-agreements --accept-source-agreements`
5. ตรวจสอบ `Get-Command <program>` หลังติดตั้ง
6. ถ้าสำเร็จ → รายงาน path และ version

### 6. Fallback to Manual Download

> Goal: เปิดหน้า download ให้ user ติดตั้งเองถ้า package manager หมดทาง

1. ใช้ `/search-files-patterns` หรือ `/search-in-github-star` หาหน้า download หลักของ program
2. ถ้าเจอ GitHub repo → เปิด `https://github.com/<owner>/<repo>/releases`
3. ถ้าเจอ official website → ใช้ `/open-web` เปิดหน้า download
4. ถ้าหาไม่เจอ → ค้นหาในเว็บด้วย `google` หรือ `duckduckgo` แล้วเปิดผลลัพธ์แรก
5. รายงาน URL ทีเปิดไว้ พร้อมขั้นตอนทั่วไปในการติดตั้ง
6. หยุดและรอ user ดำเนินการเอง

## Rules

### 1. Order of Install Methods

- ลอง `mise` ก่อน (เหมาะกับ dev tools และ version management)
- ลอง `scoop` ถัดมา (เหมาะกับ Windows CLI tools)
- ลอง `winget` ถัดมา (เหมาะกับ Windows desktop/MSIX apps)
- เปิดหน้า download ถ้าไม่มี package manager ใดทีมี program

### 2. OS Awareness

- Default เป็น Windows และ PowerShell
- ถ้า user บน macOS/Linux ให้ปรับไปใช้ `mise`, `brew`, `apt`, `pacman` ตาม context
- ระบุ OS ทีตรวจพบก่อนเลือก package manager

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

- Program ถูกติดตั้งผ่าน `mise`, `scoop` หรือ `winget` ถ้าหาเจอ
- ถ้าติดตั้งไม่ได้ จะเปิดหน้า download หลักให้ user ติดตั้งเอง
- ไม่มีการติดตั้งซ้ำถ้า program มีอยู่แล้ว
- ได้ report ครบถ้วนว่าใช้วิธีไหน, version เท่าไร, path ไหน หรือเปิด URL อะไร
