# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `obsidian` (API typings for plugin dev) |
| Registry | `npm` |
| Latest Version | `1.13.1` |
| Release Date | `2026-06-09` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Obsidian (obsidianmd)` |
| License | `MIT` |
| Repository | `<https://github.com/obsidianmd/obsidian-api>` |
| Website | `<https://obsidian.md>` |
| Documentation | `<https://docs.obsidian.md>` |
| Releases / Changelog | `<https://github.com/obsidianmd/obsidian-api/releases>` |

## Install

```bash
bun add -D obsidian esbuild
# or clone https://github.com/obsidianmd/obsidian-sample-plugin
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `esbuild` | `npm` | `unknown` | bundler `src/main.ts` -> `main.js`; `external: ['obsidian','fs','path']` |
| `obsidian-sample-plugin` | `GitHub` | `n/a` | template repo: `<https://github.com/obsidianmd/obsidian-sample-plugin>` |

## Notes

- Breaking changes in latest major: `none major — typings track Obsidian app API; keep manifest.json minAppVersion accurate per release`
- Version pinned in SKILL.md: `obsidian@1.13.1` (verified 2026-09-12)
