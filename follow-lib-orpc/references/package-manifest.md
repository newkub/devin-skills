# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@orpc/server` |
| Registry | `npm` |
| Latest Version | `1.15.1` |
| Release Date | `2026-08-08` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `unnoq (oRPC)` |
| License | `MIT` |
| Repository | `https://github.com/middleapi/orpc` |
| Website | `https://orpc.dev` |
| Documentation | `https://orpc.dev/docs` |
| Releases / Changelog | `https://github.com/unnoq/orpc/releases` |

## Install

```bash
bun add @orpc/server @orpc/client
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@orpc/client` | `npm` | `1.15.1` | Type-safe client (`RPCLink`, `safe()`, `isDefinedError`) |
| `@orpc/openapi` | `npm` | `1.15.1` | OpenAPI/REST handler + docs |
| `@orpc/tanstack-query` | `npm` | `1.15.1` | TanStack Query integration utils |
| `@orpc/contract` | `npm` | `1.15.1` | Contract-first API definitions |
| `zod` | `npm` | `4.6.5` | Schema validation for inputs/outputs |

## Notes

- Breaking changes in latest major: `v2 beta (2.0.0-beta.35) — route/prefix/tag → meta(openapi(...)), isDefinedError → isInferableError, safe() returns [error, data, inferableError], eventIterator → asyncIteratorObject`
- Version pinned in SKILL.md: `@orpc/server@1.15.1` / `@orpc/client@1.15.1`
