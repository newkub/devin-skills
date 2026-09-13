# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `cargo` (ships with the Rust toolchain) |
| Registry | `GitHub Releases` (`rust-lang/rust`) |
| Latest Version | `1.98.1` |
| Release Date | `2026-09-03` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Rust Project / rust-lang` |
| License | `MIT OR Apache-2.0` |
| Repository | `https://github.com/rust-lang/cargo` |
| Website | `https://www.rust-lang.org` |
| Documentation | `https://doc.rust-lang.org/cargo/` |
| Releases / Changelog | `https://github.com/rust-lang/rust/releases` |

## Install

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh   # rustup (includes cargo)
rustup update stable
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `clippy` | `rustup component` | `1.98.1` | Ships with toolchain: `rustup component add clippy` |
| `rustfmt` | `rustup component` | `1.98.1` | Ships with toolchain: `rustup component add rustfmt` |
| `lefthook` | `GitHub Releases` | — | Optional pre-commit hook runner used by this skill |

## Notes

- Breaking changes in latest major: `none` — cargo follows Rust stable releases
- Version pinned in SKILL.md: `Rust 1.98.1 (cargo 1.98.1)`
- crates.io `cargo` crate (`0.99.0`) is NOT the toolchain — cargo is distributed via rustup
