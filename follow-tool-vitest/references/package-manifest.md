# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `vitest` |
| Registry | `npm` |
| Latest Version | `5.0.0` |
| Release Date | `2026-09-03` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `VoidZero / vitest-dev` |
| License | `MIT` |
| Repository | `<https://github.com/vitest-dev/vitest>` |
| Website | `<https://vitest.dev>` |
| Documentation | `<https://vitest.dev/guide/>` |
| Releases / Changelog | `<https://github.com/vitest-dev/vitest/releases>` |

## Install

```bash
bun add -D vitest @vitest/coverage-v8
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@vitest/coverage-v8` | `npm` | `5.0.0` | V8 coverage provider — version must match vitest |
| `@vitest/browser-playwright` | `npm` | `5.0.0` | Stable browser-mode provider (replaces @vitest/browser) |

## Notes

- Breaking changes in latest major: `v5 — clearMocks defaults true; test.sequential removed; vi.mock/vi.hoisted must be top-level; extends in projects defaults true with sharedViteServer; artifacts under .vitest/ — see SKILL.md §6`
- Version pinned in SKILL.md: `5.0.0` — requires Vite >= 6.4.0 and Node >= 22.12.0; @effect/vitest peer needs vitest ^3.2.0 (pin vitest@^3.2 there)
