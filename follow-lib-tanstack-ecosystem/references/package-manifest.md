# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@tanstack/react-query` |
| Registry | `npm` |
| Latest Version | `5.102.8` |
| Release Date | `2026-08-27` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Tanner Linsley (TanStack)` |
| License | `MIT` |
| Repository | `<https://github.com/TanStack/query>` |
| Website | `<https://tanstack.com/query>` |
| Documentation | `<https://tanstack.com/query/latest>` |
| Releases / Changelog | `<https://github.com/TanStack/query/releases>` |

## Install

```bash
bun add @tanstack/react-query
```

Naming convention: `@tanstack/{framework}-{lib}` (e.g. `@tanstack/vue-query`, `@tanstack/solid-router`).

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@tanstack/react-router` | `npm` | `1.170.35` | Type-safe routing (React); released 2026-09-10 |
| `@tanstack/react-start` | `npm` | `1.168.52` | Full-stack SSR framework on Router + Vite; released 2026-09-10 |
| `@tanstack/react-table` | `npm` | `9.2.4` | Headless datagrid; released 2026-08-28 |
| `@tanstack/react-form` | `npm` | `1.33.5` | Form state + validation; released 2026-08-11 |
| `@tanstack/react-virtual` | `npm` | `3.14.12` | Virtualized lists; released 2026-09-11 |
| `@tanstack/store` | `npm` | `0.11.1` | Framework-agnostic client state (0.x); released 2026-08-05 |
| `@tanstack/react-db` | `npm` | `0.3.8` | Reactive client store / local-first sync (0.x); released 2026-09-10 |
| `@tanstack/react-pacer` | `npm` | `0.23.0` | Debounce/throttle/batch utilities (0.x); released 2026-08-07 |
| `@tanstack/ai` | `npm` | `0.54.0` | Framework-agnostic AI SDK (0.x); released 2026-09-10 |

## Notes

- Breaking changes in latest major: `0.x` packages (`DB`, `AI`, `Pacer`, `Store`) may change API at any minor — pin versions and check changelogs
- Version pinned in SKILL.md: query `5.102.8` / router `1.170.35` / start `1.168.52` / table `9.2.4` / form `1.33.5` / virtual `3.14.12` / store `0.11.1` / db `0.3.8` / pacer `0.23.0` / ai `0.54.0`
