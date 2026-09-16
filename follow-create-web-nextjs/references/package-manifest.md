# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `next` |
| Registry | `npm` |
| Latest Version | `16.3.5` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Vercel |
| License | `MIT` |
| Repository | `https://github.com/vercel/next.js` |
| Website | `https://nextjs.org` |
| Documentation | `https://nextjs.org/docs` |
| Releases / Changelog | `https://github.com/vercel/next.js/releases` |

## Install

```bash
bunx create-next-app@latest
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `react` | `npm` | `19.3.0` (2026-09-09) | Peer dependency — React 19.3 adds View Transitions, `useEffectEvent()` |
| `react-dom` | `npm` | `19.3.0` (peer of `react`) | Must match `react` version |
| `typescript` | `npm` | `7.0.2` | Strict mode required (TS 5.1+; latest 7.x native compiler — removed `baseUrl`/`target es5`, defaults `strict`/`module esnext`/`types []`) |
| `zod` | `npm` | `unknown` | Input validation for Server Actions |

## Notes

- Breaking changes in latest major: Next.js 16 makes Turbopack the stable default for dev and build, replaces `middleware.ts` with `proxy.ts`, adds Cache Components (`'use cache'`), and stabilizes React Compiler
- Version pinned in SKILL.md: `next@16.3.5`, `react@19.3.0` — both match latest as of 2026-09-12
