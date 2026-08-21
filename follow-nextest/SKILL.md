---
name: follow-nextest
description: ตั้งค่าและใช้งาน cargo-nextest สำหรับ test runner ที่รวดเร็วใน Rust projects
---

## Goal

ตั้งค่าและใช้งาน cargo-nextest สำหรับ test runner ที่รวดเร็วและมีประสิทธิภาพใน Rust projects

## Scope

ใช้สำหรับ Rust projects ที่ใช้ Cargo build system

## Execute

### 1 Installation

ติดตั้ง cargo-nextest ด้วย cargo-binstall:

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

### 2 Run Tests

รัน tests ด้วย cargo-nextest:

```bash
cargo nextest run
```

รัน doctests แยก (nextest ไม่รองรับ doctests):

```bash
cargo test --doc
```

### 3 Configuration

สร้าง `.config/nextest.toml` สำหรับ configuration:

```toml
[profile.ci]
# Run all tests regardless of failures
fail-fast = false
```

ใช้ profile เมื่อรัน:

```bash
cargo nextest run --profile ci
```

### 4 List Tests

แสดงรายการ tests ทั้งหมด:

```bash
cargo nextest list
```

### 5 Profiles

ใช้ profiles สำหรับ local และ CI runs:

- default: สำหรับ local development
- ci: สำหรับ CI (fail-fast = false)

สร้าง custom profiles ใน `.config/nextest.toml`:

```toml
[profile.custom-profile]
fail-fast = false
test-threads = 4
```

### 6 CI Integration

เพิ่ม cargo-nextest ใน CI pipeline:

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


## References

- `nextest` content: `references/nextest/`
