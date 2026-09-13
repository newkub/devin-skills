# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `storybook` |
| Registry | `npm` |
| Latest Version | `10.6.0` |
| Release Date | `2026-09-02` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Storybook (storybookjs)` |
| License | `MIT` |
| Repository | `<https://github.com/storybookjs/storybook>` |
| Website | `<https://storybook.js.org>` |
| Documentation | `<https://storybook.js.org/docs>` |
| Releases / Changelog | `<https://github.com/storybookjs/storybook/releases>` |

## Install

```bash
bun create storybook@latest   # or: bunx storybook@latest create
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@storybook/addon-docs` | `npm` | `10.6.0` | Auto-docs addon |
| `@storybook/addon-a11y` | `npm` | `10.6.0` | Accessibility testing addon |
| `@storybook/addon-vitest` | `npm` | `10.6.0` | Component/interaction tests via Vitest |

## Notes

- Breaking changes in latest major: `v10 — controls/actions/interactions/viewport are core features; @storybook/addon-essentials and @storybook/addon-interactions removed`
- Version pinned in SKILL.md: `10.6.0`
- Prerelease channel: `next` = `11.0.0-alpha.0` (2026-09-02)
