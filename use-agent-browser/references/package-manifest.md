# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `agent-browser` |
| Registry | `npm` |
| Latest Version | `0.37.1` |
| Release Date | `2026-09-08` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `vercel-labs` |
| License | `Apache-2.0` |
| Repository | `https://github.com/vercel-labs/agent-browser` |
| Website | `https://github.com/vercel-labs/agent-browser` |
| Documentation | `https://github.com/vercel-labs/agent-browser#readme` |
| Releases / Changelog | `https://github.com/vercel-labs/agent-browser/releases` |

## Install

```bash
bun add -g agent-browser
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `chromium` (via `agent-browser install`) | `system` | `n/a` | Browser binary downloaded by CLI, not a registry package |
| `ffmpeg` | `system` | `n/a` | Optional, required for `record` video capture |

## Notes

- Breaking changes in latest major: `none — still 0.x; requires Node >= 24`
- Version pinned in SKILL.md: `0.37.1 (verified 2026-09-12)` — matches latest
