# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `usage-cli` (bin: `usage`) |
| Registry | `crates.io` |
| Latest Version | `6.9.0` |
| Release Date | `2026-09-12` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `jdx (Jeff Dickey)` |
| License | `MIT` |
| Repository | `<https://github.com/jdx/usage>` |
| Website | `<https://usage.jdx.dev>` |
| Documentation | `<https://usage.jdx.dev>` |
| Releases / Changelog | `<https://github.com/jdx/usage/releases>` |

## Install

```bash
mise use -g usage   # or: cargo install usage-cli | brew install usage
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `usage` | `Homebrew` | `6.9.0` | Same release train; brew formula name is `usage` |

## Notes

- Breaking changes in latest major: `6.x — min_usage_version "6.x" pin recommended in spec; clause support requires usage >= 6.5`
- Version pinned in SKILL.md: `6.9.0` (updated from 6.8.0 on 2026-09-12)
