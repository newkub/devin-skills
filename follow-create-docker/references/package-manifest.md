# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `moby` (Docker Engine) |
| Registry | `GitHub Releases` (`moby/moby`) |
| Latest Version | `29.8.0` (`docker-v29.8.0`) |
| Release Date | `2026-09-03` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Docker Inc. / Moby Project` |
| License | `Apache-2.0` |
| Repository | `https://github.com/moby/moby` |
| Website | `https://www.docker.com` |
| Documentation | `https://docs.docker.com` |
| Releases / Changelog | `https://github.com/moby/moby/releases` |

## Install

```bash
docker --version   # engine is system-installed (Docker Desktop / distro package)
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `docker-compose` | `GitHub Releases` (`docker/compose`) | `v5.5.1` (2026-09-03) | Compose v2 plugin — `docker compose` (no hyphen) |

## Notes

- Breaking changes in latest major: Docker Engine 29.x series — check https://docs.docker.com/engine/release-notes/ for daemon API deprecations; Compose spec dropped top-level `version:` field.
- Version pinned in SKILL.md: Docker Engine `29.8.0`
