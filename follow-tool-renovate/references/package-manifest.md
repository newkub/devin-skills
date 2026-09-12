# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `renovate` |
| Registry | `npm` |
| Latest Version | `44.82.4` |
| Release Date | `2026-09-12` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Rhys Arkins` / Mend.io (renovatebot) |
| License | `AGPL-3.0-only` |
| Repository | `https://github.com/renovatebot/renovate` |
| Website | `https://renovatebot.com` |
| Documentation | `https://docs.renovatebot.com` |
| Releases / Changelog | `https://github.com/renovatebot/renovate/releases` |

## Install

```bash
bun add -D renovate
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `renovatebot/github-action` | `GitHub Releases` | `v46.3.0` | Self-hosted Renovate runner for GitHub Actions — latest release 2026-09-11 |
| `renovate-config-validator` | `npm` | `44.82.4` | Bin shipped inside `renovate` — `bunx -- renovate-config-validator <file>` |

## Notes

- Breaking changes in latest major: `44.x requires Node.js ^24.11.0 and pnpm ^11.0.0 when used via pnpm; AGPL-3.0-only license`
- Version pinned in SKILL.md: `renovate@44.82.4` / `renovatebot/github-action@v46.3.0`
- Source: `https://registry.npmjs.org/renovate`, `https://api.github.com/repos/renovatebot/github-action/releases/latest`
