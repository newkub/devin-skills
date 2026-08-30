---
name: use-my-packages-on-registry
description: ดึงรายการ packages ที user เป็นเจ้าของจาก registry แล้วติดตั้งใช้ใน project
related:
  - list-my-npm-packages
  - follow-my-tech-stack
  - use-bun-native-api
  - use-scripts
  - follow-runtime-bun
  - suggest-next-action
  - report-table
  - ask-me
---

## Goal

ดู packages ที user publish ไว้บน registry แล้วเลือกติดตั้งมาใช้ใน project

## Scope

ใช้กับ project ทีมี package manager (npm/bun, cargo, python) เพื่อ list และ install packages ที user เป็นเจ้าของ

## Execute

### 1. Detect Registry And Package Manager

> Goal: ระบุ registry และ package manager ของ project

1. อ่าน `package.json` → ใช้ npm/bun registry
2. อ่าน `Cargo.toml` → ใช้ crates.io
3. อ่าน `pyproject.toml` → ใช้ PyPI
4. ถ้ามีทั้ง `package.json` และ `Cargo.toml` → ให้ user เลือก หรือทำตาม manifest หลัก
5. ถ้าไม่มี manifest → ทำ `/ask-me` เพื่อระบุ registry

### 2. List My Packages

> Goal: ดึงรายการ packages ที user เป็นเจ้าของ

1. npm/bun → ทำ `/list-my-npm-packages`
2. cargo → ใช้ `cargo search` หรือ `https://crates.io/api/v1/crates?user_id=<id>` ถ้าหา username ได้
3. python → ใช้ `pip index versions <pkg>` หรือ `https://pypi.org/pypi/<pkg>/json` ตามทีทราบชื่อ
4. แสดงผลด้วย `/report-table` คอลัมน์ `No.`, `Package`, `Version`, `Registry`, `Description`

### 3. Select Packages

> Goal: เลือก packages ทีจะติดตั้ง

1. ทำ `/ask-me` หรือเลือกจาก `/report-table` ว่าจะติดตั้ง package ใด
2. ตรวจสอบ `/follow-my-tech-stack` ว่า package ทีเลือกสอดคล้องกับ tech stack หรือไม่
3. ระบุว่าเป็น `dependencies`, `devDependencies` หรือ `peerDependencies`
4. ถ้ามีหลาย package manager → ทำตามลำดับที user เลือก

### 4. Install Packages

> Goal: ติดตั้ง packages ทีเลือกลง project

1. Bun/Node:
   - `bun add <pkg>` สำหรับ dependencies
   - `bun add -d <pkg>` สำหรับ dev dependencies
   - ถ้า project ใช้ npm เป็นหลัก: ใช้คำสั่ง install ของ npm ด้วย package name
2. cargo:
   - `cargo add <pkg>`
   - `cargo add --dev <pkg>` สำหรับ dev dependencies
3. python:
   - `pip install <pkg>`
   - บันทึกลง `requirements.txt` หรือ `pyproject.toml`
4. อัปเดต lockfile ด้วย `bun install`, `cargo update`, `pip freeze`

### 5. Verify

> Goal: ยืนยันว่าติดตั้งสำเร็จ

1. ตรวจสอบ manifest ว่ามี package ทีติดตั้ง
2. รัน test/build ของ project
3. ตรวจสอบ imports ใช้ได้
4. ทำ `/suggest-next-action`

## Rules

### 1. Registry Detection

- ใช้ manifest ของ project เป็นหลัก
- ถ้าไม่ชัดเจน → ทำ `/ask-me`
- ไม่ assume registry

### 2. Package Selection

- ใช้ `/follow-my-tech-stack` เพื่อตรวจสอบ compatibility
- ไม่ duplicate dependencies ทีมีอยู่
- ถ้ามีหลาย package manager → ให้ user เลือก

### 3. Security

- ไม่ expose tokens, credentials หรือ secrets
- ใช้ `bun add` สำหรับ Bun/Node project ในระดับ project
- ใช้ `cargo add` สำหรับ Rust

### 4. Scripts And Temp

- ถ้าต้อง process ข้อมูลซับซ้อน → ทำ `/use-scripts`
- ใช้ `/create-files-in-os-temp` สำหรับ temp files หรือ reports ชั่วคราว

## Expected Outcome

- รายการ packages จาก registry ที user เป็นเจ้าของ
- packages ถูกติดตั้งใน project ตาม package manager ทีตรวจพบ
- manifest และ lockfile อัปเดต
- ไม่มี broken references