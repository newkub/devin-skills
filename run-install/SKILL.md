---
name: run-install
description: ติดตั้ง dependencies และแก้ไขปัญหา installation
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - TS
  - overrides
---

## Goal

ติดตั้ง dependencies ทั้งหมดในโปรเจกต์ พร้อมแก้ไขปัญหาที่เกิดขึ้นระหว่าง installation

## Scope

Use `run-install` for the specific tasks and workflows it covers

## Execute

### 1. Update Dependencies
> Goal: Update Dependencies

1. ทำ `/update-dependencies-latest` เพื่ออัพเดท dependencies ทั้งหมดเป็น latest version
2. ตรวจสอบว่าอัพเดทสำเร็จและไม่มี errors

### 2. Determine Package Manager
> Goal: Determine Package Manager

1. ตรวจสอบ lockfile และ manifest ทั้งหมด:
   - JS/TS: bun.lock, package-lock.json, pnpm-lock.yaml, yarn.lock
   - Rust: Cargo.toml, Cargo.lock
   - Python: requirements.txt, pyproject.toml, poetry.lock
   - Go: go.mod, go.sum
2. ใช้ bun เป็นค่าเริ่มต้นสำหรับ JS/TS ถ้าไม่มี lockfile
3. ตรวจสอบ package.json สำหรับ packageManager field
4. ใช้ cargo สำหรับ Rust projects

### 3. Clean Install (ถ้าต้องการ)
> Goal: Clean Install (ถ้าต้องการ)

JavaScript/TypeScript:
1. ลบ `node_modules/` directory
2. ลบ lockfile
3. รัน `bun pm cache rm` เพื่อ clear cache

Rust:
1. ลบ `target/` directory
2. ลบ Cargo.lock
3. รัน `cargo clean`

Python:
1. ลบ `venv/` หรือ `.venv/` directory
2. ลบ `__pycache__/` directories
3. ลบ *.pyc files

### 4. Install Dependencies
> Goal: Install Dependencies

JavaScript/TypeScript:
1. รัน `bun install` หรือ package manager ที่ใช้
2. ติดตาม progress และ errors
3. รัน postinstall scripts หากมี

Rust:
1. รัน `cargo build` หรือ `cargo check` สำหรับ dependencies
2. ติดตาม progress และ errors
3. รัน `cargo test` หากมี test dependencies

Python:
1. สร้าง venv: `python -m venv .venv`
2. Activate venv และรัน `pip install -r requirements.txt` หรือ `poetry install`
3. ติดตาม progress และ errors

### 5. Fix Issues
> Goal: Fix Issues

JavaScript/TypeScript:
1. แก้ไข dependency conflicts
2. อัพเดท incompatible versions
3. ใช้ resolutions/overrides ถ้าจำเป็น
4. รัน install อีกครั้งเพื่อยืนยัน

Rust:
1. แก้ไข dependency conflicts ใน Cargo.toml
2. อัพเดท versions: `cargo update`
3. ใช้ `[patch]` หรือ `[replace]` ถ้าจำเป็น
4. รัน `cargo build` อีกครั้งเพื่อยืนยัน

Python:
1. แก้ไข dependency conflicts
2. อัพเดท versions ใน requirements.txt หรือ pyproject.toml
3. ใช้ pip constraints ถ้าจำเป็น
4. รัน install อีกครั้งเพื่อยืนยัน

## Rules

### 1. Package Manager

ใช้ package manager ตาม lockfile หรือ manifest:

JavaScript/TypeScript:
| Manager | Command |
|---------|---------|
| Bun | `bun install` |
| npm | `npm install` |
| pnpm | `pnpm install` |
| yarn | `yarn install` |

Rust:
| Manager | Command |
|---------|---------|
| Cargo | `cargo build` / `cargo check` |

Python:
| Manager | Command |
|---------|---------|
| pip | `pip install -r requirements.txt` |
| Poetry | `poetry install` |
| PDM | `pdm install` |

Go:
| Manager | Command |
|---------|---------|
| Go | `go mod download` |

### 2. Installation Order

JavaScript/TypeScript:
- อัพเดท dependencies ก่อน install
- ติดตั้ง root dependencies ก่อน
- ติดตั้ง workspace dependencies ตามลำดับ

Rust:
- ติดตั้ง workspace root dependencies ก่อน
- ติดตั้ง workspace members ตามลำดับ
- ใช้ `cargo build -p <package>` สำหรับ build specific package

Polyglot Projects:
- ติดตั้ง JS/TS dependencies ก่อน (frontend/tooling)
- ติดตั้ง Rust dependencies ต่อไป (native modules)
- ติดตั้ง Python dependencies สุดท้าย (scripts/tools)

### 3. Error Handling

- ตรวจสอบ errors ระหว่าง installation
- แก้ไข conflicts ทันทีที่พบ
- ไม่ข้าม errors หรือ warnings

### 4. Clean Install

JavaScript/TypeScript:
- ใช้ clean install เมื่อมี dependency conflicts
- ลบ cache ก่อน install ถ้าจำเป็น

Rust:
- ใช้ `cargo clean` เมื่อมี compilation errors
- ลบ `~/.cargo/registry/cache` ถ้าจำเป็น

Python:
- สร้าง venv ใหม่เมื่อมี dependency conflicts
- ลบ pip cache: `pip cache purge`

General:
- ใช้ clean install เมื่อมี dependency conflicts ข้ามภาษา
- ลบ cache ของทุก package manager ก่อน install

## Expected Outcome

JavaScript/TypeScript:
- Dependencies ติดตั้งครบถ้วน
- ไม่มี installation errors
- Postinstall scripts ทำงานได้
- Imports ทำงานได้

Rust:
- Dependencies ติดตั้งครบถ้วน
- ไม่มี compilation errors
- Cargo.lock ถูกสร้างหรืออัพเดท

Python:
- Dependencies ติดตั้งครบถ้วน
- venv สร้างและ activate ได้
- Imports ทำงานได้

All Languages:
- Tests ผ่านทั้งหมด
- Build สำเร็จทุกภาษา
