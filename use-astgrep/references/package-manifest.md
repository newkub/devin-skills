# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@ast-grep/cli` |
| Registry | `npm` |
| Latest Version | `0.45.3` |
| Release Date | `2026-08-31` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `ast-grep` (Herrington Darkholme) |
| License | `MIT` |
| Repository | `https://github.com/ast-grep/ast-grep` |
| Website | `https://ast-grep.github.io` |
| Documentation | `https://ast-grep.github.io/guide/quick-start.html` |
| Releases / Changelog | `https://github.com/ast-grep/ast-grep/releases` |

## Install

```bash
bun add -D @ast-grep/cli
```

Ad-hoc without install: `bunx -p @ast-grep/cli ast-grep` (never bare `bunx ast-grep` — that pulls the abandoned `ast-grep` package).

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@ast-grep/napi` | `npm` | `0.45.3` (2026-08-31) | Node-API bindings for programmatic use — see `use-astgrep/subskills/programmatic` |
| `ast-grep` | `npm` | abandoned | Do NOT install — name-squatting risk; real CLI is `@ast-grep/cli` |

## Notes

- Breaking changes in latest major: `none — 0.45.3 adds --min-severity flag`
- Version pinned in SKILL.md: `0.45.3 (verified 2026-09-12)` — matches latest
