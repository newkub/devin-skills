---
title: Open Source Documentation Reference
description: Reference for open-source docs nav, sidebar, and content
---

# Open Source Documentation Reference

Use this for public libraries, frameworks, CLIs, tools, or apps without authentication.

## Detection

A project is `open-source` when all of these are true:

- No auth dependencies or auth code found
- `package.json` does not have `private: true`
- License is permissive (MIT, Apache, BSD, etc.)
- No `AUTH_`, `JWT_`, `CLERK_`, `NEXTAUTH_`, `SUPABASE_`, `FIREBASE_`, `OAUTH_` in `.env`
- No `auth.config.*`, `src/auth/`, `middleware.ts`, `routes/login.*`, `app/login.*` files

## Nav

`Project`, `Features`, `Contributing`, `Review`, `Release`, `Development`

## Sidebar

- `project/` - overview, features, workspaces (monorepo)
- `getting-started/` - installation, usage
- `references/` - contributing, license, roadmap
- `development/` - setup, architecture, workflows, testing, CI/CD, scripts, troubleshooting

## Content Focus

- `project/overview.md`: project purpose, features, architecture
- `references/contributing.md`: how to contribute, code of conduct, PR process
- `references/license.md`: license summary, attribution
- `references/roadmap.md`: future plans, issue labels, milestones
