# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `vercel` (Vercel CLI) |
| Registry | `npm` |
| Latest Version | `59.16.0` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Vercel |
| License | `Apache-2.0` |
| Repository | `https://github.com/vercel/vercel` |
| Website | `https://vercel.com` |
| Documentation | `https://vercel.com/docs/cli` |
| Releases / Changelog | `https://github.com/vercel/vercel/releases` |

## Install

```bash
bun add -D vercel
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@vercel/node` | `npm` | `13.0.0` | Builder/runtime types (`VercelRequest`, `VercelResponse`) for `api/` serverless functions |

## Notes

- Breaking changes in latest major: CLI moves fast; `vercel deploy --prod` and `vercel env` flows unchanged; `@vercel/node` major 13 aligns with current build runtime
- Version pinned in SKILL.md: `vercel@59.16.0`
