# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `clap` |
| Registry | `crates.io` |
| Latest Version | `4.6.6` |
| Release Date | `2026-08-06` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `clap-rs contributors` |
| License | `MIT OR Apache-2.0` |
| Repository | `https://github.com/clap-rs/clap` |
| Website | `https://clap.rs` |
| Documentation | `https://docs.rs/clap` |
| Releases / Changelog | `https://github.com/clap-rs/clap/blob/master/CHANGELOG.md` |

## Install

```bash
cargo add clap --features derive
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `rust` (toolchain) | `GitHub Releases` | `1.98.1` (2026-09-03) | Toolchain; use `edition = "2024"` |
| `color-eyre` | `crates.io` | `0.6.5` (2025-05-30) | Error reporting + panic hook |
| `cargo-dist` | `crates.io` | `0.32.0` (2026-05-22) | Release/distribution tooling |
| `thiserror` | `crates.io` | `2.0.20` (2026-08-08) | Library error types |
| `anyhow` | `crates.io` | `1.0.104` (2026-07-18) | Application error handling |
| `serde` | `crates.io` | `1.0.229` (2026-07-18) | Serialization |
| `serde_json` | `crates.io` | `unknown` | JSON output |

## Notes

- Breaking changes in latest major: clap 4.x — derive API (`clap::Parser`, `clap::Subcommand`), builder API renamed from clap 3 (`App` → `Command`)
- Version pinned in SKILL.md: `clap@4.6.6`, `color-eyre@0.6.5`, `cargo-dist@0.32.0`, Rust `1.98.1`
