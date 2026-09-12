# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@cloudflare/ci` |
| Registry | `npm` |
| Latest Version | `0.1.0` |
| Release Date | `2026-09-03` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Cloudflare |
| License | `Apache-2.0` |
| Repository | `https://github.com/cloudflare/ci` |
| Website | `https://workers.cloudflare.com/` |
| Documentation | `https://github.com/cloudflare/ci#readme` |
| Releases / Changelog | `https://github.com/cloudflare/ci/releases` |

## Install

```bash
bun add -D @cloudflare/ci
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `wrangler` | `npm` | `4.131.1` | Required >= 4.68 for the `events` field in `wrangler.jsonc` |
| `@cloudflare/workers-types` | `npm` | `5.20260911.1` | TypeScript types for `WorkflowEvent`, `WorkflowStep`, `cloudflare:workers` |

## Notes

- Breaking changes in latest major: `0.x` preview — API may change; requires `nodejs_compat` flag and Cloudflare Workflows + Artifacts
- Version pinned in SKILL.md: `0.1.0`
