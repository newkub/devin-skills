# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `pinia` |
| Registry | `npm` |
| Latest Version | `4.0.3` |
| Release Date | `2026-08-12` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Eduardo San Martin Morote` |
| License | `MIT` |
| Repository | `https://github.com/vuejs/pinia` |
| Website | `https://pinia.vuejs.org` |
| Documentation | `https://pinia.vuejs.org` |
| Releases / Changelog | `https://github.com/vuejs/pinia/releases` |

## Install

```bash
bun add pinia @vue/devtools-api
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@vue/devtools-api` | `npm` | `8.2.1` | Required peer dependency in Pinia v4 |
| `@pinia/nuxt` | `npm` | `1.0.2` | Nuxt 3/4 module integration |
| `pinia-plugin-persistedstate` | `npm` | `4.7.1` | Optional persistence plugin |

## Notes

- Breaking changes in latest major: `v4 is ESM-only; @vue/devtools-api must be installed manually; defineStore({id}) and PiniaStorePlugin removed`
- Version pinned in SKILL.md: `pinia@4.0.3` / `@pinia/nuxt@1.0.2` / `pinia-plugin-persistedstate@4.7.1`
