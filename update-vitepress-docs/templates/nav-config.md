---
title: Nav Config Template
description: VitePress nav arrays for all docs types — extensibility-first nav
---

# Nav Config Template

Nav excludes `Project`, `Development`, `Auth`, `Review` — those live in the sidebar only.
Nav covers getting-started + extensibility surfaces: Guides, Examples, Integrations, Plugins, Adapters, Ecosystem.

## Base Nav (all types)

```ts
nav: [
  { text: 'Getting Started', link: '/getting-started/installation' },
  { text: 'Guides', link: '/guides/', activeMatch: '/guides/' },
  { text: 'Examples', link: '/examples/', activeMatch: '/examples/' },
  { text: 'Integrations', link: '/integrations/', activeMatch: '/integrations/' },
  { text: 'Plugins', link: '/plugins/', activeMatch: '/plugins/' },
  { text: 'Adapters', link: '/adapters/', activeMatch: '/adapters/' },
  { text: 'Ecosystem', link: '/ecosystem/', activeMatch: '/ecosystem/' },
  { text: 'Roadmap', link: '/roadmap/', activeMatch: '/roadmap/' },
]
```

## Type Variations

Apply on top of Base Nav:

| Type | Add | Notes |
|------|-----|-------|
| `cli` | `{ text: 'Commands', link: '/commands/', activeMatch: '/commands/' }` after Getting Started | — |
| `tool` | same as `cli` when the tool has subcommands | otherwise plain base |
| `open-source` | `{ text: 'Contributing', link: '/references/contributing' }` before Roadmap | — |
| `library` / `sdk` | drop `Plugins`/`Adapters` only when the package truly has none | — |
| `product` / `website` | drop `Plugins`/`Adapters`/`Ecosystem` when not applicable; keep `Integrations` | Auth/Admin/Pricing stay in sidebar `/references/` |
| `saas-product` | `{ text: 'API', link: '/references/api' }` before Roadmap | Operations stays in sidebar |
| `opensource-product` | `{ text: 'Contributing', link: '/references/contributing' }` before Roadmap | full base set applies |
| monorepo | replace nothing — add dropdown `{ text: 'Workspaces', items: [...] }` per `sidebar-monorepo.md` | — |

## Rules

- Include a nav item ONLY when its directory/page actually exists in `docs/` — delete the line otherwise (no dead links).
- Every directory-index link (`/xxx/`) must carry `activeMatch: '/xxx/'`.
- Max ~8 top-level items; if more are needed, group extras under a dropdown (`items`).
- Do not define nav inside sidebar templates — nav lives here only.
