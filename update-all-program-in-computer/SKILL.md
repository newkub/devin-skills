---
name: update-all-program-in-computer
description: อัปเดต programs ทั้งหมดในเครื่องทีติดตั้งผ่าน package managers
argument-hint: "[scope]"
related:
  - download-program
  - list-program-in-computer
  - report
  - suggest-next-action
  - run-program
---

## Goal

อัปเดต programs, tools, CLIs ทั้งหมดในเครื่องทีจัดการด้วย package managers เช่น `mise`, `scoop`, `choco`, `winget`, `brew`, `cargo`, `npm`

## Scope

ใช้เมื่อต้องการ update ทุก tool ในเครื่องให้เป็นเวอร์ชันล่าสุด โดยไม่ทำลาย project-specific dependencies

## Execute

### 1. Detect Package Managers And Global Configs

> Goal: รู้ว่ามี package managers ใดบ้าง และอ่าน global configs

1. ใช้ `/download-program` เพื่อ detect package manager ที่พร้อมใช้บนเครื่อง
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

1. ใช้ `/report` คอลัมน์: Manager, Command, Status, Notes
2. ระบุ manager ใดสำเร็จ ใดมี error
3. ระบุ programs ทียังไม่อัปเดตและเหตุผล
4. ทำ `/suggest-next-action`

### Subagents

> Goal: parallelize updates เมื่อ programs เยอะ

- ใช้ profile `program-updater` (ดู `## Subagents` ด้านล่าง) เมื่อต้อง update หลาย programs ที่ independent กัน — spawn ทีละ program ผ่าน `/use-subagents` แล้วรวมผล updated/skipped/failed ก่อน report

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

- ใช้ /list-program-in-computer ถ้าจำเป็น
- ใช้ /download-program ถ้าจำเป็น
- ใช้ /run-program ถ้าจำเป็น

## Subagents

> Goal: งานอิสระที่ spawn ทำขนานได้ — profile อยู่ใน section นี้เลย ไม่ต้องมีไฟล์แยก

### program-updater — ตรวจ/อัปเดต program เดียวผ่าน package manager แล้วคืน updated/skipped/failed

- **Inputs**: `program` (ชื่อ program เดียวที่ต้อง update เช่น `ripgrep`, `node`, `git`), `package-manager` (optional — manager ที่ต้องใช้ ไม่ระบุให้ auto-detect ตามลำดับ `mise` → OS package manager), `allow-major` (optional — อนุญาต major version bump หรือไม่ default ปลอดภัยตาม manager)
- **Tools**: `exec` เท่านั้น — version checks และ upgrade commands: `mise use -g`, `scoop update`, `choco upgrade`, `winget upgrade`, `brew upgrade`, `cargo install-update`, `npm update -g` (ห้าม `write`/`edit`)
- **Execute**:
  1. ตรวจว่า program ติดตั้งอยู่และจัดการโดย manager ไหน — เช็ค `mise ls`, `scoop list`, `winget list` ฯลฯ
  2. ถ้า program ไม่ได้ติดตั้งผ่าน package manager → คืน `skipped` พร้อมเหตุผล
  3. บันทึก version ก่อน update (`<program> --version` หรือ list ของ manager)
  4. รัน update ด้วย non-interactive flags (`-y`, `--yes`, `--no-confirm`) — ถ้า command บังคับ interactive → คืน `skipped` ให้ user รันเอง
  5. ตรวจ version หลัง update และเปรียบเทียบก่อน/หลัง
  6. smoke check สั้น ๆ ว่า program ยังรันได้ (`--version` หรือ `--help`)
- **Output**: ตาราง field ต่อ program เดียว `| Field | Value |` — Program, Manager, Before, After, Status (`updated`/`skipped`/`failed`/`already-latest`), Note (เหตุผลเมื่อ skipped/failed)
- **Constraints**: Global packages เท่านั้น — ห้ามแตะ project-local dependencies; ใช้ `exec` อย่างเดียว ห้าม `write`/`edit`; ลอง `mise` ก่อนถ้า program อยู่ใน mise — ไม่ mix package managers สำหรับ program เดียวกัน; ใช้ non-interactive flags เสมอ — ถ้าทำไม่ได้ให้ `skipped` ไม่ใช่ค้างรอ input; รับผิดชอบ program เดียว — ห้าม `update *` หรือ `upgrade --all`; ถ้า program เสี่ยงทำระบบเสียหาย (OS-level tools) → คืน `skipped` ให้ parent ถาม user

## Expected Outcome

- Programs ทั้งหมดถูกอัปเดตผ่าน package managers ทีมี
- รายงาน status แต่ละ manager
- ระบุ programs ที update ไม่ได้
- ระบบทำงานปกติหลัง update
