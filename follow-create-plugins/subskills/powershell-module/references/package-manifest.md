# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `PowerShell` (`pwsh`) |
| Registry | `GitHub Releases` |
| Latest Version | `7.6.6` (LTS, .NET 10; tag `v7.6.6`) |
| Release Date | `2026-09-08` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Microsoft (PowerShell org)` |
| License | `MIT` |
| Repository | `<https://github.com/PowerShell/PowerShell>` |
| Website | `<https://learn.microsoft.com/powershell>` |
| Documentation | `<https://learn.microsoft.com/powershell/scripting/overview>` |
| Releases / Changelog | `<https://github.com/PowerShell/PowerShell/releases>` |

## Install

```powershell
mise use -g powershell   # preferred global install per tech-stack rules
# or: winget install Microsoft.PowerShell
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `Pester` | `GitHub Releases` / PSGallery | `6.2.0` (2026-09-09) | test framework — `Install-Module Pester -Scope CurrentUser` |
| `PSScriptAnalyzer` | `GitHub Releases` / PSGallery | `1.25.0` (2026-03-20) | lint — `Invoke-ScriptAnalyzer` |

## Notes

- Breaking changes in latest major: `target pwsh 7.6+ (LTS); do not target Windows PowerShell 5.1`
- Version pinned in SKILL.md: `PowerShell 7.6.6` (updated from 7.6.5), preview `7.7` (verified 2026-09-12)

