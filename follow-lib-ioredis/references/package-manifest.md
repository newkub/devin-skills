# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `ioredis` |
| Registry | `npm` |
| Latest Version | `6.0.0` |
| Release Date | `2026-07-31` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Zihua Li (redis)` |
| License | `MIT` |
| Repository | `https://github.com/redis/ioredis` |
| Website | `https://github.com/redis/ioredis` |
| Documentation | `https://redis.github.io/ioredis/` |
| Releases / Changelog | `https://github.com/redis/ioredis/releases` |

## Install

```bash
bun add ioredis
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@ioredis/commands` | `npm` | `bundled` | Redis command list — shipped internally by ioredis |

## Notes

- Breaking changes in latest major: `v6 requires Node >=20, defaults to RESP3 (HELLO 3 with RESP2 auto-fallback); set protocol:2 for v5 wire protocol and replyStyle:"resp3" for RESP3 reply shapes (default "legacy")`
- Version pinned in SKILL.md: `ioredis@6.0.0`
