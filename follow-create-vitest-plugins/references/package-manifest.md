# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `vitest` |
| Registry | `npm` |
| Latest Version | `5.0.0` |
| Release Date | `2026-09-03` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Vitest contributors (VoidZero)` |
| License | `MIT` |
| Repository | `https://github.com/vitest-dev/vitest` |
| Website | `https://vitest.dev` |
| Documentation | `https://vitest.dev/api/advanced/plugin` |
| Releases / Changelog | `https://github.com/vitest-dev/vitest/releases` |

## Install

```bash
bun add -D vitest
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `vite` | `npm` | `8.3.0` (2026-09-10) | Peer — Vitest 5 requires Vite `>=6.4.0` |
| `@vitest/coverage-v8` | `npm` | `unknown` | Optional coverage provider |

## Notes

- Breaking changes in latest major: Vitest 5.0.0 requires Node `>=22.12.0` and Vite `>=6.4.0`; `experimental_defineCacheKeyGenerator` → `defineCacheKeyGenerator` (stable); `experimental.fsModuleCache` → top-level `test.fsModuleCache`
- Version pinned in SKILL.md: `vitest@5.0.0`
