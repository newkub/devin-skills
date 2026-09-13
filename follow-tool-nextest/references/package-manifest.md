# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `cargo-nextest` |
| Registry | `crates.io` |
| Latest Version | `0.9.144` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `nextest-rs` (Rain / Sunshowers team) |
| License | `Apache-2.0 OR MIT` |
| Repository | `https://github.com/nextest-rs/nextest` |
| Website | `https://nexte.st` |
| Documentation | `https://nexte.st` |
| Releases / Changelog | `https://github.com/nextest-rs/nextest/releases` |

## Install

```bash
cargo binstall cargo-nextest --secure
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| — | — | — | Standalone CLI; also distributed via `https://get.nexte.st` binaries, `winget install nextest.cargo-nextest`, and `cargo install cargo-nextest --locked` |

## Notes

- Breaking changes in latest major: `0.9.x — pre-1.0; check release notes for config format changes between minor versions`
- Version pinned in SKILL.md: `cargo-nextest@0.9.144`
- Requires Rust toolchain `>=1.91` (crate `rust_version`); doctests unsupported — run `cargo test --doc` separately
- Source: `https://crates.io/api/v1/crates/cargo-nextest`
