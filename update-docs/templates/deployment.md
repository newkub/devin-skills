---
title: Deployment Page Template
description: Template for docs/development/deployment.md — deploy app and docs site
---

# Deployment Page Template

```md
---
title: Deployment
description: How the app and docs are deployed
---

# Deployment

## App

| No. | Target | Command | Notes |
|-----|--------|---------|-------|
| 1 | <Cloudflare/Vercel/...> | `<real deploy cmd>` | <bindings/env> |

## Docs Site

<!-- Only when the project actually has a docs site — see /update-vitepress-docs; if docs/ is plain markdown, remove this section -->

```bash
bunx vitepress build docs   # outputs docs/.vitepress/dist
```

| No. | Host | Config |
|-----|------|--------|
| 1 | <GitHub Pages / Cloudflare Pages / Netlify> | <base path, build dir> |

## Checklist

- [ ] `bun run build` passes
- [ ] env vars set on target
- [ ] base path matches host (`base: '/<repo>/'` for GitHub Pages project sites)
```
