# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `vue` |
| Registry | `npm` |
| Latest Version | `3.5.42` |
| Release Date | `2026-08-27` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Evan You (yyx990803)` |
| License | `MIT` |
| Repository | `<https://github.com/vuejs/core>` |
| Website | `<https://vuejs.org>` |
| Documentation | `<https://vuejs.org/guide/>` |
| Releases / Changelog | `<https://github.com/vuejs/core/releases>` |

## Install

```bash
bun add vue && bun add vue-router pinia
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `vue-router` | `npm` | `5.3.1` | Official router; released 2026-09-02 |
| `pinia` | `npm` | `4.0.3` | Official state management; released 2026-08-12 |
| `vite` | `npm` | `8.3.0` | Build tool (dev dependency); released 2026-09-10 |
| `nuxt` | `npm` | `4.5.2` | Full-stack framework option; released 2026-08-05 |

## Notes

- Breaking changes in latest major: Vue 3.6 still in RC (`3.6.0-rc.x`) — adds Vapor Mode; not stable for production
- Version pinned in SKILL.md: `vue@3.5.42` / `vue-router@5.3.1` / `pinia@4.0.3` / `vite@8.3.0` / `nuxt@4.5.2`
