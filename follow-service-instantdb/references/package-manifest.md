# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@instantdb/react` |
| Registry | `npm` |
| Latest Version | `1.0.67` |
| Release Date | `2026-08-31` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | InstantDB |
| License | `Apache-2.0` |
| Repository | `https://github.com/instantdb/instant` |
| Website | `https://www.instantdb.com/` |
| Documentation | `https://www.instantdb.com/docs` |
| Releases / Changelog | `https://github.com/instantdb/instant/releases` |

## Install

```bash
bun add @instantdb/react
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `instant-cli` | `npm` | `1.0.67` | Dev CLI for init/push schema & perms (NOT `@instantdb/cli`, which does not exist) |
| `@instantdb/core` | `npm` | `1.0.67` | Vanilla JS client |
| `@instantdb/solidjs` | `npm` | `1.0.67` | SolidJS client — correct name is `solidjs`, not `@instantdb/solid` (does not exist) |
| `@instantdb/svelte` | `npm` | `1.0.67` | Svelte client |
| `@instantdb/vue` | `npm` | `1.0.67` | Vue client |
| `@instantdb/admin` | `npm` | `1.0.67` | Server-side admin SDK |
| `instantdb` | `PyPI` | `unknown` | Python client |

## Notes

- Breaking changes in latest major: v1.0 line is stable; SDK reached `1.x`
- Version pinned in SKILL.md: `1.0.67`
- SKILL.md references `@instantdb/solid` for SolidJS — the actual npm package is `@instantdb/solidjs`
