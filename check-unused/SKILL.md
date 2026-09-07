---
name: check-unused
description: ตรวจหา dead code, unused files และ unused dependencies ใน project
argument-hint: "[scope] [--code|--files|--deps|--all]"
related:
  - follow-tool-knip
  - check-should-update
  - cleanup-files-in-project
  - update-references
  - update-config
  - refactor-to-single-responsibility
  - review-then-fix
  - delete-projects
  - resolve-errors
  - report

---

## Goal

ตรวจหาสิ่งที่ไม่ถูกใช้ใน project ครบ 3 มิติ: dead code (unused exports/functions/variables), unused files, unused dependencies — ด้วย knip และ ecosystem-specific tools

## Scope

- ครอบคลุม TypeScript, JavaScript, Python, Rust, Go และภาษาอื่นๆ ที่มี tool รองรับ
- รองรับ single project และ monorepo (ตรวจทุก workspace หรือระบุ workspace)
- modes: `--code` (dead code/exports), `--files` (unused files), `--deps` (unused dependencies), default `--all` เช็คทั้งหมด
- รวม capability จาก skills เดิม 3 ตัวที่ถูก merge เข้าตัวนี้ (dead code scan, unused files scan, unused deps scan)

## Execute

### 1. Detect Ecosystem And Mode

> Goal: เลือก tool และ scope ที่ถูกต้อง

1. ตรวจ manifest: `package.json` → JS/TS ใช้ `knip`, `Cargo.toml` → Rust ใช้ `cargo-udeps`/`cargo-deadcode`, `requirements.txt`/`pyproject.toml` → Python ใช้ `vulture`/`ruff`/`pip-autoremove`, `go.mod` → Go ใช้ `go mod tidy`/`unused`
2. ถ้าไม่รู้จัก ecosystem → stop และ report
3. ระบุ mode จาก argument หรือ default `--all`
4. ถ้า monorepo → ตรวจทุก workspaces หรือระบุ workspace

### 2. Run Scan ตาม Mode

> Goal: รัน tool ให้ครบทุกมิติที่เลือก

1. JS/TS: `bunx knip` — `--include files` สำหรับ unused files, `--include dependencies` สำหรับ deps, exports/types สำหรับ dead code; monorepo ใช้ `bunx knip -W <workspace>`
2. Rust: `cargo +nightly udeps` (deps), `cargo-deadcode` หรือ `rustc` lints (dead code)
3. Python: `vulture` (dead code), `ruff`/`pip-autoremove` (deps)
4. Go: `go mod tidy -v` (deps/files), `unused` จาก `golang.org/x/tools` (dead code)
5. ถ้าไม่มี tool → ใช้ `find_file_by_name` + `grep` หา references แบบ manual

### 3. Verify Results

> Goal: กรอง false positives ก่อน report

1. ตรวจ dynamic imports `import()` ที่ static analysis detect ไม่ได้
2. ตรวจ config references — ไฟล์ที่ถูกอ้างจาก config ไม่ใช่ code
3. ตรวจ entry points ตาม convention เช่น `index.ts`, `cli.ts`, build scripts
4. ตรวจ implicit usage: plugins, runtime config, framework conventions, type-only packages (`@types/*`), peer dependencies, side-effect imports, build tools (`vite`, `biome`) ที่ใช้ผ่าน CLI
5. ตรวจ public exports ที่อาจถูกใช้โดย external consumers — อย่า flag public API
6. ถ้าไม่แน่ใจ → report เป็น unused candidate แทนที่จะยืนยัน

### 4. Fix Or Remove

> Goal: จัดการ findings อย่างปลอดภัย

1. ยืนยันกับ user ก่อนลบ — dry run ก่อนเสมอ
2. ลบ dead code/unused files ที่ยืนยันแล้ว หรือ implement/import ให้ถูกใช้
3. ลบ dependency ออกจาก `package.json`/manifest แล้ว `bun install` เพื่อ update lockfile
4. dependency ที่มี implicit usage → เพิ่ม `ignoreDependencies` ใน `knip.json` แทนการลบ
5. ทำ `/update-references` เมื่อลบ/ย้ายไฟล์ และ `/resolve-errors` เมื่อเจอ build errors
6. รัน scan ซ้ำจนไม่เหลือ unused ที่ยืนยันแล้ว

### 5. Report

> Goal: รายงานครบทุก mode

1. ทำ `/report` คอลัมน์: `No.`, `Type`, `File/Symbol/Package`, `Mode`, `Severity`, `Recommendation`
2. Type: `dead-code`, `unused-file`, `unused-dep`
3. ถ้าไม่พบ → report "no unused items found"
4. ทำ `/suggest-next-action`

## Rules

### 1. Safety

- อย่า flag public API ที่มี consumers ภายนอก repo
- อย่าลบ code ที่ใช้ใน test หรือ build scripts
- dry run ก่อนเสมอ ลบหลัง user ยืนยัน

### 2. Accuracy

- กรอง false positives ก่อน report เสมอ
- ตรวจทั้ง direct และ transitive usage

- ใช้ /follow-tool-knip ถ้าจำเป็น
- ใช้ /update-references ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

- ใช้ /check-should-update ถ้าจำเป็น
- ใช้ /cleanup-files-in-project ถ้าจำเป็น
- ใช้ /update-config ถ้าจำเป็น
- ใช้ /refactor-to-single-responsibility ถ้าจำเป็น
- ใช้ /review-then-fix ถ้าจำเป็น
- ใช้ /delete-projects ถ้าจำเป็น
## Expected Outcome

- รายการ dead code, unused files, unused deps พร้อม severity และ recommendation
- ไม่มี false positives ใน report
- lockfile และ references อัปเดตถูกต้องหลังลบ

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: check-unused-files, check-unused-deps, check-dead-code)
