---
title: Build Rust Project
description: Build Rust project ด้วย optimization และ best practices
---

## Goal

Build Rust project อย่างมีประสิทธิภาพและปลอดภัย

## Execute

### 1. Debug Build

Build สำหรับ development

```bash
cargo build
```

### 2. Release Build

Build สำหรับ production ด้วย optimizations

```bash
cargo build --release
```

### 3. Check Code

ตรวจสอบ code โดยไม่ build

```bash
cargo check
```

### 4. Run Tests

รัน tests ทั้งหมด

```bash
cargo test
```

รัน tests ใน release mode

```bash
cargo test --release
```

### 5. Format Code

จัดรูปแบบ code

```bash
cargo fmt
```

ตรวจสอบ formatting

```bash
cargo fmt --check
```

### 6. Lint Code

ตรวจสอบ code quality

```bash
cargo clippy
```

### 7. Generate Documentation

สร้าง documentation

```bash
cargo doc --open
```

### 8. Clean Build Artifacts

ลบ build artifacts

```bash
cargo clean
```

## Expected Outcome

- Project ที่ build ผ่านทั้ง debug และ release
- Code ที่ผ่าน linting และ formatting
- Tests ที่ผ่านทั้งหมด
- Documentation ที่สร้างเรียบร้อย
