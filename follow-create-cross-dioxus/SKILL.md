---
name: follow-create-cross-dioxus
description: ตั้งค่าและพัฒนา Desktop, Web และ Mobile Applications ด้วย Dioxus Rust framework
argument-hint: "[scope]"
related:
  - follow-create-web
  - follow-create-mobile
  - follow-best-practice
  - setup-cicd
  - deep-review

---

## Goal

ตั้งค่าและพัฒนา Desktop, Web และ Mobile Applications ด้วย Dioxus Rust framework

## Scope

ตั้งค่า Dioxus สำหรับสร้าง cross-platform applications (Desktop, Web, Mobile) ด้วย Rust และ React-like components

- ติดตั้ง Dioxus CLI และ dependencies
- กำหนดค่า `Cargo.toml` และ `Dioxus.toml`
- พัฒนา desktop application ด้วย Rust
- Build สำหรับหลาย platforms

- Packages: `dioxus` crate + `dioxus-cli` (`dx`) — ยืนยันเวอร์ชันล่าสุดด้วย `/deep-research` + `/follow-best-practice` ทุกครั้ง (0.8.x เป็น pre-release — ห้าม adopt โดยไม่เช็ค migration notes; ไม่ pin ในไฟล์ ตาม `/update-devin-global-skills`)

## Execute

### 1. Check Precondition

> Goal: ตรวจสอบ environment ก่อนเริ่ม

1. ทำ `/deep-research` + `/follow-best-practice` เพื่อยืนยันเวอร์ชันและ pattern ล่าสุด จากนั้นทำ `/deep-review` เพื่อสรุป tech stack
2. ตรวจสอบ Rust/Cargo ติดตั้งแล้ว (`rustc --version`, `cargo --version`)
3. ติดตั้ง `wasm32-unknown-unknown` target ถ้าทำ Web (`rustup target add wasm32-unknown-unknown`)
4. Linux desktop build ต้องใช้ WebKitGTK — `sudo apt install libwebkit2gtk-4.1-dev build-essential libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev`; Windows ใช้ WebView2 (มากับ Edge); macOS ไม่ต้องลงเพิ่ม
5. หลังติดตั้ง CLI ให้รัน `dx doctor` เพื่อตรวจ toolchains ที่ขาดสำหรับแต่ละ platform

### 2. Setup

> Goal: ติดตั้ง Dioxus CLI และสร้างโปรเจกต์

1. ติดตั้ง Dioxus CLI (เลือกวิธีใดวิธีหนึ่ง):
   - prebuilt binary: `curl -sSL https://dioxus.dev/install.sh | bash`
   - `cargo binstall dioxus-cli --force`
   - build จาก source (ช้า): `cargo install dioxus-cli`
2. ตรวจสอบ `dx --version`
3. สร้างโปรเจกต์: `dx new my-dioxus-app` และเลือก template (Bare-bones, Jumpstart, Workspace)
4. หรือ init ใน directory ที่มีอยู่: `dx init` / สร้าง `Cargo.toml` เองด้วย dependency `dioxus`

### 3. Configure

> Goal: กำหนดค่า `Cargo.toml` และ `Dioxus.toml`

1. ระบุ `dioxus` dependency ใน `Cargo.toml` พร้อม feature ตาม target
2. สร้าง `Dioxus.toml` กำหนด `default_platform`, `out_dir`, `asset_dir`
3. ตั้งค่า `web.proxy` ถ้าเชื่อม API backend
4. ตรวจสอบ profile release: `opt-level = 3` และ `lto = true`

### 4. Develop

> Goal: พัฒนา components และรัน development server

1. สร้าง `src/main.rs` ด้วย `launch(app)` และ component tree
2. ใช้ `use_signal` สำหรับ state
3. สร้าง components แยกไฟล์ใน `src/components/`
4. รัน `dx serve` หรือ `dx serve --platform desktop`

### 5. Build

> Goal: Build สำหรับ production

1. Desktop: `dx build --release`
2. Web: `dx build --release --platform web`
3. ใช้ `dx bundle` เมื่อต้องการ package เป็น distributable bundle (installer/app image)
4. ตรวจสอบ `dist/` มี output ที่ถูกต้อง

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

- ใช้ /follow-create-mobile-cross-with-capacitor ถ้าจำเป็น (create cross dioxus)
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น

## Expected Outcome

- Dioxus CLI ติดตั้งและทำงานได้
- Project สร้างสำเร็จ
- Development server ทำงานได้
- Production build สร้าง executable ได้
