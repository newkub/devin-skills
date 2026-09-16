# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `aube` |
| Registry | `GitHub Releases` / `crates.io` |
| Latest Version | `2.2.15` |
| Release Date | `2026-09-13` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `jdx / aubepkg` |
| License | `MIT` |
| Repository | `https://github.com/aubepkg/aube` |
| Website | `https://aube.jdx.dev` |
| Documentation | `https://aube.jdx.dev` |
| Releases / Changelog | `https://github.com/aubepkg/aube/releases` |

## Install

```bash
mise use -g aube   # or: cargo install aube --locked / brew install jdx/tap/aube / npm i -g @endevco/aube
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@endevco/aube` | `npm` | `2.2.4` (2026-08-31) | npm wrapper/bin — lags the Rust crate; repo metadata points to `github.com/jdx/aube` |

## Notes

- Breaking changes in latest major: `none known (2.x stable)`
- Version pinned in SKILL.md: `aube@2.2.17` / `@endevco/aube@2.2.4`
- GitHub releases ship as `vX.Y.Z`; crates.io `aube` and GitHub `aubepkg/aube` are the canonical latest sources
