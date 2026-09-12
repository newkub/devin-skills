# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `shadcn` (CLI — installer for the Zaidan registry) |
| Registry | `npm` |
| Latest Version | `4.21.0` |
| Release Date | `2026-09-04` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `shadcn` |
| License | `MIT` |
| Repository | `<https://github.com/shadcn-ui/ui>` |
| Website | `<https://ui.shadcn.com>` / Zaidan registry `<https://zaidan.carere.dev>` |
| Documentation | `<https://zaidan.carere.dev/docs>` |
| Releases / Changelog | `<https://github.com/shadcn-ui/ui/releases>` |

> Zaidan UI itself is **not an npm package** — it is a remote shadcn registry (`https://zaidan.carere.dev/r/{style}/{name}.json`); components are copy-to-own via the `shadcn` CLI.

## Install

```bash
bunx shadcn@latest init && bunx shadcn@latest add @zaidan/button
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@kobalte/core` | `npm` | `0.13.14` | Accessible primitives underlying Zaidan components; released 2026-09-07 |
| `corvu` | `npm` | `0.7.2` | Additional Solid primitives used by some components; released 2025-01-24 |
| `solid-js` | `npm` | `1.9.15` | Framework peer; released 2026-08-17 |
| `tailwindcss` | `npm` | `4.3.3` | Styling (v4, with `@tailwindcss/vite`); released 2026-07-16 |

## Notes

- Breaking changes in latest major: none — `0.x` primitives (`@kobalte/core`, `corvu`) may change API at any minor
- Version pinned in SKILL.md: `shadcn@4.21.0` / `@kobalte/core@0.13.14` / `corvu@0.7.2` / `solid-js@1.9.15` / `tailwindcss@4.3.3`
