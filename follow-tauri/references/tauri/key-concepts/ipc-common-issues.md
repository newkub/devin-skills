---
title: IPC Common Issues
description: ปัญหาทั่วไปใน IPC และวิธีแก้ไข
---

## Command Not Found

**Cause**: Command ไม่ได้ register

**Solution**: เพิ่ม command ใน `invoke_handler`

## Type Mismatch

**Cause**: Data types ไม่ตรงกัน

**Solution**: ใช้ serde serialization และ validate types

## Blocking Operations

**Cause**: Synchronous operations block UI

**Solution**: ใช้ async commands
