# Structure

## Project Structure มาตรฐาน

## Single Binary Project

```
my-app/
├── Cargo.toml
├── Cargo.lock
├── src/
│   └── main.rs
├── tests/
│   └── integration_test.rs
├── examples/
│   └── example.rs
├── benches/
│   └── benchmark.rs
└── target/
    ├── debug/
    └── release/
```

## Library Project

```
my-lib/
├── Cargo.toml
├── Cargo.lock
├── src/
│   ├── lib.rs
│   ├── mod1.rs
│   └── mod2.rs
├── tests/
│   └── integration_test.rs
├── examples/
│   └── example.rs
├── benches/
│   └── benchmark.rs
└── target/
```

## Workspace Project

```
workspace/
├── Cargo.toml (workspace)
├── Cargo.lock
├── crates/
│   ├── core/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       └── mod.rs
│   ├── api/
│   │   ├── Cargo.toml
│   │   └── src/
│   │       └── lib.rs
│   └── cli/
│       ├── Cargo.toml
│       └── src/
│           └── main.rs
├── tests/
│   └── integration_test.rs
└── target/
```

## File Organization

### src/ Directory

```
src/
├── main.rs          # Binary entry point
├── lib.rs           # Library entry point
├── mod.rs           # Module declarations
├── utils/
│   ├── mod.rs       # utils module
│   └── helpers.rs   # helper functions
└── models/
    ├── mod.rs       # models module
    └── user.rs      # user model
```

### tests/ Directory

```
tests/
├── integration_test.rs   # Integration tests
├── api_test.rs          # API tests
└── common/
    └── mod.rs           # Test utilities
```

### examples/ Directory

```
examples/
├── basic.rs         # Basic example
├── advanced.rs      # Advanced example
└── custom.rs        # Custom example
```

### benches/ Directory

```
benches/
├── benchmark.rs     # Main benchmark
└── comparison.rs    # Comparison benchmark
```

## Cargo.toml Structure

### Basic Package

```toml
[package]
name = "my-crate"
version = "0.1.0"
edition = "2021"
authors = ["Name <email>"]
license = "MIT OR Apache-2.0"
description = "Description"
repository = "https://github.com/user/repo"
readme = "README.md"

[dependencies]
# dependencies here
```

### Workspace Package

```toml
[workspace]
members = ["crates/*"]
resolver = "2"

[workspace.package]
version = "0.1.0"
edition = "2021"
authors = ["Name <email>"]
license = "MIT OR Apache-2.0"

[workspace.dependencies]
serde = "1.0"
tokio = "1.0"
```

## Target Directory

```
target/
├── debug/
│   ├── my-app.exe
│   ├── deps/
│   │   ├── lib1.rlib
│   │   └── lib2.rlib
│   ├── build/
│   │   └── build-script-output
│   ├── incremental/
│   │   └── .fingerprint/
│   └── examples/
│       └── example.exe
└── release/
    ├── my-app.exe
    ├── deps/
    ├── build/
    └── examples/
```

## Configuration Files

### .cargo/config.toml

```
project/
├── .cargo/
│   └── config.toml
├── Cargo.toml
└── src/
```

### .gitignore

```
/target/
**/*.rs.bk
Cargo.lock
```

## Documentation Structure

```
docs/
├── guide/
│   ├── installation.md
│   ├── quick-start.md
│   └── advanced.md
├── api/
│   └── reference.md
└── examples/
    └── usage.md
```

## Module Organization

### Flat Structure

```
src/
├── main.rs
├── utils.rs
├── models.rs
└── api.rs
```

### Nested Structure

```
src/
├── main.rs
├── utils/
│   ├── mod.rs
│   ├── string.rs
│   └── file.rs
├── models/
│   ├── mod.rs
│   ├── user.rs
│   └── post.rs
└── api/
    ├── mod.rs
    ├── client.rs
    └── server.rs
```

## Recommended Structure

### Small Project

```
my-app/
├── Cargo.toml
├── src/
│   ├── main.rs
│   ├── lib.rs
│   └── utils.rs
└── tests/
    └── integration_test.rs
```

### Medium Project

```
my-app/
├── Cargo.toml
├── src/
│   ├── main.rs
│   ├── lib.rs
│   ├── api/
│   ├── models/
│   └── utils/
├── tests/
├── examples/
└── benches/
```

### Large Project (Workspace)

```
workspace/
├── Cargo.toml
├── crates/
│   ├── core/
│   ├── api/
│   ├── cli/
│   └── utils/
├── tests/
├── examples/
└── benches/
```

## Next Steps

- อ่าน [troubleshooting.md](./troubleshooting.md) สำหรับ troubleshooting
