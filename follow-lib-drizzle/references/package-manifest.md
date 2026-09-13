# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `drizzle-orm` |
| Registry | `npm` |
| Latest Version | `0.45.2` |
| Release Date | `2026-03-27` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Drizzle Team` |
| License | `Apache-2.0` |
| Repository | `https://github.com/drizzle-team/drizzle-orm` |
| Website | `https://orm.drizzle.team` |
| Documentation | `https://orm.drizzle.team/docs` |
| Releases / Changelog | `https://github.com/drizzle-team/drizzle-orm/releases` |

## Install

```bash
bun add drizzle-orm
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `drizzle-kit` | `npm` | `0.31.10` | Dev CLI — `generate`, `migrate`, `push`, `pull`, `check`, `studio` (`bun add -D drizzle-kit`) |
| `drizzle-orm@rc` | `npm` | `1.0.0-rc.4` | v1.0 RC — `relations()` → `defineRelations()`, `getTableColumns` → `getColumns`, migration folder v3 |

## Notes

- Breaking changes in latest major: `v1.0 RC renames relations()/getTableColumns, drops --strict, new migration folder format`
- Version pinned in SKILL.md: `drizzle-orm@0.45.2` + `drizzle-kit@0.31.10`
