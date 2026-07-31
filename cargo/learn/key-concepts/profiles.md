# Profiles

## แนวคิดเกี่ยวกับ Profiles

Profiles คือ configuration สำหรับ build modes ต่างๆ

## Built-in Profiles

| Profile | Use Case | Optimizations | Debug |
|---------|----------|---------------|-------|
| `dev` | Development | None | Full |
| `release` | Production | Full | None |
| `test` | Testing | None | Full |
| `bench` | Benchmarking | Full | Limited |

## Profile Configuration

### Dev Profile

```toml
[profile.dev]
opt-level = 0
debug = true
incremental = true
overflow-checks = true
```

### Release Profile

```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"
strip = true
debug = false
```

### Test Profile

```toml
[profile.test]
opt-level = 0
debug = true
```

### Bench Profile

```toml
[profile.bench]
inherits = "release"
debug = true
```

## Optimization Levels

| Level | Description |
|-------|-------------|
| 0 | No optimizations |
| 1 | Basic optimizations |
| 2 | More optimizations |
| 3 | All optimizations |
| "s" | Optimize for size |
| "z" | Optimize for size aggressively |

## LTO (Link-Time Optimization)

```toml
[profile.release]
lto = true  # Enable LTO
```

Benefits:
- Better optimization
- Smaller binary
- Slower build time

## Codegen Units

```toml
[profile.release]
codegen-units = 1  # Single codegen unit
```

Trade-offs:
- 1 unit: Better optimization, slower build
- Multiple units: Faster build, worse optimization

## Panic Strategy

```toml
[profile.release]
panic = "abort"  # Abort on panic
```

Options:
- `"unwind"` - Unwind stack (default)
- `"abort"` - Abort immediately (smaller binary)

## Strip

```toml
[profile.release]
strip = true  # Remove debug symbols
```

Benefits:
- Smaller binary
- No debug info

## Custom Profiles

```toml
[profile.profiling]
inherits = "release"
debug = true
strip = false
```

```bash
cargo build --profile profiling
```

## Profile Inheritance

```toml
[profile.custom]
inherits = "dev"
opt-level = 1
```

## Profile-Specific Dependencies

```toml
[dependencies]
# Always included
serde = "1.0"

[dev-dependencies]
# Only in dev/test
criterion = "0.5"

[target.'cfg(target_os = "linux")'.dependencies]
# Platform-specific
nix = "0.26"
```

## Using Profiles

### Build with Profile

```bash
cargo build --release
cargo build --profile custom
```

### Run with Profile

```bash
cargo run --release
```

### Test with Profile

```bash
cargo test --release
```

## Profile Best Practices

### 1. ใช้ Dev สำหรับ Development

```bash
cargo build  # Default dev profile
```

### 2. ใช้ Release สำหรับ Production

```bash
cargo build --release
```

### 3. ตั้งค่า Release Profile ให้เหมาะสม

```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
strip = true
```

### 4. ใช้ Custom Profiles สำหรับ Special Cases

```toml
[profile.profiling]
inherits = "release"
debug = true
```

## Profile Examples

### Fast Development

```toml
[profile.dev]
opt-level = 0
incremental = true
```

### Small Binary

```toml
[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
strip = true
panic = "abort"
```

### Fast Build

```toml
[profile.release]
opt-level = 2
lto = false
codegen-units = 8
```
