# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/review-release` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `devframe` |
| Registry | `npm` |
| Latest Version | `1.0.0` |
| Release Date | `2026-09-16` |
| Verified | `2026-09-18` (date this file was last checked) |
| Author / Publisher | `Anthony Fu (antfu)` |
| License | `MIT` |
| Repository | `https://github.com/devframes/devframe` |
| Website | `https://devfra.me` |
| Documentation | `https://devfra.me/guide` (raw markdown at `https://devfra.me/raw/*.md`) |
| Releases / Changelog | `https://github.com/devframes/devframe/releases` |

## Install

```bash
bun add devframe
bun add cac          # optional peer — required only by devframe/adapters/cac
bun add valibot      # or zod — any Standard Schema validator
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@devframes/hub` | `npm` | `1.0.0` | Headless multi-devframe orchestration (`initHub`) |
| `@devframes/hub-ui` | `npm` | `1.0.0` | Reference hub UI provider (`createUi`) |
| `@devframes/vite` | `npm` | `1.0.0` | Vite kit — `/single`, `/hub` subpaths |
| `@devframes/nuxt` | `npm` | `1.0.0` | Nuxt kit — `/single`, `/hub` subpaths |
| `@devframes/next` | `npm` | `1.0.0` | Next.js App Router route handler host |
| `@devframes/json-render` | `npm` | `1.0.0` | Opt-in data-driven UI spec |
| `@vitejs/devtools-kit` | `npm` | `0.7.5` | Vite DevTools plugin adapter (`createPluginFromDevframe`) |
| `cac` | `npm` | `7.0.0` | Optional peer for CLI adapter |

## Notes

- `devframe` ships ESM-only, zero Vite dependency.
- Optional peers surfaced at import time: `cac` (CLI adapter), `@modelcontextprotocol/client`.
- Version pinned in SKILL.md: `devframe@1.0.0`.
- Peer ranges in 0.9.x lockfiles pin exact `devframe` versions — when upgrading, align `@devframes/*` packages to the same minor.
