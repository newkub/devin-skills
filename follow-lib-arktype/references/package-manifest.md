# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `arktype` |
| Registry | `npm` |
| Latest Version | `2.2.3` |
| Release Date | `2026-07-07` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `David Blass` |
| License | `MIT` |
| Repository | `https://github.com/arktypeio/arktype` |
| Website | `https://arktype.io` |
| Documentation | `https://arktype.io/docs` |
| Releases / Changelog | `https://github.com/arktypeio/arktype/releases` |

## Install

```bash
bun add arktype
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `arkregex` | `npm` | `0.0.8` | Type-safe regex (`x/.../` literal + named groups), bundled via `type("x/.../")` |
| `@ark/json-schema` | `npm` | `0.0.7` | Optional — bidirectional JSON Schema conversion (`toJsonSchema()`) |

## Notes

- Breaking changes in latest major: `v2.x requires TS >=5.1, strict/strictNullChecks; keywords and config API reworked vs v1`
- Version pinned in SKILL.md: `arktype@2.2.3`
