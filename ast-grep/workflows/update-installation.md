---
title: Update Installation
description: ติดตั้ง ast-grep สำหรับ code search และ transformation
auto_execution_mode: 3
---

## Goal

ติดตั้ง ast-grep สำหรับใช้งานใน project

## Scope

ครอบคลุมการติดตั้ง ast-grep ผ่าน bunx หรือ global installation

## Execute

### 1. Check Installation

ตรวจสอบว่า ast-grep ติดตั้งแล้วหรือยัง:

```bash
ast-grep --version
```

### 2. Install via Bun (Recommended)

ใช้ bunx โดยไม่ต้องติดตั้ง global:

```bash
bunx ast-grep --version
```

### 3. Install Globally (Optional)

ติดตั้ง global ถ้าต้องการใช้บ่อย:

```bash
bun add -g @ast-grep/cli
```

### 4. Verify Installation

ทดสอบการทำงาน:

```bash
ast-grep --version
```

## Expected Outcome

- ast-grep ติดตั้งเรียบร้อย
- สามารถรันคำสั่ง ast-grep ได้
- พร้อมใช้งานสำหรับ code search และ transformation
