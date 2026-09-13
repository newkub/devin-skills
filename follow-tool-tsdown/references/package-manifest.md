# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `tsdown` |
| Registry | `npm` |
| Latest Version | `0.23.0` |
| Release Date | `2026-09-03` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Rolldown team` |
| License | `MIT` |
| Repository | `<https://github.com/rolldown/tsdown>` |
| Website | `<https://tsdown.dev>` |
| Documentation | `<https://tsdown.dev>` |
| Releases / Changelog | `<https://github.com/rolldown/tsdown/releases>` |

## Install

```bash
bun add -D tsdown   # or scaffold: bun create tsdown@latest
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `tsdown-migrate` | `npm` | `0.23.0` | Migration CLI from `tsup` (`bunx tsdown-migrate`) |
| `rolldown` | `npm` | `1.2.8` | Underlying bundler — bundled internally, rarely installed directly |

## Notes

- Breaking changes in latest major: `0.x line — minor releases may include breaking changes; requires Node.js ^22.18.0 || ^24.11.0 || >=26.0.0 at build time`
- Version pinned in SKILL.md: `0.23.0`
