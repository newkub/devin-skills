---
name: follow-create-tui-ratatui
description: สร้าง TUI application ด้วย Rust และ Ratatui
argument-hint: "[scope]"
related:
  - follow-create-rust-cli
  - deep-review
  - run-test-all
  - follow-single-responsibility
  - follow-release

---

## Goal

สร้าง TUI application ด้วย Rust โดยใช้ Ratatui library

## Scope

- สร้าง TUI project ด้วย Rust จาก scratch
- รองรับ layout, components, events, state, styling
- ไม่ใช้ web stack

- Packages: `ratatui` (latest stable, MSRV ตาม crates.io — 0.30 ต้องการ Rust 1.88+), `crossterm` — ยืนยันเวอร์ชันล่าสุดด้วย `/deep-research` + `/follow-best-practice` ทุกครั้ง (ไม่ pin ในไฟล์ — ตาม `/update-devin-global-skills`)

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ stack

1. ทำ `/deep-research` + `/follow-best-practice` เพื่อยืนยันเวอร์ชันและ pattern ล่าสุด จากนั้นทำ `/deep-review` เพื่อสรุป tech stack
2. ยืนยันว่าใช้ Rust + Ratatui + crossterm
3. บันทึกเหตุผลทีเลือก stack

### 2. Setup Rust Project

> Goal: สร้าง scaffold

1. ทำ `/follow-create-rust-cli` สำหรับ Rust project structure — หรือ scaffold จาก official templates: `cargo install cargo-generate` แล้ว `cargo generate ratatui/templates <name>`
2. `cargo add ratatui crossterm anyhow` (หรือ `color-eyre`) — crossterm เป็น default backend; alternatives ผ่าน features: `termion`, `termwiz`, `termina` (`--no-default-features --features <backend>`)
3. รัน `cargo build` เพื่อ verify setup

### 3. Setup Terminal

> Goal: ตั้งค่า terminal

1. ใช้ helper ของ 0.30: `ratatui::init()` / `ratatui::try_init()` / `ratatui::restore()` หรือ `ratatui::run(app)` สำหรับ app ง่าย (จัดการ raw mode + alternate screen + restore ให้อัตโนมัติ); manual path ใช้ `Terminal::new(CrosstermBackend::new(stdout()))` + `terminal.draw(render)`
3. ถ้า setup manual: ตั้งค่า `enable_raw_mode`, `enter_alternate_screen` กับ `CrosstermBackend`
4. ตั้งค่า `PanicHook` (หรือ `color-eyre`) สำหรับ restore terminal state
5. จัดการ graceful shutdown เมื่อ exit

### 4. Create Layout

> Goal: สร้าง layout

1. ใช้ `Layout` และ `Constraint` จาก `ratatui::layout`
2. กำหนด directions (horizontal, vertical)
3. กำหนด sizes (percentage, fixed, min, max)
4. แบ่ง layout เป็น nested structures ชัดเจน

### 5. Build Components

> Goal: สร้าง UI components

1. ใช้ `Paragraph`, `Block`, `Borders` สำหรับ text
2. ใช้ `List`, `ListItem` สำหรับ lists
3. ใช้ `Table`, `Row`, `Cell` สำหรับ tables
4. ใช้ `Gauge`, `Sparkline` สำหรับ progress และ charts

### 6. Handle Events

> Goal: จัดการ events

1. สร้าง event loop ด้วย `crossterm::event`
2. จัดการ `KeyEvent`, `MouseEvent`
3. จัดการ terminal resize events
4. ใช้ `/follow-single-responsibility` แยก event handling จาก render

### 7. State Management

> Goal: จัดการ state

1. แยก business logic จาก render logic — ใช้ Elm Architecture (TEA) pattern: `Model` struct + `Message` enum + `update(model, msg)` + `view(model, frame)`
2. ใช้ structs สำหรับ state management
3. จัดการ state updates ใน event loop
4. ใช้ immutable updates เมื่อเป็นไปได้

### 8. Style And Polish

> Goal: จัดการ style

1. ใช้ `Style`, `Color`, `Modifier` จาก `ratatui::style` — หรือ `Stylize` methods บน `Line`/`Span`/`&str` (`.red()`, `.bold()`, `.bg()`, `.on_<color>()`)
2. สร้าง design tokens สำหรับ colors และ borders
3. ตรวจสอบ contrast และ readability
4. ใช้ consistent styling ทุก component

### 9. Test And Validate

> Goal: ตรวจสอบ TUI

1. รัน `cargo build` และ `cargo test` — ใช้ `ratatui::backend::TestBackend` + `assert_buffer()` สำหรับ snapshot-test rendering
2. ทำ `/run-test-all` ถ้ามี integration tests
3. ทำ `/deep-review` ตรวจสอบ usability
4. ทดสอบ event handling บน terminal จริง

### 10. Package And Ship

> Goal: ส่งมอบ TUI

1. ตรวจสอบ `Cargo.toml` metadata
2. สร้าง release build ด้วย `cargo build --release`
3. ทำ `/follow-release` ถ้าจะ publish
4. ทดสอบ binary บน target platform

## Rules

### 1. Stack

- ใช้ Rust เท่านั้น
- ใช้ Ratatui สำหรับ TUI
- ไม่ใช้ web stack สำหรับ TUI

### 2. Quality

- ทำ `/follow-single-responsibility` หลัง major components
- ทำ `/implement-to-production` หลังเสร็จ
- รองรับ error handling ด้วย `Result`

### 3. Terminal Management

- ต้อง restore terminal state เมื่อ panic หรือ exit
- ใช้ `enable_raw_mode()` / `disable_raw_mode()` และ `enter_alternate_screen()` / `exit_alternate_screen()` เป็นคู่
- ตั้งค่า `PanicHook` สำหรับ restore terminal state
- ใช้ `Constraint` แทน hardcoded sizes และจัดเก็บ layout state แยกจาก render logic
- จัดการ partial updates และใช้ `Frame` สำหรับ area calculations — `Frame::render_widget` สำหรับ `Widget`, `render_stateful_widget` สำหรับ `StatefulWidget`
- Docs: https://ratatui.rs/ + https://docs.rs/ratatui/latest/ratatui/ — companion crates `ratatui-core`, `ratatui-widgets`, `ratatui-macros` ใช้แยกได้

### 4. Safety

- ไม่ commit secrets ลง repository
- ใช้ `/follow-secret-manager` สำหรับ secrets
- ใช้ `environment variables` สำหรับ non-sensitive config
- ถ้ามี destructive changes → dry run ก่อน

## Expected Outcome

- TUI application รันด้วย Rust + Ratatui
- Layout, components, event handling, state management ครบถ้วน
- Error handling รองรับ
- Tests ผ่านหรือมี plan
- Binary สามารถ build และ run ได้
