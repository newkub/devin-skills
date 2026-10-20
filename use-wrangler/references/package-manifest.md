# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review-codebase` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `wrangler` |
| Registry | `npm` |
| Latest Version | `4.151.0` |
| Release Date | `n/a` (GitHub API unreachable at last check) |
| Verified | `2026-10-15` (date this file was last checked — `registry.npmjs.org` dist-tags) |
| Author / Publisher | `cloudflare` |
| License | `MIT OR Apache-2.0` |
| Repository | `https://github.com/cloudflare/workers-sdk` |
| Website | `https://developers.cloudflare.com/workers/` |
| Documentation | `https://developers.cloudflare.com/workers/wrangler/` |
| Releases / Changelog | `https://github.com/cloudflare/workers-sdk/releases` |

## Install

```bash
bun add -D wrangler
```

Or run ad-hoc: `bunx wrangler` (requires Node >= 22).

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `workerd` | `npm` | `n/a` | Local runtime bundled/managed by wrangler itself |
| `miniflare` | `npm` | `n/a` | Local simulator used under the hood by `wrangler dev` |

## Notes

- Breaking changes in latest major: `v4 removed legacy colon syntax (kv:namespace → kv namespace, etc.) and requires Node >= 22`
- Version pinned in SKILL.md: `4.151.0 (verified 2026-10-15)` — matches `latest` dist-tag on the npm registry
