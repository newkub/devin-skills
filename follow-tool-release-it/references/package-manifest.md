# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `release-it` |
| Registry | `npm` |
| Latest Version | `21.0.2` |
| Release Date | `2026-08-09` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Lars Kappert` (webpro) |
| License | `MIT` |
| Repository | `https://github.com/release-it/release-it` |
| Website | `https://github.com/release-it/release-it#readme` |
| Documentation | `https://github.com/release-it/release-it#readme` |
| Releases / Changelog | `https://github.com/release-it/release-it/releases` |

## Install

```bash
bun add -D release-it
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@release-it/conventional-changelog` | `npm` | `12.0.0` | Plugin — auto changelog from conventional commits |
| `@release-it/bumper` | `npm` | `8.0.0` | Plugin — bump versions in non-npm manifest files |
| `@release-it/keep-a-changelog` | `npm` | `8.0.0` | Plugin — maintain `CHANGELOG.md` in keep-a-changelog format |

## Notes

- Breaking changes in latest major: `v21 requires Node.js ^22.21.0 || >=24.0.0; CLI parsing is strict (unknown options/args rejected); GitLab server certificates verified by default`
- Version pinned in SKILL.md: `release-it@21.0.2`
- Source: `https://registry.npmjs.org/release-it`
