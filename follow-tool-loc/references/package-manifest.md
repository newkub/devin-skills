# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `loc` |
| Registry | `crates.io` |
| Latest Version | `0.5.0` |
| Release Date | `2018-08-23` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `cgag` (Curtis Gagliardi) |
| License | `MIT` |
| Repository | `https://github.com/cgag/loc` |
| Website | `https://github.com/cgag/loc` |
| Documentation | `https://github.com/cgag/loc` |
| Releases / Changelog | `https://github.com/cgag/loc/releases` |

## Install

```bash
cargo install loc
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `loc` | `npm` | `0.6.1` | Different project — Node-based LOC counter; do not confuse with the Rust crate |
| `tokei` | `crates.io` | — | Maintained alternative (Rust), more language coverage |
| `scc` | `system` | — | Maintained alternative (Go), complexity + cost estimates |

## Notes

- Breaking changes in latest major: `none — last release 2018, tool is dormant/stable`
- Version pinned in SKILL.md: `loc@0.5.0`
- Source: `https://crates.io/api/v1/crates/loc`
