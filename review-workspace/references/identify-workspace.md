---
name: identify-workspace
description: รู้ว่า review workspace ใด และอยู่ที่ไหน
---

# Identify Workspace

ระบุ workspace ที่จะ review

## Goal

รู้ว่า review workspace ใด และอยู่ที่ไหน

## Checks

1. ถ้ามี argument ให้ใช้เป็นค่าเริ่มต้น ถ้าไม่มีให้ใช้ current working directory
2. ทำ `/check-monorepo` เพื่อตรวจสอบว่าเป็น monorepo หรือไม่
3. ถ้าเป็น monorepo ให้ทำ `/list-workspaces` เพื่อแสดงรายการ workspaces ทั้งหมด
4. ระบุ target workspace path และ root workspace path
5. ถ้า workspace ไม่พบให้ stop และ report

