# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `effect` |
| Registry | `npm` |
| Latest Version | `3.22.2` |
| Release Date | `2026-09-09` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Michael Arnaldi (Effect-TS)` |
| License | `MIT` |
| Repository | `https://github.com/Effect-TS/effect` |
| Website | `https://effect.website` |
| Documentation | `https://effect.website/docs` |
| Releases / Changelog | `https://github.com/Effect-TS/effect/releases` |

## Install

```bash
bun add effect
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@effect/platform` | `npm` | `0.97.2` | Platform abstractions (`FileSystem`, `Path`, `HttpClient`, `Terminal`) |
| `@effect/platform-bun` | `npm` | `0.91.2` | Bun runtime (`BunRuntime.runMain`, `BunContext`) |
| `@effect/platform-node` | `npm` | `0.108.2` | Node.js runtime |
| `@effect/vitest` | `npm` | `0.30.0` | `it.effect`/`it.live`/`it.scoped` — requires peer `vitest ^3.2.0`, `effect ^3.22.0` |
| `effect@rc` | `npm` | `4.0.0-rc.115` | v4 RC — `effect/unstable/*`, `Context.Service`, `.asEffect()`, Layer/Runtime API changes |

## Notes

- Breaking changes in latest major: `v4 RC consolidates packages under effect/unstable/*, replaces Context.Tag/Effect.Service with Context.Service, Yieldable requires .asEffect()`
- Version pinned in SKILL.md: `effect@3.22.2` (latest stable), `4.0.0-rc.115` (RC)
