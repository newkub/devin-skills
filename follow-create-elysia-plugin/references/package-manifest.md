# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `elysia` |
| Registry | `npm` |
| Latest Version | `1.4.30` |
| Release Date | `2026-08-26` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `elysiajs` (SaltyAom) |
| License | `MIT` |
| Repository | `<https://github.com/elysiajs/elysia>` |
| Website | `<https://elysiajs.com>` |
| Documentation | `<https://elysiajs.com>` |
| Releases / Changelog | `<https://github.com/elysiajs/elysia/releases>` |

## Install

```bash
bun add -D elysia
# keep elysia in peerDependencies of the plugin package
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `tsup` | `npm` | `unknown` | bundler for cjs/esm output (or `bun build`) |

## Notes

- Breaking changes in latest major: `Elysia 1.x — check release notes before upgrading across minors; peerDeps require typescript >= 5.0.0, @sinclair/typebox >= 0.34.0 < 1`
- Version pinned in SKILL.md: `elysia@1.4.30` (verified 2026-09-12)

