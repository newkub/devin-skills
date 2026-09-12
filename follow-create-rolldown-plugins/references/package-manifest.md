# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `rolldown` |
| Registry | `npm` |
| Latest Version | `1.2.8` |
| Release Date | `2026-09-09` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Rolldown contributors (VoidZero)` |
| License | `MIT` |
| Repository | `https://github.com/rolldown/rolldown` |
| Website | `https://rolldown.rs/` |
| Documentation | `https://rolldown.rs/apis/plugin-api` |
| Releases / Changelog | `https://github.com/rolldown/rolldown/releases` |

## Install

```bash
bun add -D rolldown
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `vite` | `npm` | `8.3.0` (2026-09-10) | Vite 8.x uses Rolldown as default bundler |
| `tsdown` | `npm` | `0.23.0` (2026-09-03) | Recommended build tool for plugin packages (Rolldown-powered) |

## Notes

- Breaking changes in latest major: Rolldown 1.x stabilised the plugin API incl. hook filters (`rolldown/filter` helpers `exactRegex`, `prefixRegex`); plugins should external `rolldown`/`vite`
- Version pinned in SKILL.md: `rolldown@1.2.8`, `vite@8.3.0`
