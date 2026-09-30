---
name: native-sdk-getting-started
description: Install the Native SDK CLI, scaffold an app, and run a dev build
related: []
allowed-tools:
  - read
  - exec
  - webfetch
  - ask_user_question
permissions:
  allow:
    - Exec(native *)
    - Exec(npm install -g @native-sdk/cli)
    - Exec(bun install -g @native-sdk/cli)
    - Exec(zig build -Doptimize=ReleaseFast)
triggers:
  - user
---

## Goal

ติดตั้ง CLI, สร้าง Native SDK app, และรัน dev server จาก quick start guide

## Scope

ครอบคลุม install, `native version`, `native init`, `native dev`, `native build` สำหรับ TypeScript core

## Execute

### 1. Verify Environment

ตรวจสอบ prerequisites
> Goal: มั่นใจว่าพร้อมติดตั้ง

1. ใช้ `exec` ตรวจ `node -v` (ต้อง 24+) หรือ `bun -v`
2. ตรวจ `native version` ถ้ามีอยู่
3. ถ้าไม่มี `zig` บน PATH → CLI จะ offer download ให้อัตโนมัติ หรือให้ user ติดตั้งก่อน

### 2. Install CLI

ติดตั้ง Native SDK CLI
> Goal: มี `native` command ใช้งาน

1. รัน `npm install -g @native-sdk/cli` หรือ `bun install -g @native-sdk/cli`
2. ตรวจ `native version`

### 3. Create Project

สร้าง app
> Goal: มี scaffold เริ่มต้น

1. ถาม user ชื่อ project และ path
2. รัน `native init <project-name>` (หรือ `--template zig-core` ถ้าต้องการ Zig)
3. `cd <project-name>`

### 4. Run Dev Server

รัน dev
> Goal: เปิด window พัฒนา

1. รัน `native dev`
2. รอ compile ครั้งแรก
3. แก้ `src/app.native` หรือ `src/core.ts` ขณะ app รัน

### 5. Build Release

build binary
> Goal: ได้ binary optimize

1. รัน `native build` (หรือ `zig build -Doptimize=ReleaseFast` ถ้า ejected/full)
2. ตรวจไฟล์ใน `zig-out/bin/`

## Rules

### 1. Tooling

- ใช้ `npm` เป็น default ถ้าไม่มี `bun`
- Zig เป็น build backend ที่ CLI จัดการให้ ไม่ต้องเขียน build files
- อย่าแก้ไขไฟล์ใน `.native/build/` ที่ CLI generate

### 2. Safety

- ถาม user ก่อนรัน command ที่สร้าง/เขียนทับ directory
- ไม่ commit/push โดยไม่ได้รับอนุญาต

## Expected Outcome

- `native version` แสดงเวอร์ชัน
- `native init` สร้าง project สำเร็จ
- `native dev` เปิด window
- `native build` สร้าง binary ได้
