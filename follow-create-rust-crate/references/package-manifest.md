# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `rust` (toolchain) |
| Registry | `GitHub Releases` |
| Latest Version | `1.98.1` |
| Release Date | `2026-09-03` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Rust Project / rust-lang` |
| License | `MIT OR Apache-2.0` |
| Repository | `https://github.com/rust-lang/rust` |
| Website | `https://www.rust-lang.org` |
| Documentation | `https://doc.rust-lang.org/` |
| Releases / Changelog | `https://github.com/rust-lang/rust/releases` / `https://releases.rs/` |

## Install

```bash
cargo new --lib <crate-name>
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `thiserror` | `crates.io` | `2.0.20` (2026-08-08) | Library error types |
| `serde` | `crates.io` | `1.0.229` (2026-07-18) | Serialization (optional) |
| `cargo-dist` | `crates.io` | `0.32.0` (2026-05-22) | Optional release tooling |

## Notes

- Breaking changes in latest major: Rust 2024 edition is stable — set `edition = "2024"` in `Cargo.toml`
- Version pinned in SKILL.md: Rust `1.98.1`, edition 2024
- Crate scaffolded by `cargo` (bundled with toolchain) — no single npm/crates package is "installed" by this skill
