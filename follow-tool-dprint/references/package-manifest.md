# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `dprint` |
| Registry | `npm` |
| Latest Version | `0.57.4` |
| Release Date | `2026-09-05` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `David Sherret / dprint` |
| License | `MIT` |
| Repository | `https://github.com/dprint/dprint` |
| Website | `https://dprint.dev` |
| Documentation | `https://dprint.dev/setup/` |
| Releases / Changelog | `https://github.com/dprint/dprint/releases` |

## Install

```bash
bun add -D dprint
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@dprint/typescript` | `npm` | `0.96.1` | Pinned in `dprint.json` plugins (`npm:` scheme, required since dprint 0.56.0) |
| `@dprint/json` | `npm` | `0.23.0` | Pinned in `dprint.json` plugins |
| `@dprint/markdown` | `npm` | `0.24.0` | Pinned in `dprint.json` plugins |
| `@dprint/toml` | `npm` | `0.8.0` | Pinned in `dprint.json` plugins |
| `dprint-plugin-yaml` | `npm` | `0.6.0` | Pinned in `dprint.json` plugins |
| `@dprint/dockerfile` | `npm` | `0.6.0` | Pinned in `dprint.json` plugins |
| `dprint-plugin-malva` | `npm` | `0.16.0` | CSS/SCSS/Less plugin |
| `dprint-plugin-markup` | `npm` | `0.27.3` | HTML/Vue/Svelte/Astro plugin |
| `@dprint/ruff` | `npm` | `0.8.7` | Python plugin |
| `@jakebailey/dprint-plugin-gofumpt` | `npm` | `0.0.18` | Go plugin |
| `@dprint/mago` | `npm` | `0.26.1` | PHP plugin |

## Notes

- Breaking changes in latest major: `0.56.0+ recommends plugins via npm registry (\`npm:@dprint/...\`) instead of plugin URLs`
- Version pinned in SKILL.md: `0.57.4`
- Plugin versions in `dprint.json` are pinned — update with `dprint config update`
