---
name: follow-lib-qrcode
description: ใช้ qrcode สร้าง QR codes — PNG/SVG/dataURL ฝั่ง server หรือ client
argument-hint: "[target-or-scope]"
related:
  - follow-best-practice
  - run-verify
  - run-test
  - report-table
---

## Goal

ใช้ qrcode สร้าง QR codes — PNG/SVG/dataURL ฝั่ง server หรือ client

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. ใช้ `QRCode.toDataURL()`, `toBuffer()`, `toString(type: svg)` ตาม output
1. ตั้ง `errorCorrectionLevel` (M/Q/H สำหรับ logo overlay)
1. สำหรับ API response ใช้ `toBuffer` + `new Response(new Uint8Array(buf))`
1. อย่า embed data ขนาดใหญ่ — QR มี capacity จำกัด (~4KB binary)

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- เลือก output ตาม consumer: dataURL สำหรับ `<img>`, buffer สำหรับ download
- ตั้ง margin/width ให้ scan ได้จริง (อย่างน้อย margin=2)
- ทดสอบ scan จริงก่อน ship

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน