---
title: Update Create Changeset
description: สร้าง changeset สำหรับบันทึกการเปลี่ยนแปลง
auto_execution_mode: 3
---

## Goal

สร้าง changeset สำหรับบันทึกการเปลี่ยนแปลงใน packages

## Scope

ครอบคลุมการสร้าง changeset สำหรับ version management

## Execute

### 1. Create Changeset

สร้าง changeset ใหม่:

```bash
bunx changeset
```

### 2. Select Packages

เลือก packages ที่มีการเปลี่ยนแปลง:
- เลือก packages จาก list
- กด Enter เพื่อ skip

### 3. Choose Bump Type

เลือก version bump type:
- major: Breaking changes
- minor: New features
- patch: Bug fixes

### 4. Write Changelog Message

เขียน changelog message:
- อธิบายการเปลี่ยนแปลง
- เขียนให้ชัดเจนและเฉพาะเจาะ

### 5. Commit Changeset

Commit changeset ไปยัง git:

```bash
git add .changesets/
git commit -m "chore: add changeset"
```

## Expected Outcome

- Changeset สร้างเรียบร้อย
- Packages และ bump type ระบุเรียบร้อย
- Changelog message เขียนเรียบร้อย
- Changeset commit เรียบร้อย
