# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `dioxus-cli` |
| Registry | `crates.io` |
| Latest Version | `0.7.10` (stable; newest is `0.8.0-alpha.1` pre-release) |
| Release Date | `2026-07-30` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `DioxusLabs` |
| License | `MIT OR Apache-2.0` |
| Repository | `https://github.com/DioxusLabs/dioxus` |
| Website | `https://dioxuslabs.com` |
| Documentation | `https://dioxuslabs.com/learn` |
| Releases / Changelog | `https://github.com/DioxusLabs/dioxus/releases` |

## Install

```bash
cargo binstall dioxus-cli --force   # or: cargo install dioxus-cli / curl -sSL https://dioxus.dev/install.sh | bash
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `dioxus` | `crates.io` | `0.7.10` (2026-07-30; `0.8.0-alpha.1` pre-release 2026-07-31) | Core framework crate for `Cargo.toml` |

## Notes

- Breaking changes in latest major: 0.7.x is the stable line; 0.8.0-alpha.1 is a pre-release — do not adopt without checking migration notes.
- Version pinned in SKILL.md: `dioxus@0.7.10` / `dioxus-cli@0.7.10`
