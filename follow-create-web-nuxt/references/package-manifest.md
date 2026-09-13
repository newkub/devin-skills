# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `nuxt` |
| Registry | `npm` |
| Latest Version | `4.5.2` |
| Release Date | `2026-08-05` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Nuxt team (nuxt) |
| License | `MIT` |
| Repository | `https://github.com/nuxt/nuxt` |
| Website | `https://nuxt.com` |
| Documentation | `https://nuxt.com/docs` |
| Releases / Changelog | `https://github.com/nuxt/nuxt/releases` |

## Install

```bash
bunx nuxi@latest init <project-name>
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `nuxi` | `npm` | `3.37.0` (2026-07-14) | Nuxt CLI for scaffolding and dev/build commands |
| `@nuxt/ui` | `npm` | `4.11.1` (2026-09-07) | Official UI component library |
| `@nuxt/icon` | `npm` | `unknown` | Icon module — use `mdi` preset per skill rules |
| `nitro` (`nitropack`) | `npm` | `3.0.260903-beta` (2026-09-03) | Server engine bundled by Nuxt 4 |
| `vue` | `npm` | `unknown` | Peer — see `/follow-lib-vue` |

## Notes

- Breaking changes in latest major: Nuxt 4 uses `app/` directory by default, new data-fetching semantics, and requires opting into Nuxt 4 defaults; Nuxt 3 is EOL July 2026 — new projects must use Nuxt 4
- Version pinned in SKILL.md: `nuxt@4.5.2`, `@nuxt/ui@4.11.1`, `nuxi@3.37.0` — all match latest as of 2026-09-12
