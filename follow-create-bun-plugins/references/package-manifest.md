# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `bun-types` |
| Registry | `npm` |
| Latest Version | `1.4.2` |
| Release Date | `2026-09-05` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Oven (Bun)` |
| License | `MIT` |
| Repository | `https://github.com/oven-sh/bun` |
| Website | `https://bun.sh` |
| Documentation | `https://bun.com/docs/runtime/plugins` |
| Releases / Changelog | `https://github.com/oven-sh/bun/releases` |

## Install

```bash
bun add -D bun-types typescript
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `bun` | `GitHub Releases` | `1.4.2` (`bun-v1.4.2`, 2026-09-05) | Runtime hosting `Bun.plugin` / `Bun.build` |
| `bunup` | `npm` | `0.16.32` (2026-06-01) | Optional build tool for plugin package |
| `tsdown` | `npm` | `unknown` | Alternative build tool |

## Notes

- Breaking changes in latest major: none in `Bun.plugin` API for 1.x; `bun-types` version tracks the Bun runtime version.
- Version pinned in SKILL.md: Bun `1.4.2`, `bun-types@1.4.2`
