---
title: Best Practices
description: แนวทางปฏิบัติที่ดีสำหรับการใช้ cargo-nextest
---

## Recommendations

### 1. Use Profiles

สร้าง profiles สำหรับ development และ CI:

```toml
[profile.default]
test-threads = "num-cpus"

[profile.ci]
test-threads = 4
hide-progress-bar = true
```

### 2. Configure Timeouts

ตั้งค่า timeouts สำหรับ tests ที่ช้า:

```toml
[[profile.default.overrides]]
filter = "test::integration::*"
slow-timeout = "300s"
```

### 3. Use with Coverage

ใช้กับ cargo-llvm-cov สำหรับ coverage reports:

```bash
cargo llvm-cov nextest --html
```

### 4. Separate Doctests

รัน doctests แยกจาก unit tests:

```bash
cargo nextest run && cargo test --doc
```

### 5. CI Integration

ใช้ profile สำหรับ CI เพื่อ optimize:

```bash
cargo nextest run --profile ci
```

### 6. Test Organization

จัดระเบียบ tests ด้วย modules และ naming conventions:

```rust
#[cfg(test)]
mod tests {
    mod unit;
    mod integration;
    mod e2e;
}
```

### 7. Environment Variables

ตั้งค่า environment variables ใน config file:

```toml
[env]
RUST_LOG = "info"
```
