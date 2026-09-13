# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `elysia` |
| Registry | `npm` |
| Latest Version | `1.4.30` |
| Release Date | `2026-08-26` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `saltyAom (ElysiaJS)` |
| License | `MIT` |
| Repository | `https://github.com/elysiajs/elysia` |
| Website | `https://elysiajs.com` |
| Documentation | `https://elysiajs.com` |
| Releases / Changelog | `https://github.com/elysiajs/elysia/releases` |

## Install

```bash
bun add elysia
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@elysia/eden` | `npm` | `1.4.10` | Type-safe client (`treaty<App>()`, `edenFetch`) |
| `@elysia/openapi` | `npm` | `1.4.16` | OpenAPI spec + docs UI plugin |
| `elysia@next` | `npm` | `2.0.0-beta.14` | v2.0 "DayDream" beta — hooks renamed (`on*` → bare), `resolve` → `derive`, RFC 9457 `problem`, WS opt-in |

## Notes

- Breaking changes in latest major: `v2.0 beta drops on- prefix from lifecycle hooks, route hooks/schemas must precede handler, as:'scoped' → 'plugin', WebSocket becomes opt-in plugin`
- Version pinned in SKILL.md: `elysia@1.4.30`, `@elysia/eden@1.4.10`, `@elysia/openapi@1.4.16`
