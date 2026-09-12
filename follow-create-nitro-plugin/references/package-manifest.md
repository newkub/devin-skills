# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `nitropack` (Nitro v2 stable) |
| Registry | `npm` |
| Latest Version | `2.13.4` |
| Release Date | `2026-04-29` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `nitrojs / pi0` |
| License | `MIT` |
| Repository | `<https://github.com/nitrojs/nitro>` |
| Website | `<https://nitro.build>` |
| Documentation | `<https://nitro.build>` |
| Releases / Changelog | `<https://github.com/nitrojs/nitro/releases>` |

## Install

```bash
bun add -D nitropack   # v2 stable — defineNitroPlugin
bun add -D nitro       # v3 beta — definePlugin (npm tag "latest" on package nitro)
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `nitro` | `npm` | `3.0.260903-beta` (2026-09-03) | v3 beta; npm `latest` tag — explicit imports, `definePlugin`, H3 v2 |
| `unbuild` | `npm` | `unknown` | bundler for plugin package (alternative: `tsup`) |
| `@nuxt/test-utils` | `npm` | `unknown` | fixture testing via `setup` + `$fetch` |

## Notes

- Breaking changes in latest major: `Nitro v3 — package nitropack -> nitro, defineNitroPlugin -> definePlugin, auto-imports removed (explicit imports from nitro/*), H3 v2 (defineHandler, HTTPError, event.req web APIs), Node.js >= 20`
- Version pinned in SKILL.md: `nitropack@2.13.4`, `nitro@3.0.260903-beta` (verified 2026-09-12)
