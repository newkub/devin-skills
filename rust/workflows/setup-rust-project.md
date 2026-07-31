---
title: Setup Rust Project
description: สร้าง Rust project ใหม่ด้วย Clean Architecture
---

## Goal

สร้าง Rust project ใหม่ด้วย Clean Architecture และ best practices

## Execute

### 1. Install Rust Toolchain

ติดตั้ง Rust ด้วย rustup

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

ตรวจสอบการติดตั้ง

```bash
rustc --version
cargo --version
```

### 2. Create Project

สร้าง project ใหม่ด้วย cargo

```bash
cargo new project-name --name project-name
cd project-name
```

### 3. Configure Cargo.toml

ตั้งค่า Cargo.toml ตาม Clean Architecture

```toml
[package]
name = "project-name"
version = "0.1.0"
edition = "2021"

[dependencies]
# Add dependencies here

[dev-dependencies]
# Add dev dependencies here
```

### 4. Setup Directory Structure

สร้างโครงสร้าง Clean Architecture

```bash
mkdir -p src/domain/{entities,repositories,services}
mkdir -p src/application/{dtos,use_cases}
mkdir -p src/infrastructure/{persistence,external}
mkdir -p src/interfaces/{cli,web}
mkdir -p tests
```

### 5. Configure Development Tools

ติดตั้ง tools สำหรับ development

```bash
rustup component add rustfmt clippy rust-analyzer
cargo install cargo-expand cargo-watch
```

### 6. Setup Git Hooks

ติดตั้ง pre-commit hooks

```bash
cargo install cargo-husky
cargo husky install
```

สร้าง pre-commit hook

```bash
echo "cargo fmt --check" > .husky/pre-commit
echo "cargo clippy" >> .husky/pre-commit
```

### 7. Configure IDE

ตั้งค่า VS Code หรือ IDE อื่นๆ

สร้าง `.vscode/settings.json`

```json
{
  "rust-analyzer.cargo.loadOutDirsFromCheck": true,
  "rust-analyzer.checkOnSave.command": "clippy",
  "editor.formatOnSave": true
}
```

## Expected Outcome

- Rust project ใหม่ที่มี Clean Architecture
- Development tools ที่ติดตั้งครบถ้วน
- Git hooks สำหรับ code quality
- IDE configuration ที่เหมาะสม
