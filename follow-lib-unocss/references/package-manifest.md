# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `unocss` |
| Registry | `npm` |
| Latest Version | `66.10.4` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Anthony Fu (antfu)` |
| License | `MIT` |
| Repository | `<https://github.com/unocss/unocss>` |
| Website | `<https://unocss.dev>` |
| Documentation | `<https://unocss.dev/guide/>` |
| Releases / Changelog | `<https://github.com/unocss/unocss/releases>` |

## Install

```bash
bun add -D unocss
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@unocss/preset-wind4` | `npm` | `66.10.4` | Default Tailwind-Wind4 preset; released 2026-09-11 |
| `@unocss/postcss` | `npm` | `66.10.4` | PostCSS plugin for Next.js integration |
| `@unocss/nuxt` | `npm` | `66.10.4` | Nuxt module |
| `@unocss/astro` | `npm` | `66.10.4` | Astro integration |
| `@unocss/cli` | `npm` | `66.10.4` | Standalone CLI (`unocss --watch`) |
| `@unocss/runtime` | `npm` | `66.10.4` | CDN/browser runtime |
| `@unocss/reset` | `npm` | `66.10.4` | Optional CSS resets (prefer `preflights.reset` in presetWind4) |
| `@iconify-json/mdi` | `npm` | `1.2.3` | Iconify collection for `presetIcons`; released 2025-01-20 |

## Notes

- Breaking changes in latest major: presetWind4 theme keys renamed vs wind3 (`font`, `radius`, `shadow`, `breakpoint`, `ease`, `property`, `spacing`) — see SKILL.md migration section
- Version pinned in SKILL.md: `unocss@66.10.4`
