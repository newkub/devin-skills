---
name: follow-template-license
description: ตั้งค่าและใช้งาน license ตาม template มาตรฐานสำหรับโปรเจกต์
---

## Goal

ใช้ license ที่เหมาะสมกับประเภทโปรเจกต์ ตาม template มาตรฐาน

## Scope

ตั้งค่า LICENSE.md สำหรับโปรเจกต์ทุกประเภท

## Execute

### 1. Check Current License
> Goal: Check Current License

1. ตรวจสอบไฟล์ `LICENSE.md` ที่มีอยู่
2. ระบุประเภท license ปัจจุบัน
3. ตรวจสอบว่า license ถูกต้องตามประเภทโปรเจกต์

### 2. Choose Appropriate License
> Goal: Choose Appropriate License

1. เลือก license ตามประเภทโปรเจกต์:
   - Open Source Library: MIT, Apache-2.0, BSD-3-Clause
   - Commercial Product: Proprietary
   - Template/Starter: MIT
   - Documentation: CC-BY-4.0
2. ตรวจสอบความเหมาะสมกับ business model
3. ตรวจสอบความเหมาะสมกับ dependencies

### 3. Apply License Template
> Goal: Apply License Template

1. ใช้ template มาตรฐานตามประเภท license
2. อัปเดตปีและชื่อผู้ถือลิขสิทธิ์
3. ตรวจสอบความถูกต้องของข้อความ
4. บันทึกไฟล์ `LICENSE.md`

### 4. Update Package Manifest
> Goal: Update Package Manifest

1. อัปเดต `license` field ใน `package.json` หรือ `Cargo.toml`
2. ตรวจสอบว่าค่าตรงกับ LICENSE.md
3. ตรวจสอบว่าใช้ SPDX identifier ที่ถูกต้อง

## Rules

### 1. License Selection

เลือก license ตามหลักการ:

- MIT: สำหรับ libraries และ templates ที่ต้องการความเรียบง่าย
- Apache-2.0: สำหรับ projects ที่ต้องการ patent protection
- BSD-3-Clause: สำหรับ projects ที่ต้องการความยืดหยุ่น
- Proprietary: สำหรับ commercial products ที่ไม่เปิด source

### 2. MIT License Template

ใช้ template มาตรฐานนี้สำหรับ MIT License (ภาษาอังกฤษ ไม่รวม disclaimer และไม่ต้องมีปี):

```
MIT License

Copyright (c) [COPYRIGHT HOLDER]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

### 3. Package Manifest Update

อัปเดต package manifest ให้ตรงกับ license:

- `package.json`: `"license": "MIT"` หรือ SPDX identifier อื่นๆ
- `Cargo.toml`: `license = "MIT"` หรือ SPDX identifier อื่นๆ
- ใช้ SPDX identifier ที่ถูกต้องเสมอ

### 4. Copyright Information

ระบุ copyright อย่างถูกต้อง:

- ไม่ต้องระบุปีใน copyright
- ระบุชื่อ organization หรือผู้ถือลิขสิทธิ์ชัดเจน
- สำหรับ personal projects ใช้ชื่อผู้สร้าง
- สำหรับ organization projects ใช้ชื่อ organization

## Expected Outcome

- มีไฟล์ LICENSE.md ที่ถูกต้องและครบถ้วน
- License ใน package manifest ตรงกับ LICENSE.md
- Copyright information ถูกต้องและเป็นปัจจุบัน
- License เหมาะสมกับประเภทโปรเจกต์

## Common Mistakes

- ใช้ license ที่ไม่เหมาะสมกับประเภทโปรเจกต์
- ไม่อัปเดต package manifest ให้ตรงกับ LICENSE.md
- ไม่ระบุ copyright หรือระบุไม่ถูกต้อง
- ใช้ SPDX identifier ที่ผิด

## Anti-Patterns

- ❌ ไม่มีไฟล์ LICENSE.md ในโปรเจกต์
- ❌ ใช้ license ที่ไม่ได้รับอนุญาตจาก dependencies
- ❌ ใช้ custom license โดยไม่จำเป็น
- ❌ ไม่อัปเดตปี copyright
