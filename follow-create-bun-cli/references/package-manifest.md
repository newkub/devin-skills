# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `bun` |
| Registry | `GitHub Releases` (`oven-sh/bun`) |
| Latest Version | `1.4.2` (`bun-v1.4.2`) |
| Release Date | `2026-09-05` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Oven (Anthropic-backed Bun team)` |
| License | `MIT` |
| Repository | `https://github.com/oven-sh/bun` |
| Website | `https://bun.sh` |
| Documentation | `https://bun.sh/docs` |
| Releases / Changelog | `https://github.com/oven-sh/bun/releases` |

## Install

```bash
curl -fsSL https://bun.sh/install | bash   # or: mise use -g bun / powershell -c "irm bun.sh/install.ps1 | iex"
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `cac` | `npm` | `7.0.0` (2026-02-27) | CLI arg parsing — ESM-only, `cli.on` -> `cli.addEventListener` |
| `picocolors` | `npm` | `1.1.1` (2024-10-16) | Terminal colors (preferred over `chalk`) |
| `bunup` | `npm` | `0.16.32` (2026-06-01) | Library bundler for builds (`bunx bunup`) |

## Notes

- Breaking changes in latest major: Bun 1.x is stable; `cac` v7 is ESM-only and requires Node >=20.19 / Bun.
- Version pinned in SKILL.md: Bun `1.4.2`, `cac@7.0.0`, `picocolors@1.1.1`, `bunup@0.16.32`
