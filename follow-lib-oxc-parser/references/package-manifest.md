# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `oxc-parser` |
| Registry | `npm` |
| Latest Version | `0.149.0` |
| Release Date | `2026-09-07` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Boshen and oxc contributors` |
| License | `MIT` |
| Repository | `https://github.com/oxc-project/oxc` |
| Website | `https://oxc.rs` |
| Documentation | `https://oxc.rs/docs/guide/usage/parser` |
| Releases / Changelog | `https://github.com/oxc-project/oxc/releases` |

## Install

```bash
bun add -d oxc-parser
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@oxc-project/types` | `npm` | `0.149.0` | AST type definitions |
| `oxc-transform` | `npm` | `0.149.0` | TS→JS / JSX transpilation (separate package) |
| `oxc-minify` | `npm` | `0.149.0` | Minifier |
| `oxc-resolver` | `npm` | `11.24.2` | Module resolution |
| `esrap` | `npm` | `2.3.7` | Print AST back to code (`esrap/languages/ts`) |

## Notes

- Breaking changes in latest major: `0.x — releases ship frequently; pin a version published at least 7 days ago per SKILL.md`
- Version pinned in SKILL.md: `0.149.0`
