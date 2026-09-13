# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `solid-js` |
| Registry | `npm` |
| Latest Version | `1.9.15` |
| Release Date | `2026-08-17` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Ryan Carniato` |
| License | `MIT` |
| Repository | `<https://github.com/solidjs/solid>` |
| Website | `<https://solidjs.com>` |
| Documentation | `<https://docs.solidjs.com>` |
| Releases / Changelog | `<https://github.com/solidjs/solid/releases>` |

## Install

```bash
bun add solid-js && bun add -D babel-preset-solid
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `babel-preset-solid` | `npm` | `1.9.15` | JSX transform preset (dev dependency); released 2026-08-17 |
| `@solidjs/testing-library` | `npm` | `0.8.10` | Component testing with auto cleanup; released 2024-09-25 |
| `@testing-library/user-event` | `npm` | `14.6.7` | User interaction simulation for tests |

## Notes

- Breaking changes in latest major: Solid 2.0 is still beta — `Suspense`→`Loading`, `ErrorBoundary`→`Errored`, `<Index>` removed, `batch`→microtask batching (see SKILL.md §3)
- Version pinned in SKILL.md: `solid-js@1.9.15`
