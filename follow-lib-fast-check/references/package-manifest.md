# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `fast-check` |
| Registry | `npm` |
| Latest Version | `4.10.0` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Nicolas DUBIEN` |
| License | `MIT` |
| Repository | `https://github.com/dubzzz/fast-check` |
| Website | `https://fast-check.dev` |
| Documentation | `https://fast-check.dev/docs` |
| Releases / Changelog | `https://github.com/dubzzz/fast-check/releases` |

## Install

```bash
bun add -D fast-check
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@fast-check/vitest` | `npm` | `0.5.0` | Vitest test-runner integration |
| `@fast-check/jest` | `npm` | `2.3.0` | Jest test-runner integration |

## Notes

- Breaking changes in latest major: `v4 requires Node >=12.17 / ES2020, drops deprecated arbitraries (unicode*, ascii*, char, uuidV, .noBias, .noShrink), includes invalid dates and null-prototype objects by default`
- Version pinned in SKILL.md: `fast-check@4.10.0`
