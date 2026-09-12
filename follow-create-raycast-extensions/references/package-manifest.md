# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@raycast/api` |
| Registry | `npm` |
| Latest Version | `2.3.1` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Raycast` |
| License | `MIT` |
| Repository | `https://github.com/raycast/extensions` |
| Website | `https://developers.raycast.com` |
| Documentation | `https://developers.raycast.com/api-reference` |
| Releases / Changelog | `https://developers.raycast.com/changelog` |

## Install

```bash
bun add @raycast/api @raycast/utils
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@raycast/utils` | `npm` | `2.3.1` (2026-09-03) | Shared utilities/hooks for extensions |
| `create-raycast-extension` | `npm` | `unknown` | Scaffolding CLI (`bun create raycast-extension`) |

## Notes

- Breaking changes in latest major: `@raycast/api` 2.x requires Node `>=22.22.2` and React 19 — migration via `bunx ray migrate` or `bunx @raycast/migration .`
- Version pinned in SKILL.md: `@raycast/api@2.3.1` / `@raycast/utils@2.3.1`
