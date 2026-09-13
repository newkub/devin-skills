# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `esm-dev/esm.sh` (CDN service, self-hostable server) |
| Registry | `GitHub Releases` |
| Latest Version | `v138` |
| Release Date | `2026-08-24` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `esm-dev (Je Xia)` |
| License | `MIT` |
| Repository | `https://github.com/esm-dev/esm.sh` |
| Website | `https://esm.sh` |
| Documentation | `https://esm.sh` (usage docs on homepage + repo README) |
| Releases / Changelog | `https://github.com/esm-dev/esm.sh/releases` |

## Install

```bash
# No local install — import via URL: https://esm.sh/{package}@{version}/{subpath}
# Self-host: see https://github.com/esm-dev/esm.sh
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `esm.sh` (CLI) | `npm` | `0.1.1` | Import maps manager (`esm.sh add`, `esm.sh tidy`) — see `references/cli.md` |
| jsDelivr | `CDN` | `n/a` | Alternative multi-CDN — see `references/js-delivr.md` |
| JSPM | `CDN` | `n/a` | Import maps package manager CDN — see `references/jspm.md` |

## Notes

- Breaking changes in latest major: `since build v136 no /v135/ build prefix and ?pin is ignored; since v137_2 legacy build server shut down — old pinned URLs redirect to new routes`
- Version pinned in SKILL.md: `latest build v138 (was v137_8)` — SKILL.md updated 2026-09-13
