# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `edge.js` |
| Registry | `npm` |
| Latest Version | `6.5.1` |
| Release Date | `2026-05-21` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Harminder Virk (AdonisJS)` |
| License | `MIT` |
| Repository | `https://github.com/edge-js/edge` |
| Website | `https://edgejs.dev` |
| Documentation | `https://edgejs.dev/docs` |
| Releases / Changelog | `https://github.com/edge-js/edge/releases` |

## Install

```bash
bun add edge.js
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `edge-iconify` | `npm` | `2.0.2` | Optional — Edge plugin for SVG icons via `@iconify-json/<set>` data |

## Notes

- Breaking changes in latest major: `v6 is ESM-only — requires "type": "module" / .mjs; Edge.create() + mount() replace v5 APIs`
- Version pinned in SKILL.md: `edge.js@6.5.1`
