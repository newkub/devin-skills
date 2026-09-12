# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `vite` |
| Registry | `npm` |
| Latest Version | `8.3.0` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Evan You / Vite contributors (VoidZero)` |
| License | `MIT` |
| Repository | `https://github.com/vitejs/vite` |
| Website | `https://vite.dev` |
| Documentation | `https://vite.dev/guide/api-plugin` |
| Releases / Changelog | `https://github.com/vitejs/vite/releases` |

## Install

```bash
bun add -D vite
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `rolldown` | `npm` | `1.2.8` (2026-09-09) | Default bundler inside Vite 8.x |
| `typescript` | `npm` | `7.0.2` (2026-07-08) | Type-checking for plugin sources |

## Notes

- Breaking changes in latest major: Vite 8 defaults to Rolldown; universal hooks are per-environment (`this.environment`); prefer `hotUpdate` over `handleHotUpdate` (planned deprecation)
- Version pinned in SKILL.md: `vite@8.3.0`
