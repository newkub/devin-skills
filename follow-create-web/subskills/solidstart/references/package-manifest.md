# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@solidjs/start` |
| Registry | `npm` |
| Latest Version | `2.0.5` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | SolidJS team (Ryan Carniato) |
| License | `MIT` |
| Repository | `https://github.com/solidjs/solid-start` |
| Website | `https://docs.solidjs.com/solid-start` |
| Documentation | `https://docs.solidjs.com/solid-start` |
| Releases / Changelog | `https://github.com/solidjs/solid-start/releases` |

## Install

```bash
bun add @solidjs/start @solidjs/router @solidjs/meta solid-js nitro vite
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `solid-js` | `npm` | `1.9.15` (2026-08-17) | Core UI framework — see `/follow-lib-solidjs` |
| `@solidjs/router` | `npm` | `1.0.0` (2026-07-28) | File-based routing (`FileRoutes`) — 1.x stable |
| `@solidjs/meta` | `npm` | `0.29.4` (2024-05-15) | `MetaProvider`/`Title` — still 0.x, latest published 2024 |
| `nitro` | `npm` | `3.0.260903-beta` (2026-09-03) | Server engine — `nitro/vite` plugin; npm `latest` dist-tag currently points to a 3.x beta |
| `vite` | `npm` | `8.3.0` (2026-09-10) | Build tool driving dev server and `vite build` |

## Notes

- Breaking changes in latest major: `@solidjs/start` v2 is stable (no more `@alpha`) and runs SSR through `nitro/vite` instead of Vinxi; `src/entry-server.tsx` uses `createHandler` + `StartServer`; `src/entry-client.tsx` uses `mount` + `StartClient`; `// @refresh reload` required on both entries
- `nitro` `latest` tag resolves to `3.0.260903-beta` — pin explicitly if a stable release is required
- Version pinned in SKILL.md: `@solidjs/start@2.0.5`, `@solidjs/router@1.0.0`, `@solidjs/meta@0.29.4`, `solid-js@1.9.15`, `nitro@3.x` — all match latest as of 2026-09-12

