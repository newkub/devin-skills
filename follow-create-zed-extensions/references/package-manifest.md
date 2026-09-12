# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `zed_extension_api` |
| Registry | `crates.io` |
| Latest Version | `0.7.0` |
| Release Date | `2025-09-12` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Zed Industries |
| License | `Apache-2.0` |
| Repository | `https://github.com/zed-industries/zed` |
| Website | `https://zed.dev` |
| Documentation | `https://docs.rs/zed_extension_api` |
| Releases / Changelog | `https://github.com/zed-industries/zed/releases` |

## Install

```toml
# Cargo.toml
[dependencies]
zed_extension_api = "0.7.0"
```

```bash
rustup target add wasm32-wasip2
cargo build --target wasm32-wasip2 --release
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| Rust toolchain | `GitHub Releases` | `1.98.1` (2026-09-03) | `rustc`/`cargo` — needed for `wasm32-wasip2` builds |
| Zed editor | `GitHub Releases` | `unknown` | Host editor — check `zed-industries/zed` releases for compatibility |
| `zed-industries/extensions` | `GitHub` | n/a | Registry repo — publish via PR adding submodule + `extensions.toml` entry |

## Notes

- Breaking changes in latest major: API is still 0.x — check `zed_extension_api` version compatibility against the Zed versions you target; WASM target is `wasm32-wasip2` (wasip1 deprecated)
- `std::env::var` and `std::fs` do not work inside WASM — use `zed_extension_api::current_platform()` and `Worktree` methods
- `schema_version = 1` is current for `extension.toml`
- Version pinned in SKILL.md: `zed_extension_api@0.7.0` — matches latest as of 2026-09-12
