---
name: check-open-ports
description: ตรวจ port ว่างหรือชนกันก่อน run-dev หรือ deploy พร้อมหา process เจ้าของ port
argument-hint: "[port...]"
related:
  - run-dev
  - use-pwsh-shell
  - list-computer-info
  - check-system-env
  - resolve-errors
  - report-table
  - check-file-locks
---

## Goal

ตรวจสอบว่า ports ที่ต้องการว่างหรือถูก process อื่นใช้งานอยู่ ก่อนรัน dev server, build หรือ deploy — พร้อมระบุ process เจ้าของ port

## Scope

- ใช้ก่อน `run-dev`, `run-preview` หรือ deploy เมื่อ config ระบุ port
- ครอบคลุมการตรวจ port เดียว, หลาย port และ port ranges
- Read-only: ตรวจและรายงานเท่านั้น ไม่ kill process โดยไม่ได้รับคำสั่ง

## Execute

### 1. Identify Ports

> Goal: รู้ว่าต้องตรวจ port ไหน

1. รับ `port...` จาก argument
2. ถ้าไม่ระบุ → ดึง port จาก config ของ project: `vite.config.*`, `wrangler.toml`, `package.json` scripts, `.env`, `docker-compose.yml`
3. ถ้าไม่พบใน config → ตรวจ ports นิยม: `3000`, `5173`, `8000`, `8080`, `8787`

### 2. Check Port Status

> Goal: ตรวจว่าแต่ละ port ว่างหรือไม่

1. บน Windows: ใช้ `Get-NetTCPConnection -LocalPort <port> -State Listen -ErrorAction SilentlyContinue`
2. ข้าม platform: ใช้ `Test-NetConnection -Port <port>` หรือ `netstat -ano | findstr :<port>`
3. บน macOS/Linux: ใช้ `lsof -i :<port>` หรือ `ss -tlnp`
4. บันทึก state: `free`, `listening`, `time-wait`

### 3. Identify Owning Process

> Goal: รู้ว่า process ไหนถือ port

1. จาก `Get-NetTCPConnection` เอา `OwningProcess` แล้ว `Get-Process -Id <pid>`
2. แสดง `ProcessName`, `Id`, `Path` และ command line ถ้าเป็นไปได้
3. ระบุว่า process เป็น project dev server เดิมหรือ process อื่น
4. ถ้าเป็น dev server เก่าของ project เดียวกัน → flag ว่า `restartable`

### 4. Suggest Resolution

> Goal: แนะนำทางแก้เมื่อ port ชน

1. เสนอ port ว่างถัดไป (เช่น `<port>+1` จนกว่าจะว่าง)
2. ถ้า process เจ้าของเป็น dev server เก่าของ project เดียวกัน → เสนอ kill แล้วรันใหม่
3. ถ้าเป็น process อื่น → รายงานชื่อและปล่อยให้ user ตัดสินใจ
4. ห้าม kill process อัตโนมัติ — ถาม user ก่อนเสมอ

### 5. Report

> Goal: สรุปผลอ่านง่าย

1. ทำ `/report-table` คอลัมน์: `No.`, `Port`, `Status`, `Process`, `PID`, `Action`
2. Status: `free`, `listening`, `conflict`
3. สรุปว่าพร้อม `run-dev` หรือไม่

## Rules

### 1. Read-Only Default

- ไม่ kill process โดยไม่ได้รับคำสั่งชัดเจนจาก user
- ไม่เปลี่ยน firewall rules หรือ network config

### 2. Cross-Platform

- ใช้ `/use-pwsh-shell` commands บน Windows
- ให้ command equivalent สำหรับ macOS/Linux ในรายงานเมื่อเกี่ยวข้อง

### 3. Accuracy

- ตรวจทั้ง TCP `Listen` state และ UDP ถ้า app ใช้
- อย่าสรุปว่า port ว่างจาก `Test-NetConnection` fail เพียงอย่างเดียว — ตรวจ listen state ด้วย

- ใช้ /run-dev ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Expected Outcome

- รู้ว่า ports เป้าหมายว่างหรือชน พร้อม process เจ้าของ
- ได้ทางเลือก port ว่างหรือแผน resolve conflict
- พร้อม `run-dev` หรือ deploy โดยไม่เจอ `EADDRINUSE`
