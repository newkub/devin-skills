# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `drizzle-kit` |
| Registry | `npm` |
| Latest Version | `0.31.10` |
| Release Date | `2026-03-17` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Drizzle Team` |
| License | `MIT` |
| Repository | `https://github.com/drizzle-team/drizzle-orm` |
| Website | `https://orm.drizzle.team` |
| Documentation | `https://orm.drizzle.team/docs/kit-overview` |
| Releases / Changelog | `https://github.com/drizzle-team/drizzle-orm/releases` |

## Install

```bash
bun add -D drizzle-kit
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `drizzle-orm` | `npm` | `0.45.2` (2026-03-27) | Runtime ORM — pair with drizzle-kit |
| `drizzle-kit@beta` | `npm` | `1.0.0-rc.x` | Beta/rc channel — breaking changes (casing API, RQB v1 `db._query` removed) |

## Notes

- Breaking changes in latest major: `v1.0.0 in beta/rc — casing API changes, removes RQB v1 \`db._query\`; production stays on stable 0.31.x`
- Version pinned in SKILL.md: `0.31.10` (pair `drizzle-orm@0.45.2`)
