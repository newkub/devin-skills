# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `react-scan` |
| Registry | `npm` |
| Latest Version | `0.5.7` |
| Release Date | `2026-05-27` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Aiden Bai` (Million) |
| License | `MIT` |
| Repository | `https://github.com/aidenybai/react-scan` |
| Website | `https://react-scan.million.dev` |
| Documentation | `https://github.com/aidenybai/react-scan#readme` |
| Releases / Changelog | `https://github.com/aidenybai/react-scan/releases` |

## Install

```bash
bun add react-scan
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `react-scan` CLI | `npm` | `0.5.7` | Same package exposes `react-scan` bin — `bunx react-scan@latest <url>` scans any site without code changes; `bunx -y react-scan@latest init` auto-installs |

## Notes

- Breaking changes in latest major: `0.x — pre-1.0; scan options API may change between minors`
- Version pinned in SKILL.md: `react-scan@0.5.7`
- Browser extension (Chrome/Firefox/Brave) is an install-free alternative distribution
- Source: `https://registry.npmjs.org/react-scan`
