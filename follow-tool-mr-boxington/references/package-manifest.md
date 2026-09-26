# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `mbx` (crate) / `mr-boxington` (mise tool) |
| Registry | `crates.io` / `GitHub Releases` / `mise` |
| Latest Version | `1.18.0` |
| Release Date | `2026-09-25` |
| Verified | `2026-09-26` (date this file was last checked) |
| Author / Publisher | `jdx` |
| License | `MIT` |
| Repository | `https://github.com/jdx/mr-boxington` |
| Website | `https://mr-boxington.jdx.dev` |
| Documentation | `https://mr-boxington.jdx.dev/getting-started` |
| Releases / Changelog | `https://github.com/jdx/mr-boxington/releases` |

## Install

```bash
mise use --global --tool-option mr_boxington=true rust mr-boxington  # mise >=2026.9.2 (recommended)
cargo install mbx --locked                                          # crates.io
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `jdx/mr-boxington-action` | GitHub Actions | `v1` | CI cache action — owns its input reference |
| `mise` | GitHub Releases | `>=2026.9.2` | Native `mr_boxington` Rust tool option — see `/follow-tool-mise` |
| Rust toolchain (`rust`/`cargo`) | rustup/mise | — | Prerequisite — mbx wraps the active Cargo/rustc pair |

## Notes

- ชื่อแยกกัน: binary/crate = `mbx`, mise tool/registry key = `mr-boxington`, site/repo = `mr-boxington`
- v1.18.0: new checkouts seed dependency build units จาก managed target ของ checkout อื่น (Cargo ≥1.100) และ live target dirs ถูก prune
- Windows archives มีทั้ง x86-64 และ ARM64 (zip); Linux มี gnu + musl static builds
