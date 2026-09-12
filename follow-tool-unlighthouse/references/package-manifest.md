# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@unlighthouse/cli` |
| Registry | `npm` |
| Latest Version | `0.18.0` |
| Release Date | `2026-06-29` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Harlan Wilton (harlan-zw)` |
| License | `MIT` |
| Repository | `<https://github.com/harlan-zw/unlighthouse>` |
| Website | `<https://unlighthouse.dev>` |
| Documentation | `<https://unlighthouse.dev>` |
| Releases / Changelog | `<https://github.com/harlan-zw/unlighthouse/releases>` |

## Install

```bash
bunx unlighthouse --site http://localhost:3000   # provides unlighthouse + unlighthouse-ci bins
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `unlighthouse` | `npm` | `0.18.0` | Core library / programmatic API (CLI depends on it) |

## Notes

- Breaking changes in latest major: `0.x line; v0.18.0 requires Node.js >= 22.18.0 (engines)`
- Version pinned in SKILL.md: `0.18.0`
