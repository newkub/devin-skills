# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `postgres` |
| Registry | `npm` |
| Latest Version | `3.4.9` |
| Release Date | `2026-04-05` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Rasmus Porsager` |
| License | `Unlicense` |
| Repository | `https://github.com/porsager/postgres` |
| Website | `https://github.com/porsager/postgres` |
| Documentation | `https://github.com/porsager/postgres` |
| Releases / Changelog | `https://github.com/porsager/postgres/releases` |

## Install

```bash
bun add postgres
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `drizzle-orm` | `npm` | `0.45.2` | Common companion ORM — uses postgres.js as driver |

## Notes

- Breaking changes in latest major: `none — v3.x line; tagged-template API is stable`
- Version pinned in SKILL.md: `3.4.9`
