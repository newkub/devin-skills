# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `storybook` |
| Registry | `npm` |
| Latest Version | `10.6.0` |
| Release Date | `2026-09-02` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Storybook contributors` |
| License | `MIT` |
| Repository | `https://github.com/storybookjs/storybook` |
| Website | `https://storybook.js.org` |
| Documentation | `https://storybook.js.org/docs/addons/writing-addons` |
| Releases / Changelog | `https://github.com/storybookjs/storybook/releases` |

## Install

```bash
bun add -D storybook
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@storybook/icons` | `npm` | `unknown` | Icon set for manager UI |
| `tsup` | `npm` | `unknown` | Build tool for addon dist (esm+cjs+dts) |
| `react` | `npm` | `unknown` | Peer for manager-side components |

## Notes

- Breaking changes in latest major: latest line is `10.x` — SKILL.md documents the `9.x` addon API (`storybook/manager-api`, `storybook/preview-api`, `storybook/theming`, `storybook/internal/components`); re-verify against the SB10 migration guide before relying on SB9-specific notes
- Version pinned in SKILL.md: `9.x` → updated to `10.6.0` on 2026-09-12
- `@storybook/addon-kit` is archived — scaffold addons manually per SKILL.md structure
