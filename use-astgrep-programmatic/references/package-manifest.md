# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@ast-grep/napi` |
| Registry | `npm` |
| Latest Version | `0.45.3` |
| Release Date | `2026-08-31` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `ast-grep` (Herrington Darkholme) |
| License | `MIT` |
| Repository | `https://github.com/ast-grep/ast-grep` |
| Website | `https://ast-grep.github.io` |
| Documentation | `https://ast-grep.github.io/guide/api-usage.html` |
| Releases / Changelog | `https://github.com/ast-grep/ast-grep/releases` |

## Install

```bash
bun add -D @ast-grep/napi
```

Native Node-API module — must be installed for real; cannot be imported via esm.sh.

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@ast-grep/cli` | `npm` | `0.45.3` (2026-08-31) | CLI used via `Bun.$` wrapper for batch scans |
| `bun` | `npm` | `1.4.2` (2026-09-05) | Runtime for the scripts (see `use-bun-native-api`) |

## Notes

- Breaking changes in latest major: `none`
- Version pinned in SKILL.md: `0.45.3 (verified 2026-09-12)` for both `@ast-grep/cli` and `@ast-grep/napi` — matches latest
