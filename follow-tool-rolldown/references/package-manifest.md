# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `rolldown` |
| Registry | `npm` |
| Latest Version | `1.2.8` |
| Release Date | `2026-09-09` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Rolldown team` / VoidZero (rolldown org) |
| License | `MIT` |
| Repository | `https://github.com/rolldown/rolldown` |
| Website | `https://rolldown.rs/` |
| Documentation | `https://rolldown.rs/` |
| Releases / Changelog | `https://github.com/rolldown/rolldown/releases` |

## Install

```bash
bun add -D rolldown
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `rolldown-plugin-dts` | `npm` | `0.28.5` | Generate `.d.ts` type definitions during Rolldown builds |
| `@rolldown/plugin-commonjs` | `npm` | — | Official CommonJS interop plugin |
| `@rolldown/plugin-node-resolve` | `npm` | — | Official node_modules resolution plugin |
| `@rolldown/plugin-terser` | `npm` | — | Official minification plugin |

## Notes

- Breaking changes in latest major: `1.0 stable shipped May 2026 — stable API; default bundler of Vite 8; requires Node.js ^20.19.0 || >=22.12.0`
- Version pinned in SKILL.md: `rolldown@1.2.8`
- Source: `https://registry.npmjs.org/rolldown`
