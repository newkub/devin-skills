# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@iconify/react` (framework component; framework-agnostic entry is `iconify-icon`) |
| Registry | `npm` |
| Latest Version | `6.0.2` |
| Release Date | `2025-09-15` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Vjacheslav Trushkin (Iconify)` |
| License | `MIT` |
| Repository | `https://github.com/iconify/iconify` |
| Website | `https://iconify.design` |
| Documentation | `https://iconify.design/docs/` |
| Releases / Changelog | `https://github.com/iconify/iconify/releases` |

## Install

```bash
bun add @iconify/react
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@iconify/vue` | `npm` | `5.0.1` | Vue component |
| `iconify-icon` | `npm` | `3.0.2` | Framework-agnostic web component |
| `@iconify/tailwind` | `npm` | `1.2.0` | Tailwind CSS plugin (dynamic icon classes) |
| `@iconify/utils` | `npm` | `3.1.7` | Utilities to generate/convert icon data |
| `@iconify-json/<set>` | `npm` | `per-set` | Offline icon data sets (mdi, lucide, tabler, …) — versioned per set |

## Notes

- Breaking changes in latest major: `per-component majors — @iconify/react v6 requires React 18+/ESM; iconify-icon v3 renamed attributes vs iconify web component v1`
- Version pinned in SKILL.md: `@iconify/react@6.0.2`, `@iconify/vue@5.0.1`, `iconify-icon@3.0.2`, `@iconify/tailwind@1.2.0`
