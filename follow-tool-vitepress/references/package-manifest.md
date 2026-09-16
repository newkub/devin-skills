# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `vitepress` |
| Registry | `npm` |
| Latest Version | `1.6.4` |
| Release Date | `2025-08-05` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Vue.js team (vuejs)` |
| License | `MIT` |
| Repository | `<https://github.com/vuejs/vitepress>` |
| Website | `<https://vitepress.dev>` |
| Documentation | `<https://vitepress.dev/guide/what-is-vitepress>` |
| Releases / Changelog | `<https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md>` |

## Install

```bash
bun add -D vitepress
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `unocss` | `npm` | `66.10.4` | Atomic CSS integration (`presetWind4`, `presetIcons`) |
| `@shikijs/vitepress-twoslash` | `npm` | `4.4.3` | Type-hover code blocks |
| `vitepress-plugin-group-icons` | `npm` | `1.7.6` | Icon groups for code/file trees |

## Notes

- Breaking changes in latest major: `stable line is 1.x; v2.0.0-alpha.20 (2026-09-04) is the next-channel preview built for Vite 8/rolldown`
- Version pinned in SKILL.md: `1.6.4` stable; `next` = `2.0.0-alpha.20` (updated from alpha.19 on 2026-09-12)
