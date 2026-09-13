# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `svelte` |
| Registry | `npm` |
| Latest Version | `5.57.0` |
| Release Date | `2026-08-28` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Svelte team (Rich Harris / Vercel) |
| License | `MIT` |
| Repository | `https://github.com/sveltejs/svelte` |
| Website | `https://svelte.dev` |
| Documentation | `https://svelte.dev/docs` |
| Releases / Changelog | `https://github.com/sveltejs/svelte/releases` |

## Install

```bash
bunx sv create <project-name>
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@sveltejs/kit` | `npm` | `2.70.3` (2026-08-18) | Fullstack meta-framework — see `references/sveltekit-ssr.md` |
| `@sveltejs/vite-plugin-svelte` | `npm` | `7.3.0` (2026-08-08) | Vite integration for `.svelte` compilation |
| `sv` | `npm` | `0.17.0` (2026-07-31) | Official CLI — `sv create`, `sv migrate svelte-5` |
| `vite` | `npm` | `8.3.0` (2026-09-10) | Build tool |
| `svelte-check` | `npm` | `4.7.6+` | Type checking — needed for TypeScript 6.0 support |
| `svelte2tsx` | `npm` | `0.7.61+` | TS transform backing svelte-check |

## Notes

- Breaking changes in latest major: Svelte 5 replaces reactivity with Runes (`$state`, `$derived`, `$effect`, `$props`, `$bindable`), event props (`onclick` not `on:click`), snippets replace slots, `mount()` replaces `new Component()`; migrate with `npx sv migrate svelte-5`
- Version pinned in SKILL.md: `svelte@5.57.0`, `@sveltejs/kit@2.70.3`, `@sveltejs/vite-plugin-svelte@7.3.0`, `sv@0.17.0` — all match latest as of 2026-09-12
