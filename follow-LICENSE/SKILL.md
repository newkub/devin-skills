---
name: follow-LICENSE
description: ตั้งค่าและจัดการ license สำหรับ project
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - or
---

## Goal

ตั้งค่า license file ที่เหมาะสมสำหรับ project และระบุ copyright ถูกต้อง

## Scope

ใช้สำหรับ project ที่ต้องการ license file ที่ root directory

## Execute

### 1. Choose License

> Goal: เลือก license ที่เหมาะสมกับ project
> Goal: รู้ประเภท license ที่จะใช้

1. เลือกจาก common licenses: MIT, Apache-2.0, GPL-3.0, BSD-3-Clause
2. ดูรายละเอียดที่ `https://choosealicense.com`
3. ถ้าไม่แน่ใจ → ใช้ MIT เป็น default

### 2. Create License File

> Goal: สร้าง `LICENSE` file ที่ root directory
> Goal: มี license file ที่ root directory

1. สร้างไฟล์ `LICENSE` (ไม่มี extension) ที่ root
2. ระบุ copyright holder และปี
3. วาง license text ตามประเภทที่เลือก

```text
MIT License

Copyright (c) [year] [copyright holder]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 3. Update Package Manifest

> Goal: ระบุ license ใน `package.json` หรือ `pyproject.toml`
> Goal: license ถูกระบุใน package manifest

1. เพิ่ม `"license": "MIT"` ใน `package.json`
2. หรือ `license = { text = "MIT" }` ใน `pyproject.toml`
3. ตรวจสอบว่าตรงกับ `LICENSE` file

## Rules

- ใช้ `LICENSE` (ไม่มี extension) เป็นชื่อไฟล์
- ระบุ copyright holder และปีให้ถูกต้อง
- ระบุ license ใน package manifest ให้ตรงกับ `LICENSE` file
- อ้างอิง `https://choosealicense.com` สำหรับเลือก license

## Expected Outcome

- `LICENSE` file อยู่ที่ root directory
- Copyright holder และปีถูกต้อง
- Package manifest ระบุ license ตรงกับ `LICENSE` file
