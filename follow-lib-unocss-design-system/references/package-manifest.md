# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `unocss` |
| Registry | `npm` |
| Latest Version | `66.10.2` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Anthony Fu (antfu)` |
| License | `MIT` |
| Repository | `<https://github.com/unocss/unocss>` |
| Website | `<https://unocss.dev>` |
| Documentation | `<https://unocss.dev/guide/>` |
| Releases / Changelog | `<https://github.com/unocss/unocss/releases>` |

## Install

```bash
bun add -D unocss @unocss/preset-wind4
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@unocss/preset-wind4` | `npm` | `66.10.2` | Theme engine customized by this skill (`theme`, `extendTheme`, `dark` option) |

## Notes

- Breaking changes in latest major: this skill only customizes theme — install/setup is covered by `/follow-lib-unocss`; wind4 theme keys differ from wind3
- Version pinned in SKILL.md: `unocss@66.10.2`
