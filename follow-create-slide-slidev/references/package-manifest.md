# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@slidev/cli` |
| Registry | `npm` |
| Latest Version | `52.19.1` |
| Release Date | `2026-08-19` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Anthony Fu / Slidev contributors` |
| License | `MIT` |
| Repository | `https://github.com/slidevjs/slidev` |
| Website | `https://sli.dev` |
| Documentation | `https://sli.dev/guide/` |
| Releases / Changelog | `https://github.com/slidevjs/slidev/releases` |

## Install

```bash
bun create slidev@latest {project-name}
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@slidev/theme-seriph` | `npm` | `unknown` | Default theme used in newkub root deps |
| `@slidev/theme-default` | `npm` | `unknown` | Built-in fallback theme |
| `vue` | `npm` | `unknown` | Peer runtime for slides/components |
| `playwright-chromium` | `npm` | `unknown` | Required for `slidev export` (PDF) |

## Notes

- Breaking changes in latest major: `mdc` headmatter renamed to `comark` since v52.14 — use `comark: true`
- Version pinned in SKILL.md: `@slidev/cli@52.19.1`
