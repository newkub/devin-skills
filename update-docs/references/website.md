---
title: Website Documentation Reference
description: Reference for web app docs - routes, sections, deploy
---

# Website Documentation Reference

Use this for deployable web apps (SPA/SSR/SSG) — has a framework (`vite`, `next`, `solid-start`), HTML entry or routes, and a deploy target (Cloudflare, Vercel, static host). Not a library (nothing to `npm install` as a dependency).

## Detection

A project is `website` when:

- `package.json` has a web framework (`vite`, `next`, `solid-js`, `react`, `svelte`, `vue`, `astro`) AND a `dev`/`build` script producing deployable output
- No `exports`/`main`/`bin` consumed by other packages (or `private: true` with app entry)
- Has `index.html`, `app/`, `pages/`, `routes/`, or a server/worker entry

## Index Links

`Project`, `Getting Started`, `Development`, `References` (configuration, deployment, api if it has one, troubleshooting, contributing)

## Page Groups

- `project/` — overview, features (user-facing sections/routes), decisions/
- `getting-started/` — quickstart, installation, usage
- `development/` — setup, architecture, workflows, testing, deployment, troubleshooting
- `references/` — configuration (env vars), api (if it exposes endpoints/RPC), changelog, faq, contributing

## Content Focus

- `project/features.md` — user-facing features from routes/sections, not build internals
- `development/deployment.md` — CI pipeline, secrets, rollback (required for sites)
- `development/troubleshooting.md` — deploy/dev-server issues
- `references/api.md` — only if the app exposes HTTP/RPC surface
- `references/i18n.md` — when the site has locales (template `i18n.md`)
