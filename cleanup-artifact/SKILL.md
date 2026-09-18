---
name: cleanup-artifact
description: ลบ build artifacts และ dependency caches ด้วย Rust CLI — dry-run ก่อนเสมอ
argument-hint: "[path] [--yes] [--deep] [--min MB]"
related:
  - cleanup-files-in-project
  - cleanup-files-in-computer
  - cleanup
  - run-clean
  - run-cleanup
  - ask-me
  - report
---

## Goal

คืน disk space และ clean state โดยลบ build artifacts และ dependency caches (`node_modules`, `target`, `dist`, `.next`, `coverage`, `__pycache__`, `.venv` ฯลฯ) ด้วย Rust CLI ใน skill นี้ — dry-run รายงานขนาดก่อนเสมอ

## Scope

- ครอบคลุม artifacts ทุก ecosystem: JS/Bun (`node_modules`, `dist`, `.next`, `.nuxt`, `.output`, `.turbo`, `coverage`), Rust (`target`), Python (`__pycache__`, `.venv`, `.pytest_cache`, `*.egg-info`), .NET (`bin`, `obj` — เฉพาะเมื่อ parent มี `.csproj`/`.sln`), Java/Kotlin (`.gradle`, `build`), Swift (`.build`), Zig (`zig-out`, `.zig-cache`), CMake (`cmake-build-*`), iOS (`Pods`, `DerivedData`)
- `--deep` เพิ่ม global caches: `~/.bun/install/cache`, `~/.npm`, `~/.cargo/registry`, `~/go/pkg/mod`, pip cache, pnpm store, `~/.m2`, `~/.gradle/caches`
- ต่างจาก `/cleanup-files-in-project` ที่ลบ source files ไม่แตะ artifacts — skill นี้กลับกัน

## Execute

### 1. Build CLI

> Goal: มี binary พร้อมใช้

1. `cargo build --release` ใน skill directory — binary อยู่ที่ `target/release/cleanup-artifact` (เพิ่ม `.exe` บน Windows)
2. ถ้า `cargo` ไม่มี → stop และ report

### 2. Scan And Report

> Goal: รู้ว่ามี artifacts อะไร ขนาดเท่าไร

1. รัน `cleanup-artifact <path>` (default `.`) — output เป็นตารางเรียงตามขนาด + total
2. ใช้ `--min <MB>` filter dirs เล็กๆ ออกถ้า scan กว้าง
3. ใช้ `--deep` เฉพาะเมื่อต้องการ global caches ด้วย
4. ทำ `/report` แสดงผล dry-run ให้ user

### 3. Confirm And Delete

> Goal: ลบเฉพาะที่ user อนุมัติ

1. ถาม user ด้วย `ask_user_question` — ลบ artifacts ที่ report ไหม (และ scope ไหน: project only / `--deep` ด้วย)
2. รัน `cleanup-artifact <path> --yes` (หรือ `--yes --deep`) เพื่อลบจริง — CLI รายงาน freed space ทีละ dir
3. ห้ามลบถ้ายังไม่ได้ confirm — dry-run เป็น default เสมอ

### 4. Validate

> Goal: ยืนยัน workspace ยังใช้ได้

1. รายงาน freed space จาก CLI output
2. แนะนำ reinstall ถ้าลบ `node_modules`/`.venv`: `bun install` / `cargo fetch` / `pip install -r requirements.txt`
3. ถ้าลบแล้ว build/test พัง → ทำ `/resolve-errors` (เกือบจะแก้ด้วย reinstall เสมอ)

## Rules

### 1. Dry-Run First

- ไม่มี `--yes` = report เท่านั้น — ห้ามลบโดยไม่ confirm
- `--deep` ต้องระบุชัดเจนใน confirmation (แตะ global caches นอก workspace)

### 2. Never Touch

- ห้ามลบ `.git`, `.devin`, `.env`, lock files, source files, config files — CLI skip `.git`/`.devin`/`.idea`/`.vscode` อยู่แล้ว
- `bin`/`obj` ลบเฉพาะเมื่อ parent มี `.csproj`/`.fsproj`/`.vcxproj`/`.sln` — กันลบ `bin/` ที่เป็น user scripts

### 3. Symlink Safe

- CLI ไม่ follow symlinks/junctions ตอน scan และ `remove_dir_all` ลบ reparse point ไม่ตามไปลบ target — ปลอดภัยบน Windows junctions

- ใช้ /cleanup-files-in-project ถ้าจำเป็น (ฝั่ง source files)
- ใช้ /cleanup-files-in-computer ถ้าจำเป็น (system-wide)
- ใช้ /ask-me ถ้าจำเป็น

## Expected Outcome

- ตาราง artifacts + ขนาดก่อนลบ (dry-run)
- artifacts ถูกลบหลัง confirm พร้อม freed space report
- ไม่มี source/lockfile/.env/.git ถูกแตะ
- reinstall hint ถ้าลบ dependency dirs
