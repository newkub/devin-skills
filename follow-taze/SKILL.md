---
name: follow-taze
description: ตั้งค่า Taze สำหรับจัดการ dependencies อัตโนมัติใน monorepos
---

## Goal

ตั้งค่า Taze สำหรับจัดการ dependencies อัตโนมัติใน monorepos

## Scope

ตั้งค่า Taze สำหรับ monorepos และ workspaces

## Execute

### 1. Use Taze
> Goal: Use Taze

ใช้ Taze ผ่าน bunx โดยไม่ต้องติดตั้ง

1. รัน `bunx taze` สำหรับคำสั่งทั้งหมด
2. ไม่ต้องติดตั้ง taze ใน package.json

### 2. Configure Package.json
> Goal: Configure Package.json

1. เพิ่ม `prepare` script ใน `package.json`
2. ใช้ `bunx taze latest -w -r -i` สำหรับ update latest, write, recursive, install

```json [package.json]
{
  "scripts": {
    "prepare": "bunx taze latest -w -r -i"
  }
}
```

## Rules

### 1. Prepare Script

ตั้งค่า prepare script สำหรับ automated dependency updates:

- ใช้ `bunx taze latest -w -r -i` สำหรับ update latest, write, recursive, install
- รันอัตโนมัติก่อน git operations
- เหมาะสำหรับ monorepos

### 2. Taze Options

ตัวเลือกที่ใช้:

- `latest`: update dependencies เป็น version ล่าสุด
- `-w`: write changes ลง `package.json`
- `-r`: recursive สำหรับ monorepos
- `-i`: install dependencies หลัง update

## Expected Outcome

- Dependencies ถูกจัดการอัตโนมัติ
- Monorepo รองรับการอัพเดท dependencies
- Dependencies เป็น version ล่าสุดเสมอ
