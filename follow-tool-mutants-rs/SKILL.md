---
name: follow-tool-mutants-rs
description: ตั้งค่าและใช้งาน cargo-mutants สำหรับ mutation testing ใน Rust projects
---

## Goal

ตั้งค่าและใช้งาน cargo-mutants สำหรับ mutation testing เพื่อปรับปรุงคุณภาพของ Rust tests

## Scope

ใช้สำหรับ Rust projects ที่ใช้ Cargo build system

## Execute

### 1 Installation

ติดตั้ง cargo-mutants จาก source:

```bash
cargo install --locked cargo-mutants
```

หรือใช้ cargo-binstall:

```bash
cargo binstall cargo-mutants
```

### 2 Prerequisites

ตรวจสอบว่า project มี tests ที่เชื่อถือได้ (non-flaky):

```bash
cargo test
```

หรือใช้ cargo-nextest:

```bash
cargo nextest
```

### 3 Run Mutation Testing

รัน cargo-mutants ใน Rust source directory:

```bash
cargo mutants
```

รันด้วย toolchain เฉพาะ:

```bash
cargo +1.48 mutants
```

### 4 Understanding Results

ผลลัพธ์จะแสดง:

- NOT CAUGHT: Mutants ที่ tests ไม่จับได้ (ต้องเพิ่ม tests)
- CAUGHT: Mutants ที่ tests จับได้ (ดี)
- UNVIABLE: Mutants ที่ไม่สามารถ build ได้ (ไม่เป็นปัญหา)

ตัวอย่าง output:

```
Found 14 mutants to test
Copy source to scratch directory ... 0 MB in 0.0s
Unmutated baseline ... ok in 1.6s build + 0.3s test
Auto-set test timeout to 20.0s
src/lib.rs:386: replace Error::source with Default::default() ... NOT CAUGHT
14 mutants tested in 0:08: 2 missed, 9 caught, 3 unviable
```

### 5 Configuration

ใช้ `mutants.toml` สำหรับ configuration ขั้นสูง:

```toml
[mutants]
timeout = 20.0
```

ใช้ `#[mutants::skip]` attribute สำหรับ skip mutants ที่ไม่จำเป็น:

```rust
#[mutants::skip]
fn function_to_skip() {
    // ...
}
```

### 6 CI Integration

เพิ่ม cargo-mutants ใน CI pipeline:

```yaml
- name: Run mutation testing
  run: cargo mutants
```

## Rules

- ต้องมี tests ที่เชื่อถือได้ก่อนรัน cargo-mutants
- Cross-compilation ไม่รองรับในปัจจุบัน
- ต้อง build ได้บน host platform
- ไม่ต้องเปลี่ยน source code เพื่อใช้ cargo-mutants
- Results ควร reproducible ถ้า build และ test suite deterministic
- ใช้ `#[mutants::skip]` สำหรับ mutants ที่ไม่น่าสนใจ
- เพิ่ม tests สำหรับ NOT CAUGHT mutants
- รัน cargo-mutants เป็นระยะ เพื่อ track test quality

## Expected Outcome

- Mutation testing ทำงานได้อัตโนมัติ
- Test coverage และ quality ดีขึ้น
- Missed mutants ถูกระบุและแก้ไข
- Test suite มีความเชื่อถือได้สูงขึ้น
