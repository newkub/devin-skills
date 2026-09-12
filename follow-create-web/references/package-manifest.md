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
| Author / Publisher | Vite team (VoidZero / Evan You) |
| License | `MIT` |
| Repository | `https://github.com/vitejs/vite` |
| Website | `https://vite.dev` |
| Documentation | `https://vite.dev/guide/` |
| Releases / Changelog | `https://github.com/vitejs/vite/releases` |

## Install

```bash
bun create vite@latest <project-name>
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `solid-js` | `npm` | `1.9.15` (2026-08-17) | Default UI framework for this skill's landing/saas/paas stack |
| `@tanstack/solid-start` | `npm` | `1.168.50` (2026-09-10) | Default full-stack framework — delegates to `/follow-create-web-solid-tanstack-router` |
| `unocss` | `npm` | `unknown` | Default styling engine — see `/follow-lib-unocss` |

## Notes

- Breaking changes in latest major: Vite 8 is Rolldown-powered (Rust bundler replaces Rollup+esbuild pipeline)
- Version pinned in SKILL.md: `vite@8.3.0` — matches latest as of 2026-09-12
- This skill is a router/delegator — actual scaffolding happens in `follow-create-web-*` sub-skills
