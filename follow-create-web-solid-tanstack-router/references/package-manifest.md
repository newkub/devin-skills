# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@tanstack/solid-start` |
| Registry | `npm` |
| Latest Version | `1.168.50` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | TanStack (Tanner Linsley) |
| License | `MIT` |
| Repository | `https://github.com/TanStack/router` |
| Website | `https://tanstack.com/start` |
| Documentation | `https://tanstack.com/start/latest` |
| Releases / Changelog | `https://github.com/TanStack/router/releases` |

## Install

```bash
bun i @tanstack/solid-start @tanstack/solid-router solid-js
bun i -D vite vite-plugin-solid typescript @types/node
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@tanstack/solid-router` | `npm` | `1.170.33` (2026-09-10) | Type-safe routing — required peer of Start |
| `solid-js` | `npm` | `1.9.15` (2026-08-17) | UI framework — Start requires `solid-js >=1.0.0` |
| `vite` | `npm` | `8.3.0` (2026-09-10) | Build tool — Start requires `vite >=7.0.0` |
| `vite-plugin-solid` | `npm` | `unknown` | Solid JSX transform — `ssr: true`, must come after `tanstackStart()` |
| `unocss` | `npm` | `unknown` | Styling via `unocss/vite` — see `/follow-lib-unocss` |
| `nitro` | `npm` | `3.0.260903-beta` (2026-09-03) | Optional portable production server output (`.output/server/index.mjs`) |
| `zod` | `npm` | `unknown` | Optional input validation for server functions |
| `@tanstack/cli` | `npm` | `unknown` | Scaffolding CLI — `npx @tanstack/cli@latest create --framework solid` |

## Notes

- Breaking changes in latest major: TanStack Start reached 1.x stable; server functions use `createServerFn` + `.validator()` + `.handler()`; `src/server.ts` is a reserved filename for custom server entries
- Version pinned in SKILL.md: `@tanstack/solid-start@1.168.50`, `@tanstack/solid-router@1.170.33` — both match latest as of 2026-09-12
- Maturity rule: `DB`, `Store`, `Pacer`, `AI` are 0.x/RC — no adoption without justification
