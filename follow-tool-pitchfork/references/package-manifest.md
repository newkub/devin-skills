# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `pitchfork-cli` |
| Registry | `crates.io` |
| Latest Version | `2.25.0` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `jdx` (Jeff Dickey) |
| License | `MIT` |
| Repository | `https://github.com/jdx/pitchfork` |
| Website | `https://pitchfork.jdx.dev` |
| Documentation | `https://pitchfork.jdx.dev` |
| Releases / Changelog | `https://github.com/jdx/pitchfork/releases` |

## Install

```bash
mise use -g pitchfork
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| — | — | — | Crate name is `pitchfork-cli` but the binary/command is `pitchfork`; also installable via `cargo install pitchfork-cli --locked` or GitHub release binaries |

## Notes

- Breaking changes in latest major: `2.x — check release notes when upgrading across minor versions (config keys deprecated: expected_port, auto_bump_port, port_bump_attempts)`
- Version pinned in SKILL.md: `pitchfork@2.25.0`
- Requires Rust toolchain `>=1.91` if building from source (crate `rust_version`)
- Source: `https://crates.io/api/v1/crates/pitchfork-cli`
