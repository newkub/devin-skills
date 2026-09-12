# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `vite` |
| Registry | `npm` |
| Latest Version | `8.3.0` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `VoidZero / vitejs` |
| License | `MIT` |
| Repository | `<https://github.com/vitejs/vite>` |
| Website | `<https://vite.dev>` |
| Documentation | `<https://vite.dev/guide/>` |
| Releases / Changelog | `<https://github.com/vitejs/vite/releases>` |

## Install

```bash
bun add -D vite
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `rolldown` | `npm` | `1.2.8` | Underlying bundler in Vite 8 — bundled internally, not installed separately |
| `rolldown-vite` | `npm` | `n/a` | Migration bridge package for Vite 7 users moving to Rolldown |

## Notes

- Breaking changes in latest major: `v8 — Rolldown is the only bundler (Oxc for transform/minify); esbuild option deprecated, use oxc; optimizeDeps.rolldownOptions replaces esbuildOptions; requires Node.js >=20.19 or >=22.12`
- Version pinned in SKILL.md: `8.3.0`
