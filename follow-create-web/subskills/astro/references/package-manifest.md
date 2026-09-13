# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `astro` |
| Registry | `npm` |
| Latest Version | `7.3.2` |
| Release Date | `2026-09-08` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Astro Technology Company (withastro) |
| License | `MIT` |
| Repository | `https://github.com/withastro/astro` |
| Website | `https://astro.build` |
| Documentation | `https://docs.astro.build` |
| Releases / Changelog | `https://github.com/withastro/astro/releases` |

## Install

```bash
bunx create-astro@latest
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `vite` | `npm` | `8.3.0` (2026-09-10) | Build tool bundled by Astro 7 (`vite@^8`) |
| `create-astro` | `npm` | `unknown` | Scaffolding CLI invoked via `bunx` |
| `@astrojs/check` | `npm` | `unknown` | Type checking (`astro check`) |
| `zod` | `npm` | `unknown` | Schema validation for Content Layer and Actions (Zod 4 in Astro 6+) |

## Notes

- Breaking changes in latest major: Astro 7 adds Rust compiler, reserved `src/fetch.ts`, Sätteri as default Markdown processor, `compressHTML: 'jsx'` default, `@astrojs/db` removed; Astro 6 removed `<ViewTransitions />` (use `<ClientRouter />`), legacy content collections, `Astro.glob()`, `emitESMImage()`; requires Node 22+
- Version pinned in SKILL.md: `astro@7.3.2` — matches latest as of 2026-09-12
