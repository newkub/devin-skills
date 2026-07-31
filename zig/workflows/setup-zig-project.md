---
title: Setup Zig Project
description: สร้างโปรเจกต์ Zig ใหม่ด้วย build system ที่เหมาะสม
auto_execution_mode: 3
---

## Goal

สร้างโปรเจกต์ Zig ใหม่ที่มี build system และ structure ที่เหมาะสม

## Scope

ใช้สำหรับสร้างโปรเจกต์ Zig ใหม่

## Execute

### 1. Initialize Project

สร้าง folder โปรเจกต์และไฟล์เริ่มต้น

```bash
mkdir my-zig-project
cd my-zig-project
zig init
```

### 2. Configure build.zig

แก้ไข `build.zig` ตามความต้องการของโปรเจกต์

### 3. Set Up Source Structure

สร้าง folder structure ที่เหมาะสม

```text
src/
├── main.zig
└── ...
```

### 4. Add Dependencies

เพิ่ม dependencies ใน build.zig ถ้าจำเป็น

### 5. Test Build

รัน build เพื่อตรวจสอบ

```bash
zig build
zig build run
```

## Rules

### Project Structure

- ใช้ `zig init` สำหรับเริ่มต้น
- แยก source code ไว้ใน `src/`
- ใช้ `build.zig` สำหรับ build configuration
- เพิ่ม tests ในไฟล์เดียวกับ source

### Build Configuration

- ใช้ `b.standardReleaseOptions` สำหรับ release modes
- เพิ่ม `b.installArtifact` สำหรับ executables
- ใช้ `b.addTest` สำหรับ tests

## Expected Outcome

- โปรเจกต์ Zig ที่สามารถ build ได้
- Structure ที่เป็นมาตรฐาน
- Build system ที่กำหนดได้
