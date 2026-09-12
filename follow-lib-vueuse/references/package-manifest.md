# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@vueuse/core` |
| Registry | `npm` |
| Latest Version | `14.4.0` |
| Release Date | `2026-07-29` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `VueUse team (Anthony Fu et al.)` |
| License | `MIT` |
| Repository | `<https://github.com/vueuse/vueuse>` |
| Website | `<https://vueuse.org>` |
| Documentation | `<https://vueuse.org/functions>` |
| Releases / Changelog | `<https://github.com/vueuse/vueuse/releases>` |

## Install

```bash
bun add @vueuse/core
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@vueuse/nuxt` | `npm` | `14.4.0` | Nuxt module with auto-imports; released 2026-07-29 |

## Notes

- Breaking changes in latest major: v14 requires Vue 3.5+; migrated to `tsdown` (dist file locations changed); `watchPausable`/`computedEager` deprecated; alias exports deprecated
- Version pinned in SKILL.md: `@vueuse/core@14.4.0`
