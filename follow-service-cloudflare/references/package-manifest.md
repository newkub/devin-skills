# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `wrangler` |
| Registry | `npm` |
| Latest Version | `4.131.1` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Cloudflare |
| License | `MIT OR Apache-2.0` |
| Repository | `https://github.com/cloudflare/workers-sdk` |
| Website | `https://workers.cloudflare.com/` |
| Documentation | `https://developers.cloudflare.com/workers/wrangler/` |
| Releases / Changelog | `https://github.com/cloudflare/workers-sdk/releases` |

## Install

```bash
bun add -D wrangler
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@cloudflare/workers-types` | `npm` | `5.20260911.1` | TypeScript types for Workers runtime |
| `create-cloudflare` | `npm` | `unknown` | Scaffolding CLI behind `npm create cloudflare@latest` |

## Notes

- Breaking changes in latest major: Wrangler 4.x requires `wrangler.jsonc`/`toml` config conventions and `compatibility_date`; `events` field needs >= 4.68; `wrangler deploy` can auto-detect frameworks without a config file
- Version pinned in SKILL.md: `wrangler@4.131.1`, `@cloudflare/workers-types@5.20260911.1`
