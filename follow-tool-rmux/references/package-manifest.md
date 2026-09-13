# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `rmux` |
| Registry | `crates.io` |
| Latest Version | `0.10.0` |
| Release Date | `2026-08-05` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Helvesec` |
| License | `unknown` (not declared on crates.io) |
| Repository | `https://github.com/Helvesec/rmux` |
| Website | `https://rmux.io` |
| Documentation | `https://rmux.io` |
| Releases / Changelog | `https://github.com/Helvesec/rmux/releases` |

## Install

```bash
cargo install rmux --locked   # or: mise use -g rmux / brew install rmux / winget install rmux
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@rmux/sdk` | `npm` | `0.6.5` (2026-06-18) | TypeScript SDK (`Helvesec/rmux-typescript`) |
| `rmux-sdk` | `crates.io` | `0.10.0` (2026-08-05) | Rust typed async SDK |
| `librmux` | `PyPI` | `0.6.1` (2026-06-19) | Python SDK |

## Notes

- Breaking changes in latest major: `none observed` (pre-1.0 — minor bumps may break)
- Version pinned in SKILL.md: `rmux@0.10.0`
