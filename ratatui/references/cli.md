# Ratatui CLI Reference

## Overview

Ratatui ไม่มี CLI tool โดยตรง แต่ใช้ผ่าน Cargo และ Rust toolchain ในการสร้างและจัดการ projects

## Cargo Commands

### สร้าง Project ใหม่

```bash
cargo new my-tui-app
cd my-tui-app
```

### เพิ่ม Ratatui Dependencies

```bash
cargo add ratatui
cargo add crossterm
```

### รัน Application

```bash
cargo run
```

### Build Application

```bash
cargo build --release
```

## Configuration ใน Cargo.toml

```toml
[dependencies]
ratatui = "0.29"
crossterm = "0.28"
```

## Features ตาม Terminal Backend

Ratatui รองรับหลาย terminal backends ผ่าน features:

```toml
[dependencies.ratatui]
version = "0.29"
features = ["crossterm"]  # หรือ "termion", "termwiz"
```

## Testing

```bash
cargo test
```

## Documentation

```bash
cargo doc --open
```
