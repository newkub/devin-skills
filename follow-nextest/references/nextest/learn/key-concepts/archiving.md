# Archiving and Build Reuse

## Overview

Archiving เป็น feature ของ Nextest ที่ช่วยให้ package test binaries และ dependencies ลงใน archive file สำหรับ portable execution และ build reuse ใน CI/CD pipelines

## Why Archiving?

การ archive test builds มีประโยชน์หลายอย่าง:

- **Build/Test Separation**: แยก build phase จาก test phase ใน CI
- **Cache Reuse**: Reuse builds ระหว่าง CI runs ต่างๆ
- **Cross-Platform Testing**: Build บน platform หนึ่ง และ test บนอีก platform
- **Distributed Testing**: Distribute test execution หลาย machines
- **Faster CI**: Skip build step เมื่อ build ไม่เปลี่ยน

## Archive Format

Nextest รองรับ archive formats ต่อไปนี้:

| Format | Extension | Compression | Use Case |
|--------|-----------|-------------|----------|
| `tar-zst` | `.tar.zst` | Zstandard | Default, fastest compression |
| `tar-gz` | `.tar.gz` | Gzip | Maximum compatibility |

## Creating Archives

สร้าง archive ด้วย command:

```bash
# Create archive with default format
cargo nextest archive

# Create archive with specific output path
cargo nextest archive --output my-archive.tar.zst

# Create archive with specific format
cargo nextest archive --format tar-gz

# Create archive with specific profile
cargo nextest archive --profile ci
```

## Archive Contents

Archive ประกอบด้วย:

```
archive.tar.zst
├── test-binaries/
│   ├── my-crate-test
│   └── other-crate-test
├── dependencies/
│   ├── lib1.so
│   └── lib2.dylib
├── metadata.json
└── config/
    └── nextest.toml
```

### Components

**Test Binaries**
- Compiled test executables จาก workspace
- Ready-to-run binaries
- Platform-specific

**Dependencies**
- Shared libraries และ dependencies
- Dynamic libraries (.so, .dylib, .dll)
- Runtime dependencies

**Metadata**
- Package information
- Test list
- Build configuration

**Configuration**
- Nextest configuration files
- Profile settings
- Test group definitions

## Running from Archives

รัน tests จาก archive:

```bash
# Run tests from archive
cargo nextest run --archive-file archive.tar.zst

# Run specific test from archive
cargo nextest run test_name --archive-file archive.tar.zst

# Run with profile from archive
cargo nextest run --profile ci --archive-file archive.tar.zst
```

## CI/CD Integration

### Build and Test Separation

แยก build และ test phases ใน CI:

```yaml
# .github/workflows/ci.yml
name: CI

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - name: Build tests
        run: cargo nextest archive --output test-archive.tar.zst
      - name: Upload archive
        uses: actions/upload-artifact@v3
        with:
          name: test-archive
          path: test-archive.tar.zst

  test:
    needs: build
    runs-on: ubuntu-latest
    strategy:
      matrix:
        target: [x86_64-unknown-linux-gnu, x86_64-apple-darwin]
    steps:
      - uses: actions/checkout@v3
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - name: Download archive
        uses: actions/download-artifact@v3
        with:
          name: test-archive
      - name: Run tests
        run: cargo nextest run --archive-file test-archive.tar.zst
```

### Cross-Platform Testing

Build บน Linux และ test บน multiple platforms:

```yaml
# .github/workflows/cross-platform.yml
name: Cross-Platform

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          target: x86_64-unknown-linux-gnu
      - name: Build for Linux
        run: cargo nextest archive --output linux-archive.tar.zst
      - name: Upload Linux archive
        uses: actions/upload-artifact@v3
        with:
          name: linux-archive
          path: linux-archive.tar.zst

  test-macos:
    needs: build
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - name: Download archive
        uses: actions/download-artifact@v3
        with:
          name: linux-archive
      - name: Run tests on macOS
        run: cargo nextest run --archive-file linux-archive.tar.zst
```

### Cache Optimization

ใช้ archives สำหรับ caching:

```yaml
# .github/workflows/cached-build.yml
name: Cached Build

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - name: Cache archive
        uses: actions/cache@v3
        with:
          path: test-archive.tar.zst
          key: ${{ runner.os }}-test-archive-${{ hashFiles('**/Cargo.lock') }}
      - name: Build if cache miss
        if: steps.cache.outputs.cache-hit != 'true'
        run: cargo nextest archive --output test-archive.tar.zst
      - name: Run tests
        run: cargo nextest run --archive-file test-archive.tar.zst
```

## Configuration

ตั้งค่า archive options ใน configuration:

```toml
# .config/nextest.toml
[profile.default]
archive-format = "tar-zst"

[profile.default.archive]
include-files = [
  "config/test-data.json",
  "fixtures/*"
]

exclude-files = [
  "target/debug/deps/*.pdb",
  "*.rs"
]
```

## Best Practices

### 1. Use Appropriate Compression

เลือก format ตาม use case:

```toml
# Fast compression for local development
[profile.local]
archive-format = "tar-zst"

# Maximum compatibility for CI
[profile.ci]
archive-format = "tar-gz"
```

### 2. Include Necessary Files

รวม files ที่จำเป็นสำหรับ tests:

```toml
[profile.default.archive]
include-files = [
  "config/",
  "fixtures/",
  "test-data/"
]
```

### 3. Exclude Unnecessary Files

Exclude files ที่ไม่จำเป็นเพื่อลดขนาด:

```toml
[profile.default.archive]
exclude-files = [
  "*.rs",
  "*.toml",
  "target/debug/deps/*.rlib"
]
```

### 4. Version Archives

รวม version information ใน archive:

```bash
# Create archive with version in filename
VERSION=$(cargo pkgid | cut -d@ -f2)
cargo nextest archive --output "test-archive-${VERSION}.tar.zst"
```

### 5. Verify Archive Integrity

ตรวจสอบ archive ก่อนใช้:

```bash
# List archive contents
tar -tzf test-archive.tar.zst

# Verify archive integrity
tar -tzf test-archive.tar.zst > /dev/null
```

## Advanced Usage

### Archive with Custom Metadata

เพิ่ม custom metadata ลงใน archive:

```bash
# Create archive with metadata
cargo nextest archive --output archive.tar.zst
echo "{\"version\": \"1.0.0\", \"commit\": \"$(git rev-parse HEAD)\"}" > metadata.json
tar -rf archive.tar.zst metadata.json
```

### Extract and Modify Archive

Extract archive และ modify:

```bash
# Extract archive
tar -xzf archive.tar.zst

# Modify contents
# ... make changes ...

# Repackage
tar -czf modified-archive.tar.gz test-binaries/ dependencies/
```

### Archive for Multiple Profiles

สร้าง archives สำหรับ profiles ต่างๆ:

```bash
# Archive for default profile
cargo nextest archive --profile default --output default-archive.tar.zst

# Archive for CI profile
cargo nextest archive --profile ci --output ci-archive.tar.zst
```

## Troubleshooting

### Archive Too Large

ลดขนาด archive:

```toml
[profile.default.archive]
exclude-files = [
  "target/debug/deps/*.rlib",
  "*.o",
  "*.a"
]
```

ใช้ compression ที่ดีกว่า:

```bash
cargo nextest archive --format tar-zst
```

### Archive Corrupted

ตรวจสอบ integrity:

```bash
# Verify archive
tar -tzf archive.tar.zst > /dev/null && echo "OK" || echo "CORRUPTED"
```

สร้าง archive ใหม่:

```bash
cargo nextest archive --output new-archive.tar.zst
```

### Cannot Run from Archive

ตรวจสอบ platform compatibility:

```bash
# Check archive metadata
tar -xzf archive.tar.zst metadata.json
cat metadata.json
```

ตรวจสอบ dependencies:

```bash
# Check for missing libraries
ldd test-binaries/my-crate-test
```

## Performance Considerations

### Archive Creation Time

เวลาในการสร้าง archive ขึ้นอยู่กับ:

- ขนาด workspace
- จำนวน dependencies
- Compression level
- Disk I/O speed

### Archive Size

ขนาด archive ขึ้นอยู่กับ:

- จำนวน test binaries
- ขนาด dependencies
- Compression efficiency
- Included files

### Extraction Time

เวลาในการ extract ขึ้นอยู่กับ:

- Archive size
- Compression format
- Disk I/O speed
- CPU performance

## See Also

- [Recording/Replay](./recording-replay.md) - สำหรับ test run capture
- [Setup Scripts](./setup-scripts.md) - สำหรับ environment preparation
- [CI Integration](../principles/ci-integration.md) - สำหรับ CI setup
