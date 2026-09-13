# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `semantic-release` |
| Registry | `npm` |
| Latest Version | `25.0.9` |
| Release Date | `2026-08-05` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Stephan Bönnemann` / semantic-release org |
| License | `MIT` |
| Repository | `https://github.com/semantic-release/semantic-release` |
| Website | `https://semantic-release.gitbook.io/semantic-release/` |
| Documentation | `https://semantic-release.gitbook.io/semantic-release/` |
| Releases / Changelog | `https://github.com/semantic-release/semantic-release/releases` |

## Install

```bash
bun add -D semantic-release
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@semantic-release/changelog` | `npm` | `7.0.0` | Plugin — maintain `CHANGELOG.md` |
| `@semantic-release/git` | `npm` | `11.0.1` | Plugin — commit release assets back to repo |
| `@semantic-release/github` | `npm` | `12.0.9` | Plugin — GitHub releases (bundled by default) |
| `@semantic-release/npm` | `npm` | `13.1.5` | Plugin — npm publish (bundled by default) |

## Notes

- Breaking changes in latest major: `v25 requires Node.js ^22.14.0 || >=24.10.0; ESM-only`
- Version pinned in SKILL.md: `semantic-release@25.0.9`
- Source: `https://registry.npmjs.org/semantic-release`
