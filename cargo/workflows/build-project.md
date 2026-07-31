# Build Project

## Build Project ด้วย Cargo

## Build Debug

```bash
cargo build
```

## Build Release

```bash
cargo build --release
```

## Build Specific Package

```bash
cargo build -p package-name
```

## Build with Features

```bash
cargo build --features feature1,feature2
```

## Build All Targets

```bash
cargo build --all-targets
```

## Build Workspace

```bash
cargo build --workspace
```

## Build Specific Target

```bash
cargo build --target x86_64-unknown-linux-musl
```

## Check without Building

```bash
cargo check
cargo check --all-targets
```

## Clean Build

```bash
cargo clean
cargo build
```

## Build Options

### Verbose Output

```bash
cargo build -vv
```

### Quiet Output

```bash
cargo build -q
```

### Color Output

```bash
cargo build --color=always
```

## Build Configuration

### Profile Selection

```bash
cargo build --profile custom
```

### Custom Profile

```toml
[profile.custom]
inherits = "release"
debug = true
```

## Build Errors

### Fix Build Errors

```bash
cargo build 2>&1 | head
```

### Check Warnings

```bash
cargo clippy
```

## Build Performance

### Parallel Jobs

```toml
[build]
jobs = 4
```

### Incremental Compilation

```toml
[profile.dev]
incremental = true
```

### Use sccache

```bash
cargo install sccache
export RUSTC_WRAPPER=sccache
```

## Build Verification

### Verify Project

```bash
cargo verify-project
```

### Check Metadata

```bash
cargo metadata
```

## Next Steps

- อ่าน [run-project.md](./run-project.md) สำหรับการ run
- อ่าน [test-project.md](./test-project.md) สำหรับการ test
