---
name: follow-tool-githooks
description: ใช้งาน Git hooks ใน project สำหรับ pre-commit, pre-push, pre-merge-commit
related:
  - follow-tool-hk
  - follow-tool-linter
  - follow-tool-formatter
  - run-verify
  - follow-gitignore
---

## Goal

ใช้งาน Git hooks ใน project เพื่อรัน checks อัตโนมัติก่อน commit, push, merge

## Scope

ใช้สำหรับ projects ที่ต้องการ githooks เพื่อรัน lint, format, typecheck, test, scan ก่อน commit รองรับ hk, lefthook, pre-commit, และ native Git hooks

## Execute

### 1. Select Hook Manager

> Goal: เลือก githook manager ตาม project

1. ตรวจสอบ project stack และ existing tools
2. เลือก manager ตามความเหมาะสม:
   - TypeScript/JavaScript/Rust/Go: hk (แนะนำ), lefthook
   - Python: pre-commit, lefthook
   - Simple native hooks: `core.hooksPath` กับ bash scripts
3. ถ้า project มี mise → แนะนำ hk
4. ถ้าใช้ทีมข้าม platform → หลีกเลี่ยง native bash scripts

### 2. Install Hooks

> Goal: ติดตั้ง hook manager และลงทะเบียนกับ Git

1. ติดตั้ง manager ตาม guide:
   - hk: `mise use -g hk` หรือ `cargo install hk`
   - lefthook: `mise use -g lefthook` หรือ `bun add -d lefthook`
   - pre-commit: `pip install pre-commit`
2. รัน install: `hk install`, `lefthook install`, หรือ `pre-commit install`
3. ยืนยันว่า `.git/hooks/` หรือ `core.hooksPath` ชี้ไปยัง manager
4. ถ้าใช้ mise → ตั้ง `prepare` script เพื่อ install hooks อัตโนมัติ

### 3. Configure Hooks

> Goal: กำหนด hooks ตาม workflow

1. กำหนด `pre-commit`: รัน lint, format (fix), typecheck, scan
2. กำหนด `pre-push`: รัน unit tests, check, build
3. กำหนด `pre-merge-commit`: รัน typecheck อย่างเดียว
4. ใช้ `commit-msg` ถ้าต้องการ validate commit message
5. ใช้ `post-checkout`/`post-merge` ถ้าต้องการ setup หรือ clean

### 4. Define Steps

> Goal: กำหนด step ที hook รัน

1. ระบุ globs สำหรับแต่ละ tool เช่น `*.{ts,tsx,js,jsx}`
2. แยก `check` (read-only) กับ `fix` (modify) ให้ชัดเจน
3. รองรับ staged files มากกว่า full repo ใน `pre-commit`
4. กำหนด timeout หรือ stomp สำหรับ slow checks เช่น typecheck/test
5. ถ้าใช้ hk → ใช้ `stomp = true` สำหรับ workspace-wide checks

### 5. Test And Validate

> Goal: ตรวจสอบว่า hooks ทำงาน

1. รัน `git commit --allow-empty -m "test"` ในทดลอง หรือ use manager test command
2. ทดสอบด้วยไฟล์ทีตั้งใจ fail (ลืม format, type error)
3. ตรวจสอบว่า hooks ไม่ทำให้ commit ล่มโดยไม่จำเป็น
4. รัน `/run-verify` เพื่อ verify lint/typecheck/scan
5. ทำ `/run-test` เพื่อตรวจ tests หลัง config

## Rules

### 1. Hooks Must Be Fast

- `pre-commit` ควรจบภายใน 10 วินาที
- ย้าย slow checks ไป `pre-push` หรือ CI
- ไม่รัน full build ใน `pre-commit`

### 2. Do Not Bypass

- ห้าม commit ด้วย `--no-verify` โดยไม่จำเป็น
- ถ้าต้อง bypass → บันทึกเหตุผลใน commit message หรือแจ้งทีม
- ห้ามสร้าง script อื่นมาหลีกเลี่ยง hooks

### 3. Local Overrides

- ใช้ `hk.local.pkl` หรือ `lefthook-local.yml` สำหรับ local override
- ไม่ commit local-only settings
- รองรับ environment variables เช่น `HK=0` สำหรับ edge cases แต่ไม่สนับสนุน bypass

### 4. Cross Platform

- ใช้ manager ทีรองรับ Windows, macOS, Linux
- หลีกเลี่ยง bash-only scripts
- ใช้ `mise x -- <command>` เพื่อ cross-platform tool execution

### 5. Keep Config Version Controlled

- config ของ githook manager ต้องอยู่ใน repo
- ไม่ commit hook scripts ที่ generate ทั้งหมด (ยกเว้น native `core.hooksPath`)
- ระบุ version ของ manager ใน `mise.toml` หรือ package manifest

## Expected Outcome

- Githook manager ติดตั้งและทำงาน
- `pre-commit`, `pre-push`, `pre-merge-commit` รัน checks ถูกต้อง
- Config อยู่ใน version control
- Hooks ไม่ช้าจนรบกวน developer experience
- ไฟล์ local override ไม่ถูก commit
