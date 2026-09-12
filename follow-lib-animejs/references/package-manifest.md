# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `animejs` |
| Registry | `npm` |
| Latest Version | `4.5.0` |
| Release Date | `2026-06-22` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Julian Garnier` |
| License | `MIT` |
| Repository | `https://github.com/juliangarnier/anime` |
| Website | `https://animejs.com` |
| Documentation | `https://animejs.com/documentation` |
| Releases / Changelog | `https://github.com/juliangarnier/anime/releases` |

## Install

```bash
bun add animejs
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `animejs@beta` | `npm` | `5.0.0-beta.2` | v5 beta — breaking changes (transform render order, callback args, stagger `use`, no direct `matrix`/`matrix3d`) |

## Notes

- Breaking changes in latest major: `v4 is a full rewrite of v3 — named ESM exports (animate, createTimeline, stagger), ease instead of easing; v5 beta adds further breaking changes listed above`
- Version pinned in SKILL.md: `animejs@4.5.0`
