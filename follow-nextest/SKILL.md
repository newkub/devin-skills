---
name: follow-nextest
description: ตั้งค่าและใช้งาน cargo-nextest สำหรับ test runner ที่รวดเร็วใน Rust projects
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
---

## Goal

ตั้งค่าและใช้งาน cargo-nextest สำหรับ test runner ที่รวดเร็วและมีประสิทธิภาพใน Rust projects

## Scope

ใช้สำหรับ Rust projects ที่ใช้ Cargo build system

## Execute

### 1. Installation

> Goal: ติดตั้ง cargo-nextest บน environment
> Goal: cargo-nextest พร้อมใช้งาน

ติดตั้งด้วย `cargo-binstall`:

```bash
cargo binstall cargo-nextest --secure
```

หรือติดตั้งจาก pre-built binaries:

Linux:
```bash
curl -LsSf https://get.nexte.st/latest/linux | tar zxf - -C ${CARGO_HOME:-~/.cargo}/bin
```

macOS:
```bash
curl -LsSf https://get.nexte.st/latest/mac | tar zxf - -C ${CARGO_HOME:-~/.cargo}/bin
```

Windows (PowerShell):
```powershell
$tmp = New-TemporaryFile | Rename-Item -NewName { $_ -replace 'tmp$', 'zip' } -PassThru
Invoke-WebRequest -OutFile $tmp https://get.nexte.st/latest/windows
$outputDir = if ($Env:CARGO_HOME) { Join-Path $Env:CARGO_HOME "bin" } else { "~/.cargo/bin" }
$tmp | Expand-Archive -DestinationPath $outputDir -Force
$tmp | Remove-Item
```

Windows (winget):
```bash
winget install nextest.cargo-nextest
```

### 2. Run Tests

> Goal: รัน tests ด้วย cargo-nextest
> Goal: tests รันสำเร็จและแสดงผลลัพธ์

```bash
cargo nextest run
```

รัน doctests แยก (nextest ไม่รองรับ doctests):

```bash
cargo test --doc
```

### 3. Configuration

> Goal: สร้าง `.config/nextest.toml` สำหรับ configuration
> Goal: config สำหรับ local และ CI ครบถ้วน

```toml
[profile.ci]
# Run all tests regardless of failures
fail-fast = false
```

ใช้ profile เมื่อรัน:

```bash
cargo nextest run --profile ci
```

### 4. List Tests

> Goal: แสดงรายการ tests ทั้งหมด
> Goal: รู้ scope และชื่อ tests ทีรัน

```bash
cargo nextest list
```

### 5. Profiles

> Goal: ใช้ profiles สำหรับ local และ CI runs
> Goal: แยก config ตาม environment ได้ถูกต้อง

- default: สำหรับ local development
- ci: สำหรับ CI (fail-fast = false)

สร้าง custom profiles ใน `.config/nextest.toml`:

```toml
[profile.custom-profile]
fail-fast = false
test-threads = 4
```

### 6. CI Integration

> Goal: เพิ่ม cargo-nextest ใน CI pipeline
> Goal: CI รัน tests ด้วย nextest อย่างมีประสิทธิภาพ

```yaml
- name: Run tests
  run: cargo nextest run --profile ci
```

## Rules

- รัน doctests แยกจาก cargo-nextest
- ใช้ `--profile ci` ใน CI เพื่อ run ทุก tests แม้จะ fail
- ใช้ default profile สำหรับ local development
- ตั้งค่า `fail-fast = false` ใน CI profile
- หลีกเลี่ยง naming profiles ที่ขึ้นต้นด้วย `default-`
- ใช้ cargo-nextest แทน cargo test สำหรับ performance ที่ดีกว่า
- ตรวจสอบ configuration ใน `.config/nextest.toml`

## Expected Outcome

- Test runner ที่รวดเร็วและมีประสิทธิภาพ
- Tests รันแบบ parallel อัตโนมัติ
- CI integration ที่เหมาะสม
- Test execution time ลดลง
