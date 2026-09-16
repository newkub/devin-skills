# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `node-modules-inspector` |
| Registry | `npm` |
| Latest Version | `2.6.2` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Anthony Fu` (antfu) |
| License | `MIT` |
| Repository | `https://github.com/antfu/node-modules-inspector` |
| Website | `https://github.com/antfu/node-modules-inspector#readme` |
| Documentation | `https://github.com/antfu/node-modules-inspector#readme` |
| Releases / Changelog | `https://github.com/antfu/node-modules-inspector/releases` |

## Install

```bash
bunx node-modules-inspector
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| — | — | — | Zero-install CLI (run via `bunx`/`npx`/`pnpm dlx`); optional `node-modules-inspector.config.ts` for config |

## Notes

- Breaking changes in latest major: `v2 changed static build output dir to dist/__node-modules-inspector and added report subcommands + MCP server`
- Version pinned in SKILL.md: `node-modules-inspector@2.6.2`
- Source: `https://registry.npmjs.org/node-modules-inspector`
