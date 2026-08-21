---
name: follow-dioxus
description: ตั้งค่าและพัฒนา Desktop, Web และ Mobile Applications ด้วย Dioxus Rust
  framework
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

## Execute

ตั้งค่า Dioxus สำหรับสร้าง cross-platform applications (Desktop, Web, Mobile) ด้วย Rust และ React-like components

## Scope

- ติดตั้ง Dioxus CLI และ dependencies
- กำหนดค่า `Cargo.toml` และ `Dioxus.toml`
- พัฒนา desktop application ด้วย Rust
- Build สำหรับหลาย platforms

## Inputs

| Input | Details |
|-------|-----------|
| Language | Rust |
| Platform | Desktop (default), Web, Mobile |
| CLI | Dioxus CLI |

## Rules

| Category | Requirements |
|------|---------|
| Rust | ต้องมี Rust ติดตั้งแล้ว |
| CLI | `cargo install dioxus-cli` |
| Config | สร้าง `Dioxus.toml` |
| Dependencies | `dioxus` crate ใน Cargo.toml |
| Hot Reload | ใช้ `dx serve` สำหรับ development |

## Structure

### Directory Structure

```text
project/
├── Cargo.toml            # Rust dependencies
├── Dioxus.toml           # Dioxus config
└── src/
    ├── main.rs           # Entry point
    └── components/
        └── app.rs        # App component
```

### Phase Definitions

| Phase | Description | Main Activities |
|-------|-------------|---------------|
| Setup | ติดตั้ง | Install CLI |
| Create | สร้างโปรเจกต์ | dx new |
| Configure | กำหนดค่า | Cargo.toml, Dioxus.toml |
| Develop | พัฒนา | Write components |
| Build | Build | dx build |

## Steps

### Phase 0: Precondition

- 0.1 ตรวจสอบ Environment
  - มี Rust ติดตั้งแล้ว (`rustc --version`)
  - มี Cargo ติดตั้งแล้ว (`cargo --version`)
  - มี `wasm32-unknown-unknown` target (สำหรับ web)

### Phase 1: Setup

- 1.1 ติดตั้ง Dioxus CLI
  - รัน `cargo install dioxus-cli`
  - ตรวจสอบ `dx --version`

- 1.2 ติดตั้ง Web Target (ถ้าทำ Web)
  - รัน `rustup target add wasm32-unknown-unknown`

### Phase 2: Create

- 2.1 สร้างโปรเจกต์
  - รัน `dx new my-dioxus-app`
  - เลือก template ที่ต้องการ (Desktop, Web, FullStack)

- 2.2 หรือสร้างด้วยตนเอง
  - สร้าง `Cargo.toml`:

```toml [Cargo.toml]
[package]
name = "my-dioxus-app"
version = "0.1.0"
edition = "2021"

[dependencies]
dioxus = { version = "0.5", features = ["desktop"] }

[profile.release]
opt-level = 3
lto = true
```

### Phase 3: Configure

- 3.1 สร้าง Dioxus.toml
  - สร้างไฟล์ `Dioxus.toml`:

```toml [Dioxus.toml]
[application]
name = "My Dioxus App"
default_platform = "desktop"
out_dir = "dist"
asset_dir = "public"

[web.app]
title = "My Dioxus App"

[web.watcher]
reload_html = true
watch_path = ["src", "public"]

[[web.proxy]]
backend = "http://localhost:3000/api/"
```

### Phase 4: Develop

- 4.1 สร้าง Components
  - สร้าง `src/main.rs`:

```rust [src/main.rs]
use dioxus::prelude::*;

fn main() {
    launch(app);
}

fn app() -> Element {
    let mut count = use_signal(|| 0);

    rsx! {
        div {
            h1 { "Hello, Dioxus!" }
            p { "Count: {count}" }
            button {
                onclick: move |_| count += 1,
                "Increment"
            }
        }
    }
}
```

- 4.2 รัน Development Server
  - รัน `dx serve`
  - หรือ `dx serve --platform desktop`

### Phase 5: Build

- 5.1 Build สำหรับ Production
  - Desktop: `dx build --release`
  - Web: `dx build --release --platform web`

- 5.2 ตรวจสอบ Output
  - Desktop: `dist/` มี executable
  - Web: `dist/` มี static files

## Outputs

| Output | Details |
|--------|-----------|
| Cargo.toml | Rust dependencies |
| Dioxus.toml | Dioxus configuration |
| src/main.rs | Application code |
| dist/ | Built application |

## Expected Outcome

- Dioxus CLI ติดตั้งและทำงานได้
- Project สร้างสำเร็จ
- Development server ทำงานได้
- Production build สร้าง executable ได้

## Reference

- `/validate` - ตรวจสอบความถูกต้องก่อนเริ่ม
- `connect-workflows` - เชื่อมโยง workflows
