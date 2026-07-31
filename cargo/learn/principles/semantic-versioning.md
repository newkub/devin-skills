# Semantic Versioning

## หลักการ Semantic Versioning

Cargo ใช้ Semantic Versioning (SemVer) สำหรับ versioning

## Version Format

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

ตัวอย่าง:
- `1.0.0` - First stable release
- `1.1.0` - New features
- `1.1.1` - Bug fix
- `2.0.0` - Breaking changes

## Pre-release Versions

```
VERSION-PRERELEASE
```

ตัวอย่าง:
- `1.0.0-alpha`
- `1.0.0-beta.1`
- `1.0.0-rc.1`

## Version Requirements

### Caret (^)

Compatible updates:

```toml
serde = "^1.0"  # 1.0.0 <= version < 2.0.0
```

### Tilde (~)

Patch updates only:

```toml
serde = "~1.0"  # 1.0.0 <= version < 1.1.0
```

### Comparison

```toml
serde = ">=1.0"
serde = "<2.0"
serde = ">=1.0,<2.0"
```

## Versioning Best Practices

### 1. เริ่มด้วย 0.0.x

```toml
[package]
version = "0.0.1"
```

สำหรับ initial development

### 2. ใช้ 0.x.0 สำหรับ Pre-release

```toml
[package]
version = "0.1.0"
```

สำหรับ pre-release, breaking changes ได้

### 3. ใช้ x.0.0 สำหรับ Stable

```toml
[package]
version = "1.0.0"
```

สำหรับ stable release, ระมัดระวังกับ breaking changes

### 4. อัปเดต Version อย่างถูกต้อง

```bash
# Patch
cargo release patch

# Minor
cargo release minor

# Major
cargo release major
```

## Version Compatibility

### Backward Compatibility

- **PATCH**: Always backward compatible
- **MINOR**: Backward compatible
- **MAJOR**: May break compatibility

### Breaking Changes

ต้องอัปเดต MAJOR version:

- Remove public APIs
- Change function signatures
- Change behavior significantly

## Versioning Workflow

### Development

```toml
version = "0.0.1"
```

### Pre-release

```toml
version = "0.1.0"
```

### Stable

```toml
version = "1.0.0"
```

## Version Tools

### cargo-release

```bash
cargo install cargo-release
```

```bash
cargo release patch
cargo release minor
cargo release major
```

### Manual Versioning

แก้ `Cargo.toml`:

```toml
[package]
version = "1.0.0"
```

## Version in Workspaces

### Workspace Package

```toml
[workspace.package]
version = "0.1.0"
```

### Member Package

```toml
[package]
version.workspace = true
```

## Version Constraints

### Minimum Version

```toml
serde = ">=1.0"
```

### Maximum Version

```toml
serde = "<2.0"
```

### Range

```toml
serde = ">=1.0,<2.0"
```

## Version Best Practices

### 1. ใช้ SemVer อย่างเคร่งครัด

- ไม่เปลี่ยน public APIs ใน PATCH
- อัปเดต MAVER เมื่อมี breaking changes
- Document breaking changes

### 2. ใช้ Pre-release Versions

```toml
version = "1.0.0-rc.1"
```

### 3. ใช้ Changelog

```bash
cargo install cargo-changelog
cargo changelog
```

### 4. Tag Releases

```bash
git tag v1.0.0
git push origin v1.0.0
```
