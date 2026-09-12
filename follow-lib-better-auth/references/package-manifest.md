# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `better-auth` |
| Registry | `npm` |
| Latest Version | `1.7.4` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `bekacru (Better Auth team)` |
| License | `MIT` |
| Repository | `https://github.com/better-auth/better-auth` |
| Website | `https://better-auth.com` |
| Documentation | `https://www.better-auth.com/docs` |
| Releases / Changelog | `https://github.com/better-auth/better-auth/releases` |

## Install

```bash
bun add better-auth
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@better-auth/prisma-adapter` | `npm` | `1.7.4` | Optional — Prisma database adapter |
| `@better-auth/drizzle-adapter` | `npm` | `1.7.4` | Optional — Drizzle database adapter |
| `@better-auth/cli` | `npm` | `1.4.21` | Optional — standalone CLI (skill uses `bunx auth@latest` for init/generate/migrate) |

## Notes

- Breaking changes in latest major: `v1.7 has breaking changes for OAuth, MCP, SCIM — read migration guide before upgrading`
- Version pinned in SKILL.md: `better-auth@1.7.4`
