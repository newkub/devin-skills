# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `mise` |
| Registry | `GitHub Releases` (`jdx/mise`) |
| Latest Version | `2026.9.5` (CalVer) |
| Release Date | `2026-09-10` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `jdx (Jeff Dickey)` |
| License | `MIT` |
| Repository | `https://github.com/jdx/mise` |
| Website | `https://mise.jdx.dev` |
| Documentation | `https://mise.jdx.dev` |
| Releases / Changelog | `https://github.com/jdx/mise/releases` |

## Install

```bash
curl https://mise.run | sh   # or: winget install jdx.mise / scoop install mise / cargo install mise
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `mise` | `crates.io` | `2026.9.5` (2026-09-10) | Same release via `cargo install mise` |

## Notes

- Breaking changes in latest major: `none observed`
- Version pinned in SKILL.md: `mise@2026.9.5`
- mise uses CalVer (`YYYY.M.D`), not SemVer
