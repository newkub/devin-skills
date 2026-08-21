---
name: follow-dioxus
description: ตั้งค่าและพัฒนา Desktop, Web และ Mobile Applications ด้วย Dioxus Rust framework
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ตั้งค่าและพัฒนา Desktop, Web และ Mobile Applications ด้วย Dioxus Rust framework

## Scope

ตั้งค่า Dioxus สำหรับสร้าง cross-platform applications (Desktop, Web, Mobile) ด้วย Rust และ React-like components

- ติดตั้ง Dioxus CLI และ dependencies
- กำหนดค่า `Cargo.toml` และ `Dioxus.toml`
- พัฒนา desktop application ด้วย Rust
- Build สำหรับหลาย platforms

## Execute

### 1. Check Precondition

ตรวจสอบ environment ก่อนเริ่ม

> Goal: มี Rust toolchain พร้อมสำหรับ Dioxus

1. ตรวจสอบ Rust ติดตั้งแล้ว (`rustc --version`)
2. ตรวจสอบ Cargo ติดตั้งแล้ว (`cargo --version`)
3. ติดตั้ง `wasm32-unknown-unknown` target ถ้าทำ Web (`rustup target add wasm32-unknown-unknown`)

### 2. Setup

ติดตั้ง Dioxus CLI และสร้างโปรเจกต์

> Goal: มี project structure เริ่มต้นพร้อมพัฒนา

1. ติดตั้ง Dioxus CLI: `cargo install dioxus-cli`
2. ตรวจสอบ `dx --version`
3. สร้างโปรเจกต์: `dx new my-dioxus-app` และเลือก template (Desktop, Web, FullStack)
4. หรือสร้าง `Cargo.toml` เองด้วย dependency `dioxus`

### 3. Configure

กำหนดค่า `Cargo.toml` และ `Dioxus.toml`

> Goal: project สามารถ build ได้ทุก target

1. ระบุ `dioxus` dependency ใน `Cargo.toml` พร้อม feature ตาม target
2. สร้าง `Dioxus.toml` กำหนด `default_platform`, `out_dir`, `asset_dir`
3. ตั้งค่า `web.proxy` ถ้าเชื่อม API backend
4. ตรวจสอบ profile release: `opt-level = 3` และ `lto = true`

### 4. Develop

พัฒนา components และรัน development server

> Goal: UI ทำงานได้ และ development server รันได้

1. สร้าง `src/main.rs` ด้วย `launch(app)` และ component tree
2. ใช้ `use_signal` สำหรับ state
3. สร้าง components แยกไฟล์ใน `src/components/`
4. รัน `dx serve` หรือ `dx serve --platform desktop`

### 5. Build

Build สำหรับ production

> Goal: ได้ executable หรือ static files พร้อม deploy

1. Desktop: `dx build --release`
2. Web: `dx build --release --platform web`
3. ตรวจสอบ `dist/` มี output ที่ถูกต้อง

## Rules

### 1. Project Structure

- `Cargo.toml` สำหรับ Rust dependencies
- `Dioxus.toml` สำหรับ Dioxus config
- `src/main.rs` สำหรับ entry point
- `src/components/` สำหรับ reusable components
- `dist/` สำหรับ build output

### 2. Rust Requirements

- ต้องมี Rust ติดตั้งแล้ว
- ติดตั้ง `dioxus-cli` ด้วย `cargo install dioxus-cli`
- ใช้ `dioxus` crate ใน `Cargo.toml`
- ใช้ `dx serve` สำหรับ development

### 3. Platform Targets

- Desktop: default platform
- Web: ต้องมี `wasm32-unknown-unknown` target
- Mobile: ใช้ Dioxus mobile target ตาม official docs

## Expected Outcome

- Dioxus CLI ติดตั้งและทำงานได้
- Project สร้างสำเร็จ
- Development server ทำงานได้
- Production build สร้าง executable ได้
