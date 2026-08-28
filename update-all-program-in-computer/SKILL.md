---
name: update-all-program-in-computer
description: อัปเดต programs ทั้งหมดในเครื่องทีติดตั้งผ่าน package managers
related:
  - follow-my-package-manager
  - list-program-in-computer
  - download-program
---

## Goal

อัปเดต programs, tools, CLIs ทั้งหมดในเครื่องทีจัดการด้วย package managers เช่น `mise`, `scoop`, `choco`, `winget`, `brew`, `cargo`, `npm`

## Scope

ใช้เมื่อต้องการ update ทุก tool ในเครื่องให้เป็นเวอร์ชันล่าสุด โดยไม่ทำลาย project-specific dependencies

## Execute

### 1. Detect Package Managers And Global Configs

> Goal: รู้ว่ามี package managers ใดบ้าง และอ่าน global configs

1. ใช้ `/follow-my-package-manager` เพื่อ detect package manager ที่พร้อมใช้บนเครื่อง
2. รัน `mise --version`
3. ถ้า `mise` มีอยู่ → ตรวจหา global config ที่ `~/.config/mise/config.toml` หรือ `~/.mise.toml`
4. อ่าน `mise` global config เพื่อดู tools ทีจัดการไว้
5. รัน `scoop --version`
6. รัน `choco --version`
7. รัน `winget --version`
8. รัน `brew --version`
9. รัน `cargo --version`
10. รัน `npm --version`
11. บันทึก package managers ทีพร้อมใช้

### 2. Update Each Manager

> Goal: อัปเดต programs

1. `mise` → `mise up` หรือ `mise upgrade` เพื่ออัปเดตทุก tools ตาม global config
2. `scoop` → `scoop update` แล้ว `scoop update *`
3. `choco` → `choco upgrade all -y`
4. `winget` → `winget upgrade --all --include-unknown`
5. `brew` → `brew update` แล้ว `brew upgrade`
6. `cargo` → `cargo install-update -a` หรือ `cargo install-update`
7. `npm -g` → `npm update -g`
8. บันทึก command output สำหรับแต่ละ manager

### 3. Verify Versions

> Goal: ตรวจสอบว่า update สำเร็จ

1. รัน `mise ls` หรือ `mise list` เพื่อตรวจ versions ของ tools ใน global config
2. รัน `mise outdated` เพื่อดู tools ทียังล้าหลัง
3. รัน `scoop list` หรือ `scoop status`
4. รัน `choco list --local-only`
5. รัน `winget list`
6. รัน `brew list`
7. รัน `cargo install --list`
8. รัน `npm list -g --depth=0`
9. เปรียบเทียบ versions ก่อน/หลัง

### 4. Report

> Goal: สรุปผล

1. ใช้ `/report-table` คอลัมน์: Manager, Command, Status, Notes
2. ระบุ manager ใดสำเร็จ ใดมี error
3. ระบุ programs ทียังไม่อัปเดตและเหตุผล
4. ทำ `/suggest-next-action`

## Rules

### 1. Safety

- ไม่อัปเดต project-local dependencies
- global packages เท่านั้น
- ถ้ามี program ทีอาจทำให้ระบบเสียหาย → ถาม user ก่อน

### 2. Package Manager Priority

- ลอง `mise` ก่อนถ้าติดตั้ง เพราะเป็น universal
- ใช้ package manager ของ OS ถัดไป
- ไม่ mix package managers สำหรับ program เดียวกัน

### 3. Non-Interactive

- ใช้ flags `-y`, `--yes` ถ้าจำเป็น
- ถ้า command ถาม interactive → ใช้ `--no-confirm` หรือเลือก default
- ถ้าไม่สามารถ non-interactive ได้ → report ให้ user รันเอง

## Expected Outcome

- Programs ทั้งหมดถูกอัปเดตผ่าน package managers ทีมี
- รายงาน status แต่ละ manager
- ระบุ programs ที update ไม่ได้
- ระบบทำงานปกติหลัง update
