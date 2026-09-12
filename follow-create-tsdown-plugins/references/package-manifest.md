# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `tsdown` |
| Registry | `npm` |
| Latest Version | `0.23.0` |
| Release Date | `2026-09-03` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Rolldown / VoidZero contributors` |
| License | `MIT` |
| Repository | `https://github.com/rolldown/tsdown` |
| Website | `https://tsdown.dev/` |
| Documentation | `https://github.com/rolldown/tsdown/blob/main/docs/advanced/plugins.md` |
| Releases / Changelog | `https://github.com/rolldown/tsdown/releases` |

## Install

```bash
bun add -D tsdown rolldown typescript
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `rolldown` | `npm` | `1.2.8` (2026-09-09) | Plugin API base (`Plugin` type, hook filters) |
| `bunup` | `npm` | `unknown` | Alternative build tool for plugin packages |
| `typescript` | `npm` | `7.0.2` (2026-07-08) | Type-checking / `.d.ts` |

## Notes

- Breaking changes in latest major: tsdown 0.x — `TsdownPlugin` type from `tsdown/plugins`; tsdown-specific hooks `tsdownConfig`/`tsdownConfigResolved` on top of Rolldown plugin API
- Version pinned in SKILL.md: `tsdown@0.23.0`
