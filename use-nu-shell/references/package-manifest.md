# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `nu` (Nushell) |
| Registry | `crates.io` |
| Latest Version | `0.115.1` |
| Release Date | `2026-08-23` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `nushell` |
| License | `MIT` |
| Repository | `https://github.com/nushell/nushell` |
| Website | `https://www.nushell.sh` |
| Documentation | `https://www.nushell.sh/book/` |
| Releases / Changelog | `https://github.com/nushell/nushell/releases` |

## Install

```bash
winget install --id Nushell.Nushell
```

Or `cargo install nu` / `brew install nushell` / `mise use -g nu`.

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `pwsh` | `GitHub Releases` | `7.6.6` (2026-09-08) | Documented fallback shell when `nu` is unavailable |

## Notes

- Breaking changes in latest major: `0.115 reworks YAML support, adds $ans REPL variable and Helix-style editing; into filesize / into duration removed — use literals like 10kb / 5min or into value`
- Version pinned in SKILL.md: `0.115.1 (verified 2026-09-12)` — matches latest
