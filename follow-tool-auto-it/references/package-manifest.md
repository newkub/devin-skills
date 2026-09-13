# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `auto` |
| Registry | `npm` |
| Latest Version | `11.3.6` |
| Release Date | `2025-11-14` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Intuit` |
| License | `MIT` |
| Repository | `https://github.com/intuit/auto` |
| Website | `https://intuit.github.io/auto` |
| Documentation | `https://intuit.github.io/auto/docs` |
| Releases / Changelog | `https://github.com/intuit/auto/releases` |

## Install

```bash
bun add -D auto
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@auto-it/core` | `npm` | `11.3.6` (2025-11-14) | Programmatic API; shipped in lockstep with `auto` CLI |
| `@auto-it/released` | `npm` | `11.3.6` | Released plugin — bundled with `auto`, no separate install needed |

## Notes

- Breaking changes in latest major: `v11 — see https://github.com/intuit/auto/releases (Node version bumps, plugin API)`
- Version pinned in SKILL.md: `auto@11.3.6`
