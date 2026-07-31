# Troubleshooting

## การแก้ปัญหาทั่วไป

## Build Errors

### Linker Errors

**Problem:**
```
error: linking with `cc` failed
```

**Solution:**
```bash
# Install build tools
# Windows
winget install LLVM

# Linux
sudo apt install build-essential

# macOS
xcode-select --install
```

### Out of Memory

**Problem:**
```
error: failed to allocate memory
```

**Solution:**
```toml
[build]
jobs = 1  # Reduce parallel jobs
```

```bash
# Limit memory
export CARGO_BUILD_JOBS=1
```

### Incremental Compilation Issues

**Problem:**
Build ไม่ update

**Solution:**
```bash
cargo clean
cargo build
```

## Dependency Issues

### Version Conflicts

**Problem:**
```
error: failed to select a version
```

**Solution:**
```bash
cargo update
cargo update -p package-name
```

### Dependency Not Found

**Problem:**
```
error: could not find `serde` in registry
```

**Solution:**
```bash
# Update index
cargo update

# Check network
cargo fetch
```

### Git Dependency Issues

**Problem:**
```
error: failed to get `my-crate` from git
```

**Solution:**
```toml
[net]
git-fetch-with-cli = true
```

## Cargo.lock Issues

### Lockfile Out of Sync

**Problem:**
```
error: the lock file needs to be updated
```

**Solution:**
```bash
cargo update
```

### Regenerate Lockfile

**Problem:**
Lockfile ไม่ถูกต้อง

**Solution:**
```bash
rm Cargo.lock
cargo generate-lockfile
```

## Target Issues

### Target Not Installed

**Problem:**
```
error: target not found
```

**Solution:**
```bash
rustup target add x86_64-unknown-linux-musl
```

### Cross-Compilation Issues

**Problem:**
Cross-compile ไม่สำเร็จ

**Solution:**
```bash
cargo install cross
cross build --target x86_64-unknown-linux-musl
```

## Performance Issues

### Slow Builds

**Problem:**
Build ช้า

**Solution:**
```toml
[profile.dev]
incremental = true

[build]
jobs = 4
```

```bash
# Use sccache
cargo install sccache
export RUSTC_WRAPPER=sccache
```

### Large Binary Size

**Problem:**
Binary ใหญ่เกินไป

**Solution:**
```toml
[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
strip = true
panic = "abort"
```

## Network Issues

### Registry Timeout

**Problem:**
```
error: failed to fetch from registry
```

**Solution:**
```toml
[net]
retry = 3
```

```bash
# Use mirror
[source.crates-io]
replace-with = "sparse+https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"
```

### Git Clone Issues

**Problem:**
Git clone ล้มเหลว

**Solution:**
```toml
[net]
git-fetch-with-cli = true
```

## Workspace Issues

### Member Not Found

**Problem:**
```
error: member not found
```

**Solution:**
```toml
[workspace]
members = [
    "crates/core",
    "crates/api",
]
```

### Dependency Resolution

**Problem:**
Workspace dependencies ไม่ resolve

**Solution:**
```toml
[workspace]
resolver = "2"
```

## Toolchain Issues

### Nightly Features

**Problem:**
```
error: feature requires nightly
```

**Solution:**
```bash
rustup install nightly
rustup default nightly
```

### Toolchain Mismatch

**Problem:**
```
error: toolchain not found
```

**Solution:**
```bash
rustup install stable
rustup default stable
```

## Documentation Issues

### Doc Tests Fail

**Problem:**
Doc tests ไม่ผ่าน

**Solution:**
```bash
cargo test --doc
```

```rust
/// Example
///
/// ```rust
/// let result = add(2, 3);
/// assert_eq!(result, 5);
/// ```
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

## Testing Issues

### Test Timeout

**Problem:**
Tests ใช้เวลานาน

**Solution:**
```bash
cargo test -- --test-threads=1
```

### Test Not Found

**Problem:**
```
error: test not found
```

**Solution:**
```bash
cargo test --list
cargo test test_name
```

## Publishing Issues

### Authentication Error

**Problem:**
```
error: authentication failed
```

**Solution:**
```bash
cargo login
```

### Package Name Taken

**Problem:**
```
error: package name already exists
```

**Solution:**
```toml
[package]
name = "unique-name"
```

## Debugging

### Verbose Output

```bash
cargo build -vv
cargo test -vv
```

### Check Environment

```bash
cargo version
rustc --version
rustup show
```

### Check Dependencies

```bash
cargo tree
cargo tree --duplicates
```

## Common Commands

```bash
# Clean build
cargo clean

# Update dependencies
cargo update

# Check configuration
cargo config

# Show metadata
cargo metadata

# Verify project
cargo verify-project
```

## Getting Help

```bash
cargo help
cargo help build
cargo help test
```

## Resources

- [Cargo Troubleshooting Guide](https://doc.rust-lang.org/cargo/guide/troubleshooting.html)
- [Rust Forum](https://users.rust-lang.org/)
- [Rust Discord](https://discord.gg/rust-lang)
