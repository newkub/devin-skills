# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `pwsh` (PowerShell) |
| Registry | `GitHub Releases` |
| Latest Version | `7.6.6` |
| Release Date | `2026-09-08` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `PowerShell` (Microsoft) |
| License | `MIT` |
| Repository | `https://github.com/PowerShell/PowerShell` |
| Website | `https://learn.microsoft.com/powershell/` |
| Documentation | `https://learn.microsoft.com/powershell/scripting/overview` |
| Releases / Changelog | `https://github.com/PowerShell/PowerShell/releases` |

## Install

```bash
winget install --id Microsoft.PowerShell
```

Or `brew install --cask powershell` / distro package on Linux.

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `powershell` (Windows PowerShell 5.1) | `system` | `5.1` | Legacy inbox Windows shell — separate product, fallback only |
| `nu` | `crates.io` | `0.115.1` (2026-08-23) | Alternative structured-data shell (see `use-nu-shell`) |

## Notes

- Breaking changes in latest major: `none — 7.6.x is a stable servicing line`
- Version pinned in SKILL.md: `none` — SKILL.md carries no version marker
