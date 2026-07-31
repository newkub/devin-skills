# Add Dependency

## เพิ่ม Dependency ด้วย Cargo

## Add Dependency

```bash
cargo add serde
```

## Add Specific Version

```bash
cargo add serde@1.0.150
```

## Add with Features

```bash
cargo add serde --features derive
```

## Add Dev Dependency

```bash
cargo add --dev criterion
```

## Add Build Dependency

```bash
cargo add --build cc
```

## Add Git Dependency

```bash
cargo add my-crate --git https://github.com/user/repo
```

## Add Path Dependency

```bash
cargo add local-crate --path ../local-crate
```

## Add with Rename

```bash
cargo add serde --rename new-name
```

## Manual Addition

แก้ `Cargo.toml`:

```toml
[dependencies]
serde = "1.0"
tokio = { version = "1.0", features = ["full"] }
```

## Remove Dependency

```bash
cargo remove serde
```

## Update Dependency

```bash
cargo update
cargo update -p serde
```

## Check Dependency Tree

```bash
cargo tree
cargo tree --duplicates
```

## Dependency Best Practices

### 1. ใช้ Workspace Dependencies

```toml
[workspace.dependencies]
serde = "1.0"
```

### 2. ระบุ Version อย่างชัดเจน

```toml
serde = "1.0.150"
```

### 3. ใช้ Features อย่างมีเหตุผล

```toml
serde = { version = "1.0", features = ["derive"] }
```

### 4. ตรวจสอบ Unused Dependencies

```bash
cargo install cargo-udeps
cargo +nightly udeps
```

## Next Steps

- อ่าน [build-project.md](./build-project.md) สำหรับการ build
