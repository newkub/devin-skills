---
name: uninstall-program-in-computer
description: ลบ program ออกจากเครื่องโดยเลือก package manager ทีเหมาะสม
argument-hint: "[program-name]"
related:
  - follow-my-package-manager
  - list-program-in-computer
  - use-pwsh-shell
  - download-program
  - enhance-prompt
  - resolve-errors
  - report-table
---

## Goal

ลบ program ออกจากเครื่องโดยเลือก package manager ทีเหมาะสม

## Scope

- ใช้บน Windows เป็นหลัก
- ค้นหาว่า program ติดตั้งผ่าน package manager ใด
- ลบดัวยคำสั่งทีถูกต้องของ package manager นั้น
- ถ้าไม่อยู่ใน package manager ให้รายงานและหยุด
- ถ้า program เป็น system-critical ให้แจ้ง user ก่อนลบ

## Execute

### 1. Identify Program

> Goal: ระบุ program ทีต้องการลบ

1. รับ `program-name` จาก argument
2. ถ้าชื่อกำกวม → ใช้ `/list-program-in-computer <program-name>` หรือ `/enhance-prompt`
3. หาชื่อทีตรงกันในรายการทีติดตั้ง

### 2. Find Package Manager Source

> Goal: หาว่า program ถูกติดตั้งโดย package manager ใด

1. ทำ `/follow-my-package-manager <program-name> uninstall`
2. หรือเรียก `/list-program-in-computer <program-name>` เพื่อดู package manager
3. ตรวจสอบ `mise list`, `scoop list`, `winget list` ด้วย filter
4. บันทึก package manager ทีพบ

### 3. Uninstall Via Mise

> Goal: ลบ program ที่ติดตั้งด้วย mise

1. ถ้า `mise list` มี program → รัน `mise uninstall <program>`
2. ถ้า `mise` ไม่มี → ข้ามไป package manager ถัดไป
3. ตรวจสอบ `Get-Command <program>` หลัง uninstall

### 4. Uninstall Via Scoop

> Goal: ลบ program ทีติดตั้งด้วย scoop

1. ถ้า `scoop list <program>` มี → รัน `scoop uninstall <program>`
2. ถ้าเป็น global app (`scoop install -g`) → ใช้ `scoop uninstall -g <program>`
3. ตรวจสอบ `Get-Command <program>` หลัง uninstall

### 5. Uninstall Via Winget

> Goal: ลบ program ทีติดตั้งด้วย winget

1. หา package id จาก `winget list <program>`
2. รัน `winget uninstall --id <package-id> --accept-source-agreements`
3. ถ้า package ต้องการ UAC ให้แจ้ง user
4. ตรวจสอบ `winget list --id <package-id>` เพื่อยืนยันว่าลบแล้ว

### 6. Verify Uninstall

> Goal: ยืนยันว่าลบสำเร็จ

1. รัน `Get-Command <program>` ต้องไม่เจอ
2. รัน `scoop list <program>`, `winget list --id <id>`, `mise list <program>` ต้องไม่เจอ
3. ถ้ายังเจอ → ทำ `/resolve-errors` หรือแจ้ง user

### 7. Report

> Goal: สรุปผล

1. ใช้ `/report-table` แสดง program ทีลบ, package manager, สถานะ
2. ถ้าไม่สามารถลบได้ → ระบุสาเหตุและขั้นตอนถัดไป

## Rules

### 1. Find Source First

- ห้าม uninstall โดยไม่ทราบ package manager
- ถ้าไม่อยู่ใน package manager ใด ให้หยุดและแนะนำให้ลบด้วย Windows Settings หรือ `/open-web` หา uninstaller

### 2. Confirm Destructive Action

- ก่อน uninstall ให้ระบุ program ทีจะลบ
- ถ้าเป็น tool สำคัญ (shell, editor, dev tools) แนะนำให้ user ยืนยัน
- ไม่ลบ `mise`, `scoop`, `winget` เองโดยไม่ได้รับคำสั่งชัดเจน

### 3. Use Correct Command

- `mise`: `mise uninstall <program>`
- `scoop`: `scoop uninstall <program>` หรือ `scoop uninstall -g <program>`
- `winget`: `winget uninstall --id <package-id>`
- `brew`: `brew uninstall <program>`
- `apt`: `sudo apt remove <program>`

### 4. Idempotent

- ถ้า program ไม่อยู่แล้ว รายงานว่าลบแล้ว/ไม่พบ
- ไม่ลบซ้ำ

### 5. Error Handling

- ถ้า uninstall ล้มเหลว ให้เก็บ error message
- แนะนำวิธีแก้ไขหรือ fallback

- ใช้ /use-pwsh-shell ถ้าจำเป็น
- ใช้ /download-program ถ้าจำเป็น

## Expected Outcome

- Program ถูกลบออกจากระบบ
- ยืนยันว่าไม่พบ program หลัง uninstall
- รายงาน package manager ทีใช้และสถานะ
- ไม่ลบ program ทีไม่ได้ติดตั้งผ่าน package manager โดยไม่มีการยืนยัน
