# Cargo Configuration Reference

## Cargo.toml

### Essential Fields

| Field | Type | Description |
|-------|------|-------------|
| `[package]` | section | Package metadata |
| `name` | string | Package name |
| `version` | string | Semantic version |
| `edition` | string | Rust edition (2021) |
| `authors` | array | Package authors |
| `description` | string | Package description |
| `license` | string | License type |
| `repository` | string | Git repository URL |

### Dependencies

| Section | Description |
|---------|-------------|
| `[dependencies]` | Runtime dependencies |
| `[dev-dependencies]` | Development dependencies |
| `[build-dependencies]` | Build script dependencies |
| `[target.<triple>.dependencies]` | Platform-specific dependencies |

### Dependency Versions

| Syntax | Description |
|--------|-------------|
| `1.0.0` | Exact version |
| `^1.0.0` | Compatible with 1.x.x |
| `~1.0.0` | Compatible with 1.0.x |
| `>=1.0.0` | Greater than or equal |
| `*` | Any version |

### Profiles

| Profile | Description |
|---------|-------------|
| `[profile.dev]` | Development build |
| `[profile.release]` | Release build |
| `[profile.test]` | Test build |

## Related Resources

| Name | URL | Description |
|------|-----|-------------|
| Cargo Toml | https://doc.rust-lang.org/cargo/reference/manifest.html | Cargo.toml reference |
