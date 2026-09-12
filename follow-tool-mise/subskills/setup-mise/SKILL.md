---
name: follow-tool-mise-setup-mise
description: ติดตั้ง mise CLI และ activate shell integration ให้พร้อมใช้งานครั้งแรก
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - run-install
  - run-verify
---

## Goal

ติดตั้ง mise CLI บนเครื่องและ activate shell integration ให้ tools/env load อัตโนมัติเมื่อเข้า project directory — first-time setup

## Scope

ใช้สำหรับเครื่อง/project ที่ยังไม่มี mise — install, shell activation, `mise doctor` verify. การเขียน `mise.toml` (tools/tasks/env) อยู่ใน `subskills/config-tools/SKILL.md`

## Execute

### 1. Check Current State

> Goal: ตรวจว่า mise ติดตั้งอยู่แล้วหรือไม่

1. รัน `mise --version` — ถ้าทำงาน → skip ไป step 3 (verify)
2. ตรวจว่ามี `mise.toml` หรือ `.tool-versions` ใน project อยู่แล้วหรือไม่

### 2. Install Mise

> Goal: ติดตั้ง mise ตาม OS

1. เลือกวิธีตาม environment:
   - Unix (macOS/Linux): `curl https://mise.run | sh`
   - Windows: `winget install jdx.mise` หรือ `scoop install mise`
   - Cargo: `cargo install mise`
   - ดู official docs สำหรับวิธีอื่นถ้าไม่แน่ใจ
2. รัน `mise --version` ยืนยัน installation

### 3. Activate Shell Integration

> Goal: ให้ mise load อัตโนมัติใน shell

1. เพิ่ม activation ใน shell profile ตาม shell ที่ใช้:
   - Bash: `eval "$(mise activate bash)"` ใน `~/.bashrc`
   - Zsh: `eval "$(mise activate zsh)"` ใน `~/.zshrc`
   - Fish: `mise activate fish | source` ใน fish config
   - PowerShell: `mise activate pwsh` output ใน `$PROFILE` (ดู official docs สำหรับ exact syntax)
2. Restart shell หรือ source profile ใหม่
3. ทางเลือก: ถ้าไม่ต้องการ activate → ใช้ `mise exec -- <command>` หรือ `mise x` shim mode แทน

### 4. Verify

> Goal: ยืนยัน mise พร้อมใช้งาน

1. รัน `mise doctor` — ตรวจสุขภาพ installation และ activation
2. `cd` เข้า project ที่มี `mise.toml` แล้วรัน `mise env` — env vars ต้อง load
3. ถ้า doctor report ปัญหา → แก้ตามที่ doctor แนะนำ แล้ว verify ซ้ำ (max 3 รอบ)

## Rules

### 1. Idempotent

- ถ้า `mise --version` ทำงานและ `mise doctor` ผ่าน → verify เท่านั้น ห้าม reinstall

### 2. Shell Activation

- เลือก activation method ตาม shell จริงของ user — ห้ามเดา
- commit เฉพาะ project config — shell profile เป็น user-level ไม่แก้โดยไม่จำเป็น

### 3. Safety

- รัน `mise doctor` ก่อนแก้ปัญหาซับซ้อนเสมอ
- ไม่ลบ mise cache/state โดยไม่รู้ผล

- ใช้ /follow-secret-manager ถ้าจำเป็น

## Expected Outcome

- mise ติดตั้งและ `mise --version` ทำงาน
- Shell activation ทำให้ tools/env auto-load เมื่อเข้า project
- `mise doctor` ผ่านไม่มีปัญหาค้าง
