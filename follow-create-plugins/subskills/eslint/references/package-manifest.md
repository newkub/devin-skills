# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `eslint` |
| Registry | `npm` |
| Latest Version | `10.10.0` |
| Release Date | `2026-09-04` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `OpenJS Foundation / ESLint team` |
| License | `MIT` |
| Repository | `<https://github.com/eslint/eslint>` |
| Website | `<https://eslint.org>` |
| Documentation | `<https://eslint.org/docs/latest/extend/plugins>` |
| Releases / Changelog | `<https://github.com/eslint/eslint/releases>` |

## Install

```bash
bun add -D eslint typescript-eslint
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `typescript-eslint` | `npm` | `8.70.0` (2026-09-07) | TS parser/plugin meta-package for typed rules |

## Notes

- Breaking changes in latest major: `ESLint 10 — flat config only (legacy .eslintrc removed), Node.js >= 20.19, deprecated context/SourceCode members removed, fixer text must be string, stricter RuleTester (valid cases must not set errors/output)`
- Version pinned in SKILL.md: `eslint@10.10.0` / `typescript-eslint@8.70.0` (verified 2026-09-12)

